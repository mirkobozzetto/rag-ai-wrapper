#!/bin/bash

if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

BASE_URL="$QDRANT_URL"
API_KEY="$QDRANT_API_KEY"

qdrant_request() {
    local method=$1
    local endpoint=$2
    local data=$3

    if [ -n "$data" ]; then
        curl -X $method "$BASE_URL$endpoint" \
            -H "api-key: $API_KEY" \
            -H "Content-Type: application/json" \
            -d "$data" | jq
    else
        curl -X $method "$BASE_URL$endpoint" \
            -H "api-key: $API_KEY" | jq
    fi
}

case "$1" in
    "collections")
        qdrant_request "GET" "/collections"
        ;;
    "stats")
        qdrant_request "GET" "/collections/my_rag_docs"
        ;;
    "points")
        qdrant_request "POST" "/collections/my_rag_docs/points/scroll" '{"limit": 5, "with_payload": true}'
        ;;
    "search")
        qdrant_request "POST" "/collections/my_rag_docs/points/search" '{
            "vector": [0.1, 0.2, 0.3, 0.4],
            "limit": 3,
            "with_payload": true
        }'
        ;;
    "upload")
        curl -F "file=@DevelopingAppsWithGPT-4andChatGPT.pdf" http://localhost:3000/upload | jq
        ;;
    "ask")
        curl -X POST http://localhost:3000/ask \
            -H "Content-Type: application/json" \
            -d '{"question": "What is this book about?"}' | jq
        ;;
    "local-stats")
        curl http://localhost:3000/ask/stats | jq
        ;;
    *)
        echo "Usage: $0 {collections|stats|points|search|upload|ask|local-stats}"
        ;;
esac
