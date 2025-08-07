import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import Home from './pages/Home';
import Login from './features/auth/components/Login';
import Register from './features/auth/components/Register';
import ProfileVerification from './features/auth/components/ProfileVerification';
import Upload from './pages/Upload';
import VideoPlayer from './components/VideoPlayer';
import CreatorProfile from './pages/CreatorProfile';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AnimatedLogo from './components/AnimatedLogo';
import Jobseekers from "./pages/JobSeekers"
import Employers from './pages/Employers'

function App() {
  return (
    <AuthProvider>
      <AnimatedLogo />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<ProfileVerification />} />
        <Route path="/job-seekers" element={<Jobseekers />} />
        <Route path="/employer" element={<Employers />} /> 
        <Route path="/upload" element={ <Upload />} />
        <Route path="/messages" element={<Messages />} />
      
        
      
        <Route path="/video/:id" element={
          <ProtectedRoute>
            <VideoPlayer />
          </ProtectedRoute>
        } />
        
        <Route path="/creator/:username" element={
          <ProtectedRoute>
            <CreatorProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        
        <Route path="/chat/:userId" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
        
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
