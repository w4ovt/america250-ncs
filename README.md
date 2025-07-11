# America250-NCS Event Portal

**National Communications System Event Portal for America's 250th Anniversary Celebration**

A Next.js amateur radio event management application designed for the America250 special event station operations. This system provides volunteer coordination, activation tracking, and automated QRZ logbook integration for amateur radio operators participating in America's 250th anniversary celebration.

## 🇺🇸 About America250-NCS

The America250-NCS (National Communications System) is a special event station initiative celebrating America's 250th anniversary. Amateur radio operators across the nation volunteer to activate special event stations, coordinating through this centralized portal to manage activations, log contacts, and share their contributions to this historic celebration.

## 📅 Current Status & Upcoming Events

### ✅ **K4A Event - COMPLETED**
The inaugural K4A special event station operation has concluded successfully! This event ran from [start date] to [end date] and featured:
- **Volunteer Participation**: [X] amateur radio operators
- **Total Contacts**: [X] QSOs logged
- **States Activated**: [X] states represented
- **QRZ Integration**: Automated logbook submissions to QRZ.com

### 🚀 **Chasing Cornwallis Challenge - COMING SOON**
**New Master Site**: https://history.radio

The Chasing Cornwallis Challenge will be a comprehensive platform hosting six annual historical events, each commemorating key moments in American history:

1. **1775 - Lexington & Concord** (April 19th)
2. **1776 - Declaration of Independence** (July 4th)
3. **1777 - Saratoga Campaign** (October 17th)
4. **1778 - Valley Forge** (December 19th)
5. **1781 - Yorktown Siege** (October 19th)
6. **1783 - Treaty of Paris** (September 3rd)

**Features Planned:**
- **Progress Tracking**: Participant advancement through historical timeline
- **Certificate System**: Achievement badges for each event completion
- **Unified Dashboard**: Centralized management for all six events
- **Historical Education**: Educational content for each event
- **Volunteer Coordination**: Real-time participant management and communications

## ✨ Current Features

### 📻 **Amateur Radio Operations**
- **Special Event Station Management** - K4A station coordination (COMPLETED)
- **Activation Tracking** - Real-time monitoring of active volunteers
- **QRZ Logbook Integration** - Automated ADIF upload to QRZ.com
- **Contact Logging** - ADI file processing and validation

### 👥 **Volunteer Portal**
- **PIN-based Authentication** - Secure volunteer access system
- **Activation Management** - Start/stop activation tracking
- **File Upload System** - ADI logbook submission with validation
- **Real-time Status** - Live activation monitoring

### 🛠️ **Admin Dashboard**
- **Unified Volunteer Management** - Add, edit, delete, and sort volunteers with integrated PIN and role fields
- **System Monitoring** - Activation oversight and statistics
- **Log Archive** - Complete submission history
- **Data Management** - Export and backup capabilities

### 🌐 **Public Display**
- **Live Activation Board** - Real-time volunteer status
- **QRZ Integration** - Embedded activation display
- **Mobile Responsive** - Optimized for all devices
- **Archive Access** - Historical activation records

## 🏗️ Technology Stack

### Current Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Styling**: CSS Modules with responsive design
- **Deployment**: Vercel (main app) + Cloudflare Workers (iframe)
- **Integration**: QRZ.com API for logbook automation

### Planned Migration Stack (Chasing Cornwallis Challenge)
- **Framework**: SvelteKit (simpler, less linting overhead)
- **Language**: TypeScript
- **Database**: Render PostgreSQL (consolidated hosting)
- **Styling**: Tailwind CSS
- **Deployment**: Render (unified hosting + database)
- **DNS/CDN**: Cloudflare
- **Version Control**: GitHub

## 🌍 Production Deployment

### Current Deployments
- **Main Application**: https://america250.radio
- **QRZ Iframe Worker**: america250-ncs-activations.marc-4b1.workers.dev
- **Repository**: https://github.com/w4ovt/america250-ncs

### Planned New Deployment
- **Chasing Cornwallis Challenge**: https://history.radio
- **Unified Platform**: Single deployment for all six historical events

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- QRZ.com API key (optional, for logbook integration)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/w4ovt/america250-ncs.git
   cd america250-ncs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database and API credentials
   ```

4. **Set up database**
   ```bash
   npm run db:migrate
   npm run db:seed  # Optional: add sample data
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open application**
   - Navigate to http://localhost:3000
   - Admin access: Use admin PIN from seed data
   - Volunteer access: Use volunteer PIN from seed data

## 📊 API Endpoints

### Public Endpoints
- `GET /api/health` - System health check
- `GET /api/activations/list` - Current activations
- `GET /api/activations/archive` - Historical activations

