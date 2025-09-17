import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { RotateCcw, FileText, ChevronLeft, ChevronRight, Type, Plus, Minus, Play, SkipBack, Moon, Sun, Square } from 'lucide-react';

function App() {
  const defaultMarkdown = `# Intro (keep it tight)
- Your DB bill is creeping up because every read hits the database.  
- Today I'll show how Cloudflare KV + Hono + SWR slashes reads, cuts p95, and keeps data "fresh enough."  
- I'll also call out where KV doesn't fit so you don't ship stale lies or break critical flows.

## What You'll Learn
- The cache-aside + SWR flow (KV hit → serve; stale → serve + \`waitUntil()\` refresh; hard-expire → hit DB).  
- Soft vs hard TTLs you can actually use, and simple key versioning.  
- Minimal Hono setup (KV binding, key design per tenant/type/id).  
- Safe invalidation basics and an emergency cache-bypass switch.  
- When **not** to use KV (payments, counters, strict consistency) and what to use instead.

## Standard Intro (drop-in)
- "Hey, I'm **Dwain Browne** from Toronto—software dev turned entrepreneur. I test **Cloudflare, Azure/.NET, and AI** to build faster, leaner SaaS—sharing what works and what doesn't."  
- "If you're a founder or technical builder, **subscribe**. Want help with automation or scaling? **Book a free strategy session:** https://dwain.me/meet. Check out **https://snapsuite.io** and **https://getleadscore.ai**."`;

  const [markdown, setMarkdown] = useState(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem('teleprompter-markdown');
    return saved || defaultMarkdown;
  }); const [html, setHtml] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [fontSize, setFontSize] = useState(90);
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0.05);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const parseMarkdown = async () => {
      // Configure marked with better options
      marked.setOptions({
        breaks: true, // Convert line breaks to <br>
        gfm: true, // Enable GitHub Flavored Markdown
      });
      
      const parsedHtml = await marked.parse(markdown);
      setHtml(parsedHtml);
    };
    parseMarkdown();
  }, [markdown]);

  // Save markdown to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('teleprompter-markdown', markdown);
  }, [markdown]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isScrolling && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      console.log('Container height:', container.clientHeight);
      console.log('Scroll height:', container.scrollHeight);
      console.log('Can scroll:', container.scrollHeight > container.clientHeight);
      
      console.log('Starting scroll interval'); // Debug log
      scrollIntervalRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          const currentScrollTop = scrollContainerRef.current.scrollTop;
          scrollContainerRef.current.scrollBy({
            top: scrollSpeed * 1, // Increased from 0.25 to 1 to make it more visible
            behavior: 'auto'
          });
          console.log('Scrolling...', currentScrollTop, 'to', scrollContainerRef.current.scrollTop); // Debug log
        }
      }, 50); // Also reduced interval back to 50ms for smoother movement
    } else {
      console.log('Stopping scroll interval'); // Debug log
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isScrolling, scrollSpeed]);

  const resetScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsScrolling(false);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto pr-4 sm:pr-6 lg:pr-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section: Logo, Title, and All Controls */}
            <div className="flex items-center space-x-4 pl-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dwain's Teleprompter</h1>
              </div>
              
              {/* Start Button */}
              {!isScrolling && (
                <button
                  onClick={() => {
                    setIsScrolling(true);
                    setIsCollapsed(true);
                    setIsFlipped(true);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 h-10 rounded-lg font-semibold transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-green-600 text-white hover:bg-green-500 shadow-lg' 
                      : 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
                  }`}
                  title="Start teleprompter scrolling"
                >
                  <Play className="h-4 w-4" />
                  <span>START</span>
                </button>
              )}

              {/* Stop Button */}
              {isScrolling && (
                <button
                  onClick={() => {
                    setIsScrolling(false);
                    setIsCollapsed(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 h-10 rounded-lg font-semibold transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg' 
                      : 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                  }`}
                  title="Stop teleprompter scrolling"
                >
                  <Square className="h-4 w-4" />
                  <span>STOP</span>
                </button>
              )}

              {/* Teleprompter Controls */}
              <div className={`flex items-center space-x-2 rounded-lg px-3 py-2 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <button
                  onClick={resetScroll}
                  className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  title="Reset to top"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setScrollSpeed(Math.max(0.05, scrollSpeed - 0.05))}
                    className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    title="Slower"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className={`text-xs min-w-[2.5rem] text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{scrollSpeed.toFixed(2)}x</span>
                  <button
                    onClick={() => setScrollSpeed(Math.min(3, scrollSpeed + 0.05))}
                    className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    title="Faster"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right section: Settings and Toggle buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`flex items-center space-x-2 px-4 py-2 h-10 rounded-lg transition-all duration-200 ${
                  isCollapsed 
                    ? isDarkMode 
                      ? 'bg-green-900 text-green-300 shadow-inner' 
                      : 'bg-green-100 text-green-700 shadow-inner'
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                <span className="font-medium">
                  {isCollapsed ? 'Show Editor' : 'Hide Editor'}
                </span>
              </button>
              
              {/* Font Controls */}
              <div className={`flex items-center space-x-2 rounded-lg px-3 py-2 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Type className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className={`bg-transparent text-sm font-medium focus:outline-none ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times</option>
                  <option value="Inter">Inter</option>
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="system-ui">System</option>
                  <option value="monospace">Mono</option>
                </select>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className={`text-xs min-w-[2rem] text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{fontSize}px</span>
                  <button
                    onClick={() => setFontSize(Math.min(120, fontSize + 2))}
                    className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className={`flex items-center space-x-2 px-4 py-2 h-10 rounded-lg transition-all duration-200 ${
                  isFlipped 
                    ? isDarkMode 
                      ? 'bg-blue-900 text-blue-300 shadow-inner' 
                      : 'bg-blue-100 text-blue-700 shadow-inner'
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <RotateCcw className="h-4 w-4" />
                <span className="font-medium">
                  {isFlipped ? 'Normal' : 'Flipped'}
                </span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center space-x-2 px-4 py-2 h-10 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="font-medium">
                  {isDarkMode ? 'Light' : 'Dark'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Input Panel */}
        <div className={`border-r flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-0 overflow-hidden' : 'w-1/2'
        } ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex-1 p-6">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className={`w-full h-full resize-none border rounded-lg p-4 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-600 text-gray-100 focus:border-blue-400' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              }`}
              placeholder="Enter your markdown content here..."
              spellCheck="false"
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-full' : 'w-1/2'
        } ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            <div 
              className={`p-6 transition-transform duration-300 ease-in-out ${
                isFlipped ? 'transform scale-x-[-1]' : ''
              } ${isDarkMode ? 'bg-black' : 'bg-white'}`}
            >
              <div
                className="prose prose-lg max-w-none leading-relaxed"
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.6,
                  paddingBottom: '200vh'
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;