#!/bin/bash

# 清理所有开发服务器端口

echo "🧹 清理开发服务器端口..."

# 清理端口 3000
PID_3000=$(lsof -iTCP:3000 -sTCP:LISTEN -t 2>/dev/null || true)
if [ ! -z "$PID_3000" ]; then
  echo "🔧 清理端口 3000 (PID: $PID_3000)"
  kill -9 $PID_3000 2>/dev/null || true
fi

# 清理端口 8787
PID_8787=$(lsof -iTCP:8787 -sTCP:LISTEN -t 2>/dev/null || true)
if [ ! -z "$PID_8787" ]; then
  echo "🔧 清理端口 8787 (PID: $PID_8787)"
  kill -9 $PID_8787 2>/dev/null || true
fi

sleep 1

echo "✅ 端口清理完成"
echo ""
echo "现在可以运行: pnpm dev"
