import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, MessageCircle, Upload, Zap, Shield, Download } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white border-4 border-black">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
            <span className="text-xl sm:text-2xl font-bold text-black">ASKPDF</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/login"
              className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-black hover:bg-yellow-300 border-2 border-black transition-all"
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="px-3 sm:px-6 py-1 sm:py-2 text-sm sm:text-base bg-teal-500 text-white border-2 border-black hover:bg-pink-500 hover:text-black transition-all shadow-[2px_2px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] sm:hover:shadow-[6px_6px_0_0_#000]"
            >
              SIGN UP
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center border-b-4 border-black">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-black mb-6">
          CHAT WITH YOUR
          <span className="block bg-yellow-300 px-2 py-1 border-2 border-black mt-2 sm:mt-0 sm:inline-block sm:ml-2 whitespace-nowrap">
            PDF DOCUMENTS
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-black mb-8 sm:mb-12 max-w-3xl mx-auto">
          UPLOAD ANY PDF AND GET INSTANT ANSWERS. NO FLUFF. JUST RESULTS.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link
            to="/signup"
            className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 text-white text-sm sm:text-lg font-bold border-2 border-black rounded-none hover:bg-pink-500 hover:text-black transition-all shadow-[4px_4px_0_0_#000] sm:shadow-[8px_8px_0_0_#000] hover:shadow-[5px_5px_0_0_#000] sm:hover:shadow-[10px_10px_0_0_#000]"
          >
            GET STARTED FREE
          </Link>
          <Link
            to="/login"
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black text-sm sm:text-lg font-bold border-2 border-black rounded-none hover:bg-yellow-300 transition-all"
          >
            TRY DEMO
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 border-b-4 border-black">
        <h2 className="text-2xl sm:text-4xl font-bold text-center text-black mb-8 sm:mb-16 bg-yellow-300 px-4 py-2 border-2 border-black inline-block">
          WHY CHOOSE ASKPDF?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-black mb-4 sm:mb-6" />,
              title: "EASY UPLOAD",
              desc: "DRAG AND DROP YOUR PDFS. INSTANT PROCESSING. NO COMPLICATIONS."
            },
            {
              icon: <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 text-black mb-4 sm:mb-6" />,
              title: "NATURAL CHAT",
              desc: "ASK QUESTIONS LIKE YOU WOULD TO A HUMAN. GET SMART ANSWERS."
            },
            {
              icon: <Zap className="w-8 h-8 sm:w-12 sm:h-12 text-black mb-4 sm:mb-6" />,
              title: "LIGHTNING FAST",
              desc: "NO WAITING. INSTANT RESPONSES POWERED BY CUTTING-EDGE AI."
            },
            {
              icon: <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-black mb-4 sm:mb-6" />,
              title: "SECURE",
              desc: "YOUR DOCS STAY YOURS. ENCRYPTED STORAGE. NO DATA MINING."
            },
            {
              icon: <Download className="w-8 h-8 sm:w-12 sm:h-12 text-black mb-4 sm:mb-6" />,
              title: "EXPORT CHATS",
              desc: "SAVE YOUR CONVERSATIONS. SHARE INSIGHTS WITH YOUR TEAM."
            },
            {
              icon: <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-black mb-4 sm:mb-6" />,
              title: "MULTIPLE PROJECTS",
              desc: "ORGANIZE YOUR WORK. KEEP TRACK OF DIFFERENT DOCUMENT SETS."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-4 sm:p-6 md:p-8 border-2 border-black hover:bg-yellow-300 transition-all"
            >
              {feature.icon}
              <h3 className="text-lg sm:text-xl font-bold text-black mb-2 sm:mb-4">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-black">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-500 py-12 sm:py-20 border-b-4 border-black">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-black mb-4 sm:mb-6 border-2 border-black bg-white px-4 py-2 inline-block">
            READY TO TRANSFORM YOUR PDFS?
          </h2>
          <p className="text-lg sm:text-xl text-black mb-6 sm:mb-8 max-w-2xl mx-auto">
            JOIN USERS WHO ARE ALREADY CHATTING WITH THEIR DOCUMENTS.
          </p>
          <Link
            to="/signup"
            className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 text-white text-sm sm:text-lg font-bold border-2 border-black rounded-none hover:bg-yellow-300 hover:text-black transition-all shadow-[4px_4px_0_0_#000] sm:shadow-[8px_8px_0_0_#000] hover:shadow-[5px_5px_0_0_#000] sm:hover:shadow-[10px_10px_0_0_#000]"
          >
            START FREE TRIAL
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-6 sm:py-12 border-t-4 border-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="text-lg sm:text-xl font-bold">ASKPDF</span>
            </div>
            <p className="text-sm sm:text-base text-white">
              BUILT WITH ☕ & ❤️ BY ASIF SHERIFF
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;