import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FileText, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0_0_#000] p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="w-8 h-8 text-black" />
              <span className="text-2xl font-bold text-black">ASKPDF</span>
            </div>
            <h2 className="text-3xl font-bold text-black mb-2">WELCOME BACK</h2>
            <p className="text-black font-medium">SIGN IN TO CONTINUE CHATTING WITH YOUR PDFS</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-cyan-600 mb-2">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-0 focus:border-  -600 bg-white text-black placeholder-gray-500"
                placeholder="ENTER YOUR USERNAME"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-cyan-600 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border-2 border-black rounded-none focus:outline-none focus:ring-0 focus:border-fuchsia-600 bg-white text-black placeholder-gray-500"
                  placeholder="ENTER YOUR PASSWORD"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fuchsia-600 hover:text-cyan-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-none hover:bg-cyan-600 border-2 border-black focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] active:shadow-[0px_0px_0_0_#000] active:translate-x-1 active:translate-y-1"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>SIGNING IN...</span>
                </div>
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-black font-medium">
              DON'T HAVE AN ACCOUNT?{' '}
              <Link
                to="/signup"
                className="text-fuchsia-600 hover:text-cyan-600 font-bold underline"
              >
                SIGN UP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;