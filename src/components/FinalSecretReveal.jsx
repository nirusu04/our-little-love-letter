import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, X } from 'lucide-react';

const particleTypes = ['kiss', 'heart', 'star', 'sparkle'];
const particleColors = ['#9e3445', '#c9787e', '#d6a85f', '#f8eedb'];

function LoveParticles({ particles, onComplete }) {
  return <div className="love-particle-layer" aria-hidden="true">{particles.map((particle) => <motion.span key={particle.id} className={`love-particle love-particle-${particle.type}`} style={{ left: `${particle.originX}%`, top: `${particle.originY}%`, color: particle.color, '--travel-x': `${particle.travelX}px`, '--travel-y': `${particle.travelY}px`, '--particle-rotate': `${particle.rotate}deg` }} initial={{ opacity: 0, scale: .2, x: 0, y: 0, rotate: 0 }} animate={{ opacity: [0, 1, 1, 0], scale: particle.type === 'sparkle' ? [0, 1.25, 0] : [.2, 1, .8], x: 'var(--travel-x)', y: 'var(--travel-y)', rotate: 'var(--particle-rotate)' }} transition={{ duration: particle.duration, delay: particle.delay, ease: 'easeOut' }} onAnimationComplete={() => onComplete(particle.id)}>{particle.type === 'kiss' ? '💋' : particle.type === 'heart' ? '♡' : particle.type === 'star' ? '✦' : '✧'}</motion.span>)}</div>;
}

function FinalSecretReveal({ open, data, onClose }) {
  const [particles, setParticles] = useState([]);
  const [clicks, setClicks] = useState(0);
  const createBurst = () => Array.from({ length: 32 }, (_, index) => ({ id: `${Date.now()}-${index}`, type: particleTypes[index % particleTypes.length], color: particleColors[index % particleColors.length], originX: 50 + (Math.random() - .5) * 9, originY: 49 + (Math.random() - .5) * 8, travelX: (Math.random() - .5) * 86 + (index % 2 ? 20 : -20), travelY: -70 - Math.random() * 42, rotate: (Math.random() - .5) * 90, duration: .95 + Math.random() * .55, delay: Math.random() * .12 }));
  const triggerLoveBurst = () => { setClicks((value) => value + 1); setParticles(createBurst()); };
  const removeParticle = (id) => setParticles((current) => current.filter((particle) => particle.id !== id));
  useEffect(() => () => setParticles([]), []);
  if (!open) return null;
  return createPortal(<motion.section className="final-secret-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-live="polite">
    <LoveParticles particles={particles} onComplete={removeParticle} />
    <motion.div className="final-secret" initial={{ opacity: 0, scale: .94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .08, duration: .7, ease: [0.22, 1, 0.36, 1] }}>
      <button type="button" className="secret-close" onClick={onClose} aria-label="Close the final surprise"><X size={18} /></button>
      <div className="final-secret-paper">
        <div className="secret-doodle secret-doodle-left">✦</div><div className="secret-doodle secret-doodle-right">♡</div>
        <div className="secret-copy"><p className="secret-eyebrow">a final little secret</p><h2>{data.title}</h2><p>{data.message}</p></div>
        <motion.button type="button" className="cat-couple" onClick={triggerLoveBurst} aria-label="Send love with the cat couple" whileHover={{ y: -2, scale: 1.015 }} whileTap={{ scale: .985 }}>
          <img className="cat-couple-image" src="/photos/cat-couple-transparent.png" alt="A brown cat cuddling and kissing a cream cat" />
          <motion.span className="photo-kiss" key={clicks} initial={{ opacity: 0, scale: 0, y: 8 }} animate={{ opacity: clicks ? 1 : 0, scale: clicks ? 1 : 0, y: -15 }} transition={{ duration: .35 }}><Heart size={25} fill="currentColor" /></motion.span>
        </motion.button>
        <div className="secret-footer"><Sparkles size={14} />{clicks > 4 ? data.afterClicks : 'tap them for a little extra love'}<Sparkles size={14} /></div>
      </div>
    </motion.div>
  </motion.section>, document.body);
}

export default FinalSecretReveal;
