self.falekitStorage = {};

self.onmessage = (event) => {
  const { type, payload } = event.data;
  console.log(type, payload);
  if (type.startsWith("ret:")) {
    const key = type.split(":")[1];
    self.falekitStorage[key](payload);
    delete self.falekitStorage[key];
  }
};

self.getValueFromMain = async (key, payload) => {
  const id = `${key}.${self.crypto.randomUUID()}`;
  const response = new Promise((resolve) => {
    self.falekitStorage[id] = resolve;
  });
  self.postMessage({ type: key, id, payload });
  const finalResponse = await response;
  return finalResponse;
};

self.queryData = (key, amount) => {
  // NOTE : using XHR instead of fetch because fetch doesn't support synchronous requests
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/backend/load-data?id=${key}&cnt=${amount}`, false);
  xhr.send();
  const response = JSON.parse(xhr.responseText);
  if (response.code === "green") {
    return JSON.parse(response.data);
  } else {
    return [];
  }
};

self.__falekit = {
  print: (text) => {
    return self.getValueFromMain("print", [text]);
  },
  exit_code: null,
  disp_list: [],
};

(async () => {
  self.getValueFromMain("reset", []);
  importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js");
  const script = await self.getValueFromMain("get_script", []);

  self.getValueFromMain("status", ["Python 바이너리 로드 중"]);
  self.pyodide = await loadPyodide();

  self.getValueFromMain("status", ["Python 패키지 로드 중"]);
  await self.pyodide.loadPackage([
    "numpy",
    "pandas",
    "scipy",
    "tqdm",
    "scikit-learn",
  ]);

  self.getValueFromMain("status", ["실행 중"]);
  while (self.__falekit.exit_code === null) {
    await self.pyodide.runPythonAsync(script);
    for (const data of self.__falekit.disp_list) {
      self.getValueFromMain("display", data);
    }
    self.__falekit.disp_list = [];
  }

  self.getValueFromMain("status", ["종료 중"]);
  if (self.__falekit.exit_code === null) {
    self.__falekit.exit_code = 0;
  }
  self.getValueFromMain("finished", [self.__falekit.exit_code]);
})();
