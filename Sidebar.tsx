import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import HomeView from './views/Home';
import Archive from './views/Archive';
import CoffeeView from './views/Coffee';
import Account from './views/Account';
import Admin from './views/Admin';
import Login from './views/Login';
import { AnimatePresence, motion } from 'motion/react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const scrollTarget = useRef<string | null>(null);

  useEffect(() => {
    // If activeTab is home and we have a scrollTarget, scroll to it
    if (activeTab === 'home' && scrollTarget.current) {
      const element = document.getElementById(scrollTarget.current);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        scrollTarget.current = null;
      }
    }
  }, [activeTab]);

  const handleNav = (tab: string) => {
    if (tab === 'blog' || tab === 'reviews') {
      scrollTarget.current = tab === 'blog' ? 'blog-section' : 'reviews-section';
      setActiveTab('home');
    } else {
      setActiveTab(tab);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-beige flex flex-col items-center justify-center space-y-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-12 h-12 border-4 border-gold border-t-wine rounded-full"
        />
        <h1 className="font-serif italic text-wine text-2xl animate-pulse">YOU' MINDS</h1>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView setActiveTab={handleNav} />;
      case 'archive': return <Archive />;
      case 'coffee': return <CoffeeView />;
      case 'account': return user ? <Account /> : <Login />;
      case 'admin': return <Admin />;
      case 'login': return <Login />;
      default: return <HomeView setActiveTab={handleNav} />;
    }
  };

  return (
    <div className="flex bg-beige min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={handleNav} />
      
      <main className="flex-1 overflow-y-auto h-screen relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Wrap sections in Home for scrolling */}
            {activeTab === 'home' ? (
              <div className="space-y-0">
                <div id="home-section"><HomeView setActiveTab={handleNav} /></div>
                {/* Sections are inside HomeView, but we can hook into them with IDs */}
              </div>
            ) : renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
