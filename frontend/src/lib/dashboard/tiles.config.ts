export interface TileDefinition {
  id: string;
  label: string;
  icon: string;
  href: string;
  description: string;
  bg: string;
  accent: string;
  decoAngle: number;
  decoSize: string;
  decoX: string;
  decoY: string;
}

export const BENTO_TILES: TileDefinition[] = [
  {
    id: 'courses',
    label: 'Kurzy',
    icon: 'ti-book',
    href: '/admin/courses',
    description: 'Správa kurzů, obsahu a nastavení',
    bg: '#1d3fb0',
    accent: '#3f6bf5',
    decoAngle: 38,
    decoSize: '70%',
    decoX: '55%',
    decoY: '-20%',
  },
  {
    id: 'lessons',
    label: 'Globální lekce',
    icon: 'ti-layout-list',
    href: '/admin/lessons',
    description: 'Šablony a volné lekce',
    bg: '#5b21b6',
    accent: '#8b5cf6',
    decoAngle: -25,
    decoSize: '80%',
    decoX: '-20%',
    decoY: '40%',
  },
  {
    id: 'users',
    label: 'Uživatelé',
    icon: 'ti-users',
    href: '/admin/users',
    description: 'Účty a přístupy',
    bg: '#9d174d',
    accent: '#ff5fa2',
    decoAngle: 52,
    decoSize: '90%',
    decoX: '30%',
    decoY: '-30%',
  },
  {
    id: 'groups',
    label: 'Skupiny',
    icon: 'ti-users-group',
    href: '/admin/groups',
    description: 'Přiřazení kurzů skupinám',
    bg: '#312e9e',
    accent: '#6366f1',
    decoAngle: -40,
    decoSize: '110%',
    decoX: '20%',
    decoY: '20%',
  },
  {
    id: 'access-codes',
    label: 'Přístupy',
    icon: 'ti-key',
    href: '/admin/access-codes',
    description: 'Kódy a přístup uživatelů',
    bg: '#86198f',
    accent: '#d946ef',
    decoAngle: 18,
    decoSize: '45%',
    decoX: '60%',
    decoY: '-50%',
  },
  {
    id: 'courses-deleted',
    label: 'Smazané kurzy',
    icon: 'ti-trash',
    href: '/admin/courses/deleted',
    description: 'Koš a obnovení kurzů',
    bg: '#6b2737',
    accent: '#f0566b',
    decoAngle: -32,
    decoSize: '60%',
    decoX: '50%',
    decoY: '30%',
  },
];

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'Přehled',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard', href: '/admin/dashboard' },
    ],
  },
  {
    title: 'Obsah',
    items: [
      { id: 'courses',         label: 'Spravovat kurzy', icon: 'ti-book',  href: '/admin/courses' },
      { id: 'courses-deleted', label: 'Smazané kurzy',   icon: 'ti-trash', href: '/admin/courses/deleted' },
      { id: 'lessons',         label: 'Spravovat lekce', icon: 'ti-list',  href: '/admin/lessons' },
    ],
  },
  {
    title: 'Správa přístupů',
    items: [
      { id: 'users',        label: 'Uživatelé',       icon: 'ti-users',       href: '/admin/users' },
      { id: 'groups',       label: 'Skupiny',          icon: 'ti-users-group', href: '/admin/groups' },
      { id: 'access-codes', label: 'Přístupy',         icon: 'ti-key',         href: '/admin/access-codes' },
    ],
  },
];

export type TileColor = 'amber' | 'amber-dark' | 'cyan' | 'blue' | 'peach' | 'teal-dark';
export const TILE_COLOR_MAP: Record<TileColor, string> = {
  'amber':      'bg-tile-amber',
  'amber-dark': 'bg-tile-amber-dark',
  'cyan':       'bg-tile-cyan',
  'blue':       'bg-tile-blue',
  'peach':      'bg-tile-peach',
  'teal-dark':  'bg-tile-teal-dark',
};
export const ALL_TILES: any[] = [];
