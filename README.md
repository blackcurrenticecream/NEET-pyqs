# NEET PYQ Platform 🧬

38 years of NEET/AIPMT questions — chapter-wise, with analytics, quiz mode, and custom tests.

## Setup (15 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Create Supabase project
- Go to supabase.com → New project
- Copy your Project URL and anon public key
- Go to SQL Editor → paste contents of `supabase_schema.sql` → Run

### 3. Enable Google Auth in Supabase
- Dashboard → Authentication → Providers → Google → Enable
- Add your Google OAuth credentials (or use the Supabase default for development)
- Add `http://localhost:5173` and your Vercel URL to allowed redirect URLs

### 4. Add your keys
Edit `src/lib/supabase.js`:
```js
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY'
```

### 5. Run locally
```bash
npm run dev
```

### 6. Deploy to Vercel
```bash
npx vercel
```
Add environment variables in Vercel dashboard (optional — keys are currently in source).

## Adding Real Questions

The app ships with 50 seed questions. To add the full 15k NEET PYQ dataset:

1. Get a structured JSON with this format (see `src/data/questions.js`)
2. Run `node scripts/import.js` with your Supabase service role key
3. Update `src/data/questions.js` to fetch from Supabase instead of local data

## File Structure
```
src/
  data/questions.js     ← 50 seed questions + subject/chapter config
  lib/
    supabase.js         ← Supabase client (PUT YOUR KEYS HERE)
    useAuth.js          ← Auth context
    useTheme.js         ← Dark/light toggle
    useProgress.js      ← Local progress tracking
  components/
    Layout.jsx          ← Nav, header, mobile nav
    QuestionCard.jsx    ← Reusable question component
  pages/
    Home.jsx            ← Dashboard
    SubjectPage.jsx     ← Chapter browser with filters
    QuizMode.jsx        ← Timed quiz
    CustomTest.jsx      ← Custom test builder
    TestRunner.jsx      ← Full exam mode with palette
    Analytics.jsx       ← Performance charts
    Bookmarks.jsx       ← Saved questions
    YearPage.jsx        ← Browse by year
```
