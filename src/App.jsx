import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Heart, Music2, Pause, Play, Sparkles, X } from 'lucide-react';
import { loveStory } from './data/loveStory';
import FinalSecretReveal from './components/FinalSecretReveal';

const sceneNames = ['Envelope', 'Intro', 'Letter', 'Memories', 'Things I love', 'Kisses', 'Coupons', 'Our song'];
const sceneMotion = { initial: { opacity: 0, y: 18, rotate: 0.7, scale: 0.99 }, animate: { opacity: 1, y: 0, rotate: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }, exit: { opacity: 0, y: -14, rotate: -0.5, scale: 0.995, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };
const pageVariants = {
  initial: (direction) => ({ opacity: 0, y: direction > 0 ? 34 : -34, rotate: direction > 0 ? 0.7 : -0.7, scale: 0.985, clipPath: direction > 0 ? 'inset(7% 0 0 round 12px)' : 'inset(0 0 7% round 12px)' }),
  animate: { opacity: 1, y: 0, rotate: 0, scale: 1, clipPath: 'inset(0% 0 0 round 0px)', transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] } },
  exit: (direction) => ({ opacity: 0, y: direction > 0 ? -30 : 30, rotate: direction > 0 ? -0.5 : 0.5, scale: 0.99, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } }),
};

function Paper({ children, className = '', ...props }) { return <motion.div className={`paper ${className}`} {...props}>{children}</motion.div>; }
function Tape() { return <span className="tape" aria-hidden="true" />; }
function HeartBurst({ burst }) { return burst ? <div className="heart-burst" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <Heart key={i} size={12 + (i % 3) * 4} style={{ '--i': i }} fill="currentColor" />)}</div> : null; }

function getTransitionKind(from, to) {
  if ((from === 1 && to === 2) || (from === 2 && to === 1)) return 'paper';
  if ((from === 2 && to === 3) || (from === 3 && to === 2)) return 'photo';
  if ((from === 3 && to === 4) || (from === 4 && to === 3)) return 'paper';
  if ((from === 4 && to === 5) || (from === 5 && to === 4)) return 'heart';
  if ((from === 5 && to === 6) || (from === 6 && to === 5)) return 'ticket';
  if ((from === 6 && to === 7) || (from === 7 && to === 6)) return 'record';
  if ((from === 7 && to === 8) || (from === 8 && to === 7)) return 'sparkle';
  return null;
}

