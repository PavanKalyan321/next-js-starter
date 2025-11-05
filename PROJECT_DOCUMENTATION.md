# DevPortal - Personal Developer Portal

A modern, clean dashboard application for managing projects, code archives, ideas, and automation bots.

## Features

### 1. Dashboard (Home)
- Summary cards showing:
  - Total Projects
  - Total Code Vault Files
  - Active Research Ideas
  - Running Bots / Services
- Activity timeline with recent uploads and project updates
- Quick action buttons for common tasks

### 2. Projects Management
- List all projects with descriptions and metadata
- Individual project detail pages with:
  - Project description and notes
  - Associated code uploads
  - Edit functionality
  - File upload capability

### 3. Code Vault (Files)
- Centralized file storage for code archives
- Table view with filename, project, size, upload date
- Search and filter by project
- Upload ZIP files with project association
- Download functionality

### 4. Ideas / Research Notes
- Create and manage development ideas
- Fields: title, description, tags, status
- Status tracking: Active, In Progress, Paused, Completed
- Edit and update ideas
- Tag management

### 5. Bots / Automations Dashboard
- Monitor running automation services
- Bot list with status (Running/Stopped)
- Start/Stop/Restart controls
- Last updated timestamps
- Links to logs

## Technology Stack

- **Framework**: Next.js 15.4.5 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Backend**: FastAPI (configured, not included)
- **Database**: PostgreSQL (configured, not included)
- **File Storage**: DigitalOcean Spaces (configured, not included)

## Project Structure

```
next-js-starter/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx           # Root layout with sidebar/topbar
│   │   ├── page.tsx             # Dashboard home page
│   │   ├── globals.css          # Global styles
│   │   ├── projects/            # Projects pages
│   │   │   ├── page.tsx        # Projects list
│   │   │   └── [id]/           # Project detail
│   │   ├── vault/              # Code vault pages
│   │   │   └── page.tsx
│   │   ├── ideas/              # Ideas pages
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   └── bots/               # Bots dashboard
│   │       └── page.tsx
│   ├── components/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── Topbar.tsx          # Header with search & profile
│   │   └── ui/                 # Reusable UI components
│   │       ├── Card.tsx
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       └── Input.tsx
│   ├── lib/
│   │   ├── utils.ts            # Utility functions
│   │   └── api.ts              # API client functions
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── public/                      # Static assets
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── next.config.js              # Next.js configuration
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PavanKalyan321/next-js-starter.git
cd next-js-starter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## API Integration

The application is configured to work with a FastAPI backend. API endpoints are defined in `src/lib/api.ts`:

### Available API Functions

- **Projects**: `getProjects()`, `getProject(id)`, `createProject(data)`
- **Files**: `getFiles()`, `uploadFile(file, projectId)`
- **Ideas**: `getIdeas()`, `createIdea(data)`, `updateIdea(id, data)`
- **Bots**: `getBots()`, `startBot(id)`, `stopBot(id)`
- **Dashboard**: `getDashboardStats()`, `getRecentActivity()`

### Backend Setup

Your FastAPI backend should implement these endpoints:

```
GET  /api/projects
GET  /api/projects/{id}
POST /api/projects
GET  /api/files
POST /api/files/upload
GET  /api/ideas
POST /api/ideas
PUT  /api/ideas/{id}
GET  /api/bots
POST /api/bots/{id}/start
POST /api/bots/{id}/stop
GET  /api/dashboard/stats
GET  /api/dashboard/activity
```

## Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Adding New Pages

1. Create a new folder in `src/app/`
2. Add a `page.tsx` file
3. Update the navigation in `src/components/Sidebar.tsx`

### Modifying Layout

- Edit `src/components/Sidebar.tsx` for sidebar navigation
- Edit `src/components/Topbar.tsx` for header customization
- Edit `src/app/layout.tsx` for overall layout structure

## UI Components

The application includes reusable components:

- **Card**: Container with header and content sections
- **Button**: Customizable button with variants (primary, secondary, outline, ghost, danger)
- **Badge**: Status indicators with color variants
- **Input**: Form input with label and error support

## Mock Data

Currently, the application uses mock data for demonstration. To connect to your backend:

1. Replace mock data imports with API calls
2. Use the `api` functions from `src/lib/api.ts`
3. Handle loading and error states
4. Update `.env.local` with your API URL

Example:
```typescript
// Instead of:
const [projects] = useState(mockProjects)

// Use:
const [projects, setProjects] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  api.getProjects()
    .then(setProjects)
    .finally(() => setLoading(false))
}, [])
```

## Features Roadmap

- [ ] User authentication
- [ ] Real-time notifications
- [ ] File preview functionality
- [ ] Advanced search and filtering
- [ ] Dark mode toggle
- [ ] Export/import data
- [ ] Mobile responsive improvements
- [ ] Drag-and-drop file upload
- [ ] Batch operations
- [ ] Analytics and insights

## License

ISC

## Author

Pavan Kalyan

---

For issues or questions, please create an issue in the repository.
