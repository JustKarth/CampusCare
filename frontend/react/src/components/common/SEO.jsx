import { useEffect } from 'react';

// SEO component for dynamic meta tags
export function SEO({ title, description, keywords }) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${title} | CampusCare`;
    }

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description, true);
    }

    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Open Graph tags
    updateMetaTag('og:title', title || 'CampusCare', true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'CampusCare', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary');
    updateMetaTag('twitter:title', title || 'CampusCare');
    if (description) {
      updateMetaTag('twitter:description', description);
    }
  }, [title, description, keywords]);

  return null;
}
