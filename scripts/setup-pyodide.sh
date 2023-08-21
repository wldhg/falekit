#!/bin/bash

wget https://github.com/pyodide/pyodide/releases/download/0.23.4/pyodide-0.23.4.tar.bz2
tar -xjf pyodide-0.23.4.tar.bz2
mv pyodide public
rm pyodide-0.23.4.tar.bz2
