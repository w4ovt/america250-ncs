# 🚀 Development Setup Guide

**Quick start guide for America250-NCS amateur radio event management system**

## Prerequisites

✅ **Node.js 18+** and npm  
✅ **PostgreSQL database** (Neon recommended)  
✅ **Git** for version control  

## Quick Setup (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/w4ovt/america250-ncs.git
cd america250-ncs
npm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials:
DATABASE_URL=postgresql://username:password@localhost:5432/america250_ncs
NODE_ENV=development
QRZ_API_KEY=your_qrz_api_key_here  # Optional
```

### 3. Database Setup
```bash
# Run migrations
npm run db:migrate

# Add sample data (optional)
npm run db:seed
```

### 4. Start Development
```bash
npm run dev
```

🎉 **Open http://localhost:3000**

## Default Test Credentials

After seeding, use these PINs for testing:

- **Admin Access**: `1234`
- **Volunteer Access**: `5678`

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run type-check      # TypeScript validation

# Database
npm run db:studio       # Open Drizzle studio
npm run db:push         # Push schema changes
npm run db:generate     # Generate migrations

# Quality
npm run lint            # Check code style
npm run lint:fix        # Fix lint issues
```

## Project Structure

```
america250-ncs/
├── src/app/            # Next.js App Router pages
├── src/components/     # React components
├── src/db/            # Database schema & migrations
└── public/            # Static assets
```

## Common Issues

**Database connection errors?**
- Check connection string format
- Ensure PostgreSQL is running
- Verify credentials

**Missing QRZ API key warnings?**
- Expected in development
- QRZ integration is optional for testing

**TypeScript errors?**
- Run `npm run type-check`
- Check Next.js and React versions

## Amateur Radio Context

This system manages:
- **K4A Special Event Station** activations  
- **ADIF file processing** for contest logs  
- **QRZ.com integration** for logbook automation  
- **Volunteer coordination** for America250 event  

## Need Help?

📖 **Full Documentation**: [README.md](./README.md)  
🐛 **Report Issues**: [GitHub Issues](https://github.com/w4ovt/america250-ncs/issues)  
📧 **Contact**: marc@w4ovt.org  

---

**73 and happy coding!** 📻💻 