import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PromptInputBox } from '@/components/PromptInputBox';
import { ModeToggle } from '@/components/mode-toggle';

interface Message {
  role: 'user' | 'ai';
  content: string;
  image?: string | null;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, isLoading]);

  const fileToDataURL = (file: File) =>
    new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });

  const handlePromptSend = async (message: string, files?: File[]) => {
    if (!message.trim() && (!files || files.length === 0)) return;

    setIsLoading(true);

    let imageBase64: string | null = null;
    if (files && files.length > 0 && files[0]) {
      imageBase64 = await fileToDataURL(files[0]);
    }

    const userMessage: Message = { role: 'user', content: message, image: imageBase64 };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message || 'Tolong jelaskan gambar ini', image: imageBase64 }),
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
    <>
      <div className="flex flex-col h-screen bg-background text-foreground w-full max-w-3xl mx-auto">
        <header className="p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 font-semibold">
            <div className="bg-primary p-1.5 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span>Ai Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={() => setMessages([])}>New Chat</Button>
          </div>
        </header>

        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-6 pb-4">
            {messages.length === 0 && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold tracking-tight">What Can I Help You With?</h2>
                <p className="text-muted-foreground mt-2">Type something to start a conversation.</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center  shrink-0 ${msg.role === 'user' ? 'bg-zinc-100' : 'bg-primary'}`}>
                    {msg.role === 'user' ? <User size={14} className="text-zinc-900" /> : <Bot size={14} className="text-primary-foreground" />}
                  </div>
                  <Card className={`p-4 shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground -none' : 'bg-muted/50 -none'}`}>
                    {msg.image && (
                      <div className="mb-3">
                        <img src={msg.image} alt="Uploaded content" className="max-w-[200px] rounded-md " />
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
                <Card className="p-4 bg-muted/50 -none">
                  <span className="text-sm animate-pulse text-muted-foreground">Thinking...</span>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        <footer className="p-4 -t bg-background">
          <div className="flex flex-col gap-2">
            <div className="mx-auto w-full max-w-6xl px-4">
              <PromptInputBox onSend={handlePromptSend} isLoading={isLoading} placeholder="Ask Something..." />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;