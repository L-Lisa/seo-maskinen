export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { apiLogger } from '@/lib/logger';

interface SystemMetrics {
  timestamp: string;
  memory: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  performance: {
    uptime: number;
    nodeVersion: string;
    platform: string;
  };
  database: {
    totalUsers: number;
    totalAnalyses: number;
    recentAnalyses: number; // Last 24 hours
  };
  usage: {
    activeUsers: number; // Users with activity in last 7 days
    averageCreditsUsed: number;
    topPerformingUsers: Array<{
      userId: string;
      analysesCount: number;
      creditsUsed: number;
    }>;
  };
}

/**
 * System metrics endpoint for monitoring and analytics
 */
export async function GET(request: NextRequest): Promise<NextResponse<SystemMetrics | { error: string }>> {
  const startTime = Date.now();
  
  try {
    // Get memory usage
    const memUsage = process.memoryUsage();
    
    // Get performance metrics
    const performance = {
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
    };

    // Get database metrics
    const supabase = createClient();
    const metrics: SystemMetrics = {
      timestamp: new Date().toISOString(),
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024), // MB
      },
      performance,
      database: {
        totalUsers: 0,
        totalAnalyses: 0,
        recentAnalyses: 0,
      },
      usage: {
        activeUsers: 0,
        averageCreditsUsed: 0,
        topPerformingUsers: [],
      },
    };

    // Get user count
    try {
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      metrics.database.totalUsers = userCount || 0;
    } catch (error) {
      apiLogger.error('Failed to get user count', { error: error instanceof Error ? error.message : 'Unknown' });
    }

    // Get analysis count
    try {
      const { count: analysisCount } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true });
      
      metrics.database.totalAnalyses = analysisCount || 0;
    } catch (error) {
      apiLogger.error('Failed to get analysis count', { error: error instanceof Error ? error.message : 'Unknown' });
    }

    // Get recent analyses (last 24 hours)
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: recentCount } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());
      
      metrics.database.recentAnalyses = recentCount || 0;
    } catch (error) {
      apiLogger.error('Failed to get recent analysis count', { error: error instanceof Error ? error.message : 'Unknown' });
    }

    // Get usage metrics
    try {
      // Active users (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', weekAgo.toISOString());
      
      metrics.usage.activeUsers = activeUsers || 0;

      // Average credits used
      const { data: creditsData } = await supabase
        .from('users')
        .select('credits')
        .not('credits', 'is', null);
      
      if (creditsData && creditsData.length > 0) {
        const totalCredits = creditsData.reduce((sum, user) => sum + (user.credits || 0), 0);
        metrics.usage.averageCreditsUsed = Math.round(totalCredits / creditsData.length);
      }

      // Top performing users
      const { data: topUsers } = await supabase
        .from('users')
        .select('id, credits')
        .order('credits', { ascending: false })
        .limit(5);
      
      if (topUsers) {
        // Get analysis counts for top users
        const topUserIds = topUsers.map(user => user.id);
        const { data: userAnalyses } = await supabase
          .from('analyses')
          .select('user_id')
          .in('user_id', topUserIds);
        
        const analysisCounts = userAnalyses?.reduce((acc, analysis) => {
          acc[analysis.user_id] = (acc[analysis.user_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};
        
        metrics.usage.topPerformingUsers = topUsers.map(user => ({
          userId: user.id,
          analysesCount: analysisCounts[user.id] || 0,
          creditsUsed: user.credits || 0,
        }));
      }
    } catch (error) {
      apiLogger.error('Failed to get usage metrics', { error: error instanceof Error ? error.message : 'Unknown' });
    }

    const responseTime = Date.now() - startTime;
    
    // Log metrics collection
    apiLogger.info('Metrics collected', {
      responseTime,
      totalUsers: metrics.database.totalUsers,
      totalAnalyses: metrics.database.totalAnalyses,
      recentAnalyses: metrics.database.recentAnalyses,
      activeUsers: metrics.usage.activeUsers,
      memoryUsage: metrics.memory.rss,
    });

    return NextResponse.json(metrics);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    apiLogger.error('Metrics collection failed', { error: errorMessage });
    
    return NextResponse.json(
      { error: 'Failed to collect metrics' },
      { status: 500 }
    );
  }
}
