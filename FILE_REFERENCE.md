# Project File Reference

## 📂 Complete File List

Your wedding invitation project is located at:
```
C:\Users\koles\Desktop\hybrid-wedding-invite
```

### Configuration (Edit This First!)
```
src/config/weddingConfig.ts              ⭐ YOUR WEDDING DETAILS GO HERE
```

### Components
```
src/components/InviteCard.tsx            - 3D flip card with invitation
src/components/WeatherWidget.tsx         - 10-day weather forecast
src/components/AreaFacts.tsx             - Local attractions & venue info
src/components/ContactSection.tsx        - Contact options with toggle
```

### Pages
```
src/app/page.tsx                         - Home page (landing)
src/app/invite/page.tsx                  - Interactive invitation page
src/app/email-template/page.tsx          - Email template download page
src/app/layout.tsx                       - Root layout wrapper
src/app/globals.css                      - Global styles
```

### Project Configuration Files
```
tsconfig.json                            - TypeScript configuration
next.config.ts                           - Next.js configuration
tailwind.config.ts                       - Tailwind CSS configuration
package.json                             - Project dependencies
.eslintrc.json                           - Code linting rules
```

### Documentation
```
README.md                                - Full comprehensive guide
QUICKSTART.md                            - 5-minute setup guide
DEPLOYMENT.md                            - How to deploy to production
IMPLEMENTATION_SUMMARY.md                - What was built (this summary)
```

### Dependencies
```
node_modules/                            - Installed packages (auto-created)
```

### Public Assets
```
public/                                  - Static files (logos, images, etc)
public/favicon.ico                       - Browser tab icon
```

### Hidden Files (Auto-created)
```
.git/                                    - Git repository
.gitignore                               - Files to ignore in git
.next/                                   - Build output (auto-created)
```

---

## 🎯 Files to Edit

### Priority 1 (MUST EDIT):
```
src/config/weddingConfig.ts              - All your wedding details
```

### Priority 2 (SHOULD EDIT):
```
src/components/InviteCard.tsx            - Customize invitation card text/colors
src/components/AreaFacts.tsx             - Update area attractions
```

### Priority 3 (OPTIONAL):
```
src/app/page.tsx                         - Customize home page
src/app/globals.css                      - Change fonts or global styles
tailwind.config.ts                       - Customize colors
```

---

## 📖 Reading Order

1. **Start Here**: `QUICKSTART.md` (5 min read)
2. **Then Do**: Edit `src/config/weddingConfig.ts` (10 min)
3. **Test**: Visit http://localhost:3000
4. **Download Templates**: From `/email-template` page
5. **Deploy**: Follow `DEPLOYMENT.md` (10-30 min)
6. **Reference**: `README.md` for detailed info

---

## 🚀 Command Reference

### Start Development Server
```bash
cd C:\Users\koles\Desktop\hybrid-wedding-invite
npm run dev
```
Then visit: http://localhost:3000

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Check for Errors
```bash
npm run lint
```

---

## 🎨 Key Configuration Sections

### In `src/config/weddingConfig.ts`:

**Couple Details** (lines ~4-11)
```typescript
couple: {
  brideName: "Your Names Here",
  groomName: "Your Names Here",
  date: "June 15, 2024",
  // ...
}
```

**Venue Details** (lines ~12-19)
```typescript
venue: {
  name: "Venue Name",
  address: "123 Street",
  // ...
}
```

**Weather Location** (lines ~45-51)
```typescript
weatherLocation: {
  latitude: 40.7128,    // Get from Google Maps
  longitude: -74.006,   // Get from Google Maps
  city: "City Name",
  // ...
}
```

**Contact Information** (lines ~35-44)
```typescript
contacts: {
  planner: { /* Your info */ },
  couple: { /* Couple info */ }
}
```

**Invitation Card Text** (lines ~52-70)
```typescript
inviteText: {
  front: { /* Front of card */ },
  back: { /* Back of card */ }
}
```

---

## 📝 Quick Edit Locations

### Change Couple Names
File: `src/config/weddingConfig.ts`, lines 5-6
```typescript
brideName: "Change here",
groomName: "Change here",
```

### Change Wedding Date
File: `src/config/weddingConfig.ts`, line 7
```typescript
date: "June 15, 2024",  // Change date
```

### Change Venue
File: `src/config/weddingConfig.ts`, lines 12-19
```typescript
venue: {
  name: "Venue Name here",
  address: "Street address here",
  // ... etc
}
```

