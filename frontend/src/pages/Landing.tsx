import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle, Upload, Zap, Shield, Download } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">AskPDF</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Chat with Your
          <span className="text-red-600 block">PDF Documents</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Transform your PDF documents into interactive conversations. Upload any PDF and get instant answers, summaries, and insights through natural language queries.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link
            to="/signup"
            className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 border-2 border-red-600 text-red-600 dark:text-red-400 text-lg font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all"
          >
            Try Demo
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Why Choose AskPDF?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <Upload className="w-12 h-12 text-red-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Easy Upload
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Simply drag and drop your PDF documents. Support for all PDF formats with instant processing.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <MessageCircle className="w-12 h-12 text-red-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Natural Conversations
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ask questions in natural language and get intelligent responses with source citations.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <Zap className="w-12 h-12 text-red-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Lightning Fast
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get instant responses powered by advanced AI with real-time search capabilities.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <Shield className="w-12 h-12 text-red-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Secure & Private
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your documents are encrypted and stored securely. Complete privacy guaranteed.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <Download className="w-12 h-12 text-red-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Export Chats
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Export your chat transcripts and insights for future reference and sharing.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <FileText className="w-12 h-12 text-red-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Multiple Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Organize multiple PDFs into projects with persistent chat history.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your PDFs?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already having intelligent conversations with their documents.
          </p>
          <Link
            to="/signup"
            className="px-8 py-4 bg-white text-red-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-red-600" />
              <span className="text-xl font-bold">AskPDF</span>
            </div>
            <p className="text-gray-400">
              © 2025 AskPDF. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;