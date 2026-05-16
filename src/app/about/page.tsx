import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Us – Weekend Riders | Born in the Western Ghats',
  description: 'Discover the story of Weekend Riders — custodians of the Sahyadri legacy. Meet our expert guides, learn about our safety standards, and our Leave No Trace commitment.',
};

const team = [
  { name: 'Tejas Konde', role: 'Lead Mountaineer', exp: '15+ Yrs Experience', emoji: '🧗' },
  { name: 'Raj Shinde', role: 'Flora Expert & Rescue Lead', exp: '12+ Yrs Experience', emoji: '🌿' },
  { name: 'Amit Kadam', role: 'Historical Forts Specialist', exp: '10+ Yrs Experience', emoji: '🏰' },
];

const safetyItems = [
  { icon: '🩺', title: 'Trauma Kits', desc: 'Every guide carries a comprehensive wilderness-certified first aid and trauma kit.' },
  { icon: '📡', title: 'Satellite Comms', desc: 'Satellite communication devices ensure we are never out of touch with basecamp.' },
  { icon: '🚙', title: 'Transport', desc: 'Regulated, high-clearance 4x4 vehicles for safe transit to remote trailheads.' },
  { icon: '⛅', title: 'Protocols', desc: 'Strict weather monitoring and clear evacuation protocols for every route.' },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/images/hero.png"
            alt="Sahyadri mountains at dawn"
            fill
            priority
            className={styles.heroImg}
            sizes="100vw"
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <span className="label-caps" style={{ color: '#b6ccb8', marginBottom: '12px', display: 'block' }}>
            Our Story
          </span>
          <h1 className={styles.heroTitle}>Born in the<br />Western Ghats</h1>
          <p className={styles.heroDesc}>
            We are more than just guides — we are custodians of the Sahyadri legacy.
            Discover our commitment to your safe, unforgettable adventure.
          </p>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────────────────── */}
      <section className={`section container ${styles.story}`}>
        <div className={styles.storyText}>
          <span className="label-caps" style={{ marginBottom: '12px', display: 'block' }}>Our Beginning</span>
          <h2>Weekend Riders Was Forged From Respect</h2>
          <p>
            Weekend Riders began from a profound respect for the rugged terrain of Maharashtra.
            What started as a group of friends navigating undocumented trails has evolved into a
            premier trekking collective trusted by hundreds of adventurers.
          </p>
          <p style={{ marginTop: '16px' }}>
            Our philosophy is simple: the mountains demand respect, and in return, they offer
            unparalleled clarity. We curate experiences that challenge the body while rejuvenating
            the spirit — always ensuring that our footprint is minimal and our impact on the
            Sahyadri ecosystem is positive.
          </p>
          <Link href="/#treks" className="btn btn-primary" style={{ marginTop: '28px', display: 'inline-flex' }}>
            Explore Our Treks →
          </Link>
        </div>
        <div className={styles.storyImage}>
          <Image
            src="/images/trekking-group.jpg"
            alt="Trekkers on Sahyadri trail"
            width={560}
            height={420}
            className={styles.roundedImg}
          />
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────── */}
      <section className={`section ${styles.teamSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="label-caps">The People Behind the Trek</span>
            <h2>Expert Guides</h2>
            <p>Local legends, certified mountaineers, and passionate storytellers.</p>
          </div>
          <div className={styles.teamGrid}>
            {team.map(({ name, role, exp, emoji }) => (
              <div key={name} className={styles.teamCard}>
                <div className={styles.teamAvatar}>{emoji}</div>
                <h3 className={styles.teamName}>{name}</h3>
                <p className={styles.teamRole}>{role}</p>
                <p className={styles.teamExp}>{exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety ────────────────────────────────────────────────────── */}
      <section className={`section ${styles.safetySection}`}>
        <div className={styles.safetyBg}>
          <Image
            src="/images/features-bg.png"
            alt="Misty mountain peaks"
            fill
            className={styles.safetyImg}
            sizes="100vw"
          />
          <div className={styles.safetyOverlay} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={styles.sectionHeader}>
            <span className="label-caps" style={{ color: '#b6ccb8' }}>Safety Standards</span>
            <h2 style={{ color: 'white' }}>Uncompromising Safety</h2>
            <p style={{ color: 'rgba(255,255,255,0.70)' }}>
              Your well-being is our highest priority. We equip every trek with professional-grade
              gear and rigorous safety protocols.
            </p>
          </div>
          <div className={styles.safetyGrid}>
            {safetyItems.map(({ icon, title, desc }) => (
              <div key={title} className={styles.safetyCard}>
                <span className={styles.safetyIcon}>{icon}</span>
                <h4 className={styles.safetyTitle}>{title}</h4>
                <p className={styles.safetyDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leave No Trace ────────────────────────────────────────────── */}
      <section className={`section container ${styles.lnt}`}>
        <div className={styles.lntCard}>
          <span className={styles.lntIcon}>🌱</span>
          <div>
            <h2 className={styles.lntTitle}>Leave No Trace</h2>
            <p className={styles.lntText}>
              We practice strict 'Leave No Trace' principles. All our treks are plastic-neutral.
              We carry out what we carry in, and we actively participate in local conservation
              efforts to protect the Sahyadri ecosystem for future generations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
