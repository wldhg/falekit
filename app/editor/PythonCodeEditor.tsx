"use client";

import {
  FaleGreenResponse,
  FaleRedResponse,
  type SaveCodeRequest,
} from "@/_proto";
import {
  RecoilState,
  _editorHeight,
  _isLeftSiderCollapsed,
  _isOnRendering,
  _messageApi,
  _renderTargetPath,
  _themeName,
  useRecoilState,
  useRecoilValue,
} from "@/_recoil/editor";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import Editor, { Monaco } from "@monaco-editor/react";
import {
  Alert,
  Button,
  Col,
  Divider,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import hotkeys from "hotkeys-js";
import { KeyCode, KeyMod, languages, editor as nsed } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";

import * as styles from "./PythonCodeEditor.module.css";

const docsPanelSize = 480;
const workerURL = "/editor-worker.js";

export default function ServerCodeEditor(props: {
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  valueRecoil: RecoilState<string>;
  children?: React.ReactNode;
  saveTarget?: string;
  saveType?: "client" | "server";
  completionProvider?: languages.CompletionItemProvider;
}) {
  const themeName = useRecoilValue(_themeName);
  const [codeValue, setCodeValue] = useRecoilState(props.valueRecoil);
  const isOnRendering = useRecoilValue(_isOnRendering);
  const renderTargetPath = useRecoilValue(_renderTargetPath);
  const messageApi = useRecoilValue(_messageApi);
  const isLeftSiderCollapsed = useRecoilValue(_isLeftSiderCollapsed);
  const [isPythonCodeValid, setIsPythonCodeValid] = useState(true);
  const [pythonCodeError, setPythonCodeError] = useState<string | undefined>();
  const [pythonLocalCode, setPythonLocalCode] = useState<string>(
    codeValue || props.defaultValue || ""
  );
  const [isInitializationRequested, setIsInitializationRequested] =
    useState(false);
  const [savedTextOpacity, setSavedTextOpacity] = useState(0);
  const [isMonacoMounted, setIsMonacoMounted] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [monacoWidth, setMonacoWidth] = useState(0);
  const [isPyodideAvailable, setIsPyodideAvailable] = useState(false);
  const [monacoHeight, setMonacoHeight] = useRecoilState(_editorHeight);
  const editorRef = useRef<nsed.IStandaloneCodeEditor>();
  const pythonLocalCodeRef = useRef<string>(
    codeValue || props.defaultValue || ""
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const savedTextOpacityTimeoutRef = useRef<NodeJS.Timeout>();
  const waitForNoInputToSaveRequestTimeoutRef = useRef<NodeJS.Timeout>();
  const waitForNoInputToValidateTimeoutRef = useRef<NodeJS.Timeout>();
  const leftSiderPrevStateRef = useRef<boolean>(isLeftSiderCollapsed);
  const monacoDispose1Ref = useRef<() => void>();
  const ctrlSActionRef = useRef<() => void>();
  const runPyodideCodeRef = useRef<(code: string) => Promise<boolean>>();
  const runPyodidePromiseObjRef = useRef<{
    resolve: (value: boolean) => void;
    reject: (reason?: any) => void;
  }>();

  useEffect(() => {
    const worker = new Worker(workerURL);
    worker.addEventListener("message", (e) => {
      const {
        type,
        payload,
      }: {
        type: string;
        payload: Error | boolean;
      } = e.data;
      if (type === "isLoaded") {
        setIsPyodideAvailable(payload as boolean);
      } else if (type === "result") {
        if (runPyodidePromiseObjRef.current) {
          if (payload instanceof Error) {
            runPyodidePromiseObjRef.current.reject(payload);
          } else {
            runPyodidePromiseObjRef.current.resolve(payload);
          }
        }
      }
    });

    runPyodideCodeRef.current = (code: string) => {
      return new Promise<boolean>((resolve, reject) => {
        runPyodidePromiseObjRef.current = { resolve, reject };
        worker.postMessage(code);
      });
    };

    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    const setMonacoSize = (addi: number = 0) => {
      if (containerRef.current) {
        setMonacoWidth(
          containerRef.current.clientWidth -
            (isPanelOpen ? docsPanelSize + 64 : 64) +
            addi
        );
      }
      if (containerRef.current) {
        setMonacoHeight(containerRef.current.clientHeight - 60);
      }
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    if (leftSiderPrevStateRef.current !== isLeftSiderCollapsed) {
      if (isLeftSiderCollapsed) {
        setTimeout(() => {
          setMonacoSize(0);
        }, 300);
      } else {
        setMonacoSize(-120);
      }
      leftSiderPrevStateRef.current = isLeftSiderCollapsed;
    } else {
      setMonacoSize();
    }

    window.addEventListener("resize", () => {
      setMonacoSize();
    });

    return () => {
      window.removeEventListener("resize", () => {
        setMonacoSize();
      });
    };
  }, [isPanelOpen, isLeftSiderCollapsed, isMonacoMounted, setMonacoHeight]);

  const requestToRemoteSave = useCallback(
    (displaySuccessMessage: boolean = false) => {
      if (props.saveTarget && props.saveType) {
        const saveRequest: SaveCodeRequest = {
          type: props.saveType,
          code: `${pythonLocalCodeRef.current}`,
          validity: isPythonCodeValid,
        };
        fetch(props.saveTarget, {
          method: "POST",
          body: JSON.stringify(saveRequest),
        })
          .then((res) => res.json())
          .then((res: FaleGreenResponse | FaleRedResponse) => {
            if (res.code === "red") {
              messageApi?.error(`그런데 저장에 실패했습니다. (${res.error})`);
            } else {
              if (displaySuccessMessage) {
                messageApi?.success(
                  "이전 페이지를 떠나기 전에 코드를 저장했습니다."
                );
              }
              if (savedTextOpacityTimeoutRef.current) {
                clearTimeout(savedTextOpacityTimeoutRef.current);
              }

              setSavedTextOpacity(1);

              savedTextOpacityTimeoutRef.current = setTimeout(() => {
                setSavedTextOpacity(0);
              }, 500);
            }
          });
      }
    },
    [messageApi, props.saveTarget, props.saveType, isPythonCodeValid]
  );

  const ctrlSAction = useCallback(() => {
    messageApi?.success("자동으로 저장하고 있습니다! 안심하세요~");
    requestToRemoteSave();
  }, [messageApi, requestToRemoteSave]);

  useEffect(() => {
    hotkeys("ctrl+s, command+s", (e) => {
      ctrlSAction();

      return false;
    });

    ctrlSActionRef.current = ctrlSAction;

    return () => {
      hotkeys.unbind("ctrl+s, command+s");
    };
  }, [ctrlSAction]);

  useEffect(() => {
    if (isPyodideAvailable) {
      handleEditorChange(pythonLocalCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPyodideAvailable]);

  const initValue = () => {
    if (!isInitializationRequested) {
      messageApi?.info("코드를 초기화하려면 버튼을 한번 더 누르세요.");
      setIsInitializationRequested(true);
    } else {
      messageApi?.success("코드가 초기화되었습니다.");
      const initialValue = props.defaultValue || "";
      setPythonLocalCode(initialValue);
      handleEditorChange(initialValue);
      setIsInitializationRequested(false);
    }
  };

  useEffect(() => {
    if (isInitializationRequested) {
      const dismissTO = setTimeout(() => {
        setIsInitializationRequested(false);
      }, 3000);
      return () => {
        clearTimeout(dismissTO);
      };
    }
    return () => {};
  }, [isInitializationRequested]);

  const validatePythonCode = useCallback(
    (value: string) => {
      if (isPyodideAvailable && runPyodideCodeRef.current) {
        try {
          runPyodideCodeRef
            .current(
              `
import ast

def validate(code):
    try:
        ast.parse(code)
    except SyntaxError as e:
        return str(e)
    return None

validate("""\n${value.replace(/"""/g, "'''").replace(/\\/g, "\\\\")}\n""")
          `
            )
            .then((syntaxError) => {
              if (syntaxError) {
                throw new Error(String(syntaxError));
              } else {
                setIsPythonCodeValid(true);
                setPythonCodeError(undefined);
              }
            })
            .catch((e) => {
              console.log(e);
              setIsPythonCodeValid(false);
              setPythonCodeError(e?.message);
            });
        } catch (e: any) {
          console.log(e);
          setIsPythonCodeValid(false);
          setPythonCodeError(e?.message);
        }
      }
    },
    [isPyodideAvailable]
  );

  useEffect(() => {
    if (pythonLocalCodeRef.current !== pythonLocalCode) {
      pythonLocalCodeRef.current = pythonLocalCode;
    }

    setCodeValue(pythonLocalCode);
    props.onChange?.(pythonLocalCode);

    if (waitForNoInputToSaveRequestTimeoutRef.current) {
      clearTimeout(waitForNoInputToSaveRequestTimeoutRef.current);
    }

    const saveTO = setTimeout(() => {
      requestToRemoteSave();
    }, 500);

    waitForNoInputToSaveRequestTimeoutRef.current = saveTO;

    if (waitForNoInputToValidateTimeoutRef.current) {
      clearTimeout(waitForNoInputToValidateTimeoutRef.current);
    }

    const validateTO = setTimeout(() => {
      validatePythonCode(pythonLocalCode);
    }, 100);

    waitForNoInputToValidateTimeoutRef.current = validateTO;

    return () => {
      clearTimeout(saveTO);
      clearTimeout(validateTO);
    };
  }, [
    pythonLocalCode,
    setCodeValue,
    props,
    requestToRemoteSave,
    validatePythonCode,
  ]);

  useEffect(() => {
    if (props.saveType && props.saveTarget) {
      return () => {
        if (
          isOnRendering &&
          renderTargetPath !== `/editor/node-${props.saveType}`
        ) {
          requestToRemoteSave(true);
          if (monacoDispose1Ref.current) {
            monacoDispose1Ref.current();
          }
        }
      };
    }
    return () => {};
  }, [
    isOnRendering,
    renderTargetPath,
    props.saveTarget,
    props.saveType,
    requestToRemoteSave,
  ]);

  const handleEditorDidMount = (
    editor: nsed.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, function () {
      if (ctrlSActionRef.current) {
        ctrlSActionRef.current();
      }
    });
    if (props.completionProvider) {
      const { dispose } = monaco.languages.registerCompletionItemProvider(
        "python",
        props.completionProvider
      );
      monacoDispose1Ref.current = dispose;
    }
    setIsMonacoMounted(true);
  };

  const handleEditorChange = (value: string | undefined) => {
    setPythonLocalCode(value || "");
  };

  let validityType: "success" | "error" | "info" = "success";
  let validityMessage = "코드 구문은 올바릅니다 :)";
  if (!isPythonCodeValid) {
    validityType = "error";
    validityMessage = pythonCodeError ?? "코드 구문이 올바르지 않습니다 :(";
  }
  if (!isPyodideAvailable) {
    validityType = "info";
    validityMessage = "코드 구문 분석 준비 중입니다... 잠시만 기다려 주세요.";
  }

  const handleFileOpen = () => {
    if (editorRef.current) {
      try {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".py";
        fileInput.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = e.target?.result;
              if (typeof text === "string") {
                handleEditorChange(text);
                messageApi?.success(`${file.name} 불러옴`);
              }
            };
            reader.readAsText(file);
          }
        };
        fileInput.click();
      } catch (e) {
        console.log(e);
        messageApi?.error("파일 열기 실패");
      }
    }
  };

  const handleDownload = () => {
    if (editorRef.current) {
      const blob = new Blob([editorRef.current.getValue()], {
        type: "text/plain;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FaleKit-${props.saveType}-${new Date().toISOString()}.py`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Space
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        alignItems: "start",
        gap: "16px",
      }}
      // @ts-ignore-next-line
      className={styles.spaceWrapper}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <Row>
          <Col flex="auto">
            <Space>
              <Button
                disabled={!isMonacoMounted}
                type="primary"
                onClick={handleDownload}
              >
                다운로드
              </Button>
              <Button disabled={!isMonacoMounted} onClick={handleFileOpen}>
                열기
              </Button>
              <Button
                disabled={!isMonacoMounted}
                onClick={initValue}
                danger
                type={isInitializationRequested ? "primary" : "default"}
              >
                코드 초기화
              </Button>
            </Space>
            <Divider
              type="vertical"
              style={{
                margin: "0px 16px",
              }}
            />
            <Space>
              <Typography.Text strong>구문 검사</Typography.Text>
              <Alert
                type={validityType}
                message={validityMessage}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                }}
                showIcon
              />
            </Space>
          </Col>
          <Col
            style={{
              display: "flex",
              alignItems: "center",
              opacity: savedTextOpacity,
              transition: savedTextOpacity > 0 ? "" : "opacity 0.5s",
            }}
          >
            <Space>
              <CheckOutlined />
              <Typography.Text type="secondary">저장됨</Typography.Text>
            </Space>
          </Col>
        </Row>
        <div style={{ height: "16px", width: "100%" }}></div>
        <Spin
          spinning={!isMonacoMounted}
          // @ts-ignore-next-line
          wrapperClassName={styles.spinWrapper}
        >
          <Editor
            defaultLanguage="python"
            language="python"
            defaultValue={props.defaultValue}
            value={pythonLocalCode}
            theme={themeName === "dark" ? "vs-dark" : "light"}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              renderWhitespace: "boundary",
              minimap: {
                size: "fill",
              },
              "semanticHighlighting.enabled": true,
            }}
            width={monacoWidth}
            height={monacoHeight}
          />
        </Spin>
      </div>
      {props.children && (
        <>
          <Button
            onClick={() => {
              setIsPanelOpen(!isPanelOpen);
            }}
            type="text"
            icon={isPanelOpen ? <CaretRightOutlined /> : <CaretLeftOutlined />}
          />
          <div
            style={{
              width: isPanelOpen ? docsPanelSize : "0px",
              opacity: isPanelOpen ? 1 : 0,
              transition: isPanelOpen
                ? "width ease 0.2s, opacity linear 0.2s"
                : "",
              transform: isPanelOpen ? "" : "scale(0)",
              height: "100%",
            }}
          >
            {props.children}
          </div>
        </>
      )}
    </Space>
  );
}
