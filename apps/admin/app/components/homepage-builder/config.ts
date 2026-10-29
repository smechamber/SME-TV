import type { Design, Section } from './types';

export const designs: { value: Design; label: string; hint: string }[] = [
  { value: 'STANDARD', label: 'Standard cards', hint: 'Clean three-column cards' },
  {
    value: 'FEATURED_GRID',
    label: 'Editorial news grid',
    hint: 'Large lead story with stacked cards',
  },
  { value: 'SPLIT_FEATURED', label: 'Hero + headlines', hint: 'Large hero with editor picks' },
  { value: 'DARK_BAND', label: 'Featured video band', hint: 'Dark broadcast strip with cards' },
  { value: 'COMPACT_LIST', label: 'Compact headlines', hint: 'Numbered headlines with metadata' },
  { value: 'EVENT_CARDS', label: 'Event cards', hint: 'Date and venue focused cards' },
];

export const sectionKinds = [
  { value: 'CUSTOM', label: 'Custom section' },
  { value: 'TRENDING', label: 'Trending on SMETV' },
  { value: 'LATEST', label: 'Latest content' },
] as const;

export const emptySection = (order: number): Section => ({
  id: '',
  name: 'New section',
  kind: 'CUSTOM',
  layout: 'GRID',
  design: 'STANDARD',
  source: 'MANUAL',
  contentType: 'MIXED',
  itemCount: 6,
  contentIds: [],
  displayFields: ['IMAGE', 'CATEGORY', 'SUMMARY'],
  displayOrder: order,
  enabled: true,
});

export const inputClass =
  'w-full rounded border border-[#dedbe3] bg-white p-2.5 text-xs text-[#282338]';
