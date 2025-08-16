#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$SCRIPT_DIR/.."

echo "[*] Running pre-commit hooks..."
uv run pre-commit run --all-files

echo "[*] Running type checker (pyright)..."
uv run pyright
