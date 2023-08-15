"use client";

import {
  RecoilState,
  _isPyodideAvailable,
  _pyodide,
  _themeName,
  useRecoilState,
  useRecoilValue,
} from "@/_recoil/server";
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
  message,
} from "antd";
import hotkeys from "hotkeys-js";
import { KeyCode, KeyMod, editor as nsed } from "monaco-editor";
import { CSSProperties, useEffect, useRef, useState } from "react";

import * as styles from "./PythonCodeEditor.module.css";

export default function ServerCodeEditor(props: {
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  valueRecoil: RecoilState<string>;
  style?: CSSProperties;
}) {
  const themeName = useRecoilValue(_themeName);
  const [codeValue, setCodeValue] = useRecoilState(props.valueRecoil);
  const pyodide = useRecoilValue(_pyodide);
  const isPyodideAvailable = useRecoilValue(_isPyodideAvailable);
  const [isPythonCodeValid, setIsPythonCodeValid] = useState(true);
  const [pythonCodeError, setPythonCodeError] = useState<string | undefined>();
  const [pythonLocalCode, setPythonLocalCode] = useState<string>(
    codeValue || props.defaultValue || ""
  );
  const [isInitializationRequested, setIsInitializationRequested] =
    useState(false);
  const [savedTextOpacity, setSavedTextOpacity] = useState(0);
  const editorRef = useRef<nsed.IStandaloneCodeEditor>();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    hotkeys("ctrl+s, command+s", (e) => {
      messageApi.success("자동으로 저장하고 있습니다! 안심하세요~");

      return false;
    });

    return () => {
      hotkeys.unbind("ctrl+s, command+s");
    };
  }, [messageApi]);

  const validateAndSave = (value: string | undefined) => {
    setPythonLocalCode(value || "");
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
        setCodeValue(value);
        props.onChange?.(value);
        if (syntaxError) {
          setIsPythonCodeValid(false);
          setPythonCodeError(syntaxError);
          throw new Error(syntaxError);
        } else {
          setIsPythonCodeValid(true);
          setPythonCodeError(undefined);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (pyodide && isPyodideAvailable) {
      validateAndSave(pythonLocalCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pyodide, isPyodideAvailable]);

  const initValue = () => {
    if (!isInitializationRequested) {
      messageApi.info("코드를 초기화하려면 버튼을 한번 더 누르세요.");
      setIsInitializationRequested(true);
    } else {
      messageApi.success("코드가 초기화되었습니다.");
      const initialValue = props.defaultValue || "";
      setPythonLocalCode(initialValue);
      validateAndSave(initialValue);
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

  useEffect(() => {
    if (isPyodideAvailable) {
      setSavedTextOpacity(1);

      const dismissTO = setTimeout(() => {
        setSavedTextOpacity(0);
      }, 500);

      return () => {
        clearTimeout(dismissTO);
      };
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pythonLocalCode]);

  const handleEditorDidMount = (
    editor: nsed.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, function () {
      messageApi.success("자동으로 저장하고 있습니다! 안심하세요~");
    });
    // monaco.languages.setMonarchTokensProvider("python", {
    //   tokenizer: {
    //     root: [[/get_accel_x/, { token: "function" }]],
    //   },
    // });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        ...props.style,
      }}
    >
      {contextHolder}
      <Row>
        <Col flex="auto">
          <Space>
            <Button
              disabled={!isPyodideAvailable}
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
              type={isPythonCodeValid ? "success" : "error"}
              message={pythonCodeError ?? "코드 구문은 올바릅니다 :)"}
              style={{
                transition: isPythonCodeValid
                  ? "opacity 0.5s 0.7s, color 0.5s, background-color 0.5s"
                  : "opacity 0.5s, color 0.5s, background-color 0.5s",
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
        spinning={!isPyodideAvailable}
        style={{}}
        tip={
          pyodide
            ? "Loading Python packages..."
            : "Loading Python interpreter..."
        }
        // @ts-ignore-next-line
        wrapperClassName={styles.spinWrapper}
      >
        <Editor
          defaultLanguage="python"
          language="python"
          defaultValue={props.defaultValue}
          value={pythonLocalCode}
          theme={themeName === "dark" ? "vs-dark" : "light"}
          onChange={validateAndSave}
          onMount={handleEditorDidMount}
        />
      </Spin>
    </div>
  );
}
