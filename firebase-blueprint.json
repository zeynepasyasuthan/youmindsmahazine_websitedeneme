import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MagazineCard from '../components/MagazineCard';
import MagazineReader from '../components/MagazineReader';
import { AnimatePresence } from 'motion/react';
import { Heart, MessageSquare, Coffee } from 'lucide-react';

const Account: React.FC = () => {
  const { user, profile } = useAuth();
  const [libraryMags, setLibraryMags] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [selectedMag, setSelectedMag] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch library mags
        if (profile?.library?.length > 0) {
          const mags: any[] = [];
          for (const id of profile.library) {
            const magSnap = await getDoc(doc(db, 'magazines', id));
            if (magSnap.exists()) mags.push({ id: magSnap.id, ...magSnap.data() });
          }
          setLibraryMags(mags);
        }

        // Fetch my reviews
        const q = query(collection(db, 'reviews'), where('userId', '==', user.uid));
        const reviewSnap = await getDocs(q);
        setMyReviews(reviewSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, profile]);

  if (!user) return <div className="p-12 text-center italic text-wine/40">Lütfen giriş yapın.</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-16">
      {/* Profile Header */}
      <div className="bg-wine text-beige rounded-3xl p-12 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="space-y-4 text-center md:text-left z-10">
          <h2 className="font-serif text-5xl italic">Merhaba, {user.displayName || user.email?.split('@')[0]}</h2>
          <p className="font-body text-xl opacity-70 italic max-w-lg">Kütüphanenizi yönetin ve topluluk etkileşimlerinizi görün.</p>
        </div>
        <div className="flex gap-4 z-10">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center min-w-[120px]">
            <span className="block text-3xl font-serif mb-1">${profile?.totalDonations || 0}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Toplam Bağış</span>
          </div>
        </div>
      </div>

      {/* Tabs / Content Sections */}
      <div className="space-y-12">
        {/* Library Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-wine/10 pb-4">
            <Heart className="text-wine" size={24} />
            <h3 className="font-serif text-3xl italic text-wine">Kütüphanem</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {libraryMags.length > 0 ? libraryMags.map((mag) => (
              <MagazineCard key={mag.id} magazine={mag} onOpen={m => setSelectedMag(m)} />
            )) : (
              <div className="col-span-full py-12 text-center text-wine/30 italic italic">Kütüphanenizde henüz sayı bulunmamaktadır.</div>
            )}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-wine/10 pb-4">
            <MessageSquare className="text-wine" size={24} />
            <h3 className="font-serif text-3xl italic text-wine">Yorumlarım</h3>
          </div>
          <div className="space-y-4">
            {myReviews.length > 0 ? myReviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-wine/5 flex justify-between items-start">
                <div className="space-y-2">
                  <p className="font-body text-wine/80 italic">"{review.comment}"</p>
                  <p className="text-[10px] uppercase font-bold text-gold tracking-widest mt-2 flex items-center gap-2">
                    <span className={review.approved ? "text-green-600" : "text-yellow-600"}>
                      ● {review.approved ? 'YAYINDA' : 'ONAY BEKLİYOR'}
                    </span>
                    <span>•</span>
                    <span>{new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center text-wine/30 italic italic">Henüz yorum yapmadınız.</div>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedMag && (
          <MagazineReader 
            magazine={selectedMag} 
            onClose={() => setSelectedMag(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Account;
