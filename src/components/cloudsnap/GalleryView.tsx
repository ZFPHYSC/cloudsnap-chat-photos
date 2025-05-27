
import { ViewType } from '../../pages/Index';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface GalleryViewProps {
  onNavigate: (view: ViewType) => void;
}

const GalleryView = ({ onNavigate }: GalleryViewProps) => {
  const photos = [
    '🌅', '🏔️', '🌺', '🦋', '🌊', '🌸', '🍃', '⭐',
    '🌙', '☀️', '🎨', '📸', '🌈', '🌴', '🏖️', '🌻',
    '🦄', '🌋', '🏝️', '🌿', '🌷', '🌼', '🌱', '🌊'
  ];

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Header with iPhone safe area padding */}
      <div className="flex items-center justify-between p-4 pt-16 border-b border-separator bg-white/80 backdrop-blur-md">
        <h1 className="text-xl font-semibold font-rubik">Gallery</h1>
        <Button
          onClick={() => onNavigate('search')}
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Masonry Grid */}
      <div className="p-2">
        <div className="columns-3 gap-1 space-y-1">
          {photos.map((emoji, index) => (
            <div
              key={index}
              className={`
                bg-gradient-to-br from-blue-100 to-purple-100 
                rounded-lg overflow-hidden shadow-sm border border-separator
                flex items-center justify-center text-4xl
                animate-bubble-enter cursor-pointer
                hover:shadow-lg transition-shadow duration-200
                ${index % 3 === 0 ? 'h-32' : index % 3 === 1 ? 'h-40' : 'h-36'}
              `}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryView;
