import { useState, useEffect, useRef } from 'react';
import { ViewType } from '../../pages/Index';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Grid } from 'lucide-react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import ResultCard from './ResultCard';

interface SearchViewProps {
  onNavigate: (view: ViewType) => void;
}

interface Photo {
  filename: string;
  path: string;
  size: number;
  uploadDate: string;
}

type Message = {
  id: string;
  type: 'user' | 'assistant' | 'typing' | 'results';
  content: string;
  results?: Array<{ image: string; caption: string; path?: string }>;
};

const SearchView = ({ onNavigate }: SearchViewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'assistant', content: 'Your photos are ready! What would you like to search for?' }
  ]);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('http://192.168.0.17:8081/api/photos');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    
    // Add user query
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, type: 'user', content: query }
    ]);

    // Show typing indicator
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: 'typing', type: 'typing', content: '' }
      ]);
    }, 100);

    // Show results with real photos
    setTimeout(() => {
      const shuffledPhotos = [...photos].sort(() => 0.5 - Math.random());
      const searchResults = shuffledPhotos.slice(0, 4).map((photo, index) => ({
        image: `http://192.168.0.17:8081${photo.path}`,
        caption: `Photo matching "${query}" - ${photo.filename}`,
        path: photo.path
      }));

      setMessages(prev => [
        ...prev.filter(m => m.type !== 'typing'),
        { 
          id: `results-${Date.now()}`, 
          type: 'results', 
          content: 'Search results',
          results: searchResults.length > 0 ? searchResults : [
            { image: '📸', caption: 'No photos found matching your search. Try a different term.' }
          ]
        }
      ]);
      setIsSearching(false);
    }, 400);

    setQuery('');
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'typing') {
      return <TypingIndicator key={message.id} />;
    }
    
    if (message.type === 'results') {
      return (
        <div key={message.id} className="mb-6">
          <div className="flex justify-start mb-4">
            <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-md shadow-sm border border-separator">
              <span className="text-sm font-rubik text-gray-700">Found {message.results?.length} photos:</span>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {message.results?.map((result, index) => (
              <ResultCard
                key={index}
                image={result.image}
                caption={result.caption}
                index={index}
                isRealImage={result.path !== undefined}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <ChatBubble key={message.id} type={message.type as 'user' | 'assistant'}>
        {message.content}
      </ChatBubble>
    );
  };

  return (
    <div className="min-h-screen bg-surface-light flex flex-col">
      {/* Chat History with proper top padding for iPhone safe area */}
      <div className="flex-1 overflow-y-auto p-4 pt-20 pb-40">
        {messages.map(renderMessage)}
        <div ref={scrollRef} />
      </div>

      {/* Fixed Bottom Navigation Area */}
      <div className="fixed bottom-4 left-4 right-4 space-y-3">
        {/* Gallery Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => onNavigate('gallery')}
            className="bg-white/90 backdrop-blur-md border border-separator text-gray-700 hover:bg-white shadow-lg px-6 py-3 rounded-2xl font-rubik"
            variant="outline"
          >
            <Grid className="w-5 h-5 mr-2" />
            View Gallery
          </Button>
        </div>

        {/* Search Bar */}
        <div className="bg-white/90 backdrop-blur-md border border-separator rounded-2xl shadow-lg p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your photos..."
              className="flex-1 font-rubik border-separator focus:border-accent-primary min-h-14 bg-white/50"
              disabled={isSearching}
            />
            <Button 
              type="submit" 
              disabled={!query.trim() || isSearching}
              className="px-6 bg-accent-primary hover:bg-blue-600 font-rubik min-h-14"
            >
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchView;
