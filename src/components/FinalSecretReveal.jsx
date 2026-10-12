import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

const particleSymbols = ['♡', '✦', '✧', '♥', '⋆'];

function Cat({ tone, side, nuzzling, reducedMotion }) {
  const isCream = tone === 'cream';
  return <motion.svg className={`secret-cat cat-${side}`} viewBox="0 0 190 220" aria-hidden="true" animate={reducedMotion ? {} : (nuzzling ? { x: side === 'left' ? 11 : -7, rotate: side === 'left' ? 4 : -3, scale: [1, 1.04, .98, 1] } : { y: [0, -3, 0], rotate: side === 'left' ? [-1, 0, -1] : [1, 0, 1] })} transition={nuzzling ? { duration: .72, ease: [0.22, 1, 0.36, 1] } : { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: side === 'right' ? .2 : 0 }}>
    <path className="cat-tail" d={side === 'left' ? 'M47 173 C10 182 14 215 46 204' : 'M145 174 C181 178 179 211 148 204'} />
    <path className="cat-body" fill={isCream ? '#fff4df' : '#c98f73'} d="M45 119 C42 86 57 69 95 69 C133 69 148 88 145 122 L139 190 C128 210 62 210 51 190Z" />
    <path className="cat-ear" fill={isCream ? '#f3c8bf' : '#9d634f'} d="M48 72 C25 65 28 29 50 24 L76 63Z" />
    <path className="cat-ear" fill={isCream ? '#f3c8bf' : '#9d634f'} d="M113 62 L139 25 C161 30 163 65 139 73Z" />
    <path className="cat-head" fill={isCream ? '#fff9ed' : '#d4a184'} d="M42 61 C52 34 136 31 148 65 C160 99 143 135 96 139 C48 137 30 104 42 61Z" />
    <ellipse className="cat-blush" cx="57" cy="104" rx="15" ry="9" />
    <ellipse className="cat-blush" cx="133" cy="104" rx="15" ry="9" />
    <path className="cat-eye" d="M67 86 Q73 81 79 86" />
    <path className="cat-eye" d="M111 86 Q117 81 123 86" />
    <path className="cat-mouth" d={nuzzling && side === 'right' ? 'M91 101 Q98 111 105 101' : 'M89 101 Q95 105 101 101'} />
    <path className="cat-chest" fill={isCream ? '#f8dfc5' : '#b8755d'} d="M78 137 Q95 153 112 137 L119 190 Q96 203 72 190Z" />
    <path className="cat-paw" fill={isCream ? '#fff9ed' : '#d4a184'} d="M68 159 Q77 151 87 161 L84 193 Q72 199 64 188Z" />
  </motion.svg>;
}

function FinalSecretReveal({ open, data }) {
  const reducedMotion = useReducedMotion();
  const [clicks, setClicks] = useState(0);
  const [nuzzling, setNuzzling] = useState(false);
  const [burst, setBurst] = useState(0);
  const handleClick = () => {
    setClicks((value) => value + 1);
    setBurst((value) => value + 1);
    setNuzzling(true);
    window.setTimeout(() => setNuzzling(false), 760);
  };
  const particles = Array.from({ length: 12 }, (_, index) => ({ symbol: particleSymbols[(index + burst) % particleSymbols.length], index }));
  if (!open) return null;
  return <motion.section className="final-secret" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .78, ease: [0.22, 1, 0.36, 1] }} aria-live="polite">
      <div className="final-secret-paper">
        <div className="secret-doodle secret-doodle-left">✦</div><div className="secret-doodle secret-doodle-right">♡</div>
        <motion.div className="secret-copy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28, duration: .6 }}><p className="secret-eyebrow">a final little secret</p><h2>{data.title}</h2><p>{data.message}</p></motion.div>
        <motion.button className="cat-couple" onClick={handleClick} aria-label="Give the cat couple another kiss" initial={{ opacity: 0, scale: .72, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .38, type: 'spring', stiffness: 170, damping: 14 }}>
          <Cat tone="brown" side="left" nuzzling={nuzzling} reducedMotion={reducedMotion} /><Cat tone="cream" side="right" nuzzling={nuzzling} reducedMotion={reducedMotion} />
          <AnimatePresence>{nuzzling && <motion.span className="kiss-pop" initial={{ opacity: 0, scale: 0, y: 12 }} animate={{ opacity: 1, scale: 1, y: -8 }} exit={{ opacity: 0, scale: .5, y: -25 }} transition={{ duration: .45 }}><Heart size={26} fill="currentColor" /></motion.span>}</AnimatePresence>
          {particles.map(({ symbol, index }) => <motion.span key={`${burst}-${index}`} className="secret-particle" style={{ '--particle-x': `${(index % 2 ? 1 : -1) * (44 + index * 9)}px`, '--particle-y': `${-36 - (index % 4) * 28}px`, '--particle-r': `${(index % 2 ? 1 : -1) * (8 + index * 7)}deg` }} initial={{ opacity: 0, scale: .3, x: 0, y: 15 }} animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1, .9, .7], x: 'var(--particle-x)', y: 'var(--particle-y)', rotate: 'var(--particle-r)' }} transition={{ duration: 1.2, delay: index * .025 }} aria-hidden="true">{symbol}</motion.span>)}
        </motion.button>
        <div className="secret-footer"><Sparkles size={14} />{clicks > 4 ? data.afterClicks : 'tap them for a little extra love'}<Sparkles size={14} /></div>
      </div>
    </motion.section>;
}

export default FinalSecretReveal;
