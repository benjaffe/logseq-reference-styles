// =============================================================================
// v0.0.1 2022_0220_0749 by Ben Jaffe
// The following JS allows you to put an emoji before any page with a given prefix.
// You can define as many customizations as you want.
//   title (optional): makes the generated css prettier, but you won't see it anyway
//   prefix (required): the prefix it matches against
//   character (required): it must be a single character/emoji
//   color (optional): will change the color of the matched text
// =============================================================================

import {BlockStyle} from './App';

export const makePrefixCSS = (
  title: string,
  {prefix, character, color}: BlockStyle,
) => {
  // brittle, imitating `page-name-sanity` in the logseq source code
  const prefixEscaped = prefix
    .replace(/[\[\:\\\*\?\"\<\>\|\]\+\%\#]/g, '_')
    .toLowerCase();
  return `
/* ${title} */
.page-reference[data-ref^='${prefix}'] .page-ref,
.page-ref[data-ref^='${prefixEscaped}'],
.favorite-item[data-ref^='${prefix}'] a,
.favorite-item[data-ref^='${prefixEscaped}'] a,
.recent-item[data-ref^='${prefixEscaped}'] a {
  color: ${color ? `${color}` : 'inherit'} !important;
  font-weight: 500;
}

.title[data-ref^='${prefixEscaped}'] {
  color: ${color ? `${color}` : 'inherit'} !important;
}

.recent-item[data-ref^='${prefixEscaped}'] {
  position: relative;
}
.recent-item[data-ref^='${prefixEscaped}'] .page-icon {
  visibility: hidden;
}
.page-reference[data-ref^='${prefix}'] .page-ref:before,
.page-ref[data-ref^='${prefixEscaped}']:before,
.recent-item[data-ref^='${prefixEscaped}']:before,
.title[data-ref^='${prefixEscaped}']:before {
  display: ${character ? 'inline' : 'none'};
  content: '${character || ''}';
  margin-right: 2px;
}

.recent-item[data-ref^='${prefixEscaped}']:before {
  position: absolute;
  left: 20px;
  top: 3px;
}`;
};
