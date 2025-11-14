import { Menu, UserCircle } from 'lucide-react';
import { isGuestMode } from '../lib/storage';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const isGuest = isGuestMode();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <h1 className="absolute left-1/2 -translate-x-1/2">{title}</h1>
        
        <div className="flex items-center gap-2">
          {isGuest && (
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
              Guest
            </span>
          )}
          <UserCircle className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </header>
  );
}
