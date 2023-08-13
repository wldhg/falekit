import { Menu } from "antd";

import {
  CodeOutlined,
  InfoCircleOutlined,
  RadarChartOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

export default function MenuItems() {
  const router = useRouter();
  const pathname = usePathname();

  const onClickNav = (info: any) => {
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
          label: "모니터",
        },
      ]}
    />
  );
}
