#!/usr/bin/env bash

# Freepost SaaS 数据库备份脚本
# 用途：备份生产数据库到本地和 S3
# 使用：./scripts/backup-db.sh

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

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查环境变量
if [ -z "$PRODUCTION_DATABASE_URL" ]; then
    log_error "PRODUCTION_DATABASE_URL is not set"
    exit 1
fi

# 创建备份目录
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# 生成备份文件名
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/freepost_backup_$TIMESTAMP.sql"

log_info "Starting database backup..."
log_info "Backup file: $BACKUP_FILE"

# 执行备份
pg_dump "$PRODUCTION_DATABASE_URL" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    log_success "Database backup completed"

    # 压缩备份文件
    gzip "$BACKUP_FILE"
    BACKUP_FILE="$BACKUP_FILE.gz"
    log_success "Backup compressed: $BACKUP_FILE"

    # 上传到 S3（如果配置了）
    if [ ! -z "$AWS_S3_BACKUP_BUCKET" ] && command -v aws &> /dev/null; then
        log_info "Uploading backup to S3..."
        aws s3 cp "$BACKUP_FILE" "s3://$AWS_S3_BACKUP_BUCKET/db/$(basename $BACKUP_FILE)"
        log_success "Backup uploaded to S3"
    fi

    # 清理旧备份（保留最近 7 天）
    find "$BACKUP_DIR" -name "freepost_backup_*.sql.gz" -mtime +7 -delete
    log_info "Old backups cleaned (kept last 7 days)"

else
    log_error "Database backup failed"
    exit 1
fi
