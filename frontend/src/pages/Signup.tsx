import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      alert('PASSWORDS DO NOT MATCH');
      return;
    }
    if (password.length < 6) {
      alert('PASSWORD MUST BE AT LEAST 6 CHARACTERS');
      return;
    }

    setLoading(true);
    try {
      await signup(username, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('SIGNUP ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lime-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0_0_#000] p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="w-8 h-8 text-black" />
              <span className="text-2xl font-bold text-black">ASKPDF</span>
            </div>
            <h2 className="text-3xl font-bold text-black mb-2">CREATE ACCOUNT</h2>
            <p className="text-black font-medium">START CHATTING WITH YOUR PDFS TODAY</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-cyan-600 mb-2">
                USERNAME
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-12 border-2 border-black rounded-none focus:outline-none focus:ring-0 focus:border-purple-600 bg-white text-black placeholder-gray-500"
                  placeholder="CHOOSE A USERNAME"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600 w-5 h-5" />
              </div>
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
                  className="w-full px-4 py-3 pr-12 border-2 border-black rounded-none focus:outline-none focus:ring-0 focus:border-purple-600 bg-white text-black placeholder-gray-500"
                  placeholder="CREATE A PASSWORD"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-cyan-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-black font-medium">MUST BE AT LEAST 6 CHARACTERS</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-cyan-600 mb-2">
                CONFIRM PASSWORD
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-0 focus:border-purple-600 bg-white text-black placeholder-gray-500"
                placeholder="CONFIRM YOUR PASSWORD"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password || !confirmPassword}
              className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-none hover:bg-cyan-600 border-2 border-black focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] active:shadow-[0px_0px_0_0_#000] active:translate-x-1 active:translate-y-1"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>CREATING ACCOUNT...</span>
                </div>
              ) : (
                'CREATE ACCOUNT'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-black font-medium">
              ALREADY HAVE AN ACCOUNT?{' '}
              <Link
                to="/login"
                className="text-purple-600 hover:text-cyan-600 font-bold underline"
              >
                SIGN IN
              </Link>
            </p>
          </div>

          {/* Brutalist decoration elements */}
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-cyan-600 border-2 border-black"></div>
          <div className="absolute top-2 left-2 w-3 h-3 bg-purple-600 border-2 border-black"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;