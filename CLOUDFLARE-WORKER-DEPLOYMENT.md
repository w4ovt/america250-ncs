# Cloudflare Worker Deployment Guide

This guide will help you deploy the America250-NCS Activations iframe to Cloudflare Workers for use on the QRZ K4A Biography page.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install the Cloudflare Workers CLI tool

```bash
npm install -g wrangler
```

## Setup Steps

### 1. Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

### 2. Deploy the Worker

From your project directory, run:

```bash
wrangler deploy
```

This will deploy the worker and give you a URL like:
`https://america250-ncs-activations.your-subdomain.workers.dev`

### 3. Test the Worker

Visit the worker URL in your browser to verify it's working correctly. You should see a table with activation data.

### 4. Optional: Add Custom Domain

If you want to use a custom domain (recommended for production):

1. **Add Domain to Cloudflare**:
   - Go to your Cloudflare dashboard
   - Add `america250.radio` as a zone
   - Update your domain's nameservers to point to Cloudflare

2. **Configure Route**:
   - Uncomment the routes section in `wrangler.toml`
   - Update the pattern to your desired subdomain (e.g., `activations.america250.radio`)
   - Deploy again: `wrangler deploy`

## QRZ Integration

Once deployed, update your QRZ Biography page iframe to use the worker URL:

```html
<iframe 
  src="https://america250-ncs-activations.your-subdomain.workers.dev" 
  width="100%" 
  height="300" 
  frameborder="0" 
  scrolling="no">
</iframe>
```

Or with custom domain:
```html
<iframe 
  src="https://activations.america250.radio" 
  width="100%" 
  height="300" 
  frameborder="0" 
  scrolling="no">
</iframe>
```

## Features

- **No JavaScript**: Pure HTML/CSS for QRZ compatibility
- **Auto-refresh**: Page refreshes every 60 seconds
- **Error Handling**: Graceful fallback if API is down
- **CORS Headers**: Proper iframe compatibility
- **Caching**: 60-second cache for performance
- **Responsive**: Works on all screen sizes

## Monitoring

- **Cloudflare Dashboard**: Monitor requests, errors, and performance
- **Logs**: View real-time logs with `wrangler tail`
- **Analytics**: Track usage in the Cloudflare dashboard

## Troubleshooting

### Worker Not Loading
- Check the worker URL is accessible
- Verify CORS headers are set correctly
- Check browser console for errors

### API Connection Issues
- Verify your API endpoint is accessible
- Check network connectivity from Cloudflare's edge
- Review worker logs for specific error messages

### Custom Domain Issues
- Ensure DNS is properly configured
- Verify the domain is added to Cloudflare
- Check route configuration in `wrangler.toml`

## Benefits of Cloudflare Workers

1. **Global Edge Network**: Fast loading worldwide
2. **No Cold Starts**: Always ready to serve requests
3. **Built-in Caching**: Automatic performance optimization
4. **DDoS Protection**: Enterprise-grade security
5. **Future-Proof**: Cloudflare's recommended platform
6. **Cost Effective**: Generous free tier

## Next Steps

1. Deploy the worker using the steps above
2. Test the iframe on QRZ
3. Monitor performance and adjust as needed
4. Consider adding more features like:
   - Custom styling options
   - Different refresh intervals
   - Additional data fields 