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
        background: 'linear-gradient(135deg, var(--mahogany) 0%, #5a3419 100%)',
        borderBottom: '3px solid var(--bronze)',
        boxShadow: '0 2px 12px rgba(104, 63, 27, 0.15)',
        padding: '0.75rem 2rem',
        display: 'none'
      }}
      className="desktop-nav"
      >
        {/* Top Brass Separator Bar */}
        <div style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          right: '0px',
          height: '3px',
          background: 'linear-gradient(90deg, var(--bronze) 0%, #D4AF37 50%, var(--bronze) 100%)',
          boxShadow: '0 2px 4px rgba(212, 175, 55, 0.6)',
          zIndex: 1
        }}></div>
        
        {/* Bottom Brass Separator Bar */}
        <div style={{
          position: 'absolute',
          bottom: '0px',
          left: '0px',
          right: '0px',
          height: '3px',
          background: 'linear-gradient(90deg, var(--bronze) 0%, #D4AF37 50%, var(--bronze) 100%)',
          boxShadow: '0 -2px 4px rgba(212, 175, 55, 0.6)',
          zIndex: 1
        }}></div>
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
            color: 'var(--linen)',
            textDecoration: 'none',
            fontWeight: 'bold',
            letterSpacing: '-0.02em',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            zIndex: 2
          }}>
            AMERICA250
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
              color: 'var(--linen)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              zIndex: 2
            }}
            className="nav-link"
            >
              HOME
            </Link>
            
            <Link href="/volunteer" style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '1.1rem',
              color: 'var(--linen)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              zIndex: 2
            }}
            className="nav-link"
            >
              VOLUNTEER PAGE
            </Link>
            
            <Link href="/qsl-cards" style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '1.1rem',
              color: 'var(--linen)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              zIndex: 2
            }}
            className="nav-link"
            >
              QSL CARDS
            </Link>
            
            <Link href="/meet-the-founders" style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '1.1rem',
              color: 'var(--linen)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              zIndex: 2
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
        

        
        /* Ensure proper spacing for fixed navbar */
        @media (min-width: 769px) {
          :global(body) {
            padding-top: 75px;
          }
        }
      `}</style>
    </>
  );
} 