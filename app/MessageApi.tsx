"use client";

import { message } from "antd";
import { useEffect } from "react";
import { _messageApi, useSetRecoilState } from "./_recoil/root";

export default function MessageApi() {
  const setMessageApi = useSetRecoilState(_messageApi);
  const [messageApi, messageContextHolder] = message.useMessage();

  useEffect(() => {
    setMessageApi(messageApi);
  }, [messageApi, setMessageApi]);

  return <>{messageContextHolder}</>;
}
