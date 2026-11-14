import React from 'react';

export const Badge = ({
  children,
  variant = 'burgundy',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    burgundy: 'bg-burgundy/10 text-burgundy border-burgundy/20',
    gold: 'bg-gold/15 text-gold-dark border-gold/30',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
