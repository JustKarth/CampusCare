# CampusCare React Frontend

A modern React + Tailwind CSS frontend for CampusCare, a campus community platform where students can share blogs, access resources, and explore local guides.

## 🚀 Features

- **Authentication**: Secure login and registration
- **Blogs**: Create, view, like, and comment on campus blogs
- **Resources**: Access academic resources
- **Local Guide**: Discover and rate places around campus
- **Search**: Real-time blog search with debouncing
- **Responsive Design**: Mobile-first, works on all devices
- **Performance**: Code splitting, lazy loading, and optimizations
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **SEO**: Meta tags, Open Graph, and structured data

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:5000` (or configure via `.env`)

## 🛠️ Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

3. **Start development server:**
```bash
npm run dev
```

The app will run on `http://localhost:5173` (or another port if 5173 is taken).

## 📁 Project Structure

```
src/
├── __tests__/          # Test files
├── components/         # Reusable components
│   ├── auth/          # Authentication components
│   ├── blog/          # Blog-related components
│   ├── common/        # Common UI components
│   ├── layout/        # Layout components
│   ├── localGuide/    # Local guide components
│   └── resources/     # Resource components
├── config/            # Configuration files
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components (routes)
├── services/          # API client and services
├── utils/             # Utility functions
└── styles/            # Global CSS with Tailwind
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🏗️ Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🛣️ Routes

- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/dashboard` - Dashboard (protected)
- `/profile` - User profile (protected)
- `/blogs` - Blog list with search (protected)
- `/blogs/:id` - Single blog view with comments (protected)
- `/resources` - Academic resources (protected)
- `/local-guide` - Local guide with category filtering (protected)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm test -- --coverage` - Run tests with coverage

## 🎨 Tech Stack

- **React 19** - UI library
- **React Router 7** - Routing
- **Tailwind CSS 3** - Styling
- **Vite** - Build tool
- **Jest + React Testing Library** - Testing

## 📦 Key Features Implemented

### Part 1: Scaffold ✅
- React app setup with Vite
- Tailwind CSS configuration
- React Router setup
- Basic structure and routing

### Part 2: Features ✅
- Authentication (login/register)
- Blog CRUD operations
- Comments system
- Resources display
- Local guide with ratings

### Part 3: Polish ✅
- Enhanced styling
- Loading states
- Error handling
- Success messages
- Empty states
- Responsive design

### Part 4: Performance ✅
- Code splitting
- Lazy loading
- Error boundaries
- Form validation
- Search functionality
- Memoization

### Part 5: Production Ready ✅
- Testing setup
- SEO optimization
- Accessibility improvements
- Documentation
- Deployment configuration

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder contains the production-ready files.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Actions

A deployment workflow is included in `.github/workflows/deploy.yml`. Configure your deployment platform in the workflow file.

## 📝 Development Notes

- The existing static frontend in `frontend/frontend/` and `frontend/js/` remains untouched
- This React app runs independently and can be developed alongside the static version
- Backend API endpoints remain the same (`http://localhost:5000/api`)
- All API calls use the configured `VITE_API_BASE_URL`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

[Your License Here]

## 👥 Authors

CampusCare Development Team
