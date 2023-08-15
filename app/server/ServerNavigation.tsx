import { Menu } from "antd";

import {
  _isOnRendering,
  _renderCurrentPath,
  _renderTargetPath,
  useRecoilState,
  useSetRecoilState,
} from "@/_recoil/server";
import {
  CodeOutlined,
  InfoCircleOutlined,
  RadarChartOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MenuItems() {
  const router = useRouter();
  const pathname = usePathname();
  const setIsOnRendering = useSetRecoilState(_isOnRendering);
  const [renderTargetPath, setRenderTargetPath] =
    useRecoilState(_renderTargetPath);
  const setRenderCurrentPath = useSetRecoilState(_renderCurrentPath);

  useEffect(() => {
    setRenderTargetPath(pathname);
    setRenderCurrentPath(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(`Path matching: ${pathname} == ${renderTargetPath}`);
    if (pathname == renderTargetPath) {
      setIsOnRendering(false);
      setRenderCurrentPath(pathname);
    }
  }, [pathname, renderTargetPath, setIsOnRendering, setRenderCurrentPath]);

  const onClickNav = (info: any) => {
    setIsOnRendering(true);
    setRenderTargetPath(info.key);
    router.replace(info.key);
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[pathname]}
      defaultOpenKeys={["/server/editor"]}
      onClick={onClickNav}
      items={[
        {
          key: "/server/intro",
          icon: <InfoCircleOutlined />,
          label: "설명",
        },
        {
          key: "/server/editor",
          icon: <CodeOutlined />,
          label: "편집기",
          children: [
            {
              key: "/server/editor/node-server",
              label: "서버 코드",
            },
            {
              key: "/server/editor/node-client",
              label: "센서 코드",
            },
          ],
        },
        {
          key: "/server/monitor",
          icon: <RadarChartOutlined />,
          label: "모니터 (서버 실행)",
        },
      ]}
    />
  );
}
