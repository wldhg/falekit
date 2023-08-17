export interface SaveCodeRequest {
  type: "server" | "client";
  code: string;
  validity: boolean;
}

export type SaveDataRequest = {
  name: string;
  data: string | number | boolean;
}[];
