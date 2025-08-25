
 i wish to create a user profile that spans the normal one with a very nice dashboard and i need sources as well as prompts to help in my journey of making professional and industry specific profile pages. i wish to use TypeScript with Tailwind CSS as well as use react-router for inrouting using Mostly Link as well i want to highly visual dashboard

 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

// DashboardLayout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet /> {/* This is where page content will render */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

// ProfilePage.tsx
import { useState } from 'react';
import UserCard from '../components/profile/UserCard';
import StatsGrid from '../components/dashboard/StatsGrid';
import ActivityFeed from '../components/activity/ActivityFeed';
import ProgressChart from '../components/charts/ProgressChart';

const ProfilePage = () => {
  const [userData] = useState({
    name: 'Jane Cooper',
    title: 'Frontend Developer',
    avatar: '/path/to/avatar.jpg',
    coverPhoto: '/path/to/cover.jpg',
    stats: [
      { label: 'Projects', value: 24 },
      { label: 'Followers', value: 1284 },
      { label: 'Following', value: 362 },
    ]
  });

  return (
    <div className="space-y-6">
      {/* Header with cover photo and avatar */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl overflow-hidden">
        <div className="absolute bottom-0 left-6 transform translate-y-1/2">
          <img 
            src={userData.avatar} 
            alt={userData.name}
            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
          />
        </div>
      </div>

      {/* Profile content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
        <div className="lg:col-span-2">
          <UserCard user={userData} />
          <ActivityFeed userId={123} />
        </div>
        
        <div className="space-y-6">
          <StatsGrid stats={userData.stats} />
          <ProgressChart />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDark(savedTheme ? savedTheme === 'dark' : systemPrefersDark);
  }, []);

  useEffect(() => {
    // Apply theme class to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// GlassCard.tsx
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-xl border border-white/20 bg-white/20 dark:border-gray-600/30 dark:bg-gray-600/20 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;