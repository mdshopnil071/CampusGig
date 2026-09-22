# 🎓 CampusGig — Student Freelance & Micro-Task Marketplace (Frontend)

CampusGig is an ethical, peer-to-peer freelance micro-task platform built exclusively for university students. This frontend client is built with **React, Tailwind CSS, DaisyUI, React Icons, and React Hot Toast**, connecting to the FastAPI backend.

---

## 🛠️ Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v3 + DaisyUI (Campus theme)
- **Routing**: React Router v7 (`react-router-dom`)
- **HTTP Client**: Axios (with Bearer Token & Auto Refresh Interceptor)
- **Notifications**: React Hot Toast
- **Icons**: React Icons (`fi`, `hi2`)
- **Backend API**: FastAPI REST API (`https://campusgig-backend.onrender.com`)

---

## 📁 Project Architecture

```
src/
├── api/                  # Direct mapping to FastAPI backend endpoints
│   ├── client.js         # Axios instance, JWT Bearer interceptor & auto refresh
│   ├── authApi.js        # /api/auth (login, signup, refresh, forgot/reset password)
│   ├── usersApi.js       # /api/users (me, update, list, delete)
│   ├── categoriesApi.js  # /api/categories (CRUD)
│   ├── gigsApi.js        # /api/gigs (list, create, update, delete)
│   ├── tasksApi.js       # /api/tasks (list, create, update, delete)
│   ├── proposalsApi.js   # /api/proposals (create, my proposals, delete)
│   ├── ordersApi.js      # /api/orders (create, status update, list)
│   ├── deliveriesApi.js  # /api/deliveries (create, get by order)
│   ├── messagesApi.js    # /api/messages (order chat room)
│   ├── reviewsApi.js     # /api/reviews (1-5 star ratings & comments)
│   ├── notificationsApi.js # /api/notifications (list, mark as read)
│   └── reportsApi.js     # /api/reports (dispute & misconduct reports)
│
├── context/
│   ├── AuthContext.jsx         # User state, JWT tokens, login, logout, roles
│   ├── NotificationContext.jsx # Polling, unread notifications badge
│   └── SavedGigsContext.jsx    # Wishlist & bookmarked gigs
│
├── data/
│   ├── skillQuizzes.js         # Interactive MCQ test questions (React, Python, JS, Git)
│   └── universityData.js       # Universities, departments, integrity pledge
│
├── components/
│   ├── common/           # Navbar, Footer, Pagination, ConfirmationModal, EmptyState, StatCard, BadgeDisplay
│   ├── gigs/             # GigCard, GigFilter, GigPackagesTable
│   ├── tasks/            # TaskCard, TaskFilter, ProposalModal
│   ├── orders/           # OrderTimeline, OrderStatusBadge, OrderChatBox, DeliveryModal, ReviewModal, ReportModal
│   └── matching/         # SkillMatcherModal (Algorithmic skill & budget calculator)
│
├── layouts/
│   ├── MainLayout.jsx          # Public navbar + container + footer
│   └── DashboardLayout.jsx     # Sidebar navigation + content area
│
├── routes/
│   ├── AppRoutes.jsx           # Complete route definitions
│   ├── ProtectedRoute.jsx      # Student/User route guard
│   └── AdminRoute.jsx          # Admin role guard
│
└── pages/
    ├── Home.jsx                # Landing page with hero, featured gigs, tasks, & matcher
    ├── auth/                   # Login, Signup, ForgotPassword, ResetPassword
    ├── gigs/                   # BrowseGigs, GigDetails, CreateGig, EditGig
    ├── tasks/                  # BrowseTasks, TaskDetails, CreateTask, EditTask
    ├── orders/                 # OrdersList, OrderWorkspace (Chat + Deliveries)
    ├── skills/                 # SkillTest (MCQ test with verified badge reward)
    ├── wishlist/               # SavedGigs (Bookmarked services)
    ├── profile/                # StudentProfile (Public), ProfileSettings (Wallet)
    ├── dashboard/              # UserDashboard, MyGigs, MyTasks, MyProposals
    ├── admin/                  # AdminDashboard, ManageCategories, ManageReports, ManageUsers
    └── NotFound.jsx            # 404 page
```

---

## 🚀 How to Run Locally

1. **Install Dependencies** (already done):
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   The `.env` file is configured with the backend API URL:
   ```env
   VITE_API_BASE_URL=https://campusgig-backend.onrender.com
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```
