'use client';

const ALLOWED_TAGS = new Set([
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  'span',
  'strong',
  'ul',
]);

const ALLOWED_ATTRS = new Set([
  'alt',
  'class',
  'href',
  'rel',
  'src',
  'target',
  'title',
]);

function isSafeUrl(value) {
  if (!value) return true;

  try {
    const url = new URL(value, window.location.origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export default function sanitizeHtml(html = '') {
  if (typeof window === 'undefined' || !html) return '';

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const nodes = doc.body.querySelectorAll('*');

  nodes.forEach((node) => {
    const tagName = node.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tagName)) {
      node.replaceWith(...node.childNodes);
      return;
    }

    Array.from(node.attributes).forEach((attr) => {
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value;

      if (
        attrName.startsWith('on') ||
        !ALLOWED_ATTRS.has(attrName) ||
        ((attrName === 'href' || attrName === 'src') && !isSafeUrl(attrValue))
      ) {
        node.removeAttribute(attr.name);
      }
    });

    if (tagName === 'a' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  return doc.body.innerHTML;
}