### Change Weather Location
File: `src/config/weddingConfig.ts`, lines 45-50
```typescript
weatherLocation: {
  latitude: 40.7128,     // From Google Maps
  longitude: -74.006,    // From Google Maps
  city: "Your City",
}
```

### Change Primary Colors
Files: `src/components/*.tsx`
Search for: `from-rose-600`, `from-blue-600`
Replace with: Your Tailwind colors

### Change Invitation Card Text
File: `src/config/weddingConfig.ts`, lines 52-70
```typescript
inviteText: {
  front: {
    title: "Your text here",
    // ... update all fields
  },
  back: {
    // ... update all fields
  }
}
```

---

## 🌐 Live URLs (After Deployment)

Once deployed to Vercel/Netlify:

```
https://yourdomain.com/              - Home page
https://yourdomain.com/invite        - Invitation page
https://yourdomain.com/email-template - Email templates
```

Share `https://yourdomain.com/invite` with guests!

---

## 📊 File Statistics

```
Total Files:           ~50
Main Component Files:  4
Configuration Files:   6
Documentation Files:   4
Component Lines:       ~1000 lines of code
Configuration Lines:   ~100 lines
Total Size:           ~2 MB (excluding node_modules)
Built Size:           ~100 KB (gzipped)
```

---

## 🔍 Finding Specific Features

### 3D Flip Card
Location: `src/components/InviteCard.tsx`
Key Feature: CSS `transform: rotateY(180deg)` (lines ~40-50)

### Weather Widget
Location: `src/components/WeatherWidget.tsx`
API Call: Open-Meteo API (lines ~30-45)
Data Display: Grid layout (lines ~130-155)

### Email Templates
Location: `src/app/email-template/page.tsx`
HTML Template: Lines ~40-150
Download Button: Lines ~160-180

### Contact Toggle
Location: `src/components/ContactSection.tsx`
Toggle Logic: Lines ~15-25
Contact Display: Lines ~40-70

---

## 💾 Backup & Version Control

### Create a Backup
```bash
# Copy entire folder
xcopy "C:\Users\koles\Desktop\hybrid-wedding-invite" "C:\Users\koles\Desktop\hybrid-wedding-invite-backup" /E /I
```

### Git Commands
```bash
git status                  # See what changed
git add .                   # Stage all changes
git commit -m "message"     # Save changes
git push                    # Upload to GitHub
```

---

## 🆘 If Something Breaks

1. **Server won't start?**
   ```bash
   npm install
   npm run dev
   ```

2. **TypeScript errors?**
   - Check `src/config/weddingConfig.ts` for syntax errors
   - Look for missing commas or quotes

3. **Page won't load?**
   - Press Ctrl+Shift+R (hard refresh)
   - Clear browser cache
   - Check browser console (F12)

4. **Changes not showing?**
   - Save the file (Ctrl+S)
   - Refresh browser (F5)
   - Restart dev server if needed

---

## 📞 File Contact Reference

From your configuration:
- **Planner Email**: tori@missingpieceplanning.com
- **Planner Phone**: 269-213-5290

Edit in: `src/config/weddingConfig.ts` lines 35-44

---

## ✅ Pre-Deployment Checklist

Files to verify are edited:
- [ ] `src/config/weddingConfig.ts` - All details updated
- [ ] `src/components/InviteCard.tsx` - Optional: card text customized
- [ ] `src/components/AreaFacts.tsx` - Optional: area info updated
- [ ] `src/app/page.tsx` - Optional: home page customized

Files that should be auto-generated:
- [ ] `.next/` - Build folder created
- [ ] `node_modules/` - Dependencies installed

Documentation files you have:
- [ ] `README.md` - Full guide
- [ ] `QUICKSTART.md` - Quick setup
- [ ] `DEPLOYMENT.md` - Deployment guide
- [ ] `IMPLEMENTATION_SUMMARY.md` - What was built

---

## 🎁 Extra Files You Can Add

Optional enhancements:

```
public/logo.png                  - Add your logo
public/couple-photo.jpg          - Add couple photo
public/venue-photo.jpg           - Add venue photo
public/bg-pattern.svg            - Add background pattern
```

Then reference in components:
```tsx
<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

---

**Project is at**: `C:\Users\koles\Desktop\hybrid-wedding-invite`

**Start with**: Edit `src/config/weddingConfig.ts`

**Test at**: http://localhost:3000

**Deploy with**: Vercel (see DEPLOYMENT.md)

Good luck! 💕
