'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { useTrekStore } from '@/store/trekStore';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const { toggleManagerMode, managerMode } = useTrekStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Treks' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="Weekend Riders Logo" width={40} height={40} className={styles.logoImg} />
          <div>
            <span className={styles.logoName}>Weekend Riders</span>
            <span className={styles.logoSub}>Sahyadri Explorers</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className={styles.links}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: Manager toggle + CTA */}
        <div className={styles.actions}>
          <button
            id="manager-mode-toggle"
            onClick={toggleManagerMode}
            className={`${styles.managerBtn} ${managerMode ? styles.managerActive : ''}`}
            title="Toggle Manager Mode"
          >
            <span>⚙</span>
            <span className={styles.managerLabel}>{managerMode ? 'Manager ON' : 'Manager'}</span>
          </button>
          <Link href="/#treks" className="btn btn-primary btn-sm">
            Book a Trek
          </Link>
          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={menuOpen ? styles.barOpen : styles.bar} />
            <span className={menuOpen ? styles.barOpen : styles.bar} />
            <span className={menuOpen ? styles.barOpen : styles.bar} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.drawer}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={styles.drawerLink}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
