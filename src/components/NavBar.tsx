import React, { useState } from 'react';
import Link from 'next/link';
import styles from './NavBar.module.css';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/admin', label: 'Admin' },
  { href: '/archive', label: 'Archive' },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">America250-NCS</Link>
      </div>
      <div className={styles.links}>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={styles.link}>
            {link.label}
          </Link>
        ))}
      </div>
      <button
        className={styles.hamburger}
        aria-label="Open navigation menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
} 