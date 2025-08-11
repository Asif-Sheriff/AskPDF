import React from 'react';
// import { Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // const [isDark, setIsDark] = useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    // setIsDark(useDark);
    document.documentElement.classList.toggle('dark', useDark);
  }, []);

  // const toggleTheme = () => {
  //   const newTheme = !isDark;
  //   setIsDark(newTheme);
  //   localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  //   document.documentElement.classList.toggle('dark', newTheme);
  // };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button> */}
      {children}
    </div>
  );
};

export default Layout;