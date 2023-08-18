"use client";

import { type FunctionDoc } from "@/_misc";
import { _editorHeight, useRecoilValue } from "@/_recoil/editor";
import { List, Space, Typography, theme } from "antd";

export default function DocsPanel(props: { docs: FunctionDoc[] }) {
  const editorHeight = useRecoilValue(_editorHeight);
  const {
    token: { colorBgBase },
  } = theme.useToken();
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>레퍼런스</Typography.Title>
      <List
        dataSource={props.docs}
        bordered
        style={{
          backgroundColor: colorBgBase,
          maxHeight: editorHeight + 8,
          overflow: "auto",
        }}
        renderItem={(item) => (
          <List.Item>
            <Space direction="vertical" size={0}>
              <Typography.Text
                style={{
                  fontFamily: "'Fira Mono', monospace",
                }}
                strong
              >
                {item.name}
              </Typography.Text>
              <Typography.Text type="secondary">
                {item.description}
              </Typography.Text>
              <ul
                style={{
                  paddingLeft: 16,
                }}
              >
                {item.overridings.map((ovr, idx) => (
                  <li
                    key={`${item.name}-${idx}`}
                    style={{
                      marginBottom: 8,
                    }}
                  >
                    <Typography.Text
                      style={{
                        fontFamily: "'Fira Mono', monospace",
                      }}
                    >
                      {item.name}(
                      {ovr.args.map((arg, ovrargsidx) => (
                        <>
                          <Typography.Text
                            italic
                            strong
                            style={{
                              marginRight: 2,
                            }}
                          >
                            {arg.name}
                          </Typography.Text>
                          <Typography.Text code type="danger">
                            {arg.type}
                          </Typography.Text>
                          {ovrargsidx !== ovr.args.length - 1 && (
                            <>
                              <Typography.Text
                                style={{
                                  fontFamily: "'Fira Mono', monospace",
                                }}
                              >
                                ,
                              </Typography.Text>
                              <Typography.Text> </Typography.Text>
                            </>
                          )}
                        </>
                      ))}
                      ){" ➜ "}
                    </Typography.Text>
                    <Typography.Text
                      style={{
                        fontFamily: "'Fira Mono', monospace",
                      }}
                      code
                      type="danger"
                    >
                      {ovr.returns.type}
                    </Typography.Text>
                    <Typography.Text type="secondary" italic>
                      {" "}
                      {ovr.returns.description}
                    </Typography.Text>
                    <br />
                    <Typography.Text>{ovr.description}</Typography.Text>
                    {Object.keys(ovr.aliases).length > 0 && (
                      <ul
                        style={{
                          paddingLeft: 16,
                          listStyleType: "square",
                        }}
                      >
                        {Object.keys(ovr.aliases).map((al, alidx) => (
                          <li key={`${item.name}-${idx}-a${alidx}`}>
                            <Typography.Text strong type="danger">
                              타입 별칭{" "}
                            </Typography.Text>
                            <Typography.Text
                              style={{
                                fontFamily: "'Fira Mono', monospace",
                              }}
                              code
                            >
                              {al}
                            </Typography.Text>
                            {" = "}
                            <Typography.Text
                              type="danger"
                              code
                              style={{
                                border: "none",
                                background: "transparent",
                                fontFamily: "'Fira Mono', monospace",
                              }}
                            >
                              {ovr.aliases[al]}
                            </Typography.Text>
                          </li>
                        ))}
                      </ul>
                    )}
                    {ovr.examples.length > 0 && (
                      <ul
                        style={{
                          paddingLeft: 16,
                        }}
                      >
                        {ovr.examples.map((ex, exidx) => (
                          <li key={`${item.name}-${idx}-e${exidx}`}>
                            <Typography.Text strong type="secondary">
                              예시{" "}
                            </Typography.Text>
                            <Typography.Text
                              style={{
                                fontFamily: "'Fira Mono', monospace",
                              }}
                              code
                            >
                              {ex.code}
                            </Typography.Text>
                            {ex.description !== "" && (
                              <>
                                <br />
                                <Typography.Text type="secondary" italic>
                                  {ex.description}
                                </Typography.Text>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </Space>
          </List.Item>
        )}
      />
    </Space>
  );
}
