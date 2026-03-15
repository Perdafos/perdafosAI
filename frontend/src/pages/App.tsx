import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Loader2, Sparkles, Clipboard, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { PromptInputBox } from '@/components/PromptInputBox';
import { ModeToggle } from '@/components/mode-toggle';
import { useTheme } from '@/components/theme-provider';

interface Message {
  role: 'user' | 'ai';
  content: string;
  image?: string | null;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const gridColor = theme === 'dark' ? 'rgb(107, 114, 128)' : 'rgb(209, 213, 219)';

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100;
        if (isNearBottom) {
          scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
        }
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
      <div className="fixed inset-0 z-0 bg-background">
        <FlickeringGrid
          className="absolute inset-0"
          squareSize={4}
          gridGap={6}
          color={gridColor}
          maxOpacity={theme === 'dark' ? 0.3 : 0.2}
          flickerChance={0.1}
        />
      </div>

      <div className="relative z-10 flex flex-col h-screen text-foreground w-full max-w-3xl mx-auto">
        <div className="flex flex-col h-full">
          <header className="p-4 flex items-center justify-between">
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
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh]">
                  <h2 className="text-2xl font-bold tracking-tight text-center">What Can I Help You With?</h2>
                  <p className="text-muted-foreground mt-2 text-center">Type something to start a conversation.</p>
                  <div className="mt-8 w-full max-w-md">
                    <PromptInputBox onSend={handlePromptSend} isLoading={isLoading} placeholder="Ask Something..." />
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full mb-2`}>
                      <div className={`flex items-start gap-2 w-full max-w-full min-w-0 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-100' : 'bg-primary'}`}>
                          {msg.role === 'user' ? <User size={14} className="text-zinc-900" /> : <Bot size={14} className="text-primary-foreground" />}
                        </div>
                        <div className="flex flex-col min-w-0 max-w-[calc(100%-2.5rem)]">
                          <div className="max-w-full flex">
                            <Card
                              className={`p-4 shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'} min-w-0 max-w-full sm:max-w-[85vw] md:max-w-[70vw] lg:max-w-[60vw]`}
                              style={{ width: 'fit-content' }}
                            >
                              {msg.image && (
                                <div className="mb-3">
                                  <img src={msg.image} alt="Uploaded content" className="max-w-[50%] rounded-md" />
                                </div>
                              )}
                              <div className="prose dark:prose-invert prose-sm leading-relaxed max-w-none break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                <ReactMarkdown
                                  components={{
                                    p({children}) {
                                      return <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>;
                                    },
                                    ul({children}) {
                                      return <ul className="list-disc pl-5 mb-4 last:mb-0 space-y-1">{children}</ul>;
                                    },
                                    ol({children}) {
                                      return <ol className="list-decimal pl-5 mb-4 last:mb-0 space-y-1">{children}</ol>;
                                    },
                                    li({children}) {
                                      return <li>{children}</li>;
                                    },
                                    h1({children}) {
                                      return <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>;
                                    },
                                    h2({children}) {
                                      return <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0">{children}</h2>;
                                    },
                                    h3({children}) {
                                      return <h3 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h3>;
                                    },
                                    code({node, className, children, ...props}) {
                                      const match = /language-(\w+)/.exec(className || "");
                                      const isBlock = !!match;
                                      return isBlock ? (
                                        <div className="my-4 w-full max-w-full rounded-md text-[13px] leading-snug">
                                          <SyntaxHighlighter
                                            style={oneDark}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{ margin: 0, padding: '1.25rem', overflowX: 'auto', background: '#282c34', borderRadius: '0.375rem', maxWidth: '100%' }}
                                            {...props}
                                          >
                                            {String(children).replace(/\n$/, "")}
                                          </SyntaxHighlighter>
                                        </div>
                                      ) : (
                                        <code className={`${className} bg-muted px-1.5 py-0.5 rounded-md text-sm`} {...props}>
                                          {children}
                                        </code>
                                      );
                                    }
                                  }}
                                >
                                  {msg.content}
                                </ReactMarkdown>
                              </div>
                            </Card>
                          </div>
                          {/* Tombol copy dan ulangi di bawah bubble AI */}
                          {msg.role === 'ai' && (
                            <div className="flex gap-2 mt-2 justify-end">
                              <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(msg.content)} title="Copy this AI response">
                                <Clipboard className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handlePromptSend(messages.find(m => m.role === 'user' && messages.indexOf(m) < index)?.content || '')} title="Repeat last user prompt">
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
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
                </>
              )}
            </div>
          </ScrollArea>

          {messages.length > 0 && (
            <footer className="p-4 -t">
              <div className="flex flex-col gap-2">
                <div className="mx-auto w-full max-w-6xl px-4">
                  <PromptInputBox onSend={handlePromptSend} isLoading={isLoading} placeholder="Ask Something..." />
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};

export default App;