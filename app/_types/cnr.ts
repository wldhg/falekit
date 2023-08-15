export interface FaleGreenResponse {
  code: "green";
  data: string;
}

export interface FaleRedResponse {
  code: "red";
  error: string;
}
