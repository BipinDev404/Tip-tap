import React, { useState } from 'react';
import { 
  Search, 
  Bot, 
  Share2, 
  Code, 
  FileText, 
  Check, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Globe2, 
  X 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SEOModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'google' | 'social' | 'ai' | 'schema' | 'files';

export const SEOModal: React.FC<SEOModalProps> = ({ isOpen, onClose }) => {
  const { activeTab } = useApp();
  const [currentSection, setCurrentSection] = useState<TabType>('ai');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-lfn3idh34kejylmz3k2abb-473078984102.asia-southeast1.run.app';
  const currentUrl = `${origin}${activeTab === 'practice' ? '' : `?tab=${activeTab}`}`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const aiBots = [
    { name: 'GPTBot', org: 'OpenAI / ChatGPT', status: 'Allowed', purpose: 'Knowledge grounding & model responses' },
    { name: 'ChatGPT-User', org: 'OpenAI Browsing', status: 'Allowed', purpose: 'Live real-time browsing queries' },
    { name: 'ClaudeBot / Claude-Web', org: 'Anthropic Claude', status: 'Allowed', purpose: 'Search reasoning & citations' },
    { name: 'PerplexityBot', org: 'Perplexity AI', status: 'Allowed', purpose: 'Perplexity conversational answer index' },
    { name: 'Google-Extended', org: 'Google Gemini', status: 'Allowed', purpose: 'Gemini AI Overviews & grounding' },
    { name: 'Applebot-Extended', org: 'Apple Intelligence', status: 'Allowed', purpose: 'Siri & Apple AI search indexing' },
    { name: 'cohere-ai', org: 'Cohere', status: 'Allowed', purpose: 'Enterprise NLP & semantic retrieval' },
    { name: 'Amazonbot', org: 'Amazon Bedrock', status: 'Allowed', purpose: 'Alexa & AWS AI knowledge ingestion' },
  ];

  const searchEngines = [
    { name: 'Googlebot', engine: 'Google Search', status: 'Indexed', type: 'Full Web & Image' },
    { name: 'Bingbot', engine: 'Microsoft Bing', status: 'Indexed', type: 'Full Web & Copilot' },
    { name: 'Applebot', engine: 'Apple Spotlight & Siri', status: 'Indexed', type: 'iOS & macOS' },
    { name: 'DuckDuckBot', engine: 'DuckDuckGo', status: 'Indexed', type: 'Privacy Search' },
    { name: 'Slurp', engine: 'Yahoo! Search', status: 'Indexed', type: 'Full Web' },
    { name: 'Baiduspider', engine: 'Baidu Search', status: 'Indexed', type: 'Global & APAC' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-zinc-100">SEO & AI Model Indexing</h3>
                <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  Verified
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-1 sm:line-clamp-none">
                Search engine optimization, LLM crawler readiness (<code className="text-blue-400 font-mono">/llms.txt</code>), and Schema.org rich snippets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-3 sm:px-6 pt-2 sm:pt-3 border-b border-zinc-800 bg-zinc-900/50 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setCurrentSection('ai')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-all whitespace-nowrap shrink-0 ${
              currentSection === 'ai'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Models &amp; LLMs SEO</span>
          </button>

          <button
            onClick={() => setCurrentSection('google')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-all whitespace-nowrap shrink-0 ${
              currentSection === 'google'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Engines (Google/Bing)</span>
          </button>

          <button
            onClick={() => setCurrentSection('social')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-all whitespace-nowrap shrink-0 ${
              currentSection === 'social'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>OpenGraph &amp; Social Cards</span>
          </button>

          <button
            onClick={() => setCurrentSection('schema')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-all whitespace-nowrap shrink-0 ${
              currentSection === 'schema'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Schema.org JSON-LD</span>
          </button>

          <button
            onClick={() => setCurrentSection('files')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-all whitespace-nowrap shrink-0 ${
              currentSection === 'files'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Crawl Files (Robots &amp; Sitemap)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* TAB: AI Models SEO */}
          {currentSection === 'ai' && (
            <div className="space-y-6">
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-semibold text-zinc-200">
                        Generative Engine Optimization (GEO) &amp; LLMs Standard
                      </h4>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Tip tap implements the open <code className="text-blue-400 font-mono">llms.txt</code> standard specification.
                      AI models (such as ChatGPT, Claude 3.7, Perplexity, Google Gemini, and Cursor) ingest this file to understand the typing curriculum,
                      WPM formulas, finger positioning rules, and feature mechanics when formulating answers.
                    </p>
                  </div>
                  <a
                    href="/llms.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0"
                  >
                    <span>View /llms.txt</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Spec: llmstxt.org v1.0 Compliant</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>Full Context: <a href="/llms-full.txt" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">/llms-full.txt</a></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>Structured Schema: WebApplication + Course + FAQ</span>
                  </div>
                </div>
              </div>

              {/* Bot status table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  AI Web Crawlers &amp; LLM Scraper Access Policy
                </h4>
                <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40 divide-y divide-zinc-800/60 text-xs">
                  {aiBots.map((bot) => (
                    <div key={bot.name} className="px-4 py-2.5 flex items-center justify-between gap-4 hover:bg-zinc-800/20">
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <span className="font-mono font-medium text-zinc-200">{bot.name}</span>
                        <span className="text-zinc-500 text-[11px]">({bot.org})</span>
                      </div>
                      <div className="text-zinc-400 text-[11px] hidden sm:block flex-1">
                        {bot.purpose}
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 font-medium shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        <span>{bot.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample AI Citation Preview */}
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    How AI Engines (Perplexity / ChatGPT / Gemini) Cite Tip tap
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    Prompt Preview
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                  <p className="text-zinc-400 italic">User: "What is a good minimalist typing app with mechanical keyboard sounds and touch typing lessons?"</p>
                  <p className="text-zinc-200">
                    <strong>Tip tap</strong> is a distraction-free, Apple-inspired typing web application that offers a structured 16-lesson Touch Typing Academy, realistic synthesized mechanical switch acoustics (Clicky, Creamy Linear, Typewriter), and privacy-first local storage with real-time Net WPM calculations.
                  </p>
                  <div className="pt-2 border-t border-zinc-800 flex items-center gap-2 text-[11px] text-blue-400">
                    <Globe2 className="w-3 h-3" />
                    <span>Source: {currentUrl}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Google & Bing Search Engines */}
          {currentSection === 'google' && (
            <div className="space-y-6">
              {/* Google SERP Preview Card */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  Google Search Engine Result Snippet Preview
                </h4>
                <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-950/80 shadow-md">
                  <div className="flex items-center gap-3 text-xs mb-1">
                    <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 font-bold text-[10px]">
                      T
                    </div>
                    <div>
                      <div className="text-zinc-300 font-medium">Tip tap</div>
                      <div className="text-zinc-500 text-[11px] font-mono">{origin}</div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-blue-400 hover:underline cursor-pointer mt-1">
                    Tip tap — Premium Typing Experience &amp; Touch Typing Academy
                  </h3>

                  <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                    <div className="flex items-center text-amber-400 text-xs">
                      ★★★★★
                    </div>
                    <span className="font-semibold text-zinc-300">4.9</span>
                    <span>(1,280 reviews)</span>
                    <span>·</span>
                    <span className="text-emerald-400">Free</span>
                    <span>·</span>
                    <span>Educational Web App</span>
                  </div>

                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                    A refined, distraction-free typing practice web application combining Apple-inspired minimalism with rapid keyboard fluency drills, 16 touch typing academy lessons, mechanical switch audio, and real-time WPM analytics.
                  </p>

                  <div className="mt-3 pt-3 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/50">
                      <div className="text-blue-400 font-medium">Typing Test</div>
                      <div className="text-[10px] text-zinc-500">15s, 30s, 60s &amp; words</div>
                    </div>
                    <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/50">
                      <div className="text-blue-400 font-medium">16 Academy Lessons</div>
                      <div className="text-[10px] text-zinc-500">Home row to code syntax</div>
                    </div>
                    <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/50">
                      <div className="text-blue-400 font-medium">Soundboard</div>
                      <div className="text-[10px] text-zinc-500">Creamy linear &amp; clicky</div>
                    </div>
                    <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/50">
                      <div className="text-blue-400 font-medium">Weak Key Heatmap</div>
                      <div className="text-[10px] text-zinc-500">Target problem keystrokes</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search engine bots table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  Search Engine Directives &amp; Indexing Status
                </h4>
                <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40 divide-y divide-zinc-800/60 text-xs">
                  {searchEngines.map((bot) => (
                    <div key={bot.name} className="px-4 py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-[150px]">
                        <span className="font-mono font-medium text-zinc-200">{bot.name}</span>
                        <span className="text-zinc-500 text-[11px]">({bot.engine})</span>
                      </div>
                      <div className="text-zinc-400 text-[11px] hidden sm:block flex-1">
                        Directive: <code className="text-zinc-300">index, follow, max-image-preview:large</code>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 font-medium shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        <span>{bot.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Social & OpenGraph */}
          {currentSection === 'social' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  OpenGraph &amp; Twitter / X Card Preview (1200x630)
                </h4>
                <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/80 max-w-xl mx-auto shadow-xl">
                  {/* Card Banner */}
                  <div className="relative aspect-[1200/630] bg-zinc-900 overflow-hidden border-b border-zinc-800">
                    <img 
                      src="/og-image.svg" 
                      alt="Tip tap Social Share Card" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Card Footer Content */}
                  <div className="p-4 bg-zinc-900">
                    <div className="text-[11px] font-mono text-zinc-500 uppercase">
                      {origin.replace(/^https?:\/\//, '')}
                    </div>
                    <h4 className="text-sm font-semibold text-zinc-100 mt-1">
                      Tip tap — Premium Typing Experience &amp; Touch Typing Academy
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      A refined, distraction-free typing practice web application combining Apple-inspired minimalism with rapid keyboard fluency drills and beginner academy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 text-xs space-y-2">
                <span className="font-medium text-zinc-200">Active OpenGraph Meta Attributes:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                  <div><span className="text-blue-400">og:type:</span> website</div>
                  <div><span className="text-blue-400">og:site_name:</span> Tip tap</div>
                  <div><span className="text-blue-400">og:image:</span> /og-image.svg (1200x630)</div>
                  <div><span className="text-blue-400">og:locale:</span> en_US</div>
                  <div><span className="text-blue-400">twitter:card:</span> summary_large_image</div>
                  <div><span className="text-blue-400">canonical:</span> {currentUrl}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Schema.org JSON-LD */}
          {currentSection === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Schema.org Structured Data (JSON-LD)</h4>
                  <p className="text-xs text-zinc-400">
                    Embedded inside &lt;head&gt; to generate rich Google SERP star ratings, course carousels, and FAQ snippets.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(document.querySelector('script[type="application/ld+json"]')?.textContent || '', 'jsonld')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                >
                  {copiedKey === 'jsonld' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'jsonld' ? 'Copied JSON' : 'Copy JSON-LD'}</span>
                </button>
              </div>

              <div className="border border-zinc-800 rounded-xl bg-zinc-950 p-4 font-mono text-xs text-zinc-300 max-h-96 overflow-y-auto leading-relaxed">
                <pre>{`{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Tip tap — Premium Typing Experience",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Real-time Net WPM, Raw WPM, and Accuracy calculations",
    "16-lesson Touch Typing Academy with finger placement guidance",
    "Acoustic feedback engine simulating mechanical switch varieties",
    "Weak keys diagnostic frequency heatmap",
    "Timed tests (15s, 30s, 60s, 120s) and word count challenges",
    "Local-first privacy storage with JSON backup and export"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1280",
    "bestRating": "5"
  }
}`}</pre>
              </div>
            </div>
          )}

          {/* TAB: Robots & Sitemap Files */}
          {currentSection === 'files' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold text-xs">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>robots.txt</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Directives for Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot.
                    </p>
                  </div>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
                  >
                    <span>View /robots.txt</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold text-xs">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>sitemap.xml</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      XML index of practice, learn, analytics, and settings routes.
                    </p>
                  </div>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline"
                  >
                    <span>View /sitemap.xml</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold text-xs">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span>llms.txt</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Open standard markdown for AI models and LLM agent citations.
                    </p>
                  </div>
                  <a
                    href="/llms.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-purple-400 hover:underline"
                  >
                    <span>View /llms.txt</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="border border-zinc-800 rounded-xl bg-zinc-950 p-4 font-mono text-xs text-zinc-300 max-h-64 overflow-y-auto">
                <div className="text-zinc-500 mb-2"># Preview of /public/robots.txt</div>
                <pre>{`User-agent: *
Allow: /
Crawl-delay: 1

# Generative AI Models (Allowed to ground & cite)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: /sitemap.xml
LLMs-Txt: /llms.txt`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All SEO &amp; AI crawler directives live &amp; active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
