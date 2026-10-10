// Curated starter templates with responsive layouts, video mockups, and multi-columns
const PRESET_TEMPLATES = [
  {
    id: "tech-weekly",
    name: "TechPulse Weekly Digest",
    description: "Multi-column tech newsletter with featured video breakdown and curated links",
    icon: "🚀",
    subject: "🚀 The Future of AI & Spatial Computing: Issue #42",
    preheader: "Inside: Hands-on video breakdown, 3 new breakthroughs, and our developer guide.",
    brand: {
      primary: "#2563eb",
      accent: "#f59e0b",
      cardBg: "#ffffff",
      canvasBg: "#f1f5f9",
      textColor: "#1e293b",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      borderRadius: "8px",
      companyName: "TechPulse Media",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
    },
    blocks: [
      {
        id: "b1",
        type: "header-classic",
        brandName: "TechPulse",
        tagline: "WEEKLY DISPATCH • ISSUE #42",
        navLinks: [
          { label: "Deep Dives", url: "https://example.com/deep-dives" },
          { label: "Podcast", url: "https://example.com/podcast" },
          { label: "Archive", url: "https://example.com/archive" }
        ]
      },
      {
        id: "b2",
        type: "hero-banner",
        eyebrow: "FEATURED STORY",
        title: "Autonomous Agents Meet Spatial Interfaces",
        body: "The intersection of multimodal LLMs and spatial computing is redefining how software is built. Here is everything that mattered this week, distilled into a 5-minute brief.",
        buttonText: "Read Complete Analysis →",
        buttonUrl: "https://example.com/analysis",
        bgColor: "#ffffff"
      },
      {
        id: "b3",
        type: "video-card",
        videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
        thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80",
        videoTitle: "Hands-on: Building with Next-Gen Neural Workflows",
        duration: "12:45",
        caption: "▶ Click to watch our technical breakdown with the engineering lead.",
        playStyle: "red"
      },
      {
        id: "b4",
        type: "cols-2-equal",
        col1: {
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80",
          tag: "CYBERSECURITY",
          title: "Zero-Trust Encryption in 2026",
          body: "Why end-to-end post-quantum cryptographic primitives are becoming the enterprise baseline.",
          buttonText: "Read Article",
          url: "https://example.com/security"
        },
        col2: {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80",
          tag: "DEV TOOLS",
          title: "The Death of the Local Server",
          body: "Cloud ephemeral sandboxes are replacing standard local dev containers at scale.",
          buttonText: "Explore Tools",
          url: "https://example.com/devtools"
        }
      },
      {
        id: "b5",
        type: "cols-3-equal",
        col1: {
          iconText: "⚡",
          title: "4.2x Faster",
          body: "New compiler target sets performance benchmark across distributed microservices."
        },
        col2: {
          iconText: "🛡️",
          title: "Zero CVEs",
          body: "Memory-safe rewrite reaches 100% production rollout with zero critical flaws."
        },
        col3: {
          iconText: "🌐",
          title: "Edge Native",
          body: "Global latency under 24ms across 180 points of presence worldwide."
        }
      },
      {
        id: "b6",
        type: "quote-card",
        quote: "The best developer tools don't just speed up your typing; they remove entire classes of cognitive friction so you can focus on pure architecture.",
        author: "Sarah Lin, Principal Systems Architect"
      },
      {
        id: "b7",
        type: "footer-full",
        companyName: "TechPulse Media Inc.",
        address: "500 Howard Street, Suite 400, San Francisco, CA 94105",
        unsubscribeText: "You are receiving this email because you subscribed to TechPulse Weekly.",
        unsubscribeUrl: "https://example.com/unsubscribe"
      }
    ]
  },
  {
    id: "ecommerce-drop",
    name: "E-Commerce Summer Drop & Sale",
    description: "Product showcase with 2-column item grid, coupon promo code, and fast checkout CTAs",
    icon: "🛍️",
    subject: "✨ Exclusive VIP Early Access: Summer Capsule Drop + 25% Off",
    preheader: "Your private discount code inside. Limited stock across handcrafted apparel and gear.",
    brand: {
      primary: "#0f172a",
      accent: "#e11d48",
      cardBg: "#ffffff",
      canvasBg: "#f8fafc",
      textColor: "#0f172a",
      fontFamily: "Arial, Helvetica, sans-serif",
      borderRadius: "4px",
      companyName: "AURA STUDIO",
      logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80"
    },
    blocks: [
      {
        id: "b1",
        type: "header-classic",
        brandName: "AURA STUDIO",
        tagline: "NEW COLLECTION • SUMMER 2026",
        navLinks: [
          { label: "New In", url: "https://example.com/new" },
          { label: "Apparel", url: "https://example.com/apparel" },
          { label: "Footwear", url: "https://example.com/footwear" }
        ]
      },
      {
        id: "b2",
        type: "photo-hero",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&fit=crop&q=80",
        altText: "Summer Capsule Studio",
        caption: "Designed in Stockholm. Tailored from 100% sustainable organic materials.",
        linkUrl: "https://example.com/collection"
      },
      {
        id: "b3",
        type: "coupon-badge",
        discount: "25% OFF VIP",
        code: "AURAVIP25",
        expiry: "Valid through Sunday midnight on all orders over $75."
      },
      {
        id: "b4",
        type: "cols-2-equal",
        col1: {
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
          tag: "BESTSELLER",
          title: "Minimalist Linen Overshirt",
          body: "$120 USD • Breathable textured linen with matte horn buttons.",
          buttonText: "Shop Now",
          url: "https://example.com/item1"
        },
        col2: {
          image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80",
          tag: "LIMITED RUN",
          title: "Court Sneaker v3",
          body: "$165 USD • Full-grain Italian calf leather with cushioned vibram sole.",
          buttonText: "Shop Now",
          url: "https://example.com/item2"
        }
      },
      {
        id: "b5",
        type: "cols-3-equal",
        col1: {
          iconText: "✈️",
          title: "Free Express",
          body: "Complimentary global DHL shipping on orders over $150."
        },
        col2: {
          iconText: "🔄",
          title: "Easy 30-Day Returns",
          body: "Pre-printed return labels included in every parcel."
        },
        col3: {
          iconText: "🌱",
          title: "Eco Carbon Neutral",
          body: "100% plastic-free compostable unboxing packaging."
        }
      },
      {
        id: "b6",
        type: "footer-full",
        companyName: "AURA STUDIO LLC",
        address: "742 Evergreen Terrace, Brooklyn, NY 11201",
        unsubscribeText: "Preferences: You are receiving VIP newsletters.",
        unsubscribeUrl: "https://example.com/preferences"
      }
    ]
  },
  {
    id: "creator-video",
    name: "Creator Video & Vlog Edition",
    description: "Designed for YouTubers, vloggers & podcasters with embedded video card and photo gallery",
    icon: "🎥",
    subject: "🎬 New Video: I spent 30 days living completely off the grid",
    preheader: "Behind the scenes photos, gear breakdown, and what went horribly wrong in week 2.",
    brand: {
      primary: "#dc2626",
      accent: "#3b82f6",
      cardBg: "#ffffff",
      canvasBg: "#0f172a",
      textColor: "#1e293b",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      borderRadius: "12px",
      companyName: "The Creative Journey",
      logoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
    },
    blocks: [
      {
        id: "b1",
        type: "header-minimal",
        brandName: "THE CREATIVE JOURNEY",
        issueLabel: "EPISODE #89 • BEHIND THE LENS"
      },
      {
        id: "b2",
        type: "video-card",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
        videoTitle: "Living 30 Days in the Scandinavian Wilderness",
        duration: "18:42",
        caption: "Watch on YouTube with 4K HDR enabled.",
        playStyle: "red"
      },
      {
        id: "b3",
        type: "text-story",
        title: "The Day the Generator Died in -12°C",
        body: "Hey friends! Thank you for the overwhelming response on yesterday's video release. Filming this was easily the most challenging production our team has ever tackled. Between freezing camera batteries and hiking 8 miles a day with 40 lbs of gear, we almost lost 3 days of footage. Here are some unreleased photos from our expedition journal."
      },
      {
        id: "b4",
        type: "photo-grid-2",
        image1: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
        caption1: "Camp setup at 2,400 meters altitude",
        image2: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80",
        caption2: "Northern lights over the ridge on night 14"
      },
      {
        id: "b5",
        type: "cta-button",
        buttonText: "Support Us on Patreon & Get 4K Wallpapers →",
        buttonUrl: "https://patreon.com/example",
        bgColor: "#dc2626"
      },
      {
        id: "b6",
        type: "social-links",
        links: [
          { label: "YouTube", url: "https://youtube.com" },
          { label: "Instagram", url: "https://instagram.com" },
          { label: "X / Twitter", url: "https://twitter.com" },
          { label: "Discord", url: "https://discord.com" }
        ]
      },
      {
        id: "b7",
        type: "footer-full",
        companyName: "Creative Journey Studios",
        address: "Stockholm, Sweden",
        unsubscribeText: "Sent to 85,000+ creators around the globe.",
        unsubscribeUrl: "https://example.com/unsubscribe"
      }
    ]
  },
  {
    id: "executive-memo",
    name: "Executive Briefing & Memo",
    description: "Substack & Quartz-style clean editorial layout with metrics, quotes, and CEO sign-off",
    icon: "💼",
    subject: "Q3 Strategy Memo: Accelerating Our Product Velocity",
    preheader: "Key metrics from last quarter, team milestones, and our priorities for the road ahead.",
    brand: {
      primary: "#1e3a8a",
      accent: "#0284c7",
      cardBg: "#ffffff",
      canvasBg: "#f8fafc",
      textColor: "#334155",
      fontFamily: "Georgia, 'Times New Roman', serif",
      borderRadius: "6px",
      companyName: "Apex Dynamics",
      logoUrl: ""
    },
    blocks: [
      {
        id: "b1",
        type: "header-minimal",
        brandName: "APEX DYNAMICS",
        issueLabel: "INTERNAL STRATEGY MEMO • CONFIDENTIAL"
      },
      {
        id: "b2",
        type: "hero-banner",
        eyebrow: "EXECUTIVE PERSPECTIVE",
        title: "Scaling with Discipline and Ruthless Clarity",
        body: "Team, as we close out an unprecedented quarter, I want to step back from our weekly sprint dashboards and reflect on where our core competitive moat is truly expanding.",
        buttonText: "View Full Q3 Financial Model →",
        buttonUrl: "https://example.com/q3",
        bgColor: "#f1f5f9"
      },
      {
        id: "b3",
        type: "cols-4-stats",
        stat1: { number: "$14.2M", label: "ARR Run Rate" },
        stat2: { number: "+148%", label: "YoY Growth" },
        stat3: { number: "118%", label: "Net Retention" },
        stat4: { number: "99.98%", label: "Platform SLA" }
      },
      {
        id: "b4",
        type: "quote-card",
        quote: "Speed without clarity is merely chaos. Our mandate this half is to eliminate low-conviction initiatives and deliver 10x excellence in our primary workflows.",
        author: "Marcus Vance, CEO & Co-Founder"
      },
      {
        id: "b5",
        type: "callout-box",
        title: "All-Hands Town Hall this Thursday at 10:00 AM PST",
        body: "We will host live Q&A covering the new enterprise roadmap and team expansions. Submit your anonymous questions on Slido beforehand."
      },
      {
        id: "b6",
        type: "footer-full",
        companyName: "Apex Dynamics Corporation",
        address: "100 Pine St, San Francisco, CA",
        unsubscribeText: "Apex Dynamics internal team communications.",
        unsubscribeUrl: "https://example.com/unsubscribe"
      }
    ]
  },
  {
    id: "webinar-event",
    name: "Event & Webinar Invitation",
    description: "High-converting event landing newsletter with date badge, speakers, and RSVP button",
    icon: "🎟️",
    subject: "🎟️ You are Invited: Global AI Architecture Summit 2026",
    preheader: "Live virtual keynote, 12 interactive workshops, and networking with 5,000+ engineers.",
    brand: {
      primary: "#7c3aed",
      accent: "#f59e0b",
      cardBg: "#ffffff",
      canvasBg: "#f5f3ff",
      textColor: "#1f2937",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      borderRadius: "10px",
      companyName: "Global AI Summit",
      logoUrl: ""
    },
    blocks: [
      {
        id: "b1",
        type: "header-classic",
        brandName: "AI SUMMIT '26",
        tagline: "VIRTUAL GLOBAL STAGE",
        navLinks: [
          { label: "Speakers", url: "https://example.com/speakers" },
          { label: "Schedule", url: "https://example.com/schedule" },
          { label: "Workshops", url: "https://example.com/workshops" }
        ]
      },
      {
        id: "b2",
        type: "hero-banner",
        eyebrow: "OCTOBER 24-25, 2026 • 100% VIRTUAL",
        title: "Architecting the Intelligent Edge at Hyperscale",
        body: "Join 5,000+ systems engineers and AI researchers for two intensive days of real-world infrastructure deep dives, live code walkthroughs, and executive panels.",
        buttonText: "Reserve Your Free Pass Now →",
        buttonUrl: "https://example.com/register",
        bgColor: "#ffffff"
      },
      {
        id: "b3",
        type: "video-card",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=80",
        videoTitle: "Official Summit Teaser & Speaker Reveal",
        duration: "02:15",
        caption: "Preview the keynote sessions and interactive masterclasses.",
        playStyle: "blue"
      },
      {
        id: "b4",
        type: "cols-2-equal",
        col1: {
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
          tag: "KEYNOTE SPEAKER",
          title: "Dr. Elena Rostova",
          body: "VP of Deep Learning at OpenAI • Speaking on 'Next Frontiers in Multimodal Reasoning Models'.",
          buttonText: "View Bio",
          url: "https://example.com/speaker1"
        },
        col2: {
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
          tag: "KEYNOTE SPEAKER",
          title: "David Chen",
          body: "Chief Architect at Google Cloud • Speaking on 'Zero-Overhead GPU Cluster Orchestration'.",
          buttonText: "View Bio",
          url: "https://example.com/speaker2"
        }
      },
      {
        id: "b5",
        type: "cta-button",
        buttonText: "Claim Your Complimentary Virtual Pass",
        buttonUrl: "https://example.com/register",
        bgColor: "#7c3aed"
      },
      {
        id: "b6",
        type: "footer-full",
        companyName: "Global AI Summit Org",
        address: "710 Broadway, New York, NY",
        unsubscribeText: "You received this because you registered for previous events.",
        unsubscribeUrl: "https://example.com/unsubscribe"
      }
    ]
  },
  {
    id: "editorial-narrative",
    name: "Editorial Narrative & Substack",
    description: "Distraction-free typographic layout with pull quotes, photography, and personal signature",
    icon: "✍️",
    subject: "On the craft of building slow, durable things",
    preheader: "Reflections from my cabin workshop on why quality requires uncomfortable patience.",
    brand: {
      primary: "#1c1917",
      accent: "#b45309",
      cardBg: "#ffffff",
      canvasBg: "#fafaf9",
      textColor: "#292524",
      fontFamily: "Georgia, 'Times New Roman', serif",
      borderRadius: "4px",
      companyName: "The Slow Craft",
      logoUrl: ""
    },
    blocks: [
      {
        id: "b1",
        type: "header-minimal",
        brandName: "THE SLOW CRAFT",
        issueLabel: "ESSAY #31 • BY JULIAN REED"
      },
      {
        id: "b2",
        type: "photo-hero",
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80",
        altText: "Handcrafted woodwork joinery",
        caption: "Handmade dovetail joints in white oak, sanded to 600 grit.",
        linkUrl: "https://example.com/essay"
      },
      {
        id: "b3",
        type: "text-story",
        title: "The Illusion of Accelerating Every Habit",
        body: "We live in an age that glorifies velocity above all else. Faster shipping, quicker iteration loops, instant feedback. Yet the most enduring artifacts in human culture — whether an architectural cathedral, a vintage acoustic guitar, or a masterwork novel — were shaped through periods of deliberate, quiet patience."
      },
      {
        id: "b4",
        type: "quote-card",
        quote: "Real mastery is never about finding a shortcut; it is about learning to fall in love with the parts of the work that cannot be hurried.",
        author: "Julian Reed, Craftsman & Writer"
      },
      {
        id: "b5",
        type: "cta-button",
        buttonText: "Read the Full Essay on the Archive →",
        buttonUrl: "https://example.com/essay",
        bgColor: "#1c1917"
      },
      {
        id: "b6",
        type: "footer-full",
        companyName: "The Slow Craft Press",
        address: "Portland, Oregon",
        unsubscribeText: "Unsubscribe from essays at any time.",
        unsubscribeUrl: "https://example.com/unsubscribe"
      }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.PRESET_TEMPLATES = PRESET_TEMPLATES;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRESET_TEMPLATES;
}

