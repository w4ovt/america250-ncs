'use client';

export default function GuideButton() {
  return (
    <button
      className="guide-btn"
      type="button"
      onClick={() => window.open('/ncs-guide.pdf', '_blank', 'noopener,noreferrer')}
    >
      K4A NCS Guide
    </button>
  );
} 