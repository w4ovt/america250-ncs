# 🔍 America250-NCS Troubleshooting Guide

## Quick Health Checks

### 1. System Health Check
```bash
curl https://america250.radio/api/health
```
**What it tells you:**
- Database connectivity (response time)
- Environment variable status
- System uptime
- Overall system health

### 2. Admin Status Check
```bash
curl https://america250.radio/api/admin/status
```
**What it tells you:**
- Database table counts
- Feature availability
- Configuration status
- Deployment information

## Debugging API Issues

### Request Tracing
Every API response now includes these headers for debugging:
- `X-Request-ID`: Unique identifier for this request
- `X-Response-Time`: How long the request took
- `X-Operation`: What operation was performed
- `X-Auth-Status`: Authentication result (success/failed/error)

### Finding Issues in Logs
When reporting issues, provide the **Request ID** from the response headers:
```bash
# Example response headers
X-Request-ID: auth_1703123456789_abc123
X-Response-Time: 45ms
X-Auth-Status: success
```

Search logs using the Request ID:
```bash
# Look for this pattern in server logs:
[auth_1703123456789_abc123] Error message here
```

## Common Issues & Solutions

### 1. "Invalid PIN" Errors
**Headers to check:**
- `X-Auth-Status: failed`
- `X-Request-ID`: Use this to trace the request

**Quick fix:** Verify PIN format is exactly 4 digits (0000-9999)

### 2. Database Connection Issues
**Health check endpoint:** `/api/health`
**Look for:**
```json
{
  "database": {
    "connected": false,
    "error": "connection timeout"
  }
}
```

### 3. QRZ API Issues
**Health check shows:**
```json
{
  "configuration": {
    "hasQrzApiKey": false
  },
  "features": {
    "qrzIntegration": false,
    "adiUploads": false
  }
}
```

### 4. Slow Response Times
**Check response headers:**
- `X-Response-Time` > 1000ms indicates slow database queries
- Use `X-Request-ID` to correlate with server logs

## Rate Limiting Information

PIN authentication includes rate limiting headers:
- `X-RateLimit-Limit: 10`
- `X-RateLimit-Window: 900` (15 minutes)
- `X-RateLimit-Policy: PIN authentication limited to 10 attempts per 15 minutes`

## Emergency Contacts

**System Issues:**
- Check `/api/health` endpoint first
- Check `/api/admin/status` for detailed system info
- Look for Request IDs in error messages

**Database Issues:**
- Health check will show database connectivity status
- Response times > 2000ms indicate database problems

**QRZ Integration Issues:**
- Verify QRZ API key in admin status endpoint
- Check ADI upload logs for QRZ-specific errors

## Monitoring URLs

- **Health Check:** `https://america250.radio/api/health`
- **Admin Status:** `https://america250.radio/api/admin/status`
- **Main Site:** `https://america250.radio`
- **QRZ Iframe:** `https://america250.radio/iframe`

---

*This guide covers the monitoring features added on [DATE]. All endpoints are regression-free and provide debugging information without affecting functionality.* 