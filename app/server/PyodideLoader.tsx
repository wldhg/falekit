"use client";

import {
  _isPyodideAvailable,
  _pyodide,
  useSetRecoilState,
} from "@/_recoil/server";
import {
  PyodideInterface,
  version as PyodideVersion,
  loadPyodide,
} from "pyodide";
import { useEffect } from "react";

const PyodideLoader = () => {
  const setPyodide = useSetRecoilState(_pyodide);
  const setIsPyodideAvailable = useSetRecoilState(_isPyodideAvailable);

  useEffect(() => {
    let pyodide_local: PyodideInterface | undefined = undefined;
    loadPyodide({
      indexURL: `https://cdn.jsdelivr.net/pyodide/v${PyodideVersion}/full/`,
    })
      .then((pyodide) => {
        setPyodide(pyodide);
        pyodide_local = pyodide;
        return pyodide.loadPackage([
          "numpy",
          "pandas",
          "scipy",
          "tqdm",
          "scikit-learn",
        ]);
      })
      .then(() => {
        setIsPyodideAvailable(true);
      });

    return () => {
      if (pyodide_local) {
        pyodide_local.pyodide_py.destroy();
      }
      setIsPyodideAvailable(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default PyodideLoader;
