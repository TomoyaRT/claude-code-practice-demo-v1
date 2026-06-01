#!/usr/bin/env bash
# Stop: 自動 checkpoint commit

# 確認在 git repo 中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  exit 0
fi

# 確認有未 commit 的變更
if git diff --cached --quiet && git diff --quiet; then
  exit 0
fi

# 取得變更的檔案列表
CHANGED=$(git status --short | head -5 | awk '{print $2}' | tr '\n' ' ')
TIMESTAMP=$(date '+%H:%M')

git add -A
git commit -m "chore: auto checkpoint [$TIMESTAMP] $CHANGED" 2>/dev/null || true

echo "✅ Auto-committed at $TIMESTAMP"
