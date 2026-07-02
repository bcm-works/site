#!/usr/bin/env bash
#
#
# Infra setup for Railway environment setup
#  - Run from src/infra: ./bin/infra-setup
#
#

INFRA="$(cd "$(dirname "$0")" && cd .. && pwd)"
cd "$INFRA"

echo 'Installing the Railway CLI'

curl -fsSL agents.railway.com | sh

echo 'Configuring Railway CLI'

source "$HOME/.railway/env"
railway telemetry disable

echo 'Installing Railway TypeScript SDK'

npm install --global railway

echo 'Prompting Railway login'

railway login
railway link
