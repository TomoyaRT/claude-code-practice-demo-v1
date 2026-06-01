#!/usr/bin/env bash
# SessionStart: 注入 Git context 給 Claude

BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
LAST_COMMIT=$(git log -1 --oneline 2>/dev/null || echo "no commits yet")
CHANGED_FILES=$(git status --short 2>/dev/null | wc -l | tr -d ' ')

echo "{\"additionalContext\": \"Branch: $BRANCH | Last commit: $LAST_COMMIT | Changed files: $CHANGED_FILES\"}"
