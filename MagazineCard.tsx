import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    // Handle specific admin credentials
    const loginEmail = email === 'admin' ? 'admin@admin.com' : email;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, loginEmail, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, password);
        // Initialize user profile
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: loginEmail,
          library: [],
          totalDonations: 0,
        });
      }
    } catch (err: any) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  const handleReset = async () => {
    if (!email) return setError('Lütfen email adresinizi girin.');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Şifre sıfırlama maili gönderildi.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-wine/10">
        {/* Left Side: Editorial */}
        <div className="hidden lg:flex flex-col justify-between p-12 editorial-gradient relative text-beige overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1544924405-02382dd956f1?q=80&w=1974&auto=format&fit=crop" 
              alt="Background" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <h1 className="font-serif text-4xl italic mb-2">YOU' MINDS</h1>
            <p className="font-sans text-xs uppercase tracking-[0.2em] font-bold opacity-70">Digital Magazine</p>
          </div>
          
          <div className="relative z-10 max-w-sm">
            <blockquote className="font-body text-xl italic mb-8 leading-relaxed">
              "Curated for the intellectually curious, designed for the aesthetically conscious. Step into a world where every word carries weight."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-beige/30"></div>
              <span className="font-sans text-[10px] uppercase tracking-widest font-bold">Issue No. 42 • Autumn Resonance</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 lg:p-16 flex flex-col justify-center bg-beige">
          <div className="mb-10">
            <h2 className="font-serif text-3xl mb-2 text-wine">
              {isLogin ? 'Tekrar Hoşgeldin' : 'Kütüphanene Kaydol'}
            </h2>
            <p className="font-body text-gold">
              {isLogin ? 'Küratörlü arşivlerimizi okumaya devam etmek için giriş yapın.' : 'Aylık sayılarımıza ulaşmak için hesabınızı oluşturun.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-wine/60 tracking-wider">Email Adresi</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30" size={18} />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="isim@ornek.com veya 'admin'"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-wine/10 rounded-xl focus:border-wine outline-none transition-all placeholder:text-wine/20 text-wine"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase font-bold text-wine/60 tracking-wider">Şifre</label>
                {isLogin && (
                  <button type="button" onClick={handleReset} className="text-[10px] uppercase font-bold text-wine hover:underline">Unuttun mu?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-wine/10 rounded-xl focus:border-wine outline-none transition-all placeholder:text-wine/20 text-wine"
                  required
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
            {message && <p className="text-xs text-green-600 font-bold">{message}</p>}

            <button 
              type="submit"
              className="w-full editorial-gradient text-beige font-sans font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:shadow-xl active:scale-[0.98] transition-all"
            >
              {isLogin ? 'Kütüphaneye Gir' : 'Hemen Başla'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full h-px bg-wine/10"></div>
              <span className="absolute px-4 bg-beige text-[10px] uppercase font-bold text-wine/30 tracking-widest italic">Veya Şununla Devam Et</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 border border-wine/10 rounded-xl hover:bg-wine/5 transition-all font-sans font-bold text-sm text-wine">
                <Github size={20} />
                Github ile Bağlan
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm font-body text-wine/60">
            {isLogin ? "YOU' MINDS'ta yeni misin?" : 'Zaten bir hesabın var mı?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold text-wine hover:underline cursor-pointer"
            >
              {isLogin ? 'Hesap Oluştur' : 'Giriş Yap'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
