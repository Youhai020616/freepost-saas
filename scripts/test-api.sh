#!/bin/bash

# API 功能测试脚本

API_URL="http://localhost:8787"

echo "🧪 测试 Freepost API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 测试函数
test_endpoint() {
  local name=$1
  local url=$2
  local expected_status=${3:-200}
  
  echo -n "📡 测试 $name ... "
  
  response=$(curl -s -w "\n%{http_code}" "$url")
  status_code=$(echo "$response" | tail -1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$status_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}✓ 通过${NC} (HTTP $status_code)"
    if [ ! -z "$body" ]; then
      echo "   响应: $(echo $body | cut -c1-80)..."
    fi
  else
    echo -e "${RED}✗ 失败${NC} (预期 $expected_status, 实际 $status_code)"
    echo "   响应: $body"
  fi
  echo ""
}

# 检查 API 是否运行
echo "🔍 检查 API 服务状态..."
if ! lsof -iTCP:8787 -sTCP:LISTEN > /dev/null 2>&1; then
  echo -e "${RED}❌ API 服务未运行${NC}"
  echo "请先运行: pnpm dev:api"
  exit 1
fi
echo -e "${GREEN}✓ API 服务正在运行${NC}"
echo ""

# 运行测试
echo "开始测试端点..."
echo ""

test_endpoint "根路径 (JSON)" "$API_URL/" 200
test_endpoint "健康检查" "$API_URL/health" 200

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ 基础测试完成"
echo ""
echo "💡 在浏览器中访问 http://localhost:8787 查看 API 文档"
