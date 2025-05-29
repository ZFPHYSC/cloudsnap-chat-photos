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
