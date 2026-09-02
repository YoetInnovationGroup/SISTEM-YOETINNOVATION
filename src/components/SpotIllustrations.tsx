import React from 'react';

export const StayOrganizedIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="apple-org-grad" x1="16" y1="12" x2="64" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.04" />
      </linearGradient>
      <linearGradient id="sheet-grad" x1="24" y1="16" x2="56" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F8FAFC" />
      </linearGradient>
      <filter id="apple-soft-shadow" x="12" y="14" width="56" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
      </filter>
    </defs>

    {/* Apple Squircle Base Glow */}
    <rect x="14" y="14" width="52" height="52" rx="16" fill="url(#apple-org-grad)" />

    {/* Back Sheet */}
    <rect x="29" y="19" width="28" height="34" rx="6" fill="#E2E8F0" className="dark:fill-[#2A2A32]" />
    
    {/* Main Front Document */}
    <g filter="url(#apple-soft-shadow)">
      <rect x="23" y="24" width="34" height="40" rx="8" fill="url(#sheet-grad)" className="dark:fill-[#1E1E24]" stroke="#E2E8F0" strokeWidth="1" />
    </g>

    {/* Lines on front document */}
    <rect x="29" y="32" width="14" height="3" rx="1.5" fill="#3B82F6" />
    <rect x="29" y="39" width="22" height="2" rx="1" fill="#94A3B8" className="dark:fill-[#64748B]" />
    <rect x="29" y="45" width="18" height="2" rx="1" fill="#94A3B8" className="dark:fill-[#64748B]" />
    <rect x="29" y="51" width="12" height="2" rx="1" fill="#CBD5E1" className="dark:fill-[#475569]" />

    {/* Apple Checkmark Badge */}
    <circle cx="51" cy="53" r="8" fill="#2563EB" />
    <path d="M48 53 L50.2 55.2 L54.5 50.8" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SyncNotesIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="apple-sync-grad" x1="16" y1="12" x2="64" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.04" />
      </linearGradient>
      <filter id="sync-soft-shadow" x="14" y="14" width="52" height="52" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
      </filter>
    </defs>

    {/* Background Squircle */}
    <rect x="14" y="14" width="52" height="52" rx="16" fill="url(#apple-sync-grad)" />

    {/* Central Apple Cloud Node */}
    <g filter="url(#sync-soft-shadow)">
      <rect x="20" y="22" width="40" height="36" rx="12" fill="#FFFFFF" className="dark:fill-[#1E1E24]" stroke="#E2E8F0" strokeWidth="1" />
    </g>

    {/* Cloud glyph */}
    <path 
      d="M32 44 H48 C51.3 44 54 41.3 54 38 C54 34.9 51.6 32.3 48.6 32.1 C47.9 27.5 44 24 39.2 24 C35.2 24 31.8 26.5 30.4 30.1 C27.3 30.7 25 33.4 25 36.6 C25 40.7 28.1 44 32 44 Z" 
      fill="#EEF2FF" 
      className="dark:fill-[#2D2D38]" 
    />

    {/* Dual Sync Arrows */}
    <path d="M35 37 C35.8 34.5 38.5 33 41.2 33.6 C43.2 34 44.8 35.5 45.4 37" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
    <path d="M43.5 37 H46 V34.5" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

    <path d="M45 42 C44.2 44.5 41.5 46 38.8 45.4 C36.8 45 35.2 43.5 34.6 42" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
    <path d="M36.5 42 H34 V44.5" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CollaborateShareIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="apple-share-grad" x1="16" y1="12" x2="64" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.04" />
      </linearGradient>
      <filter id="share-soft-shadow" x="14" y="14" width="52" height="52" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
      </filter>
    </defs>

    {/* Background Squircle */}
    <rect x="14" y="14" width="52" height="52" rx="16" fill="url(#apple-share-grad)" />

    {/* Central Card */}
    <g filter="url(#share-soft-shadow)">
      <rect x="20" y="22" width="40" height="36" rx="12" fill="#FFFFFF" className="dark:fill-[#1E1E24]" stroke="#E2E8F0" strokeWidth="1" />
    </g>

    {/* Left User Avatar */}
    <circle cx="33" cy="36" r="5" fill="#E2E8F0" className="dark:fill-[#33333F]" />
    <path d="M26 49 C26 45 29 43 33 43 C37 43 40 45 40 49" fill="#CBD5E1" className="dark:fill-[#444455]" />

    {/* Right User Avatar (Active) */}
    <circle cx="47" cy="34" r="5.5" fill="#10B981" />
    <path d="M40 47 C40 43 43 41 47 41 C51 41 54 43 54 47" fill="#059669" />

    {/* Apple Share Connection Spark */}
    <circle cx="40" cy="38" r="2" fill="#34D399" />
  </svg>
);

export const GoPremiumIllustration: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="16" y="16" width="48" height="48" rx="16" fill="#F8FAFC" className="dark:fill-[#1E1E24]" />
    <rect x="24" y="44" width="8" height="14" rx="2" fill="#94A3B8" />
    <rect x="36" y="34" width="8" height="24" rx="2" fill="#3B82F6" />
    <rect x="48" y="26" width="8" height="32" rx="2" fill="#2563EB" />
  </svg>
);

export { DarkFrostedFolderIllustration } from './DarkFrostedFolderIllustration.tsx';
