import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { pingBackend } from './api/api'
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout';
import StyleGuide from './pages/StyleGuide';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';
import ModalAuthWrapper from './components/auth/ModalAuthWrapper';
import { Clients } from './routes/Clients';
import { Brokers } from './routes/Brokers';
import CompanyDetail from './pages/companies/[companyId]';
import { Settings } from './routes/Settings';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth, AuthProvider } from './contexts/authContext';

const AppContent = () => {
  const { token } = useAuth();
  const [showAuthForm, setShowAuthForm ] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('login');
  const [ping, setPing] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setShowAuthForm(true);
    } else {
      setShowAuthForm(false);
    }
    pingBackend()
      .then((data) => setPing(data.message))
      .catch((err) => setPing('❌ Error: ' + err.message));
  }, [token]);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      {/* If the user is not logged in, show the auth form */}
      {showAuthForm ? (
        <ModalAuthWrapper
          title={authMode === 'signup' ? 'Sign Up' : 'Log In'}
          switchModeLabel={authMode === 'signup' ? 'Already have an account? Log In' : 'New user? Sign Up'}
          onSwitchMode={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
        >
          {authMode === 'signup' ? <SignupForm /> : <LoginForm />}
        </ModalAuthWrapper>
      ) : (
        // If the user is logged in, show the main app content
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route index element={<Navigate to="clients" />} /> */}
              <Route path="/companies" element={<Clients />} />
              <Route path="/companies/:companyId" element={<CompanyDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/brokers" element={<Brokers />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/style-guide" element={<StyleGuide />} />
              </Route>
            </Routes>
          </Layout>
        </Router>
      )}
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App;
