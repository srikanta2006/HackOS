import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebaseConfig.js';
import { 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import AuthLayout from '../components/AuthLayout.jsx';
import AuthMascot from '../components/AuthMascot.jsx';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Animation States
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [loginState, setLoginState] = useState('idle');
  const [focusedField, setFocusedField] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setLoginState('success'); // Happy animation!
      const user = userCredential.user;
      // Create base profile
      await setDoc(doc(db, 'users', user.uid), {
        displayName: '',
        email: user.email,
        photoURL: ''
      }, { merge: true });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      setLoginState('error'); // Sad animation
      setTimeout(() => setLoginState('idle'), 2000);
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    // Don't set loading immediately to allow for animation start
    try {
      const result = await signInWithPopup(auth, provider);
      setLoginState('success');
      const user = result.user;
      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.displayName || '',
        email: user.email,
        photoURL: user.photoURL || ''
      }, { merge: true });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Social login error:', err);
      setError('Failed to login.');
      setLoginState('error');
      setTimeout(() => setLoginState('idle'), 2000);
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an account"
      subtitle="Start building your portfolio today."
      mascot={<AuthMascot focusedField={focusedField} hasError={!!error} />}
    >
      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleSocialLogin(new GoogleAuthProvider())}
          className="flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.065 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/><path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/><path fill="#FBBC05" d="M5.277 14.268A7.127 7.127 0 0 1 4.909 12c0-.782.125-1.573.368-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/></svg>
          Google
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin(new GithubAuthProvider())}
          className="flex items-center justify-center gap-3 px-4 py-3 bg-[#24292e] hover:bg-[#2f363d] text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-sm border border-gray-700"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          GitHub
        </button>
      </div>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-gray-800"></div>
        <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-wider font-medium">Or continue with</span>
        <div className="flex-grow border-t border-gray-800"></div>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 tracking-wide" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // NEW: Track focus
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 tracking-wide" htmlFor="password">
            Password (min. 6 chars)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // NEW: Track focus (This triggers the "peek" animation)
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200"
            placeholder="••••••••"
            required
            minLength="6"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || loginState === 'success'}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || loginState === 'success' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="text-center text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-white hover:text-green-400 transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;