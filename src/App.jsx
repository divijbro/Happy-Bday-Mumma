import { useEffect, useRef, useState } from 'react';

const photos = [
  {
    src: '/photos/family-home.jpg',
    title: 'Our best kind of plan',
    note: 'A day at home doing velapanti with you.',
    position: 'center 52%',
  },
  {
    src: '/photos/cake-together.jpg',
    title: 'A birthday with Mumma',
    note: 'The cake is sweet; being with you is sweeter.',
    position: 'center 47%',
  },
  {
    src: '/photos/mummy-portrait.jpg',
    title: 'A little Mumma time',
    note: 'You make every ordinary outing lovely.',
    position: 'center 45%',
  },
  {
    src: '/photos/a-day-for-you.jpg',
    title: 'Anywhere with Mumma',
    note: 'Our plans are more fun with you along.',
    position: '62% 44%',
  },
  {
    src: '/photos/together-always.jpg',
    title: 'My favourite travel companion',
    note: 'Every trip becomes a story with you.',
    position: 'center 50%',
  },
];

const birthdayLetter = [
  'I love you so much. Happy birthday! You are the best Mumma in the entire universe—and the perfect Mumma for me.',
  'Everyone asks how we’ve settled into Dubai, but none of it would have been possible without you. You made everything feel so much easier, and I appreciate all that you’ve done for me more than I can say.',
  'All those times we planned to go somewhere and somehow ended up doing velapanti at home, along with our trips to Ibn Battuta Khaau Galli, have become some of my favourite memories. Every one of them is more fun because you’re there.',
  'I love you so much, Mumma. You’re the best Mumma in the universe. Happy birthday!',
  'Love always',
];

function Reveal({ children, className = '', delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={nodeRef} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>
      {children}
    </div>
  );
}

function Icon({ name }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'arrow') return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
  if (name === 'play') return <svg {...common}><path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none" /></svg>;
  if (name === 'pause') return <svg {...common}><path d="M8 5v14M16 5v14" strokeWidth="2.2" /></svg>;
  if (name === 'close') return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === 'left') return <svg {...common}><path d="m15 18-6-6 6-6" /></svg>;
  if (name === 'right') return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>;
  if (name === 'sound') return <svg {...common}><path d="M4 10v4h3l5 4V6l-5 4H4Z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /></svg>;
  if (name === 'mute') return <svg {...common}><path d="M4 10v4h3l5 4V6l-5 4H4Z" /><path d="m17 9 5 6m0-6-5 6" /></svg>;
  return null;
}

function makeConfetti() {
  return Array.from({ length: 46 }, (_, index) => ({
    id: `${Date.now()}-${index}`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.9}s`,
    duration: `${2.8 + Math.random() * 2.2}s`,
    color: ['#ff4081', '#ffd83d', '#4caf50', '#b24bd1', '#ff9800'][index % 5],
    rotate: `${Math.random() * 360}deg`,
  }));
}

function startSoftMusic() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0.22;
  master.connect(context.destination);
  const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
  let noteIndex = 0;
  const playNote = () => {
    if (context.state === 'closed') return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const now = context.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.value = notes[noteIndex % notes.length];
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.12, now + 0.12);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(now);
    oscillator.stop(now + 2.2);
    noteIndex += 1;
  };
  playNote();
  const interval = window.setInterval(playNote, 820);
  return { context, interval };
}

export default function App() {
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [slideshow, setSlideshow] = useState(false);
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const musicRef = useRef(null);

  useEffect(() => {
    if (!slideshow || !lightboxOpen) return undefined;
    const timer = window.setInterval(() => setActivePhoto((index) => (index + 1) % photos.length), 3600);
    return () => window.clearInterval(timer);
  }, [slideshow, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { setLightboxOpen(false); setSlideshow(false); }
      if (event.key === 'ArrowRight') setActivePhoto((index) => (index + 1) % photos.length);
      if (event.key === 'ArrowLeft') setActivePhoto((index) => (index - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen]);

  useEffect(() => () => {
    if (musicRef.current) {
      window.clearInterval(musicRef.current.interval);
      musicRef.current.context.close();
    }
  }, []);

  function celebrate() {
    setConfetti(makeConfetti());
    window.setTimeout(() => setConfetti([]), 5600);
  }

  function toggleMusic() {
    if (musicOn) {
      if (musicRef.current) {
        window.clearInterval(musicRef.current.interval);
        musicRef.current.context.close();
        musicRef.current = null;
      }
      setMusicOn(false);
      return;
    }
    musicRef.current = startSoftMusic();
    setMusicOn(Boolean(musicRef.current));
  }

  function openSlideshow() {
    setActivePhoto(0);
    setLightboxOpen(true);
    setSlideshow(true);
  }

  function showNext(direction) {
    setActivePhoto((index) => (index + direction + photos.length) % photos.length);
  }

  const selectedPhoto = photos[activePhoto];

  return (
    <main>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="For Mumma, home"><span className="brand-mark">M</span><span>For Mumma</span></a>
        <nav aria-label="Main navigation">
          <a href="#memories">Our memories</a>
          <a href="#letter">My letter</a>
          <a href="#surprise">Make a wish</a>
        </nav>
        <button className={`sound-toggle ${musicOn ? 'is-on' : ''}`} type="button" onClick={toggleMusic} aria-pressed={musicOn} aria-label={musicOn ? 'Turn birthday music off' : 'Play birthday music'}>
          <Icon name={musicOn ? 'sound' : 'mute'} /><span>{musicOn ? 'Party tune on' : 'Party tune off'}</span>
        </button>
      </header>

      <section className="hero section-wrap" id="top">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-line" />For the best Mumma in the universe<span className="eyebrow-line" /></span>
          <p className="hero-intro">Mumma, Dubai feels like home<br />because of you</p>
          <h1>Happy birthday,<br /><em>Mumma!</em></h1>
          <p className="hero-subtitle">You made a whole new place feel like home.</p>
          <a className="button button-gold" href="#memories">See our favourite memories <Icon name="arrow" /></a>
          <div className="hero-signature"><span className="signature-rule" />I love you so much</div>
        </div>
        <div className="hero-portrait-wrap">
          <div className="portrait-halo" />
          <div className="hero-portrait-frame">
            <img src="/photos/cake-together.jpg" alt="Mumma celebrating with the family around a birthday cake" fetchPriority="high" />
            <div className="portrait-caption"><span className="caption-dot" />My favourite place is wherever you are</div>
          </div>
          <span className="portrait-sparkle sparkle-one">✦</span>
          <span className="portrait-sparkle sparkle-two">✧</span>
        </div>
        <a className="scroll-cue" href="#memories"><span />Come relive our favourite days</a>
      </section>

      <section className="intro-section section-wrap">
        <Reveal className="intro-copy">
          <p className="eyebrow eyebrow-left">Dubai days, home days, Mumma days</p>
          <h2>You made Dubai feel<br /><em>like home.</em></h2>
          <p className="body-copy">Everyone asks how we’ve settled in Dubai. The truth is, you made it feel easy. From our velapanti days at home to our trips to Ibn Battuta Khaau Galli, my favourite memories are the ones with you.</p>
        </Reveal>
        <Reveal delay={120} className="intro-aside">
          <span className="quote-mark">“</span>
          <p>Even staying in<br />is special with you.</p>
          <span className="quote-rule" />
          <span className="aside-caption">Velapanti at home</span>
        </Reveal>
      </section>

      <section className="memories-section section-wrap" id="memories">
        <Reveal className="section-heading">
          <div><p className="eyebrow eyebrow-left">From home velapanti to Khaau Galli trips</p><h2>Every memory is better<br />with <em>you, Mumma.</em></h2></div>
          <button className="text-button slideshow-link" type="button" onClick={openSlideshow}><Icon name="play" />Take me through the memories</button>
        </Reveal>
        <div className="photo-grid">
          {photos.map((photo, index) => (
            <Reveal key={photo.src} delay={index * 70} className={`photo-card photo-card-${index + 1}`}>
              <button type="button" className="photo-button" onClick={() => { setActivePhoto(index); setLightboxOpen(true); setSlideshow(false); }} aria-label={`View photo: ${photo.title}`}>
                <span className="photo-image-wrap"><img src={photo.src} alt={photo.title} loading="lazy" style={{ objectPosition: photo.position }} /></span>
                <span className="photo-meta"><span className="photo-title">{photo.title}</span><span className="photo-note">{photo.note}</span></span>
                <span className="photo-index">0{index + 1}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="letter-section section-wrap" id="letter">
        <Reveal className="letter-card">
          <div className="letter-ornament" aria-hidden="true"><span>✦</span></div>
          <div className="letter-label"><span className="eyebrow-line" />Everything I want to tell you<span className="eyebrow-line" /></div>
          <h2>Dear <em>Mumma,</em></h2>
          <div className="letter-message">
            {birthdayLetter.map((paragraph, index) => <p className={index === birthdayLetter.length - 1 ? 'letter-signoff' : ''} key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="letter-footer"><span />I love you to the universe and back<span /></div>
        </Reveal>
      </section>

      <section className="surprise-section section-wrap" id="surprise">
        <Reveal className="surprise-panel">
          <div className="surprise-copy">
            <p className="eyebrow eyebrow-left">For my favourite person</p>
            <h2>Your wish is next,<br /><em>Mumma!</em></h2>
            <p className="body-copy">You deserve all the cake and every wish in the universe. Close your eyes, think of something wonderful, and when you’re ready, blow out your candles!</p>
            {!surpriseOpen && <button className="button button-gold" type="button" onClick={() => setSurpriseOpen(true)}>Open your birthday surprise <Icon name="arrow" /></button>}
            {surpriseOpen && <p className="surprise-open-note" aria-live="polite">One wish, with all my love.</p>}
          </div>
          <div className={`cake-scene ${surpriseOpen ? 'is-open' : ''}`}>
            <span className="cake-glow" />
          <div className={`cake ${surpriseOpen ? 'cake-reveal' : ''}`} aria-label="Mumma’s birthday cake with three candles">
              <div className="candle-row">
                {[0, 1, 2].map((candle) => <span className={`candle candle-${candle + 1}`} key={candle}><span className={`flame ${candlesLit ? 'lit' : 'out'}`} /></span>)}
              </div>
              <div className="cake-top"><span className="icing-drip drip-one" /><span className="icing-drip drip-two" /><span className="icing-drip drip-three" /><span className="cake-berry">✦</span></div>
              <div className="cake-layer cake-layer-top" />
              <div className="cake-layer cake-layer-bottom" />
              <div className="cake-plate" />
            </div>
            {surpriseOpen && <button className="wish-button" type="button" onClick={() => { if (candlesLit) { setCandlesLit(false); celebrate(); } else { setCandlesLit(true); } }}>{candlesLit ? 'Blow out your candles, Mumma!' : 'Light them for one more wish'}</button>}
            {!surpriseOpen && <span className="cake-teaser">A birthday cake just for you…</span>}
          </div>
          <span className="surprise-star star-left" aria-hidden="true">✦</span><span className="surprise-star star-right" aria-hidden="true">✧</span>
        </Reveal>
      </section>

      <footer className="site-footer section-wrap">
        <span className="footer-mark">M</span>
        <p>The best Mumma in the universe.</p>
        <a href="#top">Celebrate from the top ↑</a>
      </footer>

      {confetti.length > 0 && <div className="confetti-layer" aria-hidden="true">{confetti.map((piece) => <span key={piece.id} style={{ left: piece.left, animationDelay: piece.delay, animationDuration: piece.duration, backgroundColor: piece.color, rotate: piece.rotate }} />)}</div>}

      {lightboxOpen && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Mumma’s birthday memories" onMouseDown={(event) => { if (event.target === event.currentTarget) { setLightboxOpen(false); setSlideshow(false); } }}>
        <button className="lightbox-close" type="button" onClick={() => { setLightboxOpen(false); setSlideshow(false); }} aria-label="Close photo viewer"><Icon name="close" /></button>
        <button className="lightbox-arrow lightbox-prev" type="button" onClick={() => showNext(-1)} aria-label="Previous photo"><Icon name="left" /></button>
        <div className="lightbox-content">
          <img src={selectedPhoto.src} alt={selectedPhoto.title} />
          <div className="lightbox-caption"><span className="eyebrow eyebrow-left">One of my favourite Mumma moments · 0{activePhoto + 1} / 0{photos.length}</span><h2>{selectedPhoto.title}</h2><p>{selectedPhoto.note}</p></div>
        </div>
        <button className="lightbox-arrow lightbox-next" type="button" onClick={() => showNext(1)} aria-label="Next photo"><Icon name="right" /></button>
        <button className="lightbox-slideshow" type="button" onClick={() => setSlideshow((playing) => !playing)}><Icon name={slideshow ? 'pause' : 'play'} />{slideshow ? 'Pause these memories' : 'Play these memories'}</button>
      </div>}
    </main>
  );
}