### Volunteer Endpoints
- `POST /api/auth/pin` - PIN authentication
- `POST /api/activations/create` - Start activation
- `POST /api/activations/end` - End activation
- `POST /api/logs/upload` - Submit ADI files

### Admin Endpoints
- `GET /api/admin/status` - System statistics
- `GET /api/admin/volunteers` - Volunteer management (list)
- `POST /api/admin/volunteers` - Add new volunteer (name, callsign, state, pin, role)
- `PUT /api/admin/volunteers/:id` - Edit volunteer (all fields editable)
- `DELETE /api/admin/volunteers/:id` - Delete volunteer (cascades to activations and ADI submissions)

## 🔧 Configuration

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)

### Optional Environment Variables
- `QRZ_API_KEY` - QRZ.com API key for logbook integration
- `NEON_DATABASE_URL` - Alternative database URL format

## 📱 Mobile Features

- **Responsive Design** - Optimized for all screen sizes
- **Progressive Web App** - Mobile app-like experience
- **Touch-Friendly Interface** - Designed for field operations
- **Offline Capability** - Basic functionality without internet

## 🛡️ Security Features

- **PIN-based Authentication** - No passwords, secure 4-digit PINs
- **Input Validation** - Comprehensive ADIF file verification
- **Security Headers** - HTTPS enforcement and XSS protection
- **Rate Limiting** - Protection against brute force attacks
- **Secret Scanning** - Automated detection of exposed credentials
- **Git History Cleanup** - Removal of sensitive data from repository history

## 📻 Amateur Radio Integration

### ADIF File Processing
- **Format Validation** - Ensures compliance with ADIF standards
- **K4A Station Verification** - Validates special event station callsign
- **QRZ Submission** - Automatic upload to QRZ logbook
- **Error Reporting** - Detailed feedback for invalid submissions

### QSL Card Support
- **Template Downloads** - Professional QSL card designs
- **Contact Information** - Automatic population from logs
- **Event Branding** - America250 themed materials

## 📈 Monitoring & Analytics

- **Health Monitoring** - `/api/health` endpoint with system metrics
- **Activation Statistics** - Real-time volunteer participation
- **Log Processing Stats** - Upload success/failure tracking
- **Performance Metrics** - Response times and system load
- **SEO Optimization** - Structured data, sitemaps, and meta tags

## 🔍 SEO & Marketing

### Current SEO Implementation
- **Structured Data**: Schema.org markup for events and organizations
- **Sitemap**: Automated XML sitemap generation
- **Meta Tags**: Open Graph and Twitter Card support
- **Canonical URLs**: Proper URL canonicalization
- **Alt Text**: Comprehensive image accessibility

### SEO Strategy
- **Keyword Focus**: "America250", "amateur radio", "special event station"
- **Content Depth**: Historical context and educational materials
- **Internal Linking**: Cross-referencing between related content
- **Backlink Outreach**: Collaboration with official America250 sites

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript strict mode requirements
- Use CSS Modules for component styling
- Implement responsive design for all components
- Write comprehensive API documentation

### Amateur Radio Expertise
This project benefits from amateur radio operator knowledge:
- ADIF format specifications
- Contest logging standards
- QSL practices and procedures
- Special event station operations

## 📞 Support & Contact

- **Project Lead**: Marc Bowen (W4OVT)
- **Email**: marc@w4ovt.org
- **Repository Issues**: https://github.com/w4ovt/america250-ncs/issues

## 📜 License

This project supports the amateur radio community and America's 250th anniversary celebration. 

## 🎯 Project Status

### Current Status
- **K4A Event**: ✅ COMPLETED
- **Current Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: December 2024

### Upcoming Development
- **Chasing Cornwallis Challenge**: 🚧 IN DEVELOPMENT
- **Technology Migration**: SvelteKit + Render stack
- **New Domain**: history.radio
- **Timeline**: Q1 2025 launch

---

**73 and Happy America250!** 🇺🇸📻

*This application is dedicated to amateur radio operators participating in America's 250th anniversary celebration through the National Communications System special event stations.*

## 🔧 Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```bash
# Database Configuration (Required)
DATABASE_URL="your_neon_postgresql_connection_string"

# QRZ API Configuration (Optional - for logbook integration)
QRZ_API_KEY="your_qrz_api_key"

# Email Configuration (Required for ADI failure notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
```

### Email Configuration Notes:
- **SMTP_USER/SMTP_PASS**: Required for sending ADI failure notifications to marc@history.radio
- For Gmail: Use an App Password, not your regular password
- For other providers: Adjust SMTP_HOST and SMTP_PORT accordingly
- **CRITICAL**: Email functionality is required for ADI file failure notifications
