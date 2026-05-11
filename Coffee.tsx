import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Quote, ArrowRight, Star } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch latest blogs
      const blogSnap = await getDocs(query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(3)));
      setBlogs(blogSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch latest approved reviews
      const reviewSnap = await getDocs(query(collection(db, 'reviews'), where('approved', '==', true), orderBy('createdAt', 'desc'), limit(3)));
      setReviews(reviewSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-24">
      {/* Hero Section / Mission */}
      <section className="relative py-20 bg-wine text-beige rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2000&auto=format&fit=crop" alt="Hero" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 px-12 lg:px-24 text-center space-y-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="font-serif text-5xl lg:text-7xl italic leading-tight mb-6">Misyonumuz</h2>
            <p className="font-body text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Zihni besleyen, estetiği onurlandıran ve derinlemesine okuma deneyimi sunan bir platform inşa etmek. 
              YOU' MINDS, sadece bir dergi değil; entelektüel bir topluluğun ortak sesidir.
            </p>
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('archive')}
            className="px-10 py-5 bg-beige text-wine font-sans font-bold uppercase tracking-widest text-sm rounded-full shadow-lg"
          >
            Arşivi Keşfet
          </motion.button>
        </div>
      </section>

      {/* Blog Snippets */}
      <section id="blog-section" className="space-y-12">
        <div className="flex justify-between items-end border-b border-wine/10 pb-6">
          <div>
            <h3 className="font-serif text-4xl italic text-wine">Editörün Seçtikleri</h3>
            <p className="font-body text-gold">Dergi dünyasından en son haberler ve makaleler.</p>
          </div>
          <button onClick={() => setActiveTab('blog')} className="flex items-center gap-2 font-sans font-bold text-sm text-wine hover:underline">
            Tümünü Gör <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.length > 0 ? blogs.map((blog, idx) => (
            <motion.div 
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-md border border-wine/5">
                <img src={blog.imageUrl || "https://images.unsplash.com/photo-1544924405-02382dd956f1?q=80&w=600&auto=format&fit=crop"} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h4 className="font-serif text-2xl text-wine mb-2 group-hover:text-gold transition-colors">{blog.title}</h4>
              <p className="font-body text-sm text-wine/60 line-clamp-3 mb-4">{blog.content.substring(0, 150)}...</p>
              <span className="text-[10px] uppercase font-bold text-gold tracking-widest">
                {new Date(blog.createdAt?.seconds * 1000).toLocaleDateString('tr-TR')}
              </span>
            </motion.div>
          )) : (
            <div className="col-span-full py-12 text-center text-wine/40 italic">Henüz blog yazısı bulunmamaktadır.</div>
          )}
        </div>
      </section>

      {/* Review Snippets */}
      <section id="reviews-section" className="bg-wine/5 rounded-3xl p-12 lg:p-20 space-y-12">
        <div className="text-center space-y-4">
          <h3 className="font-serif text-4xl italic text-wine">Okur Yorumları</h3>
          <p className="font-body text-gold">Topluluğumuzun sayılarımız hakkındaki düşünceleri.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.length > 0 ? reviews.map((review, idx) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-wine/5 relative"
            >
              <Quote className="absolute top-4 right-4 text-wine/5" size={40} />
              <div className="flex items-center gap-1 text-gold mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="font-body italic text-wine/80 mb-6 line-clamp-4">"{review.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-wine text-beige flex items-center justify-center font-bold text-sm">
                  {review.userName[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-sans font-bold text-xs text-wine">{review.userName}</p>
                  <p className="text-[10px] uppercase tracking-tighter text-gold">Okur</p>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-12 text-center text-wine/40 italic">Henüz onaylanmış yorum bulunmamaktadır.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
