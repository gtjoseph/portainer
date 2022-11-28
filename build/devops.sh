#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# <platform>:<arch>:<env>
PLATFORM=${1:-"linux"}
ARCH=${2:-"amd64"}
ENV=${3:-"production"}

export NODE_ENV=$ENV
rm -rf dist

./build/build_binary_azuredevops.sh "$PLATFORM" "$ARCH"
./build/download_binaries.sh "$PLATFORM" "$ARCH"

WEBPACK_CONFIG=webpack.config.js
if [ "$ENV" == "development" ]; then
    WEBPACK_CONFIG=webpack/webpack.develop.js
    elif [ "$ENV" == "production" ]; then
    WEBPACK_CONFIG=webpack/webpack.production.js
    elif [ "$ENV" == "testing" ]; then
    WEBPACK_CONFIG=webpack/webpack.test.js
fi

yarn webpack --config $WEBPACK_CONFIG

yarn storybook:build