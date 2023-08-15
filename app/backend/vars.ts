import { globSync } from "glob";
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

export const getAllTempClientDataInfoPaths = () => {
  const globTarget = path.join(os.tmpdir(), `FALETEMP_data_*.json`);
  return globSync(globTarget);
};

export const getAllTempClientDataBigPaths = () => {
  const globTarget = path.join(os.tmpdir(), `FALETEMP_data_*.csv`);
  return globSync(globTarget);
};

// NOTE: if modify this, also modify scripts/proxy-ssl.js
export const tempPingPath = path.join(os.tmpdir(), "FALETEMP_ping.json");
