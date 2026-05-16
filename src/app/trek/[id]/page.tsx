'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTrekStore } from '@/store/trekStore';
import styles from './page.module.css';

const difficultyColor = { Easy: '#1B2E20', Moderate: '#2d3a50', Hard: '#8b3300' };
const difficultyBg   = { Easy: '#d1e8d3', Moderate: '#d5e0f7', Hard: '#ffe0cc' };

export default function TrekDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const { getTrekById, selectTrek } = useTrekStore();
  const trek = getTrekById(params.id as string);

  if (!trek) {
    return (
      <div className={styles.notFound}>
        <h2>Trek not found</h2>
        <button className="btn btn-primary" onClick={() => router.push('/')}>← Back to All Treks</button>
      </div>
    );
  }

  const isSoldOut = trek.seats <= 0;
  const seatsLow  = trek.seats > 0 && trek.seats <= 5;

  const handleBook = () => {
    selectTrek(trek.id);
    router.push(`/checkout?trek=${trek.id}`);
  };

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src={trek.image}
            alt={trek.name}
            fill
            priority
            className={styles.heroImg}
            sizes="100vw"
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <button className={styles.backBtn} onClick={() => router.push('/')}>← All Treks</button>
          <div>
            <span
              className="chip"
              style={{
                background: difficultyBg[trek.difficulty],
                color: difficultyColor[trek.difficulty],
                marginBottom: '12px',
                display: 'inline-block'
              }}
            >
              {trek.difficulty}
            </span>
            <h1 className={styles.heroTitle}>{trek.name}</h1>
            <p className={styles.heroTagline}>{trek.tagline}</p>
          </div>
          {/* Quick stats */}
          <div className={styles.heroQuickStats}>
            {[
              { icon: '🏔', label: 'Altitude', value: trek.altitude },
              { icon: '📏', label: 'Distance', value: trek.distance },
              { icon: '⏱', label: 'Duration', value: trek.duration },
              { icon: '📅', label: 'Next Date', value: trek.date },
              { icon: '💺', label: 'Seats Left', value: `${trek.seats} / ${trek.maxSeats}` },
            ].map(({ icon, label, value }) => (
              <div key={label} className={styles.quickStat}>
                <span className={styles.quickStatIcon}>{icon}</span>
                <span className={styles.quickStatValue}>{value}</span>
                <span className={styles.quickStatLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content + Sidebar ────────────────────────────────────── */}
      <div className={`container ${styles.main}`}>
        <div className={styles.content}>
          {/* Description */}
          <section className={styles.section}>
            <p className={styles.desc}>{trek.description}</p>
          </section>

          {/* Itinerary */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Trek Itinerary</h2>
            <div className={styles.itinerary}>
              {trek.itinerary.map((day, di) => (
                <div key={di} className={styles.day}>
                  <div className={styles.dayHeader}>
                    <div className={styles.dayBadge}>{day.day}</div>
                    <h3 className={styles.dayTitle}>{day.title}</h3>
                  </div>
                  <div className={styles.timeline}>
                    {day.items.map((item, ii) => (
                      <div key={ii} className={styles.timelineItem}>
                        <div className={styles.timelineDot} />
                        <div className={styles.timelineContent}>
                          <span className={styles.timelineTime}>{item.time}</span>
                          <p className={styles.timelineActivity}>{item.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Inclusions */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What's Included</h2>
            <div className={styles.inclusions}>
              {trek.inclusions.map(({ icon, label, detail }) => (
                <div key={label} className={styles.inclusion}>
                  <span className={styles.inclusionIcon}>{icon}</span>
                  <div>
                    <h4 className={styles.inclusionLabel}>{label}</h4>
                    <p className={styles.inclusionDetail}>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Safety */}
          <section className={`${styles.section} ${styles.safetyBox}`}>
            <div className={styles.safetyInner}>
              <span className={styles.safetyIcon}>🛡</span>
              <div>
                <h3 className={styles.safetyTitle}>Safety First</h3>
                <p className={styles.safetyText}>
                  Your safety is our absolute priority. All treks are led by certified mountaineers
                  trained in wilderness first responder protocols. We maintain a strict 1:10
                  guide-to-trekker ratio, ensure personal attention, and constantly monitor
                  weather conditions.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar — Booking Card */}
        <aside className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <div className={styles.bookingCardHeader}>
              <div className={styles.bookingPrice}>
                <span className={styles.bookingPriceValue}>₹{trek.price.toLocaleString('en-IN')}</span>
                <span className={styles.bookingPriceLabel}>per person</span>
              </div>
              {isSoldOut ? (
                <span className="chip chip-sold-out">Sold Out</span>
              ) : seatsLow ? (
                <span className="chip chip-hard">🔥 Only {trek.seats} left!</span>
              ) : (
                <span className="chip chip-easy">{trek.seats} seats available</span>
              )}
            </div>

            <div className={styles.bookingDetails}>
              {[
                { label: 'Date', value: trek.dateRange },
                { label: 'Duration', value: trek.duration },
                { label: 'Difficulty', value: trek.difficulty },
                { label: 'Altitude', value: trek.altitude },
                { label: 'Region', value: trek.region },
              ].map(({ label, value }) => (
                <div key={label} className={styles.bookingDetailRow}>
                  <span className={styles.bookingDetailLabel}>{label}</span>
                  <span className={styles.bookingDetailValue}>{value}</span>
                </div>
              ))}
            </div>

            <button
              id={`book-now-${trek.id}`}
              className={`btn btn-primary w-full ${styles.bookBtn}`}
              onClick={handleBook}
              disabled={isSoldOut}
            >
              {isSoldOut ? 'Trek Sold Out' : 'Proceed to Pay →'}
            </button>

            <div className={styles.secureNote}>
              🔒 Secure payment via UPI. Your data is protected.
            </div>

            <div className={styles.support}>
              <a href="tel:+918421308297" className={styles.supportLink}>📞 +91 84213 08297</a>
              <a href="mailto:hello@weekendriders.in" className={styles.supportLink}>✉ hello@weekendriders.in</a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
