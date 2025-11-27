// src/components/react/WaitlistCTA.tsx
import { useState } from 'react';
import WaitlistModal from './WaitlistModal';

interface WaitlistCTAProps {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export default function WaitlistCTA({ 
  variant = 'primary', 
  size = 'default',
  className = '',
  children 
}: WaitlistCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-all duration-200 focus:outline-none focus:ring-2 
    focus:ring-accent focus:ring-offset-2 focus:ring-offset-zinc-950
  `;

  const sizeClasses = {
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20 hover:shadow-accent/30',
    secondary: 'bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600',
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
      <WaitlistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

