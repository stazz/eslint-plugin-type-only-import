#!/bin/sh

. 'scripts/preamble.sh'

LR_TEST_MODE="$1"
if [ "${LR_TEST_MODE}" = "run" ] || [ "${LR_TEST_MODE}" = "coverage" ]; then
  if [ "$#" -gt 0 ]; then
    shift
  fi
else
  LR_TEST_MODE='run'
fi

yarn run "test:${LR_TEST_MODE}" "$@"
