import React from 'react';
import { Heart, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

interface MagazineCardProps {
  magazine: any;
  onOpen: (mag: any) => void;
}

const MagazineCard: React.FC<MagazineCardProps> = ({ magazine, onOpen }) => {
  const { user, profile } = useAuth();
  const isInLibrary = profile?.library?.includes(magazine.id);

  const toggleLibrary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, {
        library: isInLibrary ? arrayRemove(magazine.id) : arrayUnion(magazine.id)
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-wine/5 cursor-pointer"
      onClick={() => onOpen(magazine)}
    >
      {/* Cover Image */}
      <div className="aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
        <img 
          src={magazine.coverUrl} 
          alt={magazine.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
        />
      </div>

      {/* Overlay Actions */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
        <button 
          onClick={toggleLibrary}
          className={cn(
            "p-3 rounded-full shadow-lg backdrop-blur-md transition-all active:scale-90",
            isInLibrary ? "bg-wine text-beige" : "bg-beige/80 text-wine hover:bg-beige"
          )}
        >
          <Heart size={20} fill={isInLibrary ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Info Container */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-xl italic text-wine">{magazine.title}</h3>
          <span className="text-[10px] font-bold font-sans uppercase tracking-[0.2em] text-gold pt-1">
            Sayi {magazine.issueNumber}
          </span>
        </div>
        
        <p className="font-body text-sm text-wine/60 line-clamp-2 italic">
          {magazine.description}
        </p>

        <div className="pt-4 flex items-center justify-between border-t border-wine/5">
          <button className="flex items-center gap-2 font-sans font-bold text-[10px] uppercase tracking-widest text-wine hover:text-gold transition-colors">
            <BookOpen size={14} />
            Okumaya Başla
          </button>
          <span className="text-[10px] font-medium text-wine/30">
            {new Date(magazine.createdAt?.seconds * 1000).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MagazineCard;
