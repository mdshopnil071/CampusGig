import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Pages - Public
import { Home } from '../pages/Home';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { BrowseGigs } from '../pages/gigs/BrowseGigs';
import { GigDetails } from '../pages/gigs/GigDetails';
import { BrowseTasks } from '../pages/tasks/BrowseTasks';
import { TaskDetails } from '../pages/tasks/TaskDetails';
import { SkillTest } from '../pages/skills/SkillTest';
import { SavedGigs } from '../pages/wishlist/SavedGigs';
import { StudentProfile } from '../pages/profile/StudentProfile';
import { NotFound } from '../pages/NotFound';

// Pages - Protected
import { CreateGig } from '../pages/gigs/CreateGig';
import { EditGig } from '../pages/gigs/EditGig';
import { CreateTask } from '../pages/tasks/CreateTask';
import { EditTask } from '../pages/tasks/EditTask';
import { OrdersList } from '../pages/orders/OrdersList';
import { OrderWorkspace } from '../pages/orders/OrderWorkspace';
import { NotificationsList } from '../pages/notifications/NotificationsList';

// Pages - Dashboard
import { UserDashboard } from '../pages/dashboard/UserDashboard';
import { MyGigs } from '../pages/dashboard/MyGigs';
import { MyTasks } from '../pages/dashboard/MyTasks';
import { MyProposals } from '../pages/dashboard/MyProposals';
import { ProfileSettings } from '../pages/profile/ProfileSettings';

// Pages - Admin
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ManageCategories } from '../pages/admin/ManageCategories';
import { ManageReports } from '../pages/admin/ManageReports';
import { ManageUsers } from '../pages/admin/ManageUsers';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public & Main Pages (wrapped in MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/gigs" element={<BrowseGigs />} />
        <Route path="/gigs/:id" element={<GigDetails />} />
        <Route path="/tasks" element={<BrowseTasks />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/skills" element={<SkillTest />} />
        <Route path="/saved-gigs" element={<SavedGigs />} />
        <Route path="/profile/:id" element={<StudentProfile />} />

        {/* Protected Standard Workflows */}
        <Route element={<ProtectedRoute />}>
          <Route path="/gigs/create" element={<CreateGig />} />
          <Route path="/gigs/:id/edit" element={<EditGig />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/:id/edit" element={<EditTask />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/:id" element={<OrderWorkspace />} />
          <Route path="/notifications" element={<NotificationsList />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* 2. User & Admin Dashboards (wrapped in DashboardLayout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Student / User Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/my-gigs" element={<MyGigs />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/my-proposals" element={<MyProposals />} />
          <Route path="/settings" element={<ProfileSettings />} />

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<ManageCategories />} />
            <Route path="/admin/reports" element={<ManageReports />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
