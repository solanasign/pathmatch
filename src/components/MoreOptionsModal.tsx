import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../features/auth/context/AuthContext';

interface MobileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

const MobileMenuModal: React.FC<MobileMenuModalProps> = ({ isOpen, onClose, currentPath }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleAuthNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with higher z-index */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 z-[60]" // Increased z-index to 60
            onClick={onClose}
          />

          {/* Modal with higher z-index and adjusted positioning */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full h-full z-[70] overflow-y-auto" // Increased z-index to 70
          >
            <div className="bg-black text-white min-h-full">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-black z-10">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h1 className="text-white font-bold text-xl">PATHMATCH</h1>
                    <p className="text-gray-300 text-sm">Employment Agency</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-300 transition-colors p-2"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info Section (if authenticated) */}
              {isAuthenticated && user && (
                <div className="p-6 border-b border-gray-800 bg-gray-900">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.initials || 'U'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : user.email || 'User'
                        }
                      </h3>
                      <p className="text-gray-300 text-sm">{user.email}</p>
                      <p className="text-gray-400 text-xs capitalize">
                        {user.role?.replace('_', ' ') || 'User'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="p-6 space-y-8">
                {/* Main Navigation Links */}
                <nav className="space-y-6">
                  <Link
                    to="/"
                    className={`block text-2xl font-bold transition-colors ${
                      isActiveLink('/') ? 'text-yellow-400' : 'text-white hover:text-yellow-500'
                    }`}
                    onClick={onClose}
                  >
                    Home
                  </Link>
                  <Link
                    to="/job-seekers"
                    className={`block text-2xl font-bold transition-colors ${
                      isActiveLink('/job-seekers') ? 'text-yellow-400' : 'text-white hover:text-yellow-500'
                    }`}
                    onClick={onClose}
                  >
                    Job Seekers
                  </Link>
                  <Link
                    to="/about-us"
                    className={`block text-2xl font-bold transition-colors ${
                      isActiveLink('/about-us') ? 'text-yellow-400' : 'text-white hover:text-yellow-500'
                    }`}
                    onClick={onClose}
                  >
                    About
                  </Link>
                  <Link
                    to="/employer"
                    className={`block text-2xl font-bold transition-colors ${
                      isActiveLink('/employer') ? 'text-yellow-400' : 'text-white hover:text-yellow-500'
                    }`}
                    onClick={onClose}
                  >
                    Employers
                  </Link>
                  <Link
                    to="/contact-us"
                    className={`block text-2xl font-bold transition-colors ${
                      isActiveLink('/contact-us') ? 'text-yellow-400' : 'text-white hover:text-yellow-500'
                    }`}
                    onClick={onClose}
                  >
                    Contact Us
                  </Link>
                </nav>

                {/* Authentication Section */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Account</h3>
                  <div className="space-y-4">
                    {isAuthenticated ? (
                      <>
                        <button
                          onClick={() => handleAuthNavigation('/settings')}
                          className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors w-full text-left"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors w-full text-left"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAuthNavigation('/auth')}
                        className="flex items-center space-x-3 text-yellow-400 hover:text-yellow-300 transition-colors w-full text-left bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign In / Sign Up</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Useful Links */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Useful Links</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Link
                        to="/job-seekers"
                        className="block text-white hover:text-gray-300 transition-colors"
                        onClick={onClose}
                      >
                        Apply for a Job
                      </Link>
                      {!isAuthenticated && (
                        <Link
                          to="/auth"
                          className="block text-white hover:text-gray-300 transition-colors"
                          onClick={onClose}
                        >
                          New Here?
                        </Link>
                      )}
                      <Link
                        to="/contact-us"
                        className="block text-white hover:text-gray-300 transition-colors"
                        onClick={onClose}
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex gap-3 sm:gap-4 pt-4">
                  <Link to="#" className="text-white hover:text-gray-300 transition-colors">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Link>
                  <Link to="#" className="text-white hover:text-gray-300 transition-colors">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </Link>
                  <Link to="mailto:info.pathmatch@gmail.com" className="text-white hover:text-gray-300 transition-colors">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenuModal;