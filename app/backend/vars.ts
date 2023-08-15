import os from "os";
import path from "path";

export const tempClientCodePath = path.join(
  os.tmpdir(),
  "FALETEMP_code_client.py"
);
export const tempServerCodePath = path.join(
  os.tmpdir(),
  "FALETEMP_code_server.py"
);

export const getTempClienDataInfoPath = (dataName: string) => {
  return path.join(os.tmpdir(), `FALETEMP_data_${dataName}.json`);
};

export const getTempClienDataBigPath = (dataName: string) => {
  return path.join(os.tmpdir(), `FALETEMP_data_${dataName}.csv`);
};
