
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

type Message = {
  id: string;
  type: 'user' | 'assistant' | 'typing' | 'results';
  content: string;
  results?: Array<{ image: string; caption: string }>;
};

const SearchView = ({ onNavigate }: SearchViewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'assistant', content: 'Your photos are ready! What would you like to search for?' }
  ]);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sampleResults = [
    { image: '🌅', caption: 'Beautiful sunrise over mountains captured during morning hike' },
    { image: '🌺', caption: 'Colorful flowers in the garden during spring bloom' },
    { image: '🦋', caption: 'Butterfly landing on lavender flowers in macro detail' },
    { image: '🌊', caption: 'Ocean waves crashing against rocky coastline at sunset' }
  ];

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

    // Show results
    setTimeout(() => {
      setMessages(prev => [
        ...prev.filter(m => m.type !== 'typing'),
        { 
          id: `results-${Date.now()}`, 
          type: 'results', 
          content: 'Search results',
          results: sampleResults
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
      {/* Floating Gallery FAB */}
      <Button
        onClick={() => onNavigate('gallery')}
        className="fixed top-4 right-4 w-14 h-14 rounded-full bg-accent-primary hover:bg-blue-600 z-10 shadow-lg"
      >
        <Grid className="w-6 h-6" />
      </Button>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {messages.map(renderMessage)}
        <div ref={scrollRef} />
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-separator p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your photos..."
            className="flex-1 font-rubik border-separator focus:border-accent-primary min-h-14"
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
  );
};

export default SearchView;
