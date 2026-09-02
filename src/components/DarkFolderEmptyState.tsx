import React from 'react';
import { motion } from 'motion/react';
import { DarkFrostedFolderIllustration } from './DarkFrostedFolderIllustration.tsx';

interface DarkFolderEmptyStateProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onCreateNew?: () => void;
  className?: string;
}

export const DarkFolderEmptyState: React.FC<DarkFolderEmptyStateProps> = ({
  title = "Expect to see your orders appear here soon!",
  subtitle = "Here is where you'll manage order fulfillment, payment collection, and order progress tracking.",
  buttonText = "Create New",
  onCreateNew,
  className = "",
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center text-center py-16 w-full overflow-hidden select-none bg-transparent ${className}`}
    >
      {/* 3D Dark Frosted Folder Illustration */}
      <div className="mb-8">
        <DarkFrostedFolderIllustration />
      </div>

      {/* Content Block */}
      <div className="space-y-2 max-w-[360px] mx-auto mb-7 z-10 px-4">
        {/* Main Heading */}
        <h3 className="text-[17px] sm:text-[18px] font-bold text-[#111] tracking-tight">
          {title}
        </h3>

        {/* Subtitle */}
        <p className="text-[13.5px] text-[#666] font-normal leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Button */}
      <div className="z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCreateNew}
          className="relative inline-flex items-center justify-center px-8 py-[11px] rounded-full text-[13.5px] font-semibold text-white tracking-wide cursor-pointer transition-all shadow-[0_4px_12px_rgba(37,117,252,0.25)] bg-[#2575FC] hover:bg-[#2169C4]"
        >
          <span className="relative z-10">{buttonText}</span>
        </motion.button>
      </div>
    </div>
  );
};
