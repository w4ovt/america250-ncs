'use client';

import Image from 'next/image';

export default function GuideButton() {
  return (
    <button
      className="guide-btn"
      type="button"
      onClick={() => window.open('/ncs-guide.pdf', '_blank', 'noopener,noreferrer')}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'block',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      <Image
        src="/K4A-NCS-Guide.webp"
        alt="K4A NCS Guide - Click to open PDF"
        width={400}
        height={200}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '6px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(104, 63, 27, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(104, 63, 27, 0.15)';
        }}
        priority
      />
    </button>
  );
} 