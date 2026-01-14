#!/usr/bin/env bash
# This script sets up the local development environment for the backend.

set -o errexit
set -o errtrace
set -o nounset
set -o pipefail
IFS=$'\n'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$SCRIPT_DIR/.."

echo "[+] Installing uv (Python 3.13+ compatible)..."
curl -LsSf https://astral.sh/uv/install.sh | sh

echo
echo "[+] Creating virtual environment..."
uv venv

echo
echo "[+] Installing dependencies from pyproject.toml..."
uv sync --dev

echo
echo "[√] Setup complete!"

echo
echo "[ℹ️] Tips:"
echo "  - Activate the environment: source .venv/bin/activate"
echo "  - Run tests: ./bin/test.sh"
echo "  - Lint and check types: ./bin/lint.sh"
echo "  - You can add your LLM API keys and configs in a .env file"

echo
uv pip list
