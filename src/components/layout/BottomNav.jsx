import React from 'react'

const tabs = [
  { id: 'home',    label: 'Home',    icon: HomeIcon },
  { id: 'workout', label: 'Workout', icon: WorkoutIcon },
  { id: 'log',     label: 'Log',     icon: LogIcon },
  { id: 'progress',label: 'Progress',icon: ProgressIcon },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-white/10 safe-bottom">
      <div className="flex">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                isActive ? 'text-accent' : 'text-muted'
              }`}
            >
              <Icon size={22} active={isActive} />
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function HomeIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function WorkoutIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="18" y2="12"/>
      <circle cx="3" cy="12" r="2" fill={active ? 'currentColor' : 'none'}/>
      <circle cx="21" cy="12" r="2" fill={active ? 'currentColor' : 'none'}/>
      <rect x="6" y="8" width="3" height="8" rx="1" fill={active ? 'currentColor' : 'none'}/>
      <rect x="15" y="8" width="3" height="8" rx="1" fill={active ? 'currentColor' : 'none'}/>
    </svg>
  )
}

function LogIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="15" y2="17"/>
      <line x1="9" y1="9" x2="11" y2="9"/>
    </svg>
  )
}

function ProgressIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
}
