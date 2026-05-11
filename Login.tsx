import React from 'react';
import { Home, Library, BookOpen, MessageSquare, Coffee, User, Settings, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAdmin } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'archive', label: 'Dergi Arşivi', icon: Library },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'coffee', label: 'Buy us a Coffee', icon: Coffee },
  ];

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen bg-beige border-r border-wine/10 flex flex-col p-6 sticky top-0"
    >
      <div className="mb-12">
        <h1 className="font-serif text-2xl italic text-wine">YOU' MINDS</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-sans font-bold">Digital Magazine</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "sidebar-item w-full",
              activeTab === item.id && "active"
            )}
          >
            <item.icon size={20} />
            <span className="font-sans font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 space-y-2">
        {user ? (
          <>
            <button
              onClick={() => setActiveTab('account')}
              className={cn(
                "sidebar-item w-full",
                activeTab === 'account' && "active"
              )}
            >
              <User size={20} />
              <span className="font-sans font-medium text-sm">Hesabım</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={cn(
                  "sidebar-item w-full text-gold hover:bg-gold/10",
                  activeTab === 'admin' && "active !bg-gold !text-beige"
                )}
              >
                <Settings size={20} />
                <span className="font-sans font-medium text-sm">Admin Panel</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="sidebar-item w-full text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              <span className="font-sans font-medium text-sm">Çıkış Yap</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab('login')}
            className={cn(
              "sidebar-item w-full",
              activeTab === 'login' && "active"
            )}
          >
            <User size={20} />
            <span className="font-sans font-medium text-sm">Giriş Yap</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
