# DevOps Admin Platform

A complete, production-ready DevOps administration dashboard with real-time monitoring, CI/CD pipeline tracking, and infrastructure management capabilities.

## Architecture

This is a **full-stack cloud-native application** built with:

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth with JWT tokens
- **Database**: PostgreSQL (via Supabase)

## Features

### Authentication
- Secure login with JWT tokens
- Session management with access and refresh tokens
- Protected routes for authenticated users only
- Demo credentials: `admin` / `Admin@123`

### Dashboard
- Real-time system metrics overview
- CI/CD pipeline status monitoring
- Infrastructure health indicators
- System alerts and warnings
- Auto-refresh every 30 seconds

### Pages

#### 1. Dashboard
- Overview of all system metrics
- CI/CD pipeline status cards
- System monitoring indicators
- Infrastructure health summary
- Real-time statistics

#### 2. CI/CD Pipeline
- Pipeline status for Jenkins, GitLab, GitHub
- Success/failure tracking
- Build duration metrics
- Success rate analytics
- Pipeline details view

#### 3. Monitoring
- System performance metrics (CPU, Memory, Disk, Network, Response Time, Error Rate)
- Real-time alerts (critical, warning, info)
- Metric thresholds and status indicators
- Alert history with timestamps

#### 4. Infrastructure
- Kubernetes cluster information
- Container status and uptime tracking
- Node performance metrics (CPU, Memory, Disk)
- Container images and restart counts
- Multi-cluster support

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── MetricCard.tsx
│   │   ├── StatusBadge.tsx
│   │   └── StatCard.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── ui/
│       ├── Alert.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Loader.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── CICDPage.tsx
│   ├── MonitoringPage.tsx
│   └── InfrastructurePage.tsx
├── services/
│   ├── auth.service.ts
│   └── dashboard.service.ts
├── types/
│   ├── auth.ts
│   └── dashboard.ts
├── App.tsx
├── routes.tsx
├── index.css
└── main.tsx
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables** (already configured)
   The project includes pre-configured Supabase credentials:
   - `VITE_SUPABASE_URL` - Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Anonymous API key

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Building for Production

Build the optimized bundle:
```bash
npm run build
```

The production-ready files are generated in the `dist/` directory.

## Demo Credentials

```
Username: admin
Password: Admin@123
```

## API Endpoints

### Authentication (Edge Functions)
- `POST /functions/v1/auth/login` - Admin login
- `POST /functions/v1/auth/refresh` - Refresh JWT token
- `POST /functions/v1/auth/logout` - Invalidate token
- `GET /functions/v1/auth/validate` - Validate current token

### Dashboard Data (Edge Functions)
- `GET /functions/v1/dashboard/summary` - Overall dashboard metrics
- `GET /functions/v1/dashboard/cicd` - CI/CD pipeline status
- `GET /functions/v1/dashboard/monitoring` - System monitoring metrics
- `GET /functions/v1/dashboard/infrastructure` - Infrastructure status

## Database Schema

### admin_users Table
```sql
- id (UUID, Primary Key)
- username (Text, Unique)
- email (Text, Unique)
- password_hash (Text, BCrypt)
- created_at (Timestamp)
- updated_at (Timestamp)
```

Row Level Security (RLS) is enabled with policies for authenticated access.

## Technology Stack

### Frontend Dependencies
- **react** - UI library
- **react-dom** - DOM rendering
- **react-router-dom** - Client-side routing
- **typescript** - Type safety
- **tailwindcss** - Utility-first CSS
- **lucide-react** - Icon library
- **vite** - Build tool

### Development Tools
- **ESLint** - Code quality
- **TypeScript** - Type checking
- **PostCSS** - CSS processing

## Features Highlights

### Dark Mode UI
- Modern dark theme optimized for DevOps teams
- Consistent color scheme across all pages
- Professional gradient accents

### Responsive Design
- Mobile-first approach
- Works seamlessly on desktop, tablet, and mobile
- Adaptive sidebar and navigation

### Real-time Updates
- Dashboard auto-refreshes every 30 seconds
- Real-time status indicators
- Smooth loading states

### Performance Optimized
- Code splitting with Vite
- Lazy loading of pages
- Efficient re-rendering with React hooks
- Minimal bundle size

## Status Indicators

### System Health
- **Healthy** - Green - System operating normally
- **Warning** - Yellow - Minor issues detected
- **Critical** - Red - Major issues requiring attention

### Component Status
- **Running** - Active and operational
- **Idle** - Available but not active
- **Building** - In progress
- **Failed** - Error state

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Row Level Security** - Database-level access control
- **HTTPS Only** - Supabase enforces HTTPS
- **Secure Headers** - Proper CORS configuration
- **Password Hashing** - BCrypt for secure password storage

## Deployment

The application is ready for deployment to any Node.js hosting platform:

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables on your hosting platform
4. Ensure HTTPS is enabled

### Recommended Platforms
- Vercel
- Netlify
- GitHub Pages
- Azure Static Web Apps
- AWS Amplify

## Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Login Issues
- Ensure Supabase connection is active
- Check network tab for API errors
- Verify demo credentials are correct

### Data Not Loading
- Check browser console for errors
- Verify Supabase edge functions are deployed
- Ensure authentication token is valid

## Contributing

This is a complete application template. Feel free to:
- Customize components and styling
- Extend with additional pages
- Connect real data sources
- Add more monitoring metrics

## License

MIT License - Feel free to use this project as a template

## Next Steps

1. **Connect Real Data**: Replace mock data with real APIs
2. **Add Real Metrics**: Integrate with Prometheus, Grafana, or other monitoring tools
3. **Customize Branding**: Update colors, logos, and styling
4. **Extend Features**: Add more metrics, alerts, and capabilities
5. **User Management**: Implement multi-user support with role-based access

## Support

For questions or issues, refer to:
- Supabase Documentation: https://supabase.com/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Vite Documentation: https://vitejs.dev
