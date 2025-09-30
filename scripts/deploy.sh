#!/usr/bin/env bash

# Freepost SaaS 部署脚本
# 用途：手动部署到指定环境
# 使用：./scripts/deploy.sh [preview|staging|production]

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
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

# 检查必需的环境变量
check_env_vars() {
    if [ -z "$VERCEL_TOKEN" ]; then
        log_error "VERCEL_TOKEN environment variable is not set"
        echo "Please run: export VERCEL_TOKEN=your-token"
        exit 1
    fi
}

# 检查 pnpm 是否安装
check_pnpm() {
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm is not installed"
        echo "Please install pnpm: npm install -g pnpm"
        exit 1
    fi
}

# 检查 Vercel CLI 是否安装
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        log_info "Vercel CLI not found, installing..."
        pnpm add -g vercel@latest
        log_success "Vercel CLI installed"
    fi
}

# 清理构建缓存
clean_build() {
    log_info "Cleaning build cache..."
    rm -rf apps/web/.next
    rm -rf apps/web/.vercel
    log_success "Build cache cleaned"
}

# 安装依赖
install_dependencies() {
    log_info "Installing dependencies..."
    pnpm install --frozen-lockfile
    log_success "Dependencies installed"
}

# 生成 Prisma 客户端
generate_prisma() {
    log_info "Generating Prisma Client..."
    cd packages/db
    pnpm prisma:generate
    cd ../..
    log_success "Prisma Client generated"
}

# 运行代码检查
run_linting() {
    log_info "Running ESLint..."
    pnpm lint
    log_success "Linting passed"
}

# 运行类型检查
run_type_check() {
    log_info "Running TypeScript type check..."
    pnpm -r exec tsc --noEmit
    log_success "Type check passed"
}

# 运行数据库迁移
run_migrations() {
    local env=$1
    log_info "Running database migrations for $env..."

    case $env in
        preview)
            log_warning "Skipping migrations for preview environment"
            ;;
        staging)
            if [ -z "$STAGING_DATABASE_URL" ]; then
                log_error "STAGING_DATABASE_URL is not set"
                exit 1
            fi
            cd packages/db
            DATABASE_URL=$STAGING_DATABASE_URL pnpm prisma migrate deploy
            cd ../..
            log_success "Staging migrations completed"
            ;;
        production)
            log_warning "About to run migrations on PRODUCTION database"
            read -p "Are you sure? (yes/no): " -r
            if [[ $REPLY =~ ^[Yy]es$ ]]; then
                if [ -z "$PRODUCTION_DATABASE_URL" ]; then
                    log_error "PRODUCTION_DATABASE_URL is not set"
                    exit 1
                fi
                cd packages/db
                DATABASE_URL=$PRODUCTION_DATABASE_URL pnpm prisma migrate deploy
                cd ../..
                log_success "Production migrations completed"
            else
                log_error "Migration cancelled"
                exit 1
            fi
            ;;
    esac
}

# 部署到 Vercel
deploy_to_vercel() {
    local env=$1
    log_info "Deploying to $env environment..."

    case $env in
        preview)
            vercel pull --yes --environment=preview --token=$VERCEL_TOKEN
            vercel build --token=$VERCEL_TOKEN
            DEPLOY_URL=$(vercel deploy --prebuilt --token=$VERCEL_TOKEN)
            ;;
        staging)
            vercel pull --yes --environment=preview --token=$VERCEL_TOKEN
            vercel build --token=$VERCEL_TOKEN
            DEPLOY_URL=$(vercel deploy --prebuilt --token=$VERCEL_TOKEN)
            ;;
        production)
            log_warning "About to deploy to PRODUCTION"
            read -p "Are you sure? (yes/no): " -r
            if [[ $REPLY =~ ^[Yy]es$ ]]; then
                vercel pull --yes --environment=production --token=$VERCEL_TOKEN
                vercel build --prod --token=$VERCEL_TOKEN
                DEPLOY_URL=$(vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN)
            else
                log_error "Deployment cancelled"
                exit 1
            fi
            ;;
    esac

    log_success "Deployed to $DEPLOY_URL"
    echo "$DEPLOY_URL"
}

# 健康检查
health_check() {
    local url=$1
    log_info "Running health check on $url..."

    sleep 5  # 等待部署完成

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url/api/health" || echo "000")

    if [ "$response" == "200" ]; then
        log_success "Health check passed (HTTP $response)"
    else
        log_error "Health check failed (HTTP $response)"
        exit 1
    fi
}

# 主函数
main() {
    local environment=$1

    if [ -z "$environment" ]; then
        log_error "Usage: ./scripts/deploy.sh [preview|staging|production]"
        exit 1
    fi

    if [[ ! "$environment" =~ ^(preview|staging|production)$ ]]; then
        log_error "Invalid environment: $environment"
        log_error "Valid options: preview, staging, production"
        exit 1
    fi

    log_info "Starting deployment to $environment environment"
    echo "=============================================="

    # 预检查
    check_pnpm
    check_vercel_cli
    check_env_vars

    # 构建流程
    clean_build
    install_dependencies
    generate_prisma
    run_linting
    run_type_check

    # 数据库迁移
    run_migrations "$environment"

    # 部署
    DEPLOY_URL=$(deploy_to_vercel "$environment")

    # 健康检查（仅生产环境）
    if [ "$environment" == "production" ]; then
        health_check "https://app.freepost.io"
    else
        health_check "$DEPLOY_URL"
    fi

    echo "=============================================="
    log_success "Deployment completed successfully!"
    log_info "Deployment URL: $DEPLOY_URL"

    # 复制 URL 到剪贴板（macOS）
    if command -v pbcopy &> /dev/null; then
        echo "$DEPLOY_URL" | pbcopy
        log_info "URL copied to clipboard"
    fi
}

# 运行主函数
main "$@"
