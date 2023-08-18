export interface FunctionDoc {
  name: string;
  description: string;
  overridings: {
    args: {
      name: string;
      type: string;
    }[];
    description: string;
    aliases: {
      [key: string]: string;
    };
    returns: {
      description: string;
      type: string;
    };
    examples: {
      code: string;
      description: string;
    }[];
  }[];
}

export const commonFunctionDocs: FunctionDoc[] = [
  {
    name: "save",
    description: "데이터를 반복 실행 간 유지되도록 저장합니다.",
    overridings: [
      {
        args: [
          {
            name: "식별자",
            type: "str",
          },
          {
            name: "데이터",
            type: "any",
          },
        ],
        aliases: {},
        description:
          "참고: 저장하지 않은 변수는 다음 반복 시 값이 유지되지 않고 사라집니다.",
        returns: {
          description: "",
          type: "None",
        },
        examples: [],
      },
    ],
  },
  {
    name: "load",
    description: "저장한 데이터를 불러옵니다.",
    overridings: [
      {
        args: [
          {
            name: "식별자",
            type: "str",
          },
        ],
        aliases: {},
        description:
          "save() 함수로 저장한 데이터를 불러옵니다. 저장하지 않은 식별자를 불러오면 None이 리턴됩니다.",
        returns: {
          description: "",
          type: "any",
        },
        examples: [],
      },
    ],
  },
];

export const clientFunctionDocs: FunctionDoc[] = [
  {
    name: "get_accel",
    description: "가속도 센서의 x, y, z 성분을 튜플로 리턴합니다.",
    overridings: [
      {
        args: [],
        aliases: {},
        description:
          "이외에도 get_accel_x, get_accel_y, get_accel_z 함수를 사용해서 각각의 성분을 받아볼 수 있습니다.",
        returns: {
          description: "(x, y, z) 성분 튜플",
          type: "tuple[float, float, float]",
        },
        examples: [],
      },
    ],
  },
  {
    name: "get_gyro",
    description: "자이로 센서의 x, y, z 성분을 튜플로 리턴합니다.",
    overridings: [
      {
        args: [],
        aliases: {},
        description:
          "이외에도 get_gyro_x, get_gyro_y, get_gyro_z 함수를 사용해서 각각의 성분을 받아볼 수 있습니다.",
        returns: {
          description: "(x, y, z) 성분 튜플",
          type: "tuple[float, float, float]",
        },
        examples: [],
      },
    ],
  },
  {
    name: "get_gyro_accum",
    description: "자이로 센서의 x, y, z 성분 누적값을 튜플로 리턴합니다.",
    overridings: [
      {
        args: [],
        aliases: {},
        description:
          "이외에도 get_gyro_accum_x, get_gyro_accum_y, get_gyro_accum_z 함수를 사용해서 각각의 성분을 받아볼 수 있습니다.",
        returns: {
          description: "(x, y, z) 성분 튜플",
          type: "tuple[float, float, float]",
        },
        examples: [],
      },
    ],
  },
  {
    name: "send",
    description: "데이터를 서버로 전송합니다.",
    overridings: [
      {
        args: [
          {
            name: "식별자",
            type: "str",
          },
          {
            name: "데이터",
            type: "str | int | float | bool",
          },
        ],
        aliases: {},
        description:
          "데이터는 문자열, 정수, 실수, 불리언 중 하나여야 합니다. 배열은 저장할 수 없습니다.",
        returns: {
          description: "",
          type: "None",
        },
        examples: [],
      },
    ],
  },
];

export const serverFunctionDocs: FunctionDoc[] = [
  {
    name: "get_data",
    description: "최신 데이터를 원하는 만큼 불러올 수 있습니다.",
    overridings: [
      {
        args: [
          {
            name: "식별자",
            type: "str",
          },
          {
            name: "개수",
            type: "int",
          },
        ],
        aliases: {},
        description:
          "여기서 식별자는 센서 코드에서 send() 함수에 적어준 식별자와 같아야 합니다. 저장된 데이터 수보다 더 많은 개수를 요청하면 저장된 데이터 수만큼만 리턴됩니다. 리턴 배열은 시간 오름차순으로 정렬되어 있습니다.",
        returns: {
          description: "(밀리초 에포크 시간, 데이터) 튜플의 배열",
          type: "list[tuple[int, str | int | float | bool]]",
        },
        examples: [],
      },
    ],
  },
  {
    name: "display",
    description: "모니터에 값을 표시할 수 있습니다.",
    overridings: [
      {
        args: [
          {
            name: "제목",
            type: "str",
          },
          {
            name: "단일 데이터",
            type: "str | int | float | bool",
          },
        ],
        description: "단일 데이터를 크게 표시합니다.",
        aliases: {},
        returns: {
          description: "",
          type: "None",
        },
        examples: [
          {
            code: 'display("my number", 123)',
            description: "",
          },
        ],
      },
      {
        args: [
          {
            name: "제목",
            type: "str",
          },
          {
            name: "데이터 배열",
            type: "Plottable | dict[str, Plottable]",
          },
        ],
        description:
          "데이터 배열을 그래프로 표시합니다. 1차원 배열이 하나를 주면 그것을 y축 값으로 하는 그래프가, 1차원 배열 두 개를 튜플로 주면 각각을 x축과 y축 값으로 하는 그래프가 그려집니다. 여러 그래프를 한 그림에 나타내려면 각 선의 이름을 키로, 데이터 배열을 값으로 하는 딕셔너리를 주면 됩니다.",
        aliases: {
          Plottable: "Data1d | tuple[Data1d, Data1d]",
          Data1d: "list[str | int | float | bool]",
        },
        returns: {
          description: "",
          type: "None",
        },
        examples: [
          {
            code: 'display("my graph", [13, 15, 17, 19, 21])',
            description:
              "x축 값이 0 ~ 4이고, y축 값이 주어진 데이터와 같은 1차원 선",
          },
          {
            code: 'display("my graph", ([1, 2, 3, 4, 5], [13, 15, 17, 19, 21]))',
            description:
              "x축 값이 주어진 첫 번째 데이터와 같고, y축 값이 주어진 두 번째 데이터와 같은 1차원 선",
          },
          {
            code: 'display("my graph", {"first": [13, 15, 17, 19, 21], "second": [1, 2, 3, 4, 5]})',
            description:
              "x축 값이 0 ~ 4이고, y축 값이 주어진 데이터와 같은 1차원 선 두 개",
          },
        ],
      },
    ],
  },
  {
    name: "act_led",
    description: "가상 LED를 제어합니다.",
    overridings: [
      {
        args: [
          {
            name: "이름",
            type: "str",
          },
          {
            name: "색상값",
            type: "str",
          },
        ],
        aliases: {},
        description:
          "색상 값으로는 단순 이름 (예: 'red') 또는 RGB 값 (예: '#ff0000')을 사용할 수 있습니다. 검은 색('black' 또는 '#000' 또는 '#000000')으로 설정된 경우 LED가 꺼집니다.",
        returns: {
          description: "",
          type: "None",
        },
        examples: [],
      },
    ],
  },
  {
    name: "act_buzzer",
    description: "가상 부저를 제어합니다.",
    overridings: [
      {
        args: [
          {
            name: "이름",
            type: "str",
          },
          {
            name: "동작 여부",
            type: "bool",
          },
          {
            name: "주파수",
            type: "float | int",
          },
        ],
        aliases: {},
        description:
          "동작 여부가 True인 경우 주파수에 따른 사인파가 울립니다. 주파수는 40Hz에서 1000Hz 사이의 숫자가 되어야 합니다.",
        returns: {
          description: "",
          type: "None",
        },
        examples: [],
      },
    ],
  },
  {
    name: "act_motor",
    description: "가상 모터를 제어합니다.",
    overridings: [
      {
        args: [
          {
            name: "이름",
            type: "str",
          },
          {
            name: "속도",
            type: "float | int",
          },
        ],
        aliases: {},
        description: "속도 단위는 RPM입니다.",
        returns: {
          description: "",
          type: "None",
        },
        examples: [],
      },
    ],
  },
  {
    name: "act_servo",
    description: "가상 서보 모터를 제어합니다.",
    overridings: [
      {
        args: [
          {
            name: "이름",
            type: "str",
          },
          {
            name: "각도",
            type: "float | int",
          },
        ],
        aliases: {},
        description: "각도는 0 ~ 360 사이의 실수입니다.",
        returns: {
          description: "",
          type: "None",
        },
        examples: [],
      },
    ],
  },
];
