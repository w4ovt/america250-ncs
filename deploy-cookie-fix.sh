#!/bin/bash

# Minimal Cookie Fix Deployment Script
# This script makes only the essential changes to fix the PIN column display issue
# and includes the updated ncs-guide.pdf

echo "🚀 Deploying minimal cookie fix for PIN column display..."

# Step 1: Create a backup branch
echo "📦 Creating backup branch..."
git checkout -b backup-before-cookie-fix
git push origin backup-before-cookie-fix

# Step 2: Switch back to main
git checkout main

# Step 3: Stage only the essential cookie fix files and ncs-guide.pdf
echo "📝 Staging cookie fix files and ncs-guide.pdf..."
git add src/app/volunteer/page.tsx
git add src/components/VolunteerManagement.tsx  
git add src/components/AdminDashboard.tsx
git add public/ncs-guide.pdf

# Step 4: Commit the minimal fix
echo "💾 Committing cookie fix and ncs-guide.pdf update..."
git commit -m "fix: resolve PIN column display issue with enhanced cookie authentication

- Add SameSite=Lax attribute to volunteerAuth cookie
- Include auth headers as fallback in API requests
- Ensure credentials are properly sent with fetch requests
- Fix logout to properly clear cookies
- Update ncs-guide.pdf with latest documentation

This addresses the regression where PIN column was not displaying
for authenticated admins due to cookie transmission issues."

# Step 5: Push to production
echo "🚀 Pushing to production..."
git push origin main

echo "✅ Cookie fix and ncs-guide.pdf update deployed successfully!"
echo "🔍 Monitor the application to ensure PIN column is now displaying correctly"
echo "🔄 If issues occur, rollback with: git revert HEAD && git push origin main" 