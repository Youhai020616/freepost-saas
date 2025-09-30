import { NextResponse } from 'next/server';
import { prisma } from '@freepost/db';

/**
 * 健康检查端点
 * 用于监控应用和数据库连接状态
 */
export async function GET() {
  try {
    // 检查数据库连接
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version || '0.1.0',
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
