import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const SEOHead: React.FC = () => {
  const { activeTab, activeLesson } = useApp();

  useEffect(() => {
    let title = 'Tip tap — Premium Typing Experience';
    let description = 'A refined, distraction-free typing practice web application combining Apple-inspired minimalism with rapid keyboard fluency drills and beginner academy.';

    if (activeLesson) {
      title = `${activeLesson.title} — Touch Typing Academy | Tip tap`;
      description = `Practice ${activeLesson.title}. Target keys: ${activeLesson.targetKeys.join(', ')}. Master finger positioning and typing fluency with Tip tap.`;
    } else {
      switch (activeTab) {
        case 'practice':
          title = 'Tip tap — Premium Typing Experience & Speed Test';
          description = 'A refined, distraction-free typing practice web application combining Apple-inspired minimalism with rapid keyboard fluency drills and beginner academy.';
          break;
        case 'learn':
          title = 'Touch Typing Academy — 16 Interactive Lessons | Tip tap';
          description = 'Learn touch typing from scratch with 16 structured muscle memory lessons covering Home Row, Top Row, Bottom Row, Capitalization, and Code Syntax.';
          break;
        case 'progress':
          title = 'Typing Performance Analytics & Heatmap | Tip tap';
          description = 'Track your typing speed (WPM), accuracy trends, raw vs net speed history, and identify weak keys with personalized error frequency diagnostics.';
          break;
        case 'settings':
          title = 'Keyboard Soundboard & Appearance Settings | Tip tap';
          description = 'Customize mechanical switch acoustic profiles (Creamy, Clicky, Typewriter), typography, themes, and focus mode preferences.';
          break;
      }
    }

    // Update document title
    document.title = title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update OpenGraph title & description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }

    // Update Twitter title & description
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) {
      twitterDesc.setAttribute('content', description);
    }

    // Update Canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (activeTab === 'practice' && !activeLesson) {
        canonicalLink.setAttribute('href', `${url.origin}/`);
      } else if (activeLesson) {
        canonicalLink.setAttribute('href', `${url.origin}/?tab=learn&lesson=${activeLesson.id}`);
      } else {
        canonicalLink.setAttribute('href', `${url.origin}/?tab=${activeTab}`);
      }
    }
  }, [activeTab, activeLesson]);

  return null;
};
