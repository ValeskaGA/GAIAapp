
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { useOnboarding } from '../state/useOnboarding';

/**
 * AuthCallbackHandler
 * 
 * Handles the redirect flow when a user clicks the email confirmation link.
 * 
 * How it works with HashRouter:
 * 1. Supabase sends confirmation email with link ending in `#access_token=...&type=signup`
 * 2. When user clicks the link, the browser opens the app URL with tokens in the hash fragment
 * 3. Supabase JS SDK automatically detects tokens in the URL hash on page load
 * 4. It processes them and fires `SIGNED_IN` via onAuthStateChange
 * 5. This component detects when a user transitions from unauthenticated → authenticated
 *    and redirects them to /chat
 * 
 * This component renders nothing — it only provides side-effect logic.
 */
const AuthCallbackHandler: React.FC = () => {
  const { user, loading } = useAuth();
  const { isOnboardingCompleted } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  const previousUser = useRef<string | null>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (loading) return;

    if (!hasMounted.current) {
      // First render: just record the current user state without redirecting.
      // This prevents auto-redirecting a user who just logged out and navigated
      // to /login but still has a brief session during cleanup.
      previousUser.current = user?.id ?? null;
      hasMounted.current = true;
      return;
    }

    // Detect transition: no user → user (= fresh authentication, e.g. email confirmation callback or login)
    if (user && !previousUser.current) {
      const isOnPublicPage = ['/', '/login', '/register', '/intro', '/ethics', '/consent', '/safety', '/rhythm'].includes(location.pathname);

      if (isOnPublicPage) {
        const destination = isOnboardingCompleted ? '/chat' : '/ethics';
        console.log(`🔄 [AuthCallbackHandler] Sesión detectada en página pública — redirigiendo a ${destination}`);
        navigate(destination, { replace: true });
      }
    }

    // Track previous user state
    previousUser.current = user?.id ?? null;
  }, [user, loading, navigate, location.pathname]);

  return null; // This component renders nothing
};

export default AuthCallbackHandler;

