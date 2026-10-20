export type UserRole = 'WISATAWAN' | 'PETUGAS' | 'ADMIN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  siteId?: string | null;
  assignedSiteName?: string | null;
}

export interface DestinationWithPrices {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  category: string;
  openingHours: string;
  imageUrl: string;
  facilities: string[];
  status: string;
  manager: string;
  minPrice: number;
  ticketTypes: {
    id: string;
    name: string;
    visitorCategory: string;
    priceIdr: number;
  }[];
}
