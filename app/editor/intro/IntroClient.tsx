"use client";

import { Typography } from "antd";

export default function EditorIntroClient() {
  return (
    <>
      <Typography.Title level={2}>
        Fale 코드 에디터에 오신 것을 환영합니다
      </Typography.Title>
      <Typography.Paragraph>
        <Typography.Text strong>환영합니다!</Typography.Text> 여러분은 Fale 코드
        에디터에서 두 가지 Python 코드를 작성하게 됩니다.
      </Typography.Paragraph>
      <Typography.Title level={3}>센서 코드와 서버 코드</Typography.Title>
      <Typography.Paragraph>
        <Typography.Text strong>센서에서 실행되는 코드</Typography.Text>는
        센서에 연결된 센서들의 데이터를 수집하고, 수집된 데이터를 서버로
        전송하는 역할을 합니다. 이때, 간단한 데이터 처리를 수행할 수도 있습니다.
        실제 IoT 환경에서도 이 단계에서는 간단한 데이터 처리만을 수행할 수밖에
        없는데, 이는 당연하게도 센서에서 수행되는 코드는 센서 프로세서의 성능과
        배터리에 따라 제한되기 때문입니다. 최근에는 연산 가속기를 별도로 센서
        보드에 탑재하여 센서에서도 간단한 AI 연산을 수행할 수 있게 되었지만,
        여전히 센서에서 수행되는 코드는 데이터센터 혹은 클라우드에서 수행되는
        코드에 비해서 제한적입니다.
      </Typography.Paragraph>
      <Typography.Paragraph>
        <Typography.Text strong>서버에서 실행되는 코드</Typography.Text>는
        데이터베이스로부터 센싱 데이터를 가져와 분석하고, 분석 결과를 표시하며,
        그를 바탕으로 액츄에이터를 제어하는 역할을 합니다. 여기서 데이터 분석과
        액츄에이터 제어 과정에 AI가 사용되는 경우를 우리는 AIoT라고 합니다.
      </Typography.Paragraph>
      <Typography.Paragraph>
        전체 데이터 흐름에서 유이하게 빠진 부분은 저수준 디바이스 접근 코드와
        데이터베이스화 코드입니다. 저수준 디바이스 접근 코드는 하드웨어와 직접
        상호작용하며 센서 데이터 수집이나 액츄에이터 디바이스를 제어하는 역할을
        하는 코드인데, 본 수업에서는 TA가 미리 작성했으며, 상응하는 기능을
        <Typography.Text code>get_accel_x()</Typography.Text>나{" "}
        <Typography.Text code>act_led()</Typography.Text> 같은 고수준의 간단한
        함수로 여러분께 제공합니다. 실제 환경에서는 센서/액츄에이터가 아날로그
        방식인지 디지털 방식인지, 데이터 통신 프로토콜은 무엇인지 등을 고려하여
        하드웨어 기종마다 전용의 수집 코드를 저수준으로 작성해야 합니다. 이는 본
        수업의 범위를 벗어나는 내용이므로 생략하였습니다. 데이터베이스화 코드는
        센서에서 전송된 데이터를 수신하고, 수신된 데이터를 데이터베이스에
        저장하는 역할을 합니다. 요즘의 IoT 서비스에서는 데이터베이스화 코드를
        별도로 작성하지 않고, 그를 대신하는 서비스를 사용하는 경우도 많습니다.
        본 수업에서는 마치 그러한 서비스를 이용하는 것처럼 체험하기 위해
        데이터베이스화 코드를 작성하지 않고 대신 TA가 사전에 작성한{" "}
        <Typography.Text code>get_data()</Typography.Text>라는 고수준 함수로
        여러분께 제공합니다.
      </Typography.Paragraph>
      <Typography.Title level={3}>코드 실행 환경</Typography.Title>
      <Typography.Paragraph>
        본 수업에서는 여러분의 모바일 디바이스를 센서로, 데스크톱을 서버로
        사용하며, 액츄에이터는 모니터에 표시되는 가상의 것을 사용합니다. 이 모든
        과정은 <Typography.Text code>JavaScript</Typography.Text>라는 프로그래밍
        언어와 <Typography.Text code>HTML5</Typography.Text> 웹 환경 표준을
        이용하여 시뮬레이션 됩니다. 여러분이 작성하는 Python 코드는 웹 환경에서
        동작하는 Python 에뮬레이터를 통해 모바일 디바이스와 서버에서 실시간
        실행됩니다. 여러분의 코드는 Python 3.11 버전 인터프리터가 해석할
        예정이며, 기본 내장 라이브러리 외에도{" "}
        <Typography.Text code>numpy</Typography.Text>,{" "}
        <Typography.Text code>scipy</Typography.Text>,{" "}
        <Typography.Text code>scikit-learn</Typography.Text>,{" "}
        <Typography.Text code>pandas</Typography.Text> 라이브러리를 기호에 따라
        사용할 수 있습니다.
      </Typography.Paragraph>
      <Typography.Paragraph strong>
        AIoT의 세계에 빠질 준비가 되셨나요? 그렇다면 이제 본격적으로 실습을
        시작해봅시다! 🤗
      </Typography.Paragraph>
      <Typography.Paragraph italic>
        &mdash; 청년 AIBD AIoT 과정 TA
      </Typography.Paragraph>
    </>
  );
}
