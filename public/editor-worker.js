(async () => {
  self.postMessage({ type: "isLoaded", payload: false });
  importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js");

  self.pyodide = await loadPyodide();

  self.latest_uuid = "";

  self.onmessage = (event) => {
    const code = event.data;
    let uuid = self.crypto.randomUUID();
    self.latest_uuid = uuid;

    try {
      self.pyodide.runPythonAsync(code).then((result) => {
        if (self.latest_uuid === uuid) {
          self.postMessage({ type: "result", payload: result });
        }
      });
    } catch (e) {
      if (self.latest_uuid === uuid) {
        self.postMessage({ type: "result", payload: e });
      }
    }
  };

  self.postMessage({ type: "isLoaded", payload: true });
})();
