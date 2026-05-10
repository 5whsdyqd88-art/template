"use client";

import { useState, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ArrowRight } from 'lucide-react';

const TABS = [
  { id: 'node', label: 'Node.js' },
  { id: 'python', label: 'Python' },
  { id: 'curl', label: 'curl' },
] as const;

const codeMockupContent = {
  eyebrow: 'DEVELOPERS',
  headline: 'Integrate Relay in five lines',
  body: 'Drop-in replacement for your existing HTTP client. Works with Node.js, Python, or curl. No server changes required.',
  docsLink: 'Read the docs →',
  copyLabel: 'Copy code',
  samples: {
    node: `const relay = require('relay-sdk');

relay.send({
  to: '+1234567890',
  from: '+0987654321',
  body: 'Hello from Relay!',
});`,
    python: `import relay

relay.send(
  to="+1234567890",
  from="+0987654321",
  body="Hello from Relay!"
)`,
    curl: `curl https://api.relay.com/v1/messages \\
  -u your_api_key: \\
  -d from="+1234567890" \\
  -d to="+0987654321" \\
  -d body="Hello from Relay!"`,
  },
} as const;

function SyntaxHighlight({ code }: { code: string }) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) {
    return <pre className="font-mono text-sm text-ink-200">{code}</pre>;
  }

  const tokens = code.split('\n').flatMap((line, lineIndex) => {
    const tokens: React.ReactNode[] = [];
    const regex = /('.*?'|".*?"|`.*?`|\bconst\b|\brequire\b|\bimport\b|\bfrom\b|\breturn\b|\bfunction\b|\bclass\b|\bif\b|\belse\b|\bfor\b|\bwhile\b|\bdo\b|\bswitch\b|\bcase\b|\bbreak\b|\bcontinue\b|\bvar\b|\blet\b|\bconst\b|\bnew\b|\bthis\b|\btrue\b|\bfalse\b|\bnull\b|\bundefined\b|\bPromise\b|\basync\b|\bawait\b|\bthrow\b|\btry\b|\bcatch\b|\bfinally\b|\bexport\b|\bdefault\b|\bextends\b|\bimplements\b|\binterface\b|\btypeof\b|\bnamespace\b|\bmodule\b|\bimport\b|\bexport\b|\bfrom\b|\bawait\b|\basync\b)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(<span key={lastIndex} className="text-ink-300">{line.slice(lastIndex, match.index)}</span>);
      }
      tokens.push(<span key={match.index} className="text-primary-300">{match[0]}</span>);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      tokens.push(<span key={lastIndex} className="text-ink-300">{line.slice(lastIndex)}</span>);
    }

    return [<div key={lineIndex}>{tokens}</div>];
  });

  return <pre className="font-mono text-sm text-ink-200">{tokens}</pre>;
}

function Tab({ id, isActive, onClick, onKeyDown, ref }: { id: string; isActive: boolean; onClick: () => void; onKeyDown: (e: React.KeyboardEvent) => void; ref: React.Ref<HTMLButtonElement> }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`relative px-4 py-3 text-sm font-medium transition-colors ${
        isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-700'
      }`}
      animate={isActive ? { opacity: 1 } : { opacity: 0.7 }}
    >
      {id.charAt(0).toUpperCase() + id.slice(1)}
      {isActive && !shouldReduceMotion && (
        <motion.span
          layoutId="codeTabUnderline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      {isActive && shouldReduceMotion && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
      )}
    </motion.button>
  );
}

export default function CodeMockup() {
  const [activeTab, setActiveTab] = useState('node');
  const [copySuccess, setCopySuccess] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useReducedMotion();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const tabsLength = TABS.length;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = (index + 1) % tabsLength;
        tabRefs.current[nextIndex]?.focus();
        handleTabChange(TABS[nextIndex].id);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = (index - 1 + tabsLength) % tabsLength;
        tabRefs.current[prevIndex]?.focus();
        handleTabChange(TABS[prevIndex].id);
        break;
      case 'Home':
        e.preventDefault();
        tabRefs.current[0]?.focus();
        handleTabChange(TABS[0].id);
        break;
      case 'End':
        e.preventDefault();
        tabRefs.current[tabsLength - 1]?.focus();
        handleTabChange(TABS[tabsLength - 1].id);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleTabChange(TABS[index].id);
        break;
    }
  };

  const handleCopy = async () => {
    const code = codeMockupContent.samples[activeTab as keyof typeof codeMockupContent.samples];
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  return (
    <section className="bg-ink-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <span className="mb-4 inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold tracking-wider text-primary-900 uppercase">
                {codeMockupContent.eyebrow}
              </span>
            </motion.div>

            <motion.h2
              className="mb-6 text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {codeMockupContent.headline}
            </motion.h2>

            <motion.p
              className="mb-8 text-lg leading-relaxed text-ink-600"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {codeMockupContent.body}
            </motion.p>

            <motion.a
              href="#"
              className="inline-flex items-center gap-2 text-base font-medium text-primary-600 hover:text-primary-800 transition-base ease-out-soft"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ x: 4 }}
            >
              {codeMockupContent.docsLink}
              <ArrowRight size={16} />
            </motion.a>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              className="overflow-hidden rounded-2xl bg-ink-900 shadow-2xl ring-1 ring-ink-800"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between border-b border-ink-800 bg-ink-950 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>

                <div role="tablist" className="flex items-center gap-1">
                  {TABS.map((tab, index) => (
                    <Tab
                      key={tab.id}
                      id={tab.id}
                      isActive={activeTab === tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="ml-4 flex items-center gap-2 text-sm font-medium text-ink-400 hover:text-ink-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-ink-950 rounded px-2 py-1 transition-colors"
                  aria-label={copySuccess ? 'Copied!' : codeMockupContent.copyLabel}
                >
                  {copySuccess ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  <span className="text-xs hidden sm:inline">{copySuccess ? 'Copied!' : codeMockupContent.copyLabel}</span>
                </button>
              </div>

              <div
                role="tabpanel"
                tabIndex={0}
                className="min-h-[320px] bg-ink-900 p-6"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SyntaxHighlight code={codeMockupContent.samples[activeTab as keyof typeof codeMockupContent.samples]} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
