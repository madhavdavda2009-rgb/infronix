"use client";
import { useEffect } from 'react';

const SECTION_SEO_MAP = {
  'main-content': {
    title: 'InfronixWeb Digital Marketing | Best Web Development, SEO & AI Automation in Ahmedabad',
    description: 'InfronixWeb is a premier web agency in Ahmedabad, Gujarat. We engineer high-converting websites, Next.js web applications, technical SEO, and custom AI automations for modern brands across India.'
  },
  'services': {
    title: 'Digital Services & Capabilities | InfronixWeb Digital Marketing Ahmedabad',
    description: 'Explore our core capabilities in custom Website Development, Technical SEO Optimization, and Intelligent AI Automation.'
  },
  'process': {
    title: 'Our 4-Step Strategic Web Development & SEO Process | InfronixWeb',
    description: 'Discover how InfronixWeb delivers high-performance web applications through discovery, custom UI/UX design, full-stack engineering, and technical SEO.'
  },
  'portfolio': {
    title: 'Featured Projects & Digital Solutions | InfronixWeb Digital Marketing',
    description: 'Discover featured digital projects, custom e-commerce redesigns, corporate portals, and AI systems crafted by InfronixWeb in Ahmedabad.'
  },
  'about': {
    title: 'About Us & Mission | InfronixWeb Digital Marketing Ahmedabad',
    description: 'Learn about InfronixWeb Digital Marketing, our mission, collective engineering team in Sanand, Ahmedabad, and commitment to technical excellence.'
  },
  'trust': {
    title: 'Professionalism & Dedicated Support | InfronixWeb Digital Marketing',
    description: 'Unparalleled client support, transparent workflow, and comprehensive technical documentation for modern brands.'
  },
  'contact': {
    title: 'Schedule a Consultation | InfronixWeb Digital Marketing Ahmedabad',
    description: 'Schedule a complimentary digital strategy session with our technical directors to identify growth opportunities for your business.'
  },
  'faq': {
    title: 'Frequently Asked Questions | InfronixWeb Digital Marketing',
    description: 'Answers to common questions regarding our project timelines, web development pricing in Ahmedabad, ongoing SEO support, and tech stack.'
  },
  'consultation': {
    title: 'Schedule a Consultation | InfronixWeb Digital Marketing',
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
    const defaultTitle = title ? `${title} | InfronixWeb Digital Marketing` : 'InfronixWeb | Premier Web & Digital Agency';
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

    const metaDescription = description || 'InfronixWeb Digital Marketing - Delivering cutting-edge web design, AI automation, and SEO solutions.';
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
