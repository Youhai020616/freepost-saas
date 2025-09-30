#!/usr/bin/env bash

# Freepost SaaS 回滚脚本
# 用途：快速回滚到上一个稳定版本
# 使用：./scripts/rollback.sh [deployment-url-or-id]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    log_error "Vercel CLI not found. Please install: pnpm add -g vercel"
    exit 1
fi

# 检查环境变量
if [ -z "$VERCEL_TOKEN" ]; then
    log_error "VERCEL_TOKEN environment variable is not set"
    exit 1
fi

# 获取部署历史
log_info "Fetching deployment history..."
vercel ls --token=$VERCEL_TOKEN | head -n 10

# 回滚确认
log_warning "This will rollback the production deployment"
read -p "Are you sure you want to proceed? (yes/no): " -r

if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    log_error "Rollback cancelled"
    exit 1
fi

# 执行回滚
if [ -z "$1" ]; then
    log_info "Rolling back to previous deployment..."
    vercel rollback --token=$VERCEL_TOKEN --yes
else
    log_info "Rolling back to deployment: $1"
    vercel rollback "$1" --token=$VERCEL_TOKEN --yes
fi

log_success "Rollback completed"

# 健康检查
log_info "Running health check..."
sleep 10

response=$(curl -s -o /dev/null -w "%{http_code}" "https://app.freepost.io/api/health" || echo "000")

if [ "$response" == "200" ]; then
    log_success "Health check passed (HTTP $response)"
else
    log_error "Health check failed (HTTP $response)"
    log_error "Manual intervention may be required!"
    exit 1
fi

log_success "Rollback successful and service is healthy"
