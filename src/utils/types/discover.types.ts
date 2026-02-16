/**
 * TypeScript interfaces for Discover section
 */

export interface IconSource {
  type: 'local' | 'remote' | 'emoji';
  source: any; // Local asset or URL string or emoji string
}

export interface DApp {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: IconSource;
  category: string;
  featured?: boolean;
  tags?: string[];
}

export interface DiscoverCategory {
  id: string;
  name: string;
  displayName: string;
  icon: IconSource;
  description: string;
  dapps: DApp[];
}

export interface DiscoverData {
  categories: DiscoverCategory[];
  featured: DApp[];
}

export interface CategoryTabProps {
  category: DiscoverCategory;
  isActive: boolean;
  onPress: () => void;
}

export interface DAppCardProps {
  dapp: DApp;
  onPress: () => void;
}

export interface DiscoverSectionProps {
  data: DiscoverData;
  onDAppSelect: (dapp: DApp) => void;
}
