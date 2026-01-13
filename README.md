# Hybrid Wedding Invitation System

A modern, elegant solution for couples who want to send both physical and digital wedding invitations. This system combines beautifully designed print invitations with an interactive web experience that includes a 3D flip card, weather forecast widget, local attractions, and contact options.

## Features

✨ **Interactive 3D Flip Card** - Guests can click to flip between the front and back of the invitation card, creating an engaging digital experience.

🌤️ **10-Day Weather Forecast** - Real-time weather data for the wedding location using the free Open-Meteo API (no API keys required).

📍 **Area Information** - Showcase local attractions, dining options, activities, and accommodations near the wedding venue.

📱 **Flexible Contact Options** - Toggle between planner contact info and couple contact info with easy email and phone integration.

📧 **Branded Email Templates** - Ready-to-use HTML and plain text email templates that can be downloaded and sent through any email service.

🎨 **Elegant Design** - Beautiful gradient backgrounds, serif typography, and responsive design that works on all devices.

⚡ **No Database Required** - Static site that's easy to deploy and maintain. All configuration is done through a simple TypeScript file.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page with feature overview
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── invite/
│   │   └── page.tsx          # Interactive invitation page
│   └── email-template/
│       └── page.tsx          # Email template preview and downloads
├── components/
│   ├── InviteCard.tsx        # 3D flip card component
│   ├── WeatherWidget.tsx     # 10-day forecast widget
│   ├── AreaFacts.tsx         # Local attractions and venue info
│   └── ContactSection.tsx    # Contact options with toggle
└── config/
    └── weddingConfig.ts      # All wedding details (edit this!)
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory:
```bash
cd hybrid-wedding-invite
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

All wedding details are configured in a single file: `src/config/weddingConfig.ts`

### Update Your Wedding Details

Edit `src/config/weddingConfig.ts` and customize:

```typescript
export const weddingConfig = {
  couple: {
    name: "Your Names",
    brideName: "Bride Name",
    groomName: "Groom Name",
    date: "June 15, 2024",
    time: "4:00 PM",
    timezone: "EST",
  },
  venue: {
    name: "Venue Name",
    address: "123 Wedding Lane",
    city: "City, State",
    phone: "123-456-7890",
    website: "https://venuename.com",
  },
  areaFacts: [
    // Add local attractions, dining, activities
  ],
  contacts: {
    planner: {
      name: "Your Name",
      email: "your@email.com",
      phone: "555-555-5555",
    },
    couple: {
      name: "Couple Names",
      email: "couple@email.com",
      phone: "555-555-5555",
    },
  },
  weatherLocation: {
    latitude: 40.7128,  // Change to your venue location
    longitude: -74.006,
    city: "New York",
    state: "NY",
  },
  // ... card text and other details
};
```

### Find Your Venue's Coordinates

1. Go to [Google Maps](https://maps.google.com)
2. Search for your venue
3. Right-click on the venue location
4. Copy the latitude and longitude from the popup
5. Update `weatherLocation` in the config

## Pages

### Home Page (`/`)
Landing page with an overview of all features, quick links to the invitation and email templates, and step-by-step instructions.

### Invitation Page (`/invite`)
The main interactive invitation experience featuring:
- 3D flip card (click to see front/back)
- Wedding date, time, and venue details
- 10-day weather forecast for the area
- Local attractions and area information
- Contact section with toggle for planner or couple info

### Email Template Page (`/email-template`)
Download ready-to-use email templates:
- HTML version with inline styling
- Plain text version
- Preview the HTML email in real-time

## How to Use

### Step 1: Customize Configuration
Edit `src/config/weddingConfig.ts` with all your wedding details.

### Step 2: Customize Components (Optional)
Modify component text, colors, and styling in:
- `src/components/InviteCard.tsx` - Change invitation card design
- `src/components/AreaFacts.tsx` - Update local attractions
- `src/app/page.tsx` - Customize home page

### Step 3: Design Physical Invitations
Using the website as inspiration, design and print your physical:
- Save-the-date cards
- RSVP cards with the wedding URL

### Step 4: Prepare Email Templates
1. Visit `/email-template` in your running app
2. Download the HTML template
3. Optionally customize the email text
4. Save the files

### Step 5: Deploy the Website
Deploy to a hosting service of your choice:

#### Option A: Vercel (Recommended - Free)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically deploy on every push
5. Get a custom domain (optional)

#### Option B: Netlify
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your repository
4. Click "Deploy"

#### Option C: Other Hosting
```bash
npm run build
npm start
```
Then deploy the `.next` folder to your hosting provider.

### Step 6: Send Physical Invitations
Mail out your physical save-the-dates and RSVP cards with your website URL.

### Step 7: Send Email Invitations
1. Open the HTML template you downloaded
2. Use your email provider's bulk send feature (Gmail, Outlook, Mailchimp, SendGrid, etc.)
3. Use mail merge to personalize each guest's email
4. Send with a link to your deployed website

## Email Service Recommendations

### For Small Guest Lists (< 500)
- **Gmail** - Free, supports mail merge with Google Sheets
- **Outlook** - Built-in mail merge for personalization

### For Large Guest Lists (500+)
- **Mailchimp** - Free tier for up to 500 contacts
- **SendGrid** - Free tier with good personalization
- **Brevo** (formerly Sendinblue) - Good free tier

## Customization Guide

### Change Colors
Edit Tailwind color classes in components. Common places:
- `from-rose-600` - Primary color
- `from-blue-600` - Secondary color
- `bg-gradient-to-r` - Gradient direction

### Change Fonts
The site uses serif fonts for elegance. To change:
1. Edit `src/app/globals.css`
2. Update the font imports
3. Change `font-serif` classes to use your font

### Customize Card Text
Edit the `inviteText` object in `src/config/weddingConfig.ts`:
```typescript
inviteText: {
  front: {
    title: "Your custom title",
    // ...
  },
  back: {
    rsvpInstructions: "Your custom instructions",
    // ...
  },
}
```

## Weather Widget

The weather widget uses the **Open-Meteo API** which:
- ✅ Requires NO API key
- ✅ Is completely free
- ✅ Provides 10-day forecasts
- ✅ Includes temperature, wind, and precipitation data
- ✅ Works worldwide

No additional setup needed! Just update the coordinates in the config.

## Building for Production

```bash
npm run build
npm start
```

The build creates an optimized production version of your site.

## Deployment Checklist

Before sending invitations to guests:

- [ ] Update all couple details in `weddingConfig.ts`
- [ ] Update venue name, address, and coordinates
- [ ] Add your contact information (or planner's)
- [ ] Customize area facts with local attractions
- [ ] Test the flip card on both desktop and mobile
- [ ] Test the weather widget (check location is correct)
- [ ] Test the contact section (email and phone links work)
- [ ] Download and review email templates
- [ ] Deploy to your chosen hosting platform
- [ ] Test on mobile devices
- [ ] Share URL with guests

## Troubleshooting

### Weather Widget Shows "Unable to load weather data"
- Check that latitude and longitude are correct
- The coordinates should be a decimal number (e.g., 40.7128)
- Verify the location exists on a map

### Email Template Not Rendering Correctly
- Test in different email clients (Gmail, Outlook, Apple Mail)
- Some email clients have limited CSS support
- The plain text version is always a safe fallback

### Mobile Display Issues
- The site is fully responsive
- Test on actual devices, not just browser emulation
- Check that images load correctly

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Weather Data**: Open-Meteo API (free)
- **Deployment**: Vercel, Netlify, or any Node.js host
- **3D Effects**: CSS transforms and perspective

## File Sizes

The built site is very lightweight:
- HTML/CSS/JS bundle: ~100KB gzipped
- No external images by default
- All data is computed at build time

## Browser Support

Works on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## FAQ

**Q: Do I need to know coding to use this?**
A: You only need to edit the `weddingConfig.ts` file with your details. It's straightforward!

**Q: Can I add more photos?**
A: Yes! Add image files to `public/` and reference them in components.

**Q: Can I collect RSVPs through the website?**
A: This template doesn't include RSVP collection. You can add a form using services like Formspree or a Google Form.

**Q: Can I password-protect the invitation?**
A: Yes, with a middleware. Ask a developer to help with this.

**Q: What if I want to change the design significantly?**
A: All components are in `src/components/` and are fully customizable React components.

## Support

For questions or issues:
1. Check the configuration carefully
2. Review the component code comments
3. Test in different browsers
4. Check the browser console for errors (F12)

## License

This project is free to use for your wedding! Share and modify as needed.

## Credits

Created with ♥ for beautiful celebrations.

Built with Next.js, React, Tailwind CSS, and love.

---

**Happy Planning! 💕**
