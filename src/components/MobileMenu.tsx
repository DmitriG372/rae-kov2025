import { memo } from 'react'

interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
}

export const MobileMenu = memo(function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:bg-slate-700/90 transition-all shadow-lg"
      aria-label="Ava menüü"
    >
      <span
        className={`w-6 h-0.5 bg-white transition-all ${
          isOpen ? 'rotate-45 translate-y-2' : ''
        }`}
      />
      <span
        className={`w-6 h-0.5 bg-white transition-all ${
          isOpen ? 'opacity-0' : ''
        }`}
      />
      <span
        className={`w-6 h-0.5 bg-white transition-all ${
          isOpen ? '-rotate-45 -translate-y-2' : ''
        }`}
      />
    </button>
  )
})
