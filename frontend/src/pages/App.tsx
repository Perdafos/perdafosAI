import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ImagePlus, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: 'user' | 'ai';
  content: string;
  image?: string | null;
}

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, isLoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const currentInput = input;
    const currentImage = selectedImage;
    
    const userMessage: Message = { role: 'user', content: currentInput, image: currentImage };
    setMessages((prev) => [...prev, userMessage]);
    
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

      try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput || 'Tolong jelaskan gambar ini', image: currentImage }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const aiMessage: Message = { role: 'ai', content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground max-w-3xl mx-auto border-x">
      <header className="p-4 border-b flex items-center justify-between bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-semibold">
          <div className="bg-primary p-1.5 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>AI Assistant v2 (TS)</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setMessages([])}>New Chat</Button>
      </header>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-6 pb-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold tracking-tight">Apa yang bisa saya bantu?</h2>
              <p className="text-muted-foreground mt-2">Ketik sesuatu untuk memulai percakapan.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center border shrink-0 ${msg.role === 'user' ? 'bg-zinc-100' : 'bg-primary'}`}>
                  {msg.role === 'user' ? <User size={14} className="text-zinc-900" /> : <Bot size={14} className="text-primary-foreground" />}
                </div>
                <Card className={`p-4 shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground border-none' : 'bg-muted/50 border-none'}`}>
                  {msg.image && (
                    <div className="mb-3">
                      <img src={msg.image} alt="Uploaded content" className="max-w-[200px] rounded-md border" />
                    </div>
                  )}
                  <div className="prose dark:prose-invert prose-sm leading-relaxed overflow-hidden">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </Card>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Loader2 size={14} className="animate-spin text-primary-foreground" />
              </div>
              <Card className="p-4 bg-muted/50 border-none">
                <span className="text-sm animate-pulse text-muted-foreground">Sedang berpikir...</span>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <footer className="p-4 border-t bg-background">
        <div className="flex flex-col gap-2">
          {selectedImage && (
            <div className="relative w-20 h-20">
              <img src={selectedImage} alt="Selected" className="w-full h-full object-cover rounded-md border" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-background border rounded-full p-0.5"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <Button variant="outline" size="icon" className="h-11 w-11 shrink-0" onClick={() => fileInputRef.current?.click()}>
              <ImagePlus size={18} />
            </Button>
            <Input
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan sesuatu..."
              className="flex-1 h-11"
            />
            <Button onClick={handleSend} disabled={isLoading || (!input.trim() && !selectedImage)} size="icon" className="h-11 w-11 shrink-0">
              <Send size={18} />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;