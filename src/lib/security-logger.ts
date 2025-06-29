interface SecurityEvent {
  timestamp: string;
  requestId: string;
  eventType: 'auth' | 'upload' | 'admin' | 'security' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  clientIP: string;
  userAgent?: string;
  details: Record<string, unknown>;
  outcome: 'success' | 'failure' | 'blocked' | 'error';
}

interface AuthEvent extends SecurityEvent {
  eventType: 'auth';
  details: {
    pin?: string;
    hashedPin?: string;
    volunteerId?: number;
    callsign?: string;
    rateLimited?: boolean;
    attempts?: number;
  };
}

interface UploadEvent extends SecurityEvent {
  eventType: 'upload';
  details: {
    filename: string;
    fileSize: number;
    recordCount?: number;
    volunteerId: number;
    callsign: string;
    validationErrors?: string[];
    qrzSubmission?: boolean;
  };
}

interface AdminEvent extends SecurityEvent {
  eventType: 'admin';
  details: {
    action: string;
    targetResource?: string;
    adminId?: number;
    adminCallsign?: string;
    changes?: Record<string, unknown>;
  };
}

interface SecurityIncident extends SecurityEvent {
  eventType: 'security';
  details: {
    threatType: 'brute_force' | 'invalid_input' | 'rate_limit' | 'suspicious_activity';
    description: string;
    mitigationTaken?: string;
    blockedDuration?: number;
  };
}

/**
 * Security logger for monitoring and alerting
 */
class SecurityLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private log(event: SecurityEvent): void {
    // In development, log to console
    if (this.isDevelopment) {
      const logLevel = this.getLogLevel(event.severity);
      console[logLevel](`[SECURITY] ${event.eventType.toUpperCase()}:`, {
        timestamp: event.timestamp,
        requestId: event.requestId,
        severity: event.severity,
        clientIP: event.clientIP,
        outcome: event.outcome,
        details: event.details
      });
    }
    
    // In production, this would send to logging service (e.g., DataDog, CloudWatch, Sentry)
    this.sendToLoggingService(event);
    
    // For critical events, send immediate alerts
    if (event.severity === 'critical') {
      this.sendSecurityAlert(event);
    }
  }
  
  private getLogLevel(severity: string): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warn';
      default:
        return 'log';
    }
  }
  
  private sendToLoggingService(event: SecurityEvent): void {
    // TODO: Implement actual logging service integration
    // Examples: DataDog, CloudWatch, Splunk, etc.
    
    // For now, we'll structure the log for future integration
    const structuredLog = {
      '@timestamp': event.timestamp,
      'service': 'america250-ncs',
      'version': '1.0.0',
      'environment': process.env.NODE_ENV || 'development',
      'event_type': event.eventType,
      'severity': event.severity,
      'outcome': event.outcome,
      'client_ip': event.clientIP,
      'request_id': event.requestId,
      'user_agent': event.userAgent,
      ...event.details
    };
    
    // Placeholder for actual logging service call
    if (!this.isDevelopment) {
      // In production: send to actual logging service
      // await loggingService.send(structuredLog);
      console.log('Production logging placeholder:', structuredLog);
    }
  }
  
  private sendSecurityAlert(event: SecurityEvent): void {
    // TODO: Implement actual alerting system
    // Examples: PagerDuty, Slack, email alerts
    
    const alert = {
      title: `CRITICAL SECURITY EVENT: ${event.eventType}`,
      description: JSON.stringify(event.details),
      severity: event.severity,
      timestamp: event.timestamp,
      clientIP: event.clientIP,
      requestId: event.requestId
    };
    
    if (!this.isDevelopment) {
      // In production: send to actual alerting service
      // await alertingService.send(alert);
      console.error('Production alert placeholder:', alert);
    }
  }
  
  /**
   * Log authentication attempts
   */
  logAuth(
    requestId: string,
    clientIP: string,
    userAgent: string | null,
    pin: string,
    outcome: 'success' | 'failure' | 'blocked',
    details: Partial<AuthEvent['details']> = {}
  ): void {
    // Hash PIN for logging (never log actual PIN)
    const hashedPin = this.hashPin(pin);
    
    const severity = outcome === 'blocked' ? 'high' : 
                    outcome === 'failure' ? 'medium' : 'low';
    
    const event: AuthEvent = {
      timestamp: new Date().toISOString(),
      requestId,
      eventType: 'auth',
      severity,
      clientIP,
      outcome,
      details: {
        hashedPin,
        ...details
      }
    };
    
    if (userAgent) {
      event.userAgent = userAgent;
    }
    
    this.log(event);
  }
  
  /**
   * Log file upload attempts
   */
  logUpload(
    requestId: string,
    clientIP: string,
    userAgent: string | null,
    filename: string,
    fileSize: number,
    volunteerId: number,
    callsign: string,
    outcome: 'success' | 'failure' | 'error',
    details: Partial<UploadEvent['details']> = {}
  ): void {
    const severity = outcome === 'success' ? 'low' : 'medium';
    
    const event: UploadEvent = {
      timestamp: new Date().toISOString(),
      requestId,
      eventType: 'upload',
      severity,
      clientIP,
      outcome,
      details: {
        filename,
        fileSize,
        volunteerId,
        callsign,
        ...details
      }
    };
    
    if (userAgent) {
      event.userAgent = userAgent;
    }
    
    this.log(event);
  }
  
  /**
   * Log admin actions
   */
  logAdmin(
    requestId: string,
    clientIP: string,
    userAgent: string | null,
    action: string,
    outcome: 'success' | 'failure' | 'error',
    details: Partial<AdminEvent['details']> = {}
  ): void {
    const severity = action.includes('delete') || action.includes('reset') ? 'high' : 'medium';
    
    const event: AdminEvent = {
      timestamp: new Date().toISOString(),
      requestId,
      eventType: 'admin',
      severity,
      clientIP,
      outcome,
      details: {
        action,
        ...details
      }
    };
    
    if (userAgent) {
      event.userAgent = userAgent;
    }
    
    this.log(event);
  }
  
  /**
   * Log security incidents
   */
  logSecurityIncident(
    requestId: string,
    clientIP: string,
    threatType: SecurityIncident['details']['threatType'],
    description: string,
    severity: SecurityEvent['severity'] = 'high',
    details: Partial<SecurityIncident['details']> = {}
  ): void {
    const event: SecurityIncident = {
      timestamp: new Date().toISOString(),
      requestId,
      eventType: 'security',
      severity,
      clientIP,
      outcome: 'blocked',
      details: {
        threatType,
        description,
        ...details
      }
    };
    
    this.log(event);
  }
  
  /**
   * Hash PIN for secure logging
   */
  private hashPin(pin: string): string {
    // Simple hash for logging purposes (not cryptographic)
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      const char = pin.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `pin_${Math.abs(hash).toString(36)}`;
  }
  
  /**
   * Get security metrics for monitoring dashboard
   */
  getSecurityMetrics(_timeRange: '1h' | '24h' | '7d' = '24h'): Record<string, number> {
    // TODO: Implement actual metrics aggregation
    // This would typically query the logging service
    
    return {
      totalAuthAttempts: 0,
      failedAuthAttempts: 0,
      blockedAuthAttempts: 0,
      successfulUploads: 0,
      failedUploads: 0,
      adminActions: 0,
      securityIncidents: 0,
      uniqueIPs: 0
    };
  }
}

// Export singleton instance
export const securityLogger = new SecurityLogger(); 