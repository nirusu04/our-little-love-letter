import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, X } from 'lucide-react';

const framePaths = [
  '/photos/resting%20cuddle.png',
  '/photos/beginning%20to%20lean.png',
  '/photos/forehead%20kiss%20contact.png',
  '/photos/delighted%20reaction.png',
  '/photos/settle%20back.png',
];
const particleTypes = ['kiss', 'heart', 'star', 'sparkle'];
const particleColors = ['#9e3445', '#c9787e', '#d6a85f', '#f8eedb'];
const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

function LoveParticles({ particles, onComplete }) {
  return <div className="love-particle-layer" aria-hidden="true">{particles.map((particle) => <motion.span key={particle.id} className={`love-particle love-particle-${particle.type}`} style={{ left: `${particle.originX}%`, top: `${particle.originY}%`, color: particle.color, '--travel-x': `${particle.travelX}px`, '--travel-y': `${particle.travelY}px`, '--particle-rotate': `${particle.rotate}deg` }} initial={{ opacity: 0, scale: .2, x: 0, y: 0, rotate: 0 }} animate={{ opacity: [0, 1, 1, 0], scale: particle.type === 'sparkle' ? [0, 1.25, 0] : [.2, 1, .8], x: 'var(--travel-x)', y: 'var(--travel-y)', rotate: 'var(--particle-rotate)' }} transition={{ duration: particle.duration, delay: particle.delay, ease: 'easeOut' }} onAnimationComplete={() => onComplete(particle.id)}>{particle.type === 'kiss' ? '💋' : particle.type === 'heart' ? '♡' : particle.type === 'star' ? '✦' : '✧'}</motion.span>)}</div>;
}

function FinalSecretReveal({ open, data, onClose }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isKissing, setIsKissing] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [particles, setParticles] = useState([]);
  const timers = useRef([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const preload = framePaths.map((src) => new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = src;
    }));
    Promise.all(preload).then((results) => { if (mounted.current && results.every(Boolean)) setImagesReady(true); });
    return () => { mounted.current = false; timers.current.forEach((timer) => window.clearTimeout(timer)); };
  }, []);

  const createBurst = () => Array.from({ length: 32 }, (_, index) => ({ id: `${Date.now()}-${index}`, type: particleTypes[index % particleTypes.length], color: particleColors[index % particleColors.length], originX: 50 + (Math.random() - .5) * 9, originY: 45 + (Math.random() - .5) * 8, travelX: (Math.random() - .5) * 86 + (index % 2 ? 20 : -20), travelY: -70 - Math.random() * 42, rotate: (Math.random() - .5) * 90, duration: .95 + Math.random() * .55, delay: Math.random() * .12 }));
  const triggerLoveBurst = async () => {
    if (!imagesReady || isKissing) return;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    setIsKissing(true);
    setFrameIndex(1);
    await wait(120);
    if (!mounted.current) return;
    setFrameIndex(2);
    setParticles(createBurst());
    await wait(260);
    if (!mounted.current) return;
    setFrameIndex(3);
    await wait(180);
    if (!mounted.current) return;
    setFrameIndex(4);
    await wait(200);
    if (!mounted.current) return;
    setFrameIndex(0);
    setIsKissing(false);
  };
  const removeParticle = (id) => setParticles((current) => current.filter((particle) => particle.id !== id));
  if (!open) return null;
  return createPortal(<motion.section className="final-secret-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-live="polite">
    <LoveParticles particles={particles} onComplete={removeParticle} />
    <motion.div className="final-secret" initial={{ opacity: 0, scale: .94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .08, duration: .7, ease: [0.22, 1, 0.36, 1] }}>
      <button type="button" className="secret-close" onClick={onClose} aria-label="Close the final surprise"><X size={18} /></button>
      <div className="final-secret-paper">
        <div className="secret-doodle secret-doodle-left">✦</div><div className="secret-doodle secret-doodle-right">♡</div>
        <div className="secret-copy"><p className="secret-eyebrow">a final little secret</p><h2>{data.title}</h2><p>{data.message}</p></div>
        <motion.button type="button" className={`cat-couple ${isKissing ? 'is-kissing' : ''}`} onClick={triggerLoveBurst} disabled={!imagesReady || isKissing} aria-label="Give the cat couple a forehead kiss" whileHover={!isKissing ? { y: -2, scale: 1.015 } : {}} whileTap={!isKissing ? { scale: .985 } : {}}>
          <img className="cat-couple-image" src={framePaths[frameIndex]} alt="Cat couple animation frame" />
        </motion.button>
        <div className="secret-footer"><Sparkles size={14} />{!imagesReady ? 'preparing a little extra love...' : isKissing ? 'mwah ♡' : 'tap them for a little extra love'}<Sparkles size={14} /></div>
      </div>
    </motion.div>
  </motion.section>, document.body);
}

export default FinalSecretReveal;
