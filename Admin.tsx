import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  magazineId: string;
}

const ReviewPopup: React.FC<ReviewPopupProps> = ({ isOpen, onClose, magazineId }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!magazineId) return;

    // Listen for approved reviews
    const q = query(
      collection(db, 'reviews'),
      where('magazineId', '==', magazineId),
      where('approved', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [magazineId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        magazineId,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Okur',
        comment: comment.trim(),
        approved: false, // Needs admin approval
        createdAt: serverTimestamp(),
      });
      setComment('');
      alert('Yorumunuz gönderildi, onaylandıktan sonra görünecektir.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          className="fixed bottom-28 right-8 w-96 max-h-[60vh] bg-beige rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-wine/10 z-[120]"
        >
          {/* Header */}
          <div className="p-4 border-b border-wine/10 flex justify-between items-center bg-wine text-beige">
            <h3 className="font-serif italic text-lg">Yorumlar</h3>
            <button onClick={onClose} className="p-1 hover:bg-beige/10 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {reviews.length > 0 ? reviews.map((review) => (
              <div key={review.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-sans font-bold text-[10px] text-wine uppercase tracking-widest">{review.userName}</span>
                  <span className="text-[8px] text-wine/40">
                    {review.createdAt?.seconds ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() : 'Az önce'}
                  </span>
                </div>
                <p className="font-body text-sm text-wine/80 bg-white p-3 rounded-xl border border-wine/5 italic">
                  {review.comment}
                </p>
              </div>
            )) : (
              <div className="py-12 text-center text-wine/30 italic text-sm">
                İlk yorumu siz yapın. (Yorumlar onaylandıktan sonra görünür)
              </div>
            )}
          </div>

          {/* Footer - Form */}
          <div className="p-4 border-t border-wine/10 bg-white">
            {user ? (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Yorumunuzu yazın..."
                  className="flex-1 bg-beige border border-wine/10 rounded-full px-4 py-2 text-sm outline-none focus:border-wine transition-all"
                  disabled={loading}
                />
                <button 
                  type="submit"
                  disabled={loading || !comment.trim()}
                  className="p-2 bg-wine text-beige rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-wine/40 py-2">
                <Lock size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">Yorum yazmak için giriş yapın</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewPopup;
