"use client";

import {
  FaleGreenResponse,
  FaleRedResponse,
  type SaveCodeRequest,
} from "@/_proto";
import {
  RecoilState,
  _isOnRendering,
  _isPyodideAvailable,
  _messageApi,
  _pyodide,
  _renderTargetPath,
  _themeName,
  useRecoilState,
  useRecoilValue,
} from "@/_recoil/editor";
import { CheckOutlined } from "@ant-design/icons";
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
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import * as styles from "./PythonCodeEditor.module.css";

export default function ServerCodeEditor(props: {
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  valueRecoil: RecoilState<string>;
  style?: CSSProperties;
  saveTarget?: string;
  saveType?: "client" | "server";
  completionProvider?: languages.CompletionItemProvider;
}) {
  const themeName = useRecoilValue(_themeName);
  const [codeValue, setCodeValue] = useRecoilState(props.valueRecoil);
  const pyodide = useRecoilValue(_pyodide);
  const isPyodideAvailable = useRecoilValue(_isPyodideAvailable);
  const isOnRendering = useRecoilValue(_isOnRendering);
  const renderTargetPath = useRecoilValue(_renderTargetPath);
  const messageApi = useRecoilValue(_messageApi);
  const [isPythonCodeValid, setIsPythonCodeValid] = useState(true);
  const [pythonCodeError, setPythonCodeError] = useState<string | undefined>();
  const [pythonLocalCode, setPythonLocalCode] = useState<string>(
    codeValue || props.defaultValue || ""
  );
  const [isInitializationRequested, setIsInitializationRequested] =
    useState(false);
  const [savedTextOpacity, setSavedTextOpacity] = useState(0);
  const [isMonacoMounted, setIsMonacoMounted] = useState(false);
  const editorRef = useRef<nsed.IStandaloneCodeEditor>();
  const pythonLocalCodeRef = useRef<string>(
    codeValue || props.defaultValue || ""
  );
  const savedTextOpacityTimeoutRef = useRef<NodeJS.Timeout>();
  const waitForNoInputToSaveRequestTimeoutRef = useRef<NodeJS.Timeout>();
  const waitForNoInputToValidateTimeoutRef = useRef<NodeJS.Timeout>();

  const requestToRemoteSave = useCallback(
    (displaySuccessMessage: boolean = false) => {
      if (props.saveTarget && props.saveType) {
        const saveRequest: SaveCodeRequest = {
          type: props.saveType,
          code: `${pythonLocalCodeRef.current}`,
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
    [messageApi, props.saveTarget, props.saveType]
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

    return () => {
      hotkeys.unbind("ctrl+s, command+s");
    };
  }, [ctrlSAction]);

  useEffect(() => {
    if (pyodide && isPyodideAvailable) {
      handleEditorChange(pythonLocalCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pyodide, isPyodideAvailable]);

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
      if (value && pyodide && isPyodideAvailable) {
        try {
          let syntaxError = pyodide.runPython(`
import ast

def validate(code):
    try:
        ast.parse(code)
    except SyntaxError as e:
        return str(e)
    return None

validate("""${value.replace(/"""/g, "'''")}""")
          `);
          if (syntaxError) {
            throw new Error(String(syntaxError));
          } else {
            setIsPythonCodeValid(true);
            setPythonCodeError(undefined);
          }
        } catch (e: any) {
          console.log(e);
          setIsPythonCodeValid(false);
          setPythonCodeError(e?.message);
        }
      }
    },
    [pyodide, isPyodideAvailable]
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
      ctrlSAction();
    });
    if (props.completionProvider) {
      monaco.languages.registerCompletionItemProvider(
        "python",
        props.completionProvider
      );
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        ...props.style,
      }}
    >
      <Row>
        <Col flex="auto">
          <Space>
            <Button
              disabled={!isMonacoMounted}
              onClick={initValue}
              danger={isInitializationRequested}
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
        />
      </Spin>
    </div>
  );
}
