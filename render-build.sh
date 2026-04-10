#!/usr/bin/env bash
set -euo pipefail

# Optional: install OS packages if apt-get is available in the build image.
if command -v apt-get >/dev/null 2>&1; then
  apt-get update
  apt-get install -y libgl1 libglib2.0-0
fi

pip install --upgrade pip
pip install -r requirements.txt
