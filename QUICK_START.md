# ⚡ Quick Start Guide - 5 Minutes

Get your Next.js app running locally in 5 minutes.

---

## Step 1: Install Dependencies (1 min)

```bash
cd /Users/marcosaruj/projects/nextjs-starter
npm install
```

---

## Step 2: Start Development Server (30 sec)

```bash
npm run dev
```

Output should show:

```
> next dev

  ▲ Next.js 15.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 1234ms
```

---

## Step 3: Open in Browser (15 sec)

Visit: **http://localhost:3000**

You should see a beautiful landing page with:

- Hero section with headline
- Feature grid
- Call-to-action buttons
- Responsive design

---

## Step 4: Run Tests (1 min)

```bash
npm test
```

You should see:

```
PASS  app/components/Button.test.tsx
  ✓ renders correctly
  ✓ handles click events
  ✓ applies variant styles
```

---

## Step 5: Build for Production (1.5 min)

```bash
npm run build
npm start
```

Visit: **http://localhost:3000** again

---

## 🎯 Common Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm test                 # Run tests
npm run lint             # Check code quality
npm run lint:fix         # Auto-fix issues
npm run format           # Auto-format code
npm run type-check       # Check TypeScript types
```

---

## 📁 Project Structure

```
app/                    # Your Next.js pages and components
├── components/        # React components
│   └── Button.tsx    # Example component
├── page.tsx          # Home page
└── layout.tsx        # Root layout

lib/                   # Utilities and helpers
├── types/
└── utils/

docs/                  # Documentation
config/               # Configuration guides
.github/workflows/    # CI/CD automation
```

---

## 🚀 Next Steps

### 1. Edit Home Page

Open `app/page.tsx` and modify the content

### 2. Create New Component

```bash
# Create app/components/YourComponent.tsx
```

### 3. Add Styling

Use Tailwind CSS classes:

```tsx
<div className="rounded-lg bg-blue-500 p-4">Styled with Tailwind!</div>
```

### 4. Deploy to Vercel

1. Push to GitHub:

```bash
git remote add origin <YOUR_GITHUB_URL>
git branch -M main
git push -u origin main
```

2. Import to Vercel:
   - Go to vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

3. Set GitHub Secrets:

```bash
gh secret set VERCEL_TOKEN --body "YOUR_TOKEN"
gh secret set VERCEL_ORG_ID --body "YOUR_ORG_ID"
gh secret set VERCEL_PROJECT_ID --body "YOUR_PROJECT_ID"
```

---

## 📖 Documentation

For more details, see:

- **SETUP_COMPLETE.md** - Full setup overview
- **config/QUICKSTART.md** - Detailed setup steps
- **config/DEPLOYMENT_GUIDE.md** - Vercel deployment
- **docs/INDEX.md** - Documentation hub
- **.github/workflows/README.md** - CI/CD info

---

## ⚠️ Troubleshooting

### Port 3000 in use?

```bash
npm run dev -- -p 3001
```

### Module not found?

```bash
rm -rf node_modules package-lock.json
npm install
```

### Type errors?

```bash
npm run type-check
npm run lint:fix
```

---

## ✅ You're All Set!

Your Next.js app is running and ready to customize.

**Start coding!** 🚀

Visit **http://localhost:3000** and begin building.

---

**Need help?** Check the docs in the `docs/` and `config/` directories.
