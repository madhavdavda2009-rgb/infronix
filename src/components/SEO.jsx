"use client";
import { useEffect } from 'react';

const SECTION_SEO_MAP = {
  'main-content': {
    title: 'Infronix Web Agency | Best Web Development, SEO & AI Automation in Ahmedabad',
    description: 'Infronix is a premier web agency in Ahmedabad, Gujarat. We engineer high-converting websites, Next.js web applications, technical SEO, and custom AI automations for modern brands across India.'
  },
  'services': {
    title: 'Digital Services & Capabilities | Infronix Web Agency Ahmedabad',
    description: 'Explore our core capabilities in custom Website Development, Technical SEO Optimization, and Intelligent AI Automation.'
  },
  'process': {
    title: 'Our 4-Step Strategic Web Development & SEO Process | Infronix',
    description: 'Discover how Infronix delivers high-performance web applications through discovery, custom UI/UX design, full-stack engineering, and technical SEO.'
  },
  'portfolio': {
    title: 'Featured Projects & Digital Solutions | Infronix Web Agency',
    description: 'Discover featured digital projects, custom e-commerce redesigns, corporate portals, and AI systems crafted by Infronix in Ahmedabad.'
  },
  'about': {
    title: 'About Us & Mission | Infronix Web Agency Ahmedabad',
    description: 'Learn about Infronix Web Agency, our mission, collective engineering team in Sanand, Ahmedabad, and commitment to technical excellence.'
  },
  'trust': {
    title: 'Professionalism & Dedicated Support | Infronix Web Agency',
    description: 'Unparalleled client support, transparent workflow, and comprehensive technical documentation for modern brands.'
  },
  'contact': {
    title: 'Schedule a Consultation | Infronix Web Agency Ahmedabad',
    description: 'Schedule a complimentary digital strategy session with our technical directors to identify growth opportunities for your business.'
  },
  'faq': {
    title: 'Frequently Asked Questions | Infronix Web Agency',
    description: 'Answers to common questions regarding our project timelines, web development pricing in Ahmedabad, ongoing SEO support, and tech stack.'
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
