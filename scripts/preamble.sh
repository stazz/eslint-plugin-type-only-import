set -e

LR_ROOT_DIR="$(pwd)"

# Always use Alpine-based image
LR_NODE_VERSION="$(cat "${LR_ROOT_DIR}/versions/node")-alpine"

yarn ()
{
  docker run \
    --rm \
    -t \
    --volume "${LR_ROOT_DIR}:${LR_ROOT_DIR}:rw" \
    --entrypoint yarn \
    --workdir "${LR_ROOT_DIR}" \
    --env YARN_CACHE_FOLDER="${LR_ROOT_DIR}/.yarn" \
    --env NODE_PATH="${LR_ROOT_DIR}/node_modules" \
    "node:${LR_NODE_VERSION}" \
    "$@"
}
