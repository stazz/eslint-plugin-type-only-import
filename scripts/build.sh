#!/bin/sh

. 'scripts/preamble.sh'

LR_BUILD_MODE="$1"
if [ "${LR_BUILD_MODE}" = "run" ] || [ "${LR_BUILD_MODE}" = "ci" ]; then
  if [ "$#" -gt 0 ]; then
    shift
  fi
else
  LR_BUILD_MODE='run'
fi

yarn run "build:${LR_BUILD_MODE}"