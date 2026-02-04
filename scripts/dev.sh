#!/bin/bash

# Freepost SaaS 开发服务器智能启动脚本
# 自动检查并处理端口占用，确保干净启动

set -e

echo "🔍 检查开发服务器端口状态..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查并清理端口函数
check_and_clean_port() {
  local port=$1
  local service_name=$2
  local force_kill=${3:-false}

  PORT_INFO=$(lsof -iTCP:$port -sTCP:LISTEN -n -P 2>/dev/null || true)

  if [ ! -z "$PORT_INFO" ]; then
    PID=$(echo "$PORT_INFO" | awk 'NR==2 {print $2}')
    COMMAND=$(echo "$PORT_INFO" | awk 'NR==2 {print $1}')

    echo -e "${YELLOW}⚠️  端口 $port ($service_name) 已被占用${NC}"
    echo "   进程: $COMMAND (PID: $PID)"

    # 如果是开发服务器，询问是否重启
    if [[ "$COMMAND" == "node" ]] || [[ "$COMMAND" == "next" ]]; then
      if [ "$force_kill" = true ]; then
        echo -e "${BLUE}🔧 正在清理旧进程...${NC}"
        kill -9 $PID 2>/dev/null || true
        sleep 1
        echo -e "${GREEN}✅ 端口 $port 已清理${NC}"
      else
        echo -e "${BLUE}💡 检测到开发服务器正在运行${NC}"
        echo "   如需重启，请先手动停止: kill $PID"
        return 1
      fi
    else
      echo -e "${RED}❌ 端口被非开发服务器进程占用${NC}"
      echo "   请手动处理: kill $PID"
      return 1
    fi
  else
    echo -e "${GREEN}✅ 端口 $port ($service_name) 空闲${NC}"
  fi

  return 0
}

# 检查端口 3000 (Web)
WEB_READY=false
if check_and_clean_port 3000 "Next.js Web" false; then
  WEB_READY=true
else
  echo ""
  read -p "是否强制重启 Web 服务? (y/N): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    check_and_clean_port 3000 "Next.js Web" true
    WEB_READY=true
  fi
fi

echo ""

# 检查端口 8787 (API) - 总是清理
check_and_clean_port 8787 "Hono API" true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 根据情况启动服务
if [ "$WEB_READY" = true ]; then
  echo -e "${GREEN}🚀 启动完整开发环境${NC}"
  echo ""
  echo "   📍 Next.js Web: http://localhost:3000"
  echo "   📍 Hono API:    http://localhost:8787"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${YELLOW}💡 提示: 按 Ctrl+C 停止所有服务${NC}"
  echo ""

  # 启动并行开发服务器
  pnpm --parallel --filter @freepost/api --filter @freepost/web dev
else
  echo -e "${YELLOW}⚡ 仅启动 API 服务${NC}"
  echo "   (Web 服务已在运行或被跳过)"
  echo ""
  echo "   📍 Hono API: http://localhost:8787"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${YELLOW}💡 提示: 按 Ctrl+C 停止服务${NC}"
  echo ""

  # 仅启动 API 服务
  pnpm --filter @freepost/api dev
fi
