'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './HamburgerMenu.module.css';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getNavLinkStyle = (path: string) => ({
    fontFamily: 'librebaskerville-bold, serif',
    fontSize: '1.1rem',
    color: 'var(--linen)',
    textDecoration: isActive(path) ? 'underline' : 'none',
    textDecorationColor: isActive(path) ? 'var(--bronze)' : 'transparent',
    textUnderlineOffset: '4px',
    textDecorationThickness: '2px',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
    zIndex: 2,
    background: isActive(path) ? 'rgba(199, 161, 89, 0.2)' : 'transparent'
  });

  const getMobileLinkStyle = (path: string) => ({
    textDecoration: isActive(path) ? 'underline' : 'none',
    textDecorationColor: isActive(path) ? 'var(--bronze)' : 'transparent',
    textUnderlineOffset: '4px',
    textDecorationThickness: '2px',
    background: isActive(path) ? 'rgba(199, 161, 89, 0.2)' : 'transparent'
  });

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
          margin: '0 auto',
          minWidth: 0
        }} className="nav-container"
        >
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
            zIndex: 2,
            whiteSpace: 'nowrap'
          }} className="nav-logo">
            AMERICA250
          </Link>

          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'nowrap',
            minWidth: 0
          }} className="nav-links"
          >
            <Link href="/" style={getNavLinkStyle('/')} className="nav-link">
              HOME
            </Link>
            
            <Link href="/volunteer" style={getNavLinkStyle('/volunteer')} className="nav-link">
              VOLUNTEER PAGE
            </Link>
            
            <Link href="/qsl-cards" style={getNavLinkStyle('/qsl-cards')} className="nav-link">
              QSL CARDS
            </Link>
            
            <Link href="/meet-the-founders" style={getNavLinkStyle('/meet-the-founders')} className="nav-link">
              MEET THE FOUNDERS
            </Link>
            
            <Link href="/our-story" style={getNavLinkStyle('/our-story')} className="nav-link">
              OUR STORY
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
            <Link href="/" className={isActive('/') ? `${styles.menuLink} active` : styles.menuLink} style={getMobileLinkStyle('/')} onClick={closeMenu}>
              Home
            </Link>
            <Link href="/volunteer" className={isActive('/volunteer') ? `${styles.menuLink} active` : styles.menuLink} style={getMobileLinkStyle('/volunteer')} onClick={closeMenu}>
              Volunteer Page
            </Link>
            <Link href="/qsl-cards" className={isActive('/qsl-cards') ? `${styles.menuLink} active` : styles.menuLink} style={getMobileLinkStyle('/qsl-cards')} onClick={closeMenu}>
              QSL Cards
            </Link>
            <Link href="/meet-the-founders" className={isActive('/meet-the-founders') ? `${styles.menuLink} active` : styles.menuLink} style={getMobileLinkStyle('/meet-the-founders')} onClick={closeMenu}>
              Meet the Founders
            </Link>
            <Link href="/our-story" className={isActive('/our-story') ? `${styles.menuLink} active` : styles.menuLink} style={getMobileLinkStyle('/our-story')} onClick={closeMenu}>
              Our Story
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
        
        /* Responsive navigation adjustments */
        @media (max-width: 1200px) {
          .nav-links {
            gap: 0.75rem;
          }
          
          .nav-logo {
            font-size: 1.3rem !important;
          }
        }
        
        @media (max-width: 1000px) {
          .nav-links {
            gap: 0.5rem;
          }
          
          .nav-logo {
            font-size: 1.2rem !important;
          }
        }
        
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          
          .hamburger {
            display: flex !important;
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