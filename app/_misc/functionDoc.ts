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
  {
    name: "get_repeat_idx",
    description: "현재 반복 실행 횟수를 리턴합니다.",
    overridings: [
      {
        args: [],
        aliases: {},
        description: "",
        returns: {
          description: "현재 반복 횟수 (0부터 시작)",
          type: "int",
        },
        examples: [],
      },
    ],
  },
];

export const clientFunctionDocs: FunctionDoc[] = [
  {
    name: "get_accel",
    description:
      "가속도 센서의 x, y, z 성분을 튜플로 리턴합니다. 단위는 m/s²입니다.",
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
    name: "get_accng",
    description:
      "가속도 센서의 x, y, z 성분을 중력 상수를 제거하고 튜플로 리턴합니다. 단위는 m/s²입니다.",
    overridings: [
      {
        args: [],
        aliases: {},
        description:
          "이외에도 get_accng_x, get_accng_y, get_accng_z 함수를 사용해서 각각의 성분을 받아볼 수 있습니다. 각각 역시 중력 상수가 제거된 값입니다.",
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
    description:
      "자이로(각속도) 센서의 x, y, z 성분을 튜플로 리턴합니다. 단위는 초당 회전 각도입니다.",
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
    name: "get_rot",
    description:
      "회전 센서의 x, y, z 성분을 튜플로 리턴합니다. -180도 ~ 180도 범위입니다.",
    overridings: [
      {
        args: [],
        aliases: {},
        description:
          "이외에도 get_rot_x, get_rot_y, get_rot_z 함수를 사용해서 각각의 성분을 받아볼 수 있습니다.",
        returns: {
          description: "(x, y, z) 성분 튜플",
          type: "tuple[float, float, float]",
        },
        examples: [],
      },
    ],
  },
  {
    name: "get_sensor_time",
    description:
      "센서에서 데이터를 수집한 (센서 기준) 타임스탬프를 리턴합니다. 센서가 동작하기 시작한 뒤 몇 초가 지났는지가 반환됩니다. 센서가 시작되는 시간을 명확하게 알 수 없으므로, 이 값은 단일 값 자체로보다는 다른 값과 상대적으로 비교했을 때 의미가 있습니다.",
    overridings: [
      {
        args: [],
        aliases: {},
        description: "",
        returns: {
          description: "타임스탬프 (초)",
          type: "float",
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
            name: "y축 값 리스트",
            type: "list[int | float]",
          },
        ],
        description:
          "데이터 배열을 2차원 좌표에 선으로 나타냅니다. x축 값은 자동으로 결정됩니다.",
        aliases: {},
        returns: {
          description: "",
          type: "None",
        },
        examples: [
          {
            code: 'display("my graph", [13, 15, 17, 19, 21])',
            description: "x축 값이 0 ~ 4이고, y축 값이 주어진 데이터와 같은 선",
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
            name: "x축 및 y축 값 튜플",
            type: "tuple[list[str | int | float], list[int | float]]",
          },
        ],
        description:
          "데이터 배열을 2차원 좌표에 나타냅니다. 주어진 배열 두 개 각각을 x축과 y축 값으로 하는 그래프가 그려집니다.",
        aliases: {},
        returns: {
          description: "",
          type: "None",
        },
        examples: [
          {
            code: 'display("my graph", ([1, 2, 3, 4, 5], [13, 15, 17, 19, 21]))',
            description:
              "x축 값이 주어진 첫 번째 데이터와 같고, y축 값이 주어진 두 번째 데이터와 같은 1차원 선",
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
            name: "선 이름과 데이터 딕셔너리",
            type: "dict[str, ...]",
          },
        ],
        description:
          "딕셔너리를 활용하면 그래프에 여러 선을 그릴 수 있습니다. 딕셔너리 키는 선의 이름, 딕셔너리 값은 선의 데이터입니다. 선의 데이터는 위 두 가지 방법(y축 값 리스트, x축 값과 y축 값 리스트의 배열) 모두 사용 가능합니다.",
        aliases: {},
        returns: {
          description: "",
          type: "None",
        },
        examples: [
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
