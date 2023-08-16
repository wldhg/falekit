export interface SaveCodeRequest {
  type: "server" | "client";
  code: string;
}

export type SaveDataRequest = {
  name: string;
  data: string | number | boolean;
}[];
