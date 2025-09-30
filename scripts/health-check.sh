#!/usr/bin/env bash

# Freepost SaaS 健康检查脚本
# 用途：检查生产环境健康状态
# 使用：./scripts/health-check.sh

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

PROD_URL="https://app.freepost.io"
FAILED_CHECKS=0

echo "=============================================="
log_info "Running health checks on $PROD_URL"
echo "=============================================="

# 1. 基本健康检查
log_info "1. Checking /api/health endpoint..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL/api/health" || echo "000")
if [ "$response" == "200" ]; then
    log_success "Health endpoint: OK (HTTP $response)"
else
    log_error "Health endpoint: FAILED (HTTP $response)"
    ((FAILED_CHECKS++))
fi

# 2. 首页加载检查
log_info "2. Checking homepage load time..."
load_time=$(curl -o /dev/null -s -w '%{time_total}' "$PROD_URL")
if (( $(echo "$load_time < 3.0" | bc -l) )); then
    log_success "Homepage load time: ${load_time}s (< 3s)"
else
    log_warning "Homepage load time: ${load_time}s (> 3s)"
fi

# 3. API 响应时间检查
log_info "3. Checking API response time..."
api_time=$(curl -o /dev/null -s -w '%{time_total}' "$PROD_URL/api/health")
if (( $(echo "$api_time < 1.0" | bc -l) )); then
    log_success "API response time: ${api_time}s (< 1s)"
else
    log_warning "API response time: ${api_time}s (> 1s)"
fi

# 4. SSL 证书检查
log_info "4. Checking SSL certificate..."
ssl_expiry=$(echo | openssl s_client -servername app.freepost.io -connect app.freepost.io:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
if [ ! -z "$ssl_expiry" ]; then
    log_success "SSL certificate valid until: $ssl_expiry"
else
    log_error "SSL certificate check failed"
    ((FAILED_CHECKS++))
fi

# 5. 数据库连接检查（需要 DATABASE_URL）
if [ ! -z "$PRODUCTION_DATABASE_URL" ]; then
    log_info "5. Checking database connection..."
    if psql "$PRODUCTION_DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
        log_success "Database connection: OK"
    else
        log_error "Database connection: FAILED"
        ((FAILED_CHECKS++))
    fi
else
    log_warning "5. Database connection check skipped (PRODUCTION_DATABASE_URL not set)"
fi

echo "=============================================="
if [ $FAILED_CHECKS -eq 0 ]; then
    log_success "All health checks passed ✅"
    exit 0
else
    log_error "$FAILED_CHECKS health check(s) failed ❌"
    exit 1
fi
