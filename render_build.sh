#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt