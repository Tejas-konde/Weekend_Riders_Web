'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTrekStore } from '@/store/trekStore';
import TrekCard from '@/components/TrekCard';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();
  const { treks, selectedTrekId, selectTrek, getSelectedTrek } = useTrekStore();
  const selectedTrek = getSelectedTrek();

  const handleProceedToPay = () => {
    if (selectedTrekId) {
      router.push(`/checkout?trek=${selectedTrekId}`);
    }
  };

  const stats = [
    { value: '6+', label: 'Curated Treks' },
    { value: '500+', label: 'Happy Trekkers' },
    { value: '100%', label: 'Safety Record' },
    { value: '15+', label: 'Years Experience' },
  ];

  const features = [
    { icon: '🧗', title: 'Expert Guides', desc: 'Certified mountaineers with local knowledge and wilderness first responder training.' },
    { icon: '🛡', title: 'Safety First', desc: 'Strict 1:10 guide-to-trekker ratio, satellite comms, and constant weather monitoring.' },
    { icon: '🌿', title: 'Leave No Trace', desc: 'Plastic-neutral treks with active conservation participation in the Sahyadri ecosystem.' },
    { icon: '🎒', title: 'All Inclusive', desc: 'Transport, meals, guides, and camping equipment included. Just bring yourself.' },
  ];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/images/hero.png"
            alt="Sahyadri mountains"
            fill
            priority
            className={styles.heroImg}
            sizes="100vw"
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <span className="label-caps" style={{ color: '#b6ccb8', marginBottom: '16px', display: 'block' }}>
            Sahyadri Explorers
          </span>
          <h1 className={styles.heroTitle}>
            Conquer the Heights<br />
            <em>with Weekend Riders</em>
          </h1>
          <p className={styles.heroDesc}>
            Experience premium, guided treks through ancient forts and pristine nature.
            Crafted for the modern explorer seeking sophisticated Sahyadri adventure.
          </p>
          <div className={styles.heroCtas}>
            <a href="#treks" className="btn btn-primary btn-lg">Explore Treks ↓</a>
            <a href="/about" className="btn btn-ghost btn-lg">Our Story</a>
          </div>

          {/* Stats */}
          <div className={styles.heroStats}>
            {stats.map(({ value, label }) => (
              <div key={label} className={styles.heroStat}>
                <span className={styles.heroStatValue}>{value}</span>
                <span className={styles.heroStatLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trek Cards Grid ───────────────────────────────────────────── */}
      <section className={`section ${styles.treksSection}`} id="treks">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="label-caps">Curated Experiences</span>
            <h2>Choose Your Adventure</h2>
            <p className={styles.sectionDesc}>
              Handpicked itineraries blending thrilling ascents with premium comfort and
              uncompromising safety. Select a trek below to proceed.
            </p>
          </div>

          {/* Selection hint */}
          <div className={styles.selectionHint}>
            <span className={styles.hintIcon}>👆</span>
            <span>Click any trek card to select it, then use the <strong>Proceed to Pay</strong> bar below</span>
          </div>

          <div className={styles.treksGrid}>
            {treks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className={`section ${styles.features}`}>
        <div className={styles.featuresBg}>
          <Image
            src="/images/features-bg.png"
            alt="Mountain landscape"
            fill
            className={styles.featuresImg}
            sizes="100vw"
          />
          <div className={styles.featuresOverlay} />
        </div>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="label-caps" style={{ color: '#b6ccb8' }}>Why Weekend Riders</span>
            <h2 style={{ color: 'white' }}>The Premier Sahyadri Experience</h2>
          </div>
          <div className={styles.featuresGrid}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{icon}</span>
                <h4 style={{ color: 'white', fontFamily: 'Noto Serif', marginBottom: '8px' }}>{title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: '0.875rem', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className={`section-sm ${styles.ctaBanner}`}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready for Your Next Adventure?</h2>
          <p style={{ color: '#4f6353', marginTop: '12px', marginBottom: '28px' }}>
            Select a trek above and experience the Sahyadri like never before.
          </p>
          <a href="#treks" className="btn btn-primary btn-lg">View All Treks →</a>
        </div>
      </section>

      {/* ── Conditional "Proceed to Pay" Floating Bar ─────────────────── */}
      {selectedTrek && (
        <div className={styles.payBar} id="proceed-to-pay-bar" role="region" aria-label="Trek selection and payment">
          <div className={styles.payBarInner}>
            <div className={styles.payBarInfo}>
              <div className={styles.payBarSelected}>
                <span className={styles.payBarSelectedLabel}>Selected Trek</span>
                <span className={styles.payBarTrekName}>{selectedTrek.name}</span>
              </div>
              <div className={styles.payBarDivider} />
              <div className={styles.payBarMeta}>
                <span className={styles.payBarMetaItem}>📅 {selectedTrek.date}</span>
                <span className={styles.payBarMetaItem}>⏱ {selectedTrek.duration}</span>
                <span className={styles.payBarMetaItem}>
                  💺 {selectedTrek.seats} seat{selectedTrek.seats !== 1 ? 's' : ''} left
                </span>
              </div>
            </div>

            <div className={styles.payBarActions}>
              <div className={styles.payBarPrice}>
                <span className={styles.payBarPriceValue}>
                  ₹{selectedTrek.price.toLocaleString('en-IN')}
                </span>
                <span className={styles.payBarPriceLabel}>per person</span>
              </div>
              <button
                className={`btn btn-primary btn-lg ${styles.payBtn}`}
                onClick={handleProceedToPay}
                id="proceed-to-pay-btn"
              >
                Proceed to Pay →
              </button>
              <button
                className={styles.payBarClose}
                onClick={() => selectTrek(null)}
                aria-label="Dismiss selection"
                id="dismiss-selection"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
