"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const MENU_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/volunteer', label: 'VOLUNTEER PAGE' },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <>
      <button
        className="hamburger"
        aria-label="Open menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      {open && (
        <div className="overlay">
          <div className="drawer" ref={drawerRef}>
            {MENU_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="menuLink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
} 