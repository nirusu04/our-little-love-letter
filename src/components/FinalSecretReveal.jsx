import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Heart, Sparkles, X } from 'lucide-react';

const particleTypes = ['kiss', 'heart', 'star', 'sparkle'];
const particleColors = ['#9e3445', '#c9787e', '#d6a85f', '#f8eedb'];

function Cat({ tone, side, phase, reducedMotion }) {
  const isBrown = tone === 'brown';
  const headMotion = reducedMotion ? {} : phase === 'anticipate'
    ? { x: isBrown ? -5 : 0, y: isBrown ? -3 : 0, rotate: isBrown ? -4 : 0 }
    : phase === 'kiss'
      ? { x: isBrown ? 22 : -3, y: isBrown ? 13 : 3, rotate: isBrown ? 7 : -3, scale: isBrown ? .98 : 1.02 }
      : { x: 0, y: [0, -2, 0], rotate: isBrown ? [-1, 0, -1] : [1, 0, 1] };
  const headTransition = phase === 'anticipate' ? { duration: .15, ease: [0.22, 1, 0.36, 1] } : phase === 'kiss' ? { duration: .3, ease: [0.22, 1, 0.36, 1] } : { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: isBrown ? 0 : .12 };
  return <motion.svg className={`secret-cat cat-${side}`} viewBox="0 0 190 220" aria-hidden="true" animate={reducedMotion ? {} : { y: [0, -2, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: isBrown ? 0 : .12 }}>
    <path className="cat-tail" d={side === 'left' ? 'M47 173 C10 182 14 215 46 204' : 'M145 174 C181 178 179 211 148 204'} />
    <path className="cat-body" fill={isBrown ? '#c98f73' : '#fff4df'} d="M45 119 C42 86 57 69 95 69 C133 69 148 88 145 122 L139 190 C128 210 62 210 51 190Z" />
    <path className="cat-ear" fill={isBrown ? '#9d634f' : '#f3c8bf'} d="M48 72 C25 65 28 29 50 24 L76 63Z" />
    <path className="cat-ear" fill={isBrown ? '#9d634f' : '#f3c8bf'} d="M113 62 L139 25 C161 30 163 65 139 73Z" />
    <motion.g className="cat-head-group" animate={headMotion} transition={headTransition}>
      <path className="cat-head" fill={isBrown ? '#d4a184' : '#fff9ed'} d="M42 61 C52 34 136 31 148 65 C160 99 143 135 96 139 C48 137 30 104 42 61Z" />
      <motion.ellipse className="cat-blush" cx="57" cy="104" rx="15" ry="9" animate={phase === 'kiss' ? { opacity: .95, scale: 1.18 } : { opacity: .6, scale: 1 }} transition={{ duration: .25 }} />
      <motion.ellipse className="cat-blush" cx="133" cy="104" rx="15" ry="9" animate={phase === 'kiss' ? { opacity: .95, scale: 1.18 } : { opacity: .6, scale: 1 }} transition={{ duration: .25 }} />
      <path className="cat-eye" d={phase === 'kiss' && !isBrown ? 'M67 88 Q73 94 79 88' : 'M67 86 Q73 81 79 86'} />
      <path className="cat-eye" d={phase === 'kiss' && !isBrown ? 'M111 88 Q117 94 123 88' : 'M111 86 Q117 81 123 86'} />
      <path className="cat-mouth" d={phase === 'kiss' && isBrown ? 'M89 101 Q95 108 101 101' : 'M89 101 Q95 105 101 101'} />
    </motion.g>
    <path className="cat-chest" fill={isBrown ? '#b8755d' : '#f8dfc5'} d="M78 137 Q95 153 112 137 L119 190 Q96 203 72 190Z" />
    <path className="cat-paw" fill={isBrown ? '#d4a184' : '#fff9ed'} d="M68 159 Q77 151 87 161 L84 193 Q72 199 64 188Z" />
  </motion.svg>;
}

function LoveParticles({ particles, onComplete }) {
  return <div className="love-particle-layer" aria-hidden="true">{particles.map((particle) => <motion.span key={particle.id} className={`love-particle love-particle-${particle.type}`} style={{ left: `${particle.originX}%`, top: `${particle.originY}%`, color: particle.color, '--travel-x': `${particle.travelX}px`, '--travel-y': `${particle.travelY}px`, '--particle-rotate': `${particle.rotate}deg` }} initial={{ opacity: 0, scale: .2, x: 0, y: 0, rotate: 0 }} animate={{ opacity: [0, 1, 1, 0], scale: particle.type === 'sparkle' ? [0, 1.25, 0] : [.2, 1, .8], x: 'var(--travel-x)', y: 'var(--travel-y)', rotate: 'var(--particle-rotate)' }} transition={{ duration: particle.duration, delay: particle.delay, ease: 'easeOut' }} onAnimationComplete={() => onComplete(particle.id)}>{particle.type === 'kiss' ? '💋' : particle.type === 'heart' ? '♡' : particle.type === 'star' ? '✦' : '✧'}</motion.span>)}</div>;
}

function FinalSecretReveal({ open, data, onClose }) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState('rest');
  const [particles, setParticles] = useState([]);
  const timerRef = useRef([]);
  const createBurst = () => Array.from({ length: 32 }, (_, index) => ({ id: `${Date.now()}-${index}`, type: particleTypes[index % particleTypes.length], color: particleColors[index % particleColors.length], originX: 50 + (Math.random() - .5) * 9, originY: 49 + (Math.random() - .5) * 8, travelX: (Math.random() - .5) * 86 + (index % 2 ? 20 : -20), travelY: -70 - Math.random() * 42, rotate: (Math.random() - .5) * 90, duration: .95 + Math.random() * .55, delay: Math.random() * .12 }));
  const triggerLoveBurst = () => {
    if (phase !== 'rest') return;
    setPhase('anticipate');
    timerRef.current.forEach((timer) => window.clearTimeout(timer));
    timerRef.current = [window.setTimeout(() => setPhase('kiss'), 170), window.setTimeout(() => { setPhase('kiss'); setParticles((current) => [...current, ...createBurst()].slice(-64)); }, 470), window.setTimeout(() => setPhase('settle'), 790), window.setTimeout(() => setPhase('rest'), 1250)];
  };
  const removeParticle = (id) => setParticles((current) => current.filter((particle) => particle.id !== id));
  useEffect(() => () => timerRef.current.forEach((timer) => window.clearTimeout(timer)), []);
  if (!open) return null;
  return createPortal(<motion.section className="final-secret-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-live="polite">
    <LoveParticles particles={particles} onComplete={removeParticle} />
    <motion.div className="final-secret" initial={{ opacity: 0, scale: .94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .08, duration: .7, ease: [0.22, 1, 0.36, 1] }}>
      <button type="button" className="secret-close" onClick={onClose} aria-label="Close the final surprise"><X size={18} /></button>
      <div className="final-secret-paper">
        <div className="secret-doodle secret-doodle-left">✦</div><div className="secret-doodle secret-doodle-right">♡</div>
        <div className="secret-copy"><p className="secret-eyebrow">a final little secret</p><h2>{data.title}</h2><p>{data.message}</p></div>
        <motion.button type="button" className={`cat-couple cat-phase-${phase}`} onClick={triggerLoveBurst} aria-label="Give the cat couple a forehead kiss" whileHover={{ y: -2, scale: 1.015 }} whileTap={{ scale: .985 }}>
          <Cat tone="brown" side="left" phase={phase} reducedMotion={reducedMotion} /><Cat tone="cream" side="right" phase={phase} reducedMotion={reducedMotion} />
          <AnimatePresence>{phase === 'kiss' && <motion.span className="kiss-pop" initial={{ opacity: 0, scale: 0, y: 10 }} animate={{ opacity: 1, scale: 1, y: -12 }} exit={{ opacity: 0, scale: .5, y: -25 }} transition={{ duration: .3 }}><Heart size={27} fill="currentColor" /></motion.span>}</AnimatePresence>
        </motion.button>
        <div className="secret-footer"><Sparkles size={14} />{phase === 'kiss' ? 'mwah ♡' : 'tap them for a little extra love'}<Sparkles size={14} /></div>
      </div>
    </motion.div>
  </motion.section>, document.body);
}

export default FinalSecretReveal;
