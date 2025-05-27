
import { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import AccountFormBubble from './AccountFormBubble';
import ThumbnailGridBubble from './ThumbnailGridBubble';
import ProgressBubble from './ProgressBubble';
import { ViewType } from '../../pages/Index';
import { Button } from '../ui/button';

interface ChatViewProps {
  onNavigate: (view: ViewType) => void;
}

type Message = {
  id: string;
  type: 'user' | 'assistant' | 'typing' | 'account-form' | 'account-choice' | 'permission-request' | 'thumbnails' | 'progress' | 'action-button';
  content: string;
  accountType?: 'create' | 'login';
  total?: number;
};

const ChatView = ({ onNavigate }: ChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial-1', type: 'user', content: 'Get Started' }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = [
    () => {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: 'typing-1', type: 'typing', content: '' }
        ]);
      }, 500);
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev.filter(m => m.type !== 'typing'),
          { id: 'assistant-2', type: 'assistant', content: "Let's set up your account. Choose an option:" }
        ]);
        // Move to next step after showing the message
        setCurrentStep(1);
      }, 1000);
    },
    () => {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: 'choice-3', type: 'account-choice', content: 'Account options' }
        ]);
      }, 500);
    }
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      steps[currentStep]();
    }
  }, [currentStep]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAccountChoice = (type: 'create' | 'login') => {
    setMessages(prev => [
      ...prev.filter(m => m.type !== 'account-choice'),
      { id: 'user-choice-4', type: 'user', content: type === 'create' ? 'Create Account' : 'Log In' },
      { id: 'form-5', type: 'account-form', content: 'Account form', accountType: type }
    ]);
  };

  const handleAccountSubmit = (email: string, password: string) => {
    setMessages(prev => [
      ...prev.filter(m => m.type !== 'account-form'),
      { id: 'user-form-6', type: 'user', content: `Account created with ${email}` },
      { id: 'typing-7', type: 'typing', content: '' }
    ]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev.filter(m => m.type !== 'typing'),
        { id: 'assistant-8', type: 'assistant', content: '✅ Account created — welcome!' }
      ]);
    }, 1000);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: 'assistant-9', type: 'assistant', content: 'I need permission to access your photos to get started.' },
        { id: 'permission-10', type: 'permission-request', content: 'Permission request' }
      ]);
    }, 2000);
  };

  const handlePermissionResponse = (granted: boolean) => {
    if (granted) {
      setMessages(prev => [
        ...prev.filter(m => m.type !== 'permission-request'),
        { id: 'user-permission-11', type: 'user', content: 'Allow Access' },
        { id: 'assistant-12', type: 'assistant', content: 'Great! Now accessing your photos...' },
        { id: 'thumbnails-13', type: 'thumbnails', content: 'Photo selection' }
      ]);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: 'progress-14', type: 'progress', content: 'Upload progress', total: 12 }
        ]);
      }, 2000);
    } else {
      setMessages(prev => [
        ...prev.filter(m => m.type !== 'permission-request'),
        { id: 'user-permission-11', type: 'user', content: 'Deny Access' },
        { id: 'assistant-12', type: 'assistant', content: 'I need photo access to help you search. Please allow access to continue.' },
        { id: 'permission-13', type: 'permission-request', content: 'Permission request' }
      ]);
    }
  };

  const handleUploadComplete = () => {
    setMessages(prev => [
      ...prev.filter(m => m.type !== 'progress'),
      { id: 'assistant-15', type: 'assistant', content: 'Uploaded 12 photos • saved 27.6 MB. 👍🏼' },
      { id: 'action-16', type: 'action-button', content: 'Start Searching →' }
    ]);
  };

  const handleStartSearching = () => {
    onNavigate('search');
  };

  const renderMessage = (message: Message) => {
    switch (message.type) {
      case 'typing':
        return <TypingIndicator key={message.id} />;
      
      case 'account-choice':
        return (
          <div key={message.id} className="flex justify-start mb-4">
            <div className="bg-white p-4 rounded-2xl rounded-tl-md shadow-sm border border-separator max-w-[80%] animate-bubble-enter">
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleAccountChoice('create')}
                  className="bg-accent-primary hover:bg-blue-600 text-white font-rubik"
                >
                  Create Account
                </Button>
                <Button
                  onClick={() => handleAccountChoice('login')}
                  variant="outline"
                  className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white font-rubik"
                >
                  Log In
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'permission-request':
        return (
          <div key={message.id} className="flex justify-start mb-4">
            <div className="bg-white p-4 rounded-2xl rounded-tl-md shadow-sm border border-separator max-w-[80%] animate-bubble-enter">
              <div className="mb-3">
                <p className="font-rubik text-sm text-gray-700 mb-3">
                  CloudSnap would like to access your photos to help you search and organize them.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handlePermissionResponse(true)}
                  className="bg-accent-primary hover:bg-blue-600 text-white font-rubik"
                >
                  Allow Access
                </Button>
                <Button
                  onClick={() => handlePermissionResponse(false)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 font-rubik"
                >
                  Deny Access
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'account-form':
        return (
          <div key={message.id} className="flex justify-start mb-4">
            <AccountFormBubble 
              type={message.accountType || 'create'}
              onSubmit={handleAccountSubmit}
            />
          </div>
        );
      
      case 'thumbnails':
        return (
          <div key={message.id} className="flex justify-start mb-4">
            <ThumbnailGridBubble />
          </div>
        );
      
      case 'progress':
        return (
          <div key={message.id} className="flex justify-start mb-4">
            <ProgressBubble 
              total={message.total || 12}
              onComplete={handleUploadComplete}
            />
          </div>
        );
      
      case 'action-button':
        return (
          <div key={message.id} className="flex justify-end mb-4">
            <Button
              onClick={handleStartSearching}
              className="bg-accent-primary hover:bg-blue-600 text-white px-6 py-3 rounded-full font-rubik animate-bubble-enter"
            >
              {message.content}
            </Button>
          </div>
        );
      
      default:
        return (
          <ChatBubble key={message.id} type={message.type as 'user' | 'assistant'}>
            {message.content}
          </ChatBubble>
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface-light flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 pb-8 pt-16 md:pt-4">
        {messages.map(renderMessage)}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default ChatView;
