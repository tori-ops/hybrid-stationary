# Deployment Guide - Hybrid Wedding Invitation System

## 🌐 Deploy Your Wedding Website

Your system is ready to go live! Choose your preferred hosting platform below.

---

## 🚀 Option 1: Vercel (Recommended - Easiest)

Vercel is made by the creators of Next.js and makes deployment effortless.

### Steps:

1. **Create GitHub Account** (if you don't have one)
   - Go to github.com
   - Sign up (free)

2. **Push Code to GitHub**
   - In your project directory, run:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your@email.com"
   git add .
   git commit -m "Initial wedding invitation setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/hybrid-wedding-invite.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to vercel.com
   - Click "Sign Up" and choose "Continue with GitHub"
   - Authorize Vercel
   - Click "New Project"
   - Select your `hybrid-wedding-invite` repository
   - Click "Import"
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - You'll get a URL like: `https://hybrid-wedding-invite-abc123.vercel.app`

4. **Get Custom Domain** (Optional)
   - In Vercel dashboard, go to Settings
   - Click "Domains"
   - Add your custom domain (e.g., `ourmariagedate.com`)
   - Update DNS records as shown
   - Takes 24-48 hours to activate

### Benefits:
✅ Automatic deployments on every code change
✅ Free SSL certificate
✅ CDN included
✅ Very fast performance
✅ Easy to update later

---

## 🎨 Option 2: Netlify

Netlify is another great option with drag-and-drop deployment.

### Steps:

1. **Push to GitHub** (same as Vercel above)

2. **Deploy on Netlify**
   - Go to netlify.com
   - Click "Sign up"
   - Choose "GitHub"
   - Select your repository
   - Verifies build command: `next build`
   - Verifies publish directory: `.next`
   - Click "Deploy"
   - Wait for deployment to complete
   - Get your live URL

3. **Configure Custom Domain**
   - In Netlify dashboard, click "Domain settings"
   - Add custom domain
   - Update DNS records
   - Done!

### Benefits:
✅ Very user-friendly
✅ Free tier is generous
✅ Easy form submissions (optional)
✅ Good analytics included

---

## 💼 Option 3: Your Own Server (Advanced)

If you have your own hosting:

### Build the App:
```bash
npm run build
npm start
```

### Deploy Files:
Upload these folders to your server:
- `.next/` - The built application
- `public/` - Static files
- `node_modules/` - Dependencies

Set up Node.js and PM2 for keeping it running:
```bash
npm install -g pm2
pm2 start "npm start" --name "wedding-site"
pm2 startup
pm2 save
```

---

## 📊 Getting Your Domain

Options for custom domain:

1. **GoDaddy** (godaddy.com)
   - Domain: $1-15/year
   - Easy to use
   - Good for beginners

2. **Namecheap** (namecheap.com)
   - Domain: $1-10/year
   - Very cheap
   - Good support

3. **Google Domains** (domains.google.com)
   - Domain: $12/year
   - Simple to set up with Vercel
   - Integrates with Google Account

### Recommended Domain Names:
- FirstName-LastName.com
- OurMarriage-Year.com
- JoinUs-For-OurWedding.com
- FirstNameLastName-Weddings.com
- LoveStory-2024.com

---

## 🔄 Updating After Deployment

### If using Vercel/Netlify:
1. Edit files locally
2. Save and test
3. `git add .`
4. `git commit -m "Update wedding details"`
5. `git push`
6. Automatically deploys in 1-2 minutes!

### To update wedding details:
1. Edit `src/config/weddingConfig.ts`
2. Save
3. Push to GitHub
4. Wait for automatic deployment

---

## 🎯 Pre-Launch Checklist

Before sharing URL with guests:

- [ ] Website deployed and live
- [ ] All couple details updated
- [ ] All venue information correct
- [ ] Weather location verified (test weather widget)
- [ ] Email/phone contact info correct
- [ ] Tested on desktop and mobile
- [ ] All links work (email, phone)
- [ ] Domain purchased (if using custom)
- [ ] Domain points to your hosting

---

## 📱 Test Your Live Site

Before sending to guests:

1. Visit your live URL
2. Click the invitation card (should flip)
3. Scroll to weather (should show forecast)
4. Check contact section (click email/phone links)
5. Test on phone (use mobile browser)
6. Try different pages:
   - Home page (`/`)
   - Invitation page (`/invite`)
   - Email templates page (`/email-template`)

---

## 📧 Sharing with Guests

### Physical Invitation:
Print cards with:
```
[Your invitation design]

View full details and weather forecast:
www.yourweddingdomain.com/invite
```

### Email Invitation:
1. Go to your live site
2. Visit `/email-template`
3. Download the HTML template
4. Send through:
   - Gmail (with mail merge)
   - Outlook (with mail merge)
   - Mailchimp
   - SendGrid
   - Brevo

Include personalized message and your wedding URL.

---

## 🔒 Security & Privacy

Your site is:
- ✅ Encrypted (HTTPS)
- ✅ No database (no guest data stored)
- ✅ No cookies
- ✅ No tracking
- ✅ Safe for guests

---

## 📈 Monitor Your Site

### With Vercel:
- Dashboard shows deployment history
- Analytics tab shows visitor statistics
- See when guests viewed your invitation

### With Netlify:
- Similar analytics
- Easy performance monitoring
- Deployment logs available

---

## 🆘 Deployment Issues

**Site won't deploy?**
- Check that `src/config/weddingConfig.ts` has valid syntax
- Ensure no TypeScript errors
- Try rebuild locally: `npm run build`

**Domain not working?**
- DNS changes take 24-48 hours
- Check domain registrar DNS settings
- Verify settings match Vercel/Netlify requirements

**Slow loading?**
- Clear browser cache
- Check network connection
- It should load in under 2 seconds

---

## 💡 Pro Tips for Launch

1. **Test before sending invites**
   - Share URL with a few people first
   - Get feedback
   - Fix any issues

2. **Create a "test wedding" first**
   - Deploy to verify everything works
   - Then update with real details
   - Deploy again

3. **Share analytics with couple**
   - Vercel/Netlify shows how many viewed
   - Nice to track engagement

4. **Update weather location carefully**
   - Use exact venue coordinates
   - Google Maps: right-click, copy coordinates
   - Test weather widget before launch

5. **Plan email send**
   - Send in batches (morning is best)
   - Include clear subject line
   - Use personal greeting in email body

---

## 🎉 You're Live!

Once deployed:
1. ✅ Site is live and accessible
2. ✅ Guests can view invitation anytime
3. ✅ Weather widget updates automatically
4. ✅ Easy to update details anytime
5. ✅ Email templates ready to send

---

## 📞 Support

- **Vercel Issues**: vercel.com/support
- **Netlify Issues**: netlify.com/support
- **Domain Issues**: Contact your domain registrar
- **Code Issues**: Review README.md

---

**You're all set!** Share your beautiful invitation with the world. 💕
