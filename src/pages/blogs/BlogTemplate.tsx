import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeft, Check, Terminal, Zap, Lightbulb, Link as LinkIcon, Eye, ChevronRight, Copy, ArrowRight, ImageIcon, Sparkles, Box, ExternalLink, BookOpen, ChevronDown } from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { AuthorBox } from '../../components/AuthorBox';
import { BlogPost, BlogSection } from '../../types/blog';

const ScreenshotPlaceholder = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
  <figure className="my-10 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50">
    <div className="relative">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full object-cover"
        style={{ maxHeight: '400px' }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const next = (e.currentTarget as HTMLImageElement).nextElementSibling;
          if (next) (next as HTMLElement).style.display = 'flex';
        }}
      />
      <div 
        style={{ display: 'none' }}
        className="h-56 flex-col items-center justify-center gap-3 text-zinc-500 bg-zinc-900/80"
      >
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
          <ImageIcon className="w-5 h-5" />
        </div>
        <span className="text-sm text-center px-8">{alt}</span>
      </div>
    </div>
    <figcaption className="px-5 py-3 text-xs text-zinc-500 border-t border-zinc-800 text-center italic">
      {caption}
    </figcaption>
  </figure>
);

const IconMap = {
  zap: Zap,
  lightbulb: Lightbulb,
  terminal: Terminal,
  box: Box,
  sparkles: Sparkles
};

