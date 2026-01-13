# Quick Start Guide - Hybrid Wedding Invitation System

## 🎉 Welcome!

Your hybrid wedding invitation system is ready to go! This guide will help you get everything set up in minutes.

## 📂 Project Location

Your project is located at:
```
C:\Users\koles\Desktop\hybrid-wedding-invite
```

## 🚀 Quick Setup (5 Minutes)

### 1. Start the Development Server
The app is already running at **http://localhost:3000**

To restart it anytime:
```bash
cd C:\Users\koles\Desktop\hybrid-wedding-invite
npm run dev
```

### 2. Customize Your Wedding Details
Open this file: `src/config/weddingConfig.ts`

Update the following:

**Couple Information:**
```typescript
couple: {
  name: "Your Names",
  brideName: "Bride's Full Name",
  groomName: "Groom's Full Name",
  date: "June 15, 2024",
  time: "4:00 PM",
  timezone: "EST",
}
```

**Venue Information:**
```typescript
venue: {
  name: "Venue Name",
  address: "123 Main Street",
  city: "City, State",
  phone: "555-555-5555",
  website: "https://venue.com",
}
```

**Weather Location:**
1. Go to Google Maps
2. Search for your venue
3. Right-click on the location → copy coordinates
4. Update latitude and longitude:
```typescript
weatherLocation: {
  latitude: 40.7128,  // Change this
  longitude: -74.006, // Change this
  city: "New York",   // Your city
  state: "NY",        // Your state
}
```

**Contact Information:**
```typescript
contacts: {
  planner: {
    name: "Tori - Wedding Planner",
    email: "tori@missingpieceplanning.com",
    phone: "269-213-5290",
  },
  couple: {
    name: "Your Names",
    email: "couple@email.com",
    phone: "555-555-5555",
  },
}
```

**Area Facts:**
Update with attractions, dining, activities near your venue:
```typescript
areaFacts: [
  {
    title: "Local Attractions",
    description: "Description here",
  },
  // Add more facts...
]
```

## 🎨 Pages You Can View

Once started, visit these URLs:

- **Home Page**: http://localhost:3000 - Overview of all features
- **Invitation**: http://localhost:3000/invite - Interactive invitation card
- **Email Templates**: http://localhost:3000/email-template - Download email templates

## 📧 Email Templates

When you're ready to email invitations:

1. Visit http://localhost:3000/email-template
2. Click "Download HTML Template" or "Download Text Template"
3. Use the HTML template with your email service (Gmail, Outlook, etc.)
4. Customize with mail merge for personalization
5. Send to your guest list

## 🎫 Customize the Invitation Card

Edit the card text in `src/config/weddingConfig.ts`, section `inviteText`:

```typescript
inviteText: {
  front: {
    title: "Together with their parents",
    subtitle: "request the honour of your presence",
    couple: "Bride Name and Groom Name",
    event: "at the marriage of",
  },
  back: {
    rsvpInstructions: "Please respond by [DATE]",
    rsvpEmail: "couple@email.com",
    additionalInfo: "Dinner and dancing to follow",
    registry: "Gifts are gratefully declined...",
  },
}
```

## 🌈 Customize Colors

The site uses rose and blue colors. To change:

1. Open any component in `src/components/`
2. Look for color classes like:
   - `from-rose-600` (primary rose)
   - `from-blue-600` (primary blue)
   - `bg-rose-50` (light rose)
3. Change to other Tailwind colors: `amber`, `purple`, `green`, etc.

Common colors:
- `from-rose-600` → `from-purple-600`, `from-blue-600`, `from-pink-600`
- `to-rose-700` → `to-purple-700`, etc.

## 🚢 Deploy When Ready

When you're ready to share with guests:

### Option 1: Vercel (Easiest - Free)
1. Create a GitHub account
2. Push your code to GitHub
3. Go to vercel.com
4. Click "New Project" and select your repo
5. Vercel auto-deploys
6. Get your live URL instantly
7. Share the URL with guests!

### Option 2: Netlify
1. Push to GitHub
2. Go to netlify.com
3. Connect your repo
4. Click "Deploy"
5. Get your live URL

### Option 3: Your Own Server
```bash
npm run build
npm start
```

## 📋 Physical Invitation Design Tips

For your physical save-the-dates and RSVP cards, consider:

**Front of Card:**
- "Together with their parents request the honour of your presence..."
- Couple names
- "at the marriage of"

**Back of Card:**
- Date, time, location
- RSVP deadline
- Website URL to view digital invitation
- Your/planner's email and phone

## ✅ Pre-Launch Checklist

Before sending to guests:

- [ ] Updated all couple/venue details in config
- [ ] Set correct weather location (latitude/longitude)
- [ ] Tested invitation page on phone and desktop
- [ ] Weather widget shows correct location
- [ ] Contact section has correct email/phone
- [ ] Downloaded email templates
- [ ] Deployed to live domain
- [ ] Tested all links work
- [ ] Physical invitations printed with URL

## 🆘 Troubleshooting

**Weather shows "Unable to load"?**
- Check latitude/longitude are correct decimals
- Verify location on Google Maps first

**Changes not showing?**
- Save the file
- Refresh browser (Ctrl+R or Cmd+R)
- Check browser console for errors (F12)

**Can't start server?**
- Make sure you're in the right directory: `C:\Users\koles\Desktop\hybrid-wedding-invite`
- Try: `npm install` then `npm run dev`

## 📞 Contact Info Reference

Your system has planner contact option built-in:
- **Email**: tori@missingpieceplanning.com
- **Phone**: 269-213-5290

Update `weddingConfig.ts` with couple's email/phone as needed.

## 🎁 Next Steps

1. ✏️ Edit `weddingConfig.ts` with your details
2. 🔍 Test all pages at localhost:3000
3. 💾 Download email templates
4. 🌍 Deploy to Vercel/Netlify when ready
5. 📮 Design and print physical invitations
6. 📧 Send email invitations with your URL
7. 🎉 Enjoy your beautiful hybrid invitation!

## 💡 Pro Tips

- **Preview Updates**: Save changes to `weddingConfig.ts` and refresh browser
- **Test on Phone**: Visit http://192.168.86.24:3000 from your phone on same WiFi
- **Email Services**: Mailchimp, SendGrid, and Gmail all support bulk sending
- **Custom Domain**: After deploying, add custom domain (myweddingsite.com)
- **Share Analytics**: Services like Vercel show how many guests visited

## 📚 Full Documentation

See `README.md` in the project folder for comprehensive documentation.

---

**Questions?** Check the README.md file or review the component code - it's all well-commented!

**Happy Planning!** 💕
