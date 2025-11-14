import { StickyNote } from 'lucide-react';

export function Notes() {
  return (
    <div className="p-4 pb-20">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 text-center border border-amber-100">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <StickyNote className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="mb-2">Notes Feature</h2>
        <p className="text-sm text-gray-600 mb-4">
          This feature is coming soon! You'll be able to create and manage notes with tags.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 rounded-full text-xs">
          <span className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
          In Development
        </div>
      </div>
    </div>
  );
}
