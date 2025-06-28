'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './HamburgerMenu.module.css';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation Bar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, var(--parchment) 0%, var(--linen) 100%)',
        borderBottom: '3px solid var(--bronze)',
        boxShadow: '0 2px 12px rgba(104, 63, 27, 0.15)',
        padding: '0.75rem 2rem',
        display: 'none'
      }}
      className="desktop-nav"
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Logo/Title */}
          <Link href="/" style={{
            fontFamily: 'librebaskerville-bold, serif',
            fontSize: '1.5rem',
            color: 'var(--mahogany)',
            textDecoration: 'none',
            fontWeight: 'bold',
            letterSpacing: '-0.02em'
          }}>
            AMERICA250-NCS
          </Link>

          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <Link href="/" style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '1.1rem',
              color: 'var(--mahogany)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="nav-link"
            >
              HOME
            </Link>
            
            <Link href="/volunteer" style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '1.1rem',
              color: 'var(--mahogany)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="nav-link"
            >
              VOLUNTEER PAGE
            </Link>
            
            <Link href="/qsl-cards" style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '1.1rem',
              color: 'var(--mahogany)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="nav-link"
            >
              QSL CARDS
            </Link>
            
            <Link href="/meet-the-founders" style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '1.1rem',
              color: 'var(--mahogany)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="nav-link"
            >
              MEET THE FOUNDERS
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Hamburger Menu */}
      <button
        onClick={toggleMenu}
        className={`hamburger ${styles.hamburger}`}
        aria-label="Toggle menu"
      >
        <span className={`${styles.bar} bar`}></span>
        <span className={`${styles.bar} bar`}></span>
        <span className={`${styles.bar} bar`}></span>
      </button>

      {isMenuOpen && (
        <div className={styles.overlay} onClick={closeMenu}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <Link href="/" className={styles.menuLink} onClick={closeMenu}>
              Home
            </Link>
            <Link href="/volunteer" className={styles.menuLink} onClick={closeMenu}>
              Volunteer Page
            </Link>
            <Link href="/qsl-cards" className={styles.menuLink} onClick={closeMenu}>
              QSL Cards
            </Link>
            <Link href="/meet-the-founders" className={styles.menuLink} onClick={closeMenu}>
              Meet the Founders
            </Link>
            <Link href="/archive" className={styles.menuLink} onClick={closeMenu}>
              Archive
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .desktop-nav {
          display: none;
        }
        
        @media (min-width: 769px) {
          .desktop-nav {
            display: block !important;
          }
          
          .hamburger {
            display: none !important;
          }
        }
        
        .nav-link:hover {
          background: var(--bronze) !important;
          color: var(--parchment) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(104, 63, 27, 0.2);
        }
        
        .nav-link::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s;
        }
        
        .nav-link:active::before {
          width: 300px;
          height: 300px;
        }
        
        /* Add top padding to body when desktop nav is visible */
        @media (min-width: 769px) {
          body {
            padding-top: 70px;
          }
        }
      `}</style>
    </>
  );
} 