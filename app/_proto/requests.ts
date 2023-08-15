export interface SaveCodeRequest {
  type: "server" | "client";
  code: string;
}

export interface SaveDataRequest {
  name: string;
  data: string | number | boolean;
}
