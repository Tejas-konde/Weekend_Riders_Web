import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo.png" alt="Weekend Riders Logo" width={40} height={40} className={styles.logoImg} />
            <div>
              <span className={styles.logoName}>Weekend Riders</span>
              <span className={styles.logoSub}>Sahyadri Explorers</span>
            </div>
          </Link>
          <p className={styles.tagline}>
            Crafted for the modern trekker. We are custodians of the Sahyadri legacy — blending sophistication with the raw beauty of Maharashtra's forts.
          </p>
          <div className={styles.social}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram">📸 @weekend_riders</a>
          </div>
        </div>

        {/* Links */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Resources</h4>
          <ul className={styles.list}>
            <li><Link href="/about">Safety Policy</Link></li>
            <li><Link href="/about">Expert Guides</Link></li>
            <li><a href="#">Gear List</a></li>
            <li><a href="#">Trek Preparation</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Destinations</h4>
          <ul className={styles.list}>
            <li><Link href="/trek/harishchandragad">Harishchandragad</Link></li>
            <li><Link href="/trek/torna">Torna Fort</Link></li>
            <li><Link href="/trek/rajgad">Rajgad Fort</Link></li>
            <li><Link href="/trek/kalsubai">Kalsubai Peak</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Legal</h4>
          <ul className={styles.list}>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
          <div className={styles.contact}>
            <a href="tel:+918421308297">📞 +91 84213 08297</a>
            <a href="mailto:hello@weekendriders.in">✉ hello@weekendriders.in</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© 2025 Weekend Riders. All rights reserved. Crafted for the Sahyadri Spirit.</span>
        <span className={styles.made}>Made with 🏔 in Pune</span>
      </div>
    </footer>
  );
}
