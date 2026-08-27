"use client";
import { useEffect } from 'react';

const SECTION_SEO_MAP = {
  'main-content': {
    title: 'Home | Infronix Web Agency',
    description: 'Infronix Web Agency - Designing digital brilliance, custom web applications, AI automation, and technical innovation.'
  },
  'services': {
    title: 'Digital Services & Capabilities | Infronix Web Agency',
    description: 'Explore our core capabilities in modern Web Development, Technical SEO Optimization, and Intelligent AI Automation.'
  },
  'portfolio': {
    title: 'Featured Projects & Portfolio | Infronix Web Agency',
    description: 'Discover featured digital projects, custom e-commerce redesigns, fintech dashboards, and AI portals crafted by Infronix.'
  },
  'about': {
    title: 'About Us & Our Mission | Infronix Web Agency',
    description: 'Learn about Infronix, our mission, collective engineering team, and commitment to technical excellence.'
  },
  'trust': {
    title: 'Professionalism & Client Support | Infronix Web Agency',
    description: 'Unparalleled client support, transparent workflow, and comprehensive technical documentation.'
  },
  'contact': {
    title: 'Get in Touch & Strategy | Infronix Web Agency',
    description: 'Schedule a complimentary digital strategy session with our technical directors to elevate your brand.'
  },
  'faq': {
    title: 'Frequently Asked Questions | Infronix Web Agency',
    description: 'Answers to common questions regarding our project timelines, ongoing SEO support, responsiveness, and tech stack.'
  },
  'consultation': {
    title: 'Schedule a Consultation | Infronix Web Agency',
    description: 'Fill out our secure consultation request form to get a personalized project proposal within 24 hours.'
  }
};

export default function SEO({ 
  title, 
  description, 
  enableSectionObserver = true 
}) {
  useEffect(() => {
    // 1. Initial Page Title Update
    const defaultTitle = title ? `${title} | Infronix Web Agency` : 'Infronix | Premier Web & Digital Agency';
    document.title = defaultTitle;

    // 2. Helper to set or create meta tags
    const setMetaTag = (selector, name, attr, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    const metaDescription = description || 'Infronix Web Agency - Delivering cutting-edge web design, AI automation, and SEO solutions.';
    setMetaTag('meta[name="description"]', 'description', 'name', metaDescription);
    setMetaTag('meta[property="og:title"]', 'og:title', 'property', defaultTitle);
    setMetaTag('meta[property="og:description"]', 'og:description', 'property', metaDescription);
    setMetaTag('meta[name="twitter:title"]', 'twitter:title', 'name', defaultTitle);
    setMetaTag('meta[name="twitter:description"]', 'twitter:description', 'name', metaDescription);

    // 3. Section Scroll-Spy Observer (updates SEO title as user scrolls sections)
    if (!enableSectionObserver) return;

    const sectionIds = Object.keys(SECTION_SEO_MAP);
    const observedElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (observedElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Center viewport focus
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          const sectionData = SECTION_SEO_MAP[entry.target.id];
          if (sectionData) {
            document.title = sectionData.title;
            setMetaTag('meta[name="description"]', 'description', 'name', sectionData.description);
            setMetaTag('meta[property="og:title"]', 'og:title', 'property', sectionData.title);
          }
        }
      });
    }, observerOptions);

    observedElements.forEach((el) => observer.observe(el));

    return () => {
      observedElements.forEach((el) => observer.unobserve(el));
    };
  }, [title, description, enableSectionObserver]);

  return null;
}