function TransitionBridge({ kind }) {
  if (!kind) return null;
  return <motion.div className={`transition-bridge bridge-${kind}`} initial={{ opacity: 0, scale: .7, y: 24, rotate: -4 }} animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, scale: 1.18, y: -24, rotate: 4 }} transition={{ duration: .68, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true">
    {kind === 'paper' && <span className="bridge-paper-mark">♡</span>}
    {kind === 'photo' && <img src={loveStory.photos[0].src} alt="" />}
    {kind === 'heart' && <Heart fill="currentColor" size={72} />}
    {kind === 'ticket' && <span className="bridge-ticket-mark">LOVE TICKET<br /><b>♡</b></span>}
    {kind === 'record' && <span className="bridge-record-mark"><Music2 size={24} /></span>}
    {kind === 'sparkle' && <Sparkles size={72} />}
  </motion.div>;
}

function EnvelopeScene({ onOpen }) {
  const [pressed, setPressed] = useState(false);
  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--pointer-x', `${x * 4}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${y * 4}px`);
  };
  return <motion.section className="scene envelope-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="letter-desk" onPointerMove={handlePointerMove} onPointerLeave={(event) => { event.currentTarget.style.setProperty('--pointer-x', '0px'); event.currentTarget.style.setProperty('--pointer-y', '0px'); }}>
      <div className="desk-doodle doodle-star doodle-star-one">✦</div>
      <div className="desk-doodle doodle-star doodle-star-two">✧</div>
      <div className="desk-doodle doodle-heart doodle-heart-one">♡</div>
      <div className="desk-doodle doodle-heart doodle-heart-two">♡</div>
      <div className="dried-flower" aria-hidden="true"><span /><i /><b /><em /></div>
      <motion.div className="loose-ribbon" animate={{ rotate: [-5, -3, -5], x: [0, 2, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="mini-polaroid" initial={{ opacity: 0, y: 18, rotate: -12 }} animate={{ opacity: 1, y: 0, rotate: -12 }} transition={{ delay: 0.35, duration: 0.8 }}><div>♡</div><span>a day worth keeping</span></motion.div>
      <motion.div className="letter-stage" initial={{ opacity: 0, y: 70, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 80, damping: 15 }}>
        <div className={`love-envelope ${pressed ? 'is-opening' : ''}`}>
          <motion.div layoutId="love-letter-paper" className="letter-sheet"><span>for my favorite person</span><i>♡</i></motion.div>
          <div className="envelope-back" />
          <div className="envelope-pocket" />
          <div className="envelope-fold fold-left" />
          <div className="envelope-fold fold-right" />
          <div className="envelope-address"><strong>for {loveStory.nickname} <Heart size={18} fill="currentColor" /></strong><span>open when you're ready</span></div>
          <div className="envelope-flap" />
          <button className="wax-seal" onClick={() => { setPressed(true); onOpen(); }} aria-label="Open the letter">
            <span className="seal-cracks" aria-hidden="true">╲　╱<br />╱　╲</span><span className="seal-word">for you</span><Heart size={19} fill="currentColor" /><span className="seal-shine" aria-hidden="true" />
          </button>
        </div>
        <div className="seal-prompt"><span>tap the seal</span><Heart size={13} fill="currentColor" /><i aria-hidden="true" /></div>
      </motion.div>
      <div className="anniversary-stamp"><span>PRIVATE POST</span><strong>{loveStory.anniversaryDate.replaceAll('.', ' • ')}</strong><small>♡ with love</small></div>
      <p className="landing-whisper">a little something, just for you</p>
    </div>
  </motion.section>;
}

function IntroScene({ onSecret, isEmerging = false }) {
  return <motion.section className="scene centered-scene" {...sceneMotion}>
    <Paper layoutId="love-letter-paper" className={`intro-paper ${isEmerging ? 'paper-waiting' : ''}`}>
      <span className="paper-corner top-left">✦</span><span className="paper-corner bottom-right">♡</span>
      <p className="date-stamp">{loveStory.anniversaryDate}</p>
      <p className="eyebrow">a note for my favorite person</p>
      <h1>Happy {loveStory.yearsTogether} Years,<br /><em>{loveStory.nickname} ♡</em></h1>
      <p className="intro-copy">{loveStory.intro}</p>
      <button className="sticker-button" onClick={onSecret}><Heart size={18} fill="currentColor" /> tap me</button>
      <span className="annotation">(there is a little secret here)</span>
    </Paper>
  </motion.section>;
}

function LetterScene({ onPhoto, onSecret }) {
  return <motion.section className="scene letter-scene" {...sceneMotion}>
    <Paper layoutId="love-letter-paper" className="letter-paper">
      <div className="letter-content"><p className="eyebrow">a few words I keep meaning to say</p><h2>Dear weirdo,</h2>{loveStory.letter.slice(1).map((paragraph, index) => <motion.p key={paragraph} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.16 + 0.25 }}>{paragraph}</motion.p>)}<button className="text-heart" onClick={onSecret} aria-label="Reveal a secret message"><Heart size={20} fill="currentColor" /></button></div>
      <button className="letter-photo" onClick={onPhoto} aria-label="Open the photo"><Tape /><img src={loveStory.photos[0].src} alt={loveStory.photos[0].alt} /><span>{loveStory.photos[0].caption}</span></button>
    </Paper>
  </motion.section>;
}

function MemoriesScene({ onSelect }) {
  return <motion.section className="scene memories-scene" {...sceneMotion}><div className="scene-heading"><p className="eyebrow">the scrapbook, chapter one</p><h2>Two years of us <em>♡</em></h2><p>click a memory to hold it a little closer</p></div><div className="memory-scatter">{loveStory.photos.map((photo, index) => <motion.button key={photo.src} className={`polaroid polaroid-${index + 1}`} whileHover={{ y: -8, rotate: 0, scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => onSelect(photo)}><img src={photo.src} alt={photo.alt} /><span>{photo.caption}</span><small>{photo.date}</small></motion.button>)}</div><span className="scribble">keep<br />these<br />forever</span></motion.section>;
}

function ReasonsScene({ onSecret }) {
  return <motion.section className="scene reasons-scene" {...sceneMotion}><div className="scene-heading"><p className="eyebrow">the little things</p><h2>things I hope<br /><em>you know</em></h2><p>some of the reasons, in no particular order</p></div><div className="reason-grid">{loveStory.reasonsILoveYou.map((reason, index) => <motion.button key={reason} className={`reason-note note-${index + 1}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .1 }} whileHover={{ rotate: 0, y: -5 }} onClick={onSecret}><span>{String(index + 1).padStart(2, '0')}</span>{reason}</motion.button>)}</div><span className="arrow-note">there are<br />so many more →</span></motion.section>;
}

function KissesScene() {
  const [kisses, setKisses] = useState(0);
  const [burst, setBurst] = useState(false);
  const addKiss = () => { setKisses((value) => value + 1); setBurst(true); window.setTimeout(() => setBurst(false), 650); };
  return <motion.section className="scene centered-scene kisses-scene" {...sceneMotion}><HeartBurst burst={burst} /><div className="scene-heading"><p className="eyebrow">a very serious collection</p><h2>kisses for you <em>♡</em></h2><p>tap the heart. I have plenty to spare.</p></div><button className="kiss-heart" onClick={addKiss} aria-label="Send a kiss"><Heart size={110} fill="currentColor" /></button><p className="kiss-count">kisses collected: <strong>{kisses}</strong></p><AnimatePresence mode="wait">{kisses >= 12 ? <motion.p className="unlimited" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>okay fine... they're unlimited.</motion.p> : <motion.p className="kiss-hint" key={kisses}>one more?</motion.p>}</AnimatePresence></motion.section>;
}

function CouponCard({ text, index }) {
  const [redeemed, setRedeemed] = useState(false);
  return <motion.button className={`coupon coupon-${index + 1} ${redeemed ? 'redeemed' : ''}`} whileHover={{ y: -6, rotate: 0 }} onClick={() => setRedeemed(true)}><span className="coupon-top">LOVE LETTER CO. <b>NO. 00{index + 1}</b></span><strong>{text}</strong><span className="coupon-bottom">valid forever · {redeemed ? 'redeemed (but unlimited)' : 'tap to redeem'}</span>{redeemed && <span className="stamp">REDEEMED</span>}</motion.button>;
}

function SongScene({ onFinish }) {
  const [playing, setPlaying] = useState(false); const audioRef = useRef(null);
  const toggle = () => { if (!audioRef.current) return; if (playing) audioRef.current.pause(); else audioRef.current.play().catch(() => {}); setPlaying((value) => !value); };
  return <motion.section className="scene song-scene" {...sceneMotion}><div className="scene-heading"><p className="eyebrow">press play when you are ready</p><h2>our song <em>♫</em></h2></div><div className="record-player"><div className={`vinyl ${playing ? 'spinning' : ''}`}><div className="vinyl-label"><img src={loveStory.song.cover} alt="Placeholder album cover" /></div></div><button className="play-button" onClick={toggle} aria-label={playing ? 'Pause our song' : 'Play our song'}>{playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}</button></div><div className="song-details"><Music2 size={17} /><div><strong>{loveStory.song.title}</strong><span>{loveStory.song.artist}</span></div></div><audio ref={audioRef} src={loveStory.song.audio} onEnded={() => setPlaying(false)} /><button className="next-note" onClick={onFinish}>one last thing... <ArrowRight size={15} /></button></motion.section>;
}

function FinalScene({ initiallyRevealed = false }) {
  const [revealed, setRevealed] = useState(initiallyRevealed);
  useEffect(() => { if (initiallyRevealed) setRevealed(true); }, [initiallyRevealed]);
  return <motion.section className="scene final-scene" {...sceneMotion}><div className="final-stars" aria-hidden="true">✦　♡　✧　♡　✦</div><p className="eyebrow">the last page, for now</p><h1>Two years down.<br /><em>And I'd still choose you.</em></h1><p className="final-message">{loveStory.finalMessage}</p><p className="signature">Happy anniversary,<br /><em>my love. ♡</em></p><button type="button" className="one-more" onClick={() => setRevealed(true)}>one more thing... <Heart size={16} fill="currentColor" /></button><FinalSecretReveal open={revealed} data={loveStory.finalSecret} /></motion.section>;
}

function App() {
  const [scene, setScene] = useState(0); const [direction, setDirection] = useState(1); const [opened, setOpened] = useState(false); const [opening, setOpening] = useState(false); const [revealFinal, setRevealFinal] = useState(false); const [bridge, setBridge] = useState(null); const [secret, setSecret] = useState(''); const [selectedPhoto, setSelectedPhoto] = useState(null); const touchStart = useRef(0); const bridgeTimer = useRef(null);
  const totalScenes = sceneNames.length + 1;
  const goTo = (next) => { const bounded = Math.max(0, Math.min(totalScenes - 1, next)); if (bounded === scene) return; setDirection(bounded > scene ? 1 : -1); const kind = getTransitionKind(scene, bounded); if (kind) { window.clearTimeout(bridgeTimer.current); setBridge(kind); bridgeTimer.current = window.setTimeout(() => setBridge(null), 760); } setScene(bounded); };
  const showSecret = (message = loveStory.secretMessages.intro) => { setSecret(message); window.setTimeout(() => setSecret(''), 2600); };
  useEffect(() => { const onKey = (event) => { if (event.key === 'ArrowRight') goTo(scene + 1); if (event.key === 'ArrowLeft') goTo(scene - 1); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [scene]);
  const renderScene = () => { if (scene === 0) return <EnvelopeScene onOpen={() => { setOpened(true); setOpening(true); window.setTimeout(() => goTo(1), 720); window.setTimeout(() => setOpening(false), 1550); }} />; if (scene === 1) return <IntroScene isEmerging={opening} onSecret={() => showSecret()} />; if (scene === 2) return <LetterScene onPhoto={() => setSelectedPhoto(loveStory.photos[0])} onSecret={() => showSecret(loveStory.secretMessages.photo)} />; if (scene === 3) return <MemoriesScene onSelect={setSelectedPhoto} />; if (scene === 4) return <ReasonsScene onSecret={() => showSecret('I love you more than I can fit on a sticky note.')} />; if (scene === 5) return <KissesScene />; if (scene === 6) return <motion.section className="scene coupons-scene" {...sceneMotion}><div className="scene-heading"><p className="eyebrow">a small supply of good things</p><h2>Coupons <em>for you</em></h2><p>Use them freely. I never run out when it comes to you.</p></div><div className="coupon-grid">{loveStory.coupons.map((coupon, index) => <CouponCard key={coupon} text={coupon} index={index} />)}</div></motion.section>; if (scene === 7) return <SongScene onFinish={() => { setRevealFinal(true); goTo(8); }} />; return <FinalScene initiallyRevealed={revealFinal} />; };
  return <main className={`app ${opened ? 'opened' : ''}`} onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }} onTouchEnd={(event) => { const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 55) goTo(scene + (distance < 0 ? 1 : -1)); }}><div className="world-backdrop" /><div className="grain" /><LayoutGroup id="love-letter-world"><AnimatePresence mode="sync" custom={direction}><motion.div key={scene} className="scene-layer" custom={direction} variants={pageVariants} initial="initial" animate="animate" exit="exit">{renderScene()}</motion.div></AnimatePresence></LayoutGroup><AnimatePresence>{opening && <motion.div className="opening-paper" initial={{ opacity: 0, x: '-50%', y: '-50%', scale: .45 }} animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1, width: 'calc(100vw - 44px)', height: 'calc(100svh - 58px)' }} exit={{ opacity: 0, scale: 1.02, transition: { duration: .35 } }} transition={{ duration: .95, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true" />}</AnimatePresence><AnimatePresence mode="wait"><TransitionBridge key={bridge || 'no-bridge'} kind={bridge} /></AnimatePresence>{scene > 0 && <Navigation scene={scene} total={totalScenes} onNavigate={goTo} />}{secret && <motion.div className="secret-toast" initial={{ opacity: 0, y: 12, scale: .92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}><Heart size={16} fill="currentColor" />{secret}</motion.div>}{selectedPhoto && <motion.div className="photo-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPhoto(null)}><button className="modal-close" aria-label="Close photo"><X size={20} /></button><motion.div className="modal-photo" initial={{ scale: .8, rotate: -5 }} animate={{ scale: 1, rotate: 0 }} onClick={(event) => event.stopPropagation()}><img src={selectedPhoto.src} alt={selectedPhoto.alt} /><strong>{selectedPhoto.caption}</strong><span>{selectedPhoto.date}</span></motion.div></motion.div>}</main>;
}

function Navigation({ scene, total, onNavigate }) { return <div className="navigation"><button onClick={() => onNavigate(scene - 1)} disabled={scene === 0} aria-label="Previous page"><ArrowLeft size={18} /></button><div className="progress">{Array.from({ length: total }, (_, index) => <button key={index} className={scene === index ? 'active' : ''} onClick={() => onNavigate(index)} aria-label={`Go to ${sceneNames[index] || 'final message'}`}><span>{index === 0 ? '✦' : '♡'}</span></button>)}</div><button onClick={() => onNavigate(scene + 1)} disabled={scene === total - 1} aria-label="Next page"><ArrowRight size={18} /></button></div>; }

export default App;
