export interface FaleGreenResponse {
  code: "green";
  data: string;
}

export interface FaleRedResponse {
  code: "red";
  error: string;
}

export function faleGreen(data: string): FaleGreenResponse {
  return { code: "green", data };
}

export function faleRed(error: string): FaleRedResponse {
  return { code: "red", error };
}
