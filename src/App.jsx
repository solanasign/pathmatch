import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AnimatedLogo from './components/AnimatedLogo';
import ScrollToTop from './components/ScrollToTop'
import Jobseekers from "./pages/JobSeekers"
import Employers from './pages/Employers'
import ContactUs from './pages/ContactUs'
import Auth from './pages/Auth';


function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      <ScrollToTop />
      {location.pathname !== '/auth' && <AnimatedLogo />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job-seekers" element={<Jobseekers />} />
        <Route path="/employers" element={<Employers />} /> 
        <Route path="/chat" element={<Chat />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/auth" element={<Auth />} />
        
        
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        {/* Fallback Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
