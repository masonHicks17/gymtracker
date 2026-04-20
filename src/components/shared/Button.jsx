import React from 'react'

export default function Button({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, type = 'button', fullWidth = false }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none'

  const variants = {
    primary:  'bg-accent text-white shadow-lg',
    secondary:'bg-surface-2 text-white border border-white/10',
    ghost:    'text-muted hover:text-white',
    danger:   'bg-danger text-white',
    pr:       'bg-pr text-black',
  }

  const sizes = {
    sm:  'px-3 py-2 text-sm gap-1.5',
    md:  'px-5 py-3 text-base gap-2',
    lg:  'px-6 py-4 text-lg gap-2',
    xl:  'px-8 py-5 text-xl gap-3',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
