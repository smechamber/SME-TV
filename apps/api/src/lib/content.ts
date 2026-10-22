import { createHash } from 'node:crypto';
import sanitizeHtml from 'sanitize-html';

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90);

export const hashToken = (value: string) => createHash('sha256').update(value).digest('hex');

export const sanitizeArticleHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: [
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'ul',
      'ol',
      'li',
      'blockquote',
      'a',
      'img',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'hr',
      'br',
      'iframe',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      iframe: [
        'src',
        'width',
        'height',
        'title',
        'allow',
        'allowfullscreen',
        'loading',
        'referrerpolicy',
      ],
    },
    allowedIframeHostnames: ['www.youtube-nocookie.com'],
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) },
  });
