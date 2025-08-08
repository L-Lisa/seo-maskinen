'use client';

import { useState, useEffect } from 'react';
import { apiLogger } from '@/lib/logger';

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  error?: string;
  details?: Record<string, any>;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    database: ServiceHealth;
    openai: ServiceHealth;
    crawler: ServiceHealth;
    memory: ServiceHealth;
  };
  checks: {
    total: number;
    passed: number;
    failed: number;
  };
}

export default function HealthMonitor() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/health');
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      const healthData = await response.json();
      setHealth(healthData);
      setLastUpdate(new Date());
      setError(null);
      
      // Log health status for monitoring
      apiLogger.info('Health monitor updated', {
        status: healthData.status,
        checks: healthData.checks,
        uptime: healthData.uptime,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      apiLogger.error('Health monitor failed', { error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-100';
      case 'degraded': return 'text-yellow-500 bg-yellow-100';
      case 'unhealthy': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'unhealthy': return '❌';
      default: return '❓';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading && !health) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">System Health</h2>
        <div className="flex items-center space-x-4">
          {lastUpdate && (
            <span className="text-sm text-gray-400">
              Senast uppdaterad: {lastUpdate.toLocaleTimeString('sv-SE')}
            </span>
          )}
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="px-3 py-1 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'Uppdaterar...' : 'Uppdatera'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
          <p className="text-red-200">Fel vid hämtning av systemstatus: {error}</p>
        </div>
      )}

      {health && (
        <>
          {/* Overall Status */}
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getStatusIcon(health.status)}</span>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    Systemstatus: {health.status.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Version {health.version} • Uptime: {formatUptime(health.uptime)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(health.status)}`}>
                  {health.checks.passed}/{health.checks.total} checks passed
                </div>
              </div>
            </div>
          </div>

          {/* Service Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(health.services).map(([serviceName, service]) => (
              <div key={serviceName} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white capitalize">
                    {serviceName === 'openai' ? 'OpenAI API' : 
                     serviceName === 'database' ? 'Databas' :
                     serviceName === 'crawler' ? 'Webbcrawler' :
                     serviceName === 'memory' ? 'Minnesanvändning' : serviceName}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getStatusIcon(service.status)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Svarstid:</span>
                    <span className="text-white">{service.responseTime}ms</span>
                  </div>
                  
                  {service.error && (
                    <div className="text-sm text-red-400 bg-red-900/50 p-2 rounded">
                      {service.error}
                    </div>
                  )}
                  
                  {service.details && (
                    <div className="text-xs text-gray-400 space-y-1">
                      {Object.entries(service.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span className="text-gray-300">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* System Info */}
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="font-medium text-white mb-3">Systeminformation</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Status:</span>
                <div className="text-white font-medium">{health.status}</div>
              </div>
              <div>
                <span className="text-gray-400">Kontroller:</span>
                <div className="text-white font-medium">
                  {health.checks.passed}/{health.checks.total} lyckades
                </div>
              </div>
              <div>
                <span className="text-gray-400">Version:</span>
                <div className="text-white font-medium">{health.version}</div>
              </div>
              <div>
                <span className="text-gray-400">Uptime:</span>
                <div className="text-white font-medium">{formatUptime(health.uptime)}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