export const BlogTemplate = ({ post }: { post: BlogPost }) => {
  const [activeSection, setActiveSection] = useState('intro');
  const [copied, setCopied] = useState(false);
  const [troubleshooterOpen, setTroubleshooterOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [post.slug]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toc = post.sections
    .filter(s => s.heading)
    .map(s => ({ id: s.id, label: s.heading as string }));
    
  if (post.faqs && post.faqs.length > 0) {
    toc.push({ id: 'faq', label: 'Questions I Get Asked' });
  }

  const formatParagraphs = (content: string) => {
    return content.split('\\n\\n').map((paragraph, index) => {
      // Basic bold formatting support via regex if needed, or just plain text
      const withBold = paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return (
        <p key={index} className="text-base leading-8 text-zinc-300 mb-6">
          {withBold}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-cyan-500/30 relative flex flex-col">
      <Navigation />
      
      {/* 1. READING PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-cyan-400 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* 2. HELMET BLOCK */}
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.metaKeywords} />
        <link rel="canonical" href={post.canonicalUrl} />
        <meta property="og:title" content={post.ogTitle} />
        <meta property="og:description" content={post.ogDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={post.canonicalUrl} />
        <meta property="og:image" content={post.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.twitterTitle} />
        <meta name="twitter:description" content={post.twitterDescription} />
        <meta name="twitter:image" content={post.ogImage} />
      </Helmet>

      {/* 3. JSON-LD SCHEMA BLOCKS */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.h1,
            "description": post.metaDescription,
            "image": post.ogImage,
            "author": {
              "@type": "Organization",
              "name": "CircuitForge",
              "url": "https://luvaai.in"
            },
            "publisher": {
              "@type": "Organization",
              "name": "CircuitForge",
              "url": "https://luvaai.in",
              "logo": {
                "@type": "ImageObject",
                "url": "https://luvaai.in/favicon.svg"
              }
            },
            "datePublished": post.datePublished,
            "dateModified": post.dateModified,
            "mainEntityOfPage": post.canonicalUrl,
            "keywords": post.metaKeywords
          })}
        </script>
        {post.faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": post.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.a
                }
              }))
            })}
          </script>
        )}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://luvaai.in" },
              { "@type": "ListItem", "position": 2, "name": "Learn", "item": "https://luvaai.in/learn" },
              { "@type": "ListItem", "position": 3, "name": post.h1, "item": post.canonicalUrl }
            ]
          })}
        </script>
      </Helmet>

      {/* 4. LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 items-start w-full flex-1">
        
        {/* 5. LEFT SIDEBAR */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
          <Link to="/learn" className="inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Hub
          </Link>
          
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Table of Contents</h4>
          <nav className="space-y-1 relative before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-zinc-800 mb-10">
            {toc.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`block w-full text-left pl-4 py-2 text-sm transition-colors relative before:absolute before:inset-y-0 before:left-0 before:w-px ${
                  activeSection === item.id
                    ? 'text-cyan-400 before:bg-cyan-400 font-medium'
                    : 'text-zinc-500 hover:text-zinc-300 before:bg-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="text-xs text-zinc-600 mb-10 flex flex-wrap gap-1 items-center">
            <Link to="/" className="hover:text-zinc-400">Home</Link> › 
            <Link to="/learn" className="hover:text-zinc-400">Learn</Link> › 
            <span className="text-zinc-500">{post.category}</span>
          </div>

          {post.sidebarCta && (
            <div className="bg-cyan-950/20 border border-cyan-900/30 rounded-xl p-5">
              <h5 className="text-cyan-400 font-bold mb-2 text-sm">{post.sidebarCta.title}</h5>
              <p className="text-zinc-400 text-xs mb-4">{post.sidebarCta.body}</p>
              <Link to={post.sidebarCta.linkPath} className="text-sm font-bold text-white hover:text-cyan-400 transition-colors inline-flex items-center">
                {post.sidebarCta.linkText}
              </Link>
            </div>
          )}
        </aside>

        {/* 6. MAIN ARTICLE */}
        <article className="flex-1 max-w-2xl mx-auto lg:mx-0 w-full">
          
          {/* a) ARTICLE HEADER */}
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-full border border-cyan-500/20">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.h1}
            </h1>
            
            <p className="text-lg text-zinc-400 leading-8 mb-8">
              {post.deck}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-6 justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold border border-cyan-900">
                    AD
                  </div>
                  <span className="text-zinc-300 font-medium">By Advik</span>
                </div>
              </div>
              
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm text-zinc-300 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400 flex items-center gap-1.5">
                ⏱ {post.readTime}
              </span>
              <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400 flex items-center gap-1.5">
                📅 {new Date(post.dateModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> {post.level}
              </span>
              <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400 flex items-center gap-1.5">
                🔧 <Link to="/sim" className="text-cyan-400 hover:underline ml-1">CircuitForge</Link>
              </span>
            </div>

            <hr className="border-t border-zinc-800/80 mb-8" />
            
            {post.heroImage && (
              <img 
                src={post.heroImage.src} 
                alt={post.heroImage.alt}
                loading="eager"
                fetchPriority="high"
                className="w-full rounded-2xl object-cover border border-zinc-800"
                style={{ height: '320px' }}
                onError={(e) => {
                   (e.currentTarget as HTMLImageElement).alt = post.heroImage!.fallbackText;
                }}
              />
            )}
          </motion.header>

          <div className="prose prose-invert prose-cyan max-w-none prose-p:text-base prose-p:leading-8 prose-p:mb-6 prose-headings:text-white">
            
            {/* b) SECTIONS LOOP */}
            {post.sections.map((section, index) => (
              <motion.section 
                key={section.id}
                id={section.id}
                className={`mb-20 scroll-mt-24 ${index === 0 ? '' : 'border-t border-zinc-800/50 pt-12'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* i) H2 heading */}
                {section.heading && (
                  <h2 className="text-3xl font-bold text-white mb-8">{section.heading}</h2>
                )}

                {/* ii) Content paragraphs */}
                {formatParagraphs(section.content)}

                {/* iii) Callout box */}
                {section.callout && (
                  <div className={`bg-${section.callout.type === 'warning' ? 'amber' : section.callout.type === 'tip' ? 'emerald' : 'cyan'}-950/20 border border-${section.callout.type === 'warning' ? 'amber' : section.callout.type === 'tip' ? 'emerald' : 'cyan'}-800/50 rounded-xl p-6 my-8 flex gap-4`}>
                    <div className="shrink-0 mt-1">
                      {section.callout.type === 'warning' && <Zap className="w-6 h-6 text-amber-400" />}
                      {section.callout.type === 'tip' && <BookOpen className="w-6 h-6 text-emerald-400" />}
                      {section.callout.type === 'info' && <Zap className="w-6 h-6 text-cyan-400" />}
                    </div>
                    <div>
                      <strong className={`text-${section.callout.type === 'warning' ? 'amber' : section.callout.type === 'tip' ? 'emerald' : 'cyan'}-400 not-italic block mb-2 font-bold`}>
                        {section.callout.title}
                      </strong>
                      <div className="text-zinc-300 m-0">{section.callout.body}</div>
                    </div>
                  </div>
                )}

                {/* iv) Cards */}
                {section.cards && (
                  <div className="space-y-4 my-8">
                    {section.cards.map((card, i) => {
                      const Icon = IconMap[card.icon] || Zap;
                      return (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800"
                        >
                          <strong className="text-white text-lg block mb-2 flex items-center gap-2">
                            <Icon className={`w-5 h-5 text-${card.iconColor}-400`} /> {card.title}
                          </strong>
                          <p className="text-zinc-400 m-0">{card.body}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* v) Steps */}
                {section.steps && (
                  <div className="space-y-10 my-10">
                    {section.steps.map((step, i) => (
                      <div key={i} className="flex gap-6">
                        <motion.div 
                          whileInView={{ scale: [0.8, 1] }} 
                          viewport={{ once: true }}
                          className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-900 text-lg shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        >
                          {i + 1}
                        </motion.div>
                        <div>
                          <strong className="text-white text-xl block mb-2">{step.title}</strong>
                          <p className="text-zinc-400 mb-2">{step.body}</p>
                          {step.note && (
                            <p className="text-sm text-emerald-400 bg-emerald-950/30 p-3 rounded border border-emerald-900/50 inline-block m-0">
                              {step.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* vi) Screenshot */}
                {section.screenshot && (
                  <ScreenshotPlaceholder 
                    src={section.screenshot.src}
                    alt={section.screenshot.alt}
                    caption={section.screenshot.caption}
                  />
                )}

                {/* vii) Embed sim iframe */}
                {section.embedSim && (
                  <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 my-8 shadow-lg">
                    <div className="bg-zinc-800 px-4 py-3 text-xs font-bold text-zinc-300 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Interactive Circuit
                    </div>
                    <iframe 
                      src="/sim" 
                      className="w-full h-[400px]"
                      title="Simulated Circuit"
                    />
                  </div>
                )}

                {/* viii) Comparison cards */}
                {section.comparison && (
                  <div className="grid sm:grid-cols-2 gap-6 my-10">
                    {[section.comparison.left, section.comparison.right].map((comp, i) => (
                      <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900 transition-colors relative overflow-hidden">
                        {comp.variant === 'danger' && (
                           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        )}
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 border ${comp.variant === 'danger' ? 'bg-amber-950/50 border-amber-900/50' : 'bg-zinc-800/50 border-zinc-700'}`}>
                           <Zap className={`w-6 h-6 ${comp.variant === 'danger' ? 'text-amber-400' : 'text-zinc-400'}`} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 mt-2">{comp.title}</h3>
                        <p className="text-zinc-400 text-sm leading-8 m-0">{comp.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ix) Troubleshooter */}
                {section.troubleshooter && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mt-8">
                    <button 
                      onClick={() => setTroubleshooterOpen(!troubleshooterOpen)}
                      className="w-full flex items-center justify-between p-5 text-left bg-zinc-900 hover:bg-zinc-800/80 transition-colors"
                    >
                      <span className="font-bold text-white text-lg">What if it doesn't work? (Common Mistakes)</span>
                      <ChevronRight className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${troubleshooterOpen ? 'rotate-90' : ''}`} />
                    </button>
                    <div 
                      className={`px-5 transition-all duration-300 ease-in-out ${troubleshooterOpen ? 'max-h-[500px] py-4 opacity-100' : 'max-h-0 py-0 opacity-0'} overflow-hidden bg-zinc-950/50`}
                    >
                      <ul className="space-y-4 text-zinc-400 m-0 pl-4">
                        {section.troubleshooter.map((t, i) => (
                          <li key={i}><strong className="text-white">{t.problem}</strong> {t.solution}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* x) Upgrades */}
                {section.upgrades && (
                  <div className="space-y-8 mt-8">
                    {section.upgrades.map((upgrade, i) => (
                      <div key={i} className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800/50">
                        <h3 className="text-xl font-bold text-white mb-3 mt-2">{upgrade.title}</h3>
                        <p className="text-zinc-400 mb-4 leading-8">{upgrade.body}</p>
                        <Link to="/sim" className="inline-flex items-center text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors mt-4">
                          Try in CircuitForge <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* xi) Inline CTA banner */}
                {section.inlineCta && (
                  <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-zinc-900 to-cyan-950/30 border border-zinc-800 text-center">
                    <p className="text-lg font-bold text-white mb-2">{section.inlineCta.heading}</p>
                    {section.inlineCta.body && <p className="text-zinc-400 mb-6">{section.inlineCta.body}</p>}
                    <Link to={section.inlineCta.buttonLink} className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-xl transition-colors">
                      {section.inlineCta.buttonText}
                    </Link>
                  </div>
                )}
              </motion.section>
            ))}

            {/* c) FAQ SECTION */}
            {post.faqs.length > 0 && (
              <section id="faq" className="mb-20 scroll-mt-24 border-t border-zinc-800/50 pt-12">
                <h2 className="text-3xl font-bold text-white mb-8">Questions I Get Asked</h2>
                <div className="space-y-8">
                  {post.faqs.map((faq, i) => (
                    <div key={i}>
                      <h3 className="text-xl font-bold text-white mb-3 mt-2">{faq.q}</h3>
                      <p className="text-zinc-400 mb-6">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* d) REFERENCES SECTION */}
            {post.references.length > 0 && (
              <div id="references" className="border-t border-zinc-800 pt-12 mt-8">
                <h3 className="text-lg font-bold text-white mb-2">References & Further Reading</h3>
                <p className="text-zinc-500 text-sm mb-6">
                  These are the resources we actually recommend — not just Wikipedia.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {post.references.map((ref, i) => (
                    <a 
                      key={i}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="font-medium text-zinc-200 group-hover:text-cyan-400 transition-colors text-sm leading-snug">
                          {ref.title}
                        </span>
                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                          {ref.tag}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-xs leading-relaxed m-0">{ref.desc}</p>
                    </a>
                  ))}
                </div>
                <p className="text-zinc-600 text-xs mt-6">
                  CircuitForge is not affiliated with any of the above resources. We link them because they're genuinely useful.
                </p>
              </div>
            )}
            
            {/* e) READ NEXT SECTION */}
            {post.relatedPosts.length > 0 && (
              <div className="border-t border-zinc-800 pt-16 mt-16">
                <h3 className="text-2xl font-bold text-white mb-8">Continue Reading</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {post.relatedPosts.map((related, i) => (
                    <Link key={i} to={related.path} className="group block bg-zinc-900 border border-zinc-800 hover:border-cyan-800 rounded-xl p-6 transition-colors">
                      <span className={`text-xs font-bold text-${related.categoryColor}-400 uppercase tracking-wider mb-3 block`}>
                        {related.category}
                      </span>
                      <h4 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                        {related.title}
                      </h4>
                      <p className="text-zinc-500 text-sm">{related.description}</p>
                      <span className="text-cyan-400 text-sm font-bold mt-4 block">Read guide →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <AuthorBox />
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
};
