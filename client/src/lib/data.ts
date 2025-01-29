import { User } from '../components/UserContext';

export type UnsavedProperty = {
  description: string;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  features: string;
  numberAndStreet: string;
  city: string;
  state: string;
  imageUrl: string;
  zipCode: string;
  agentId?: number;
  status: string;
  createdAt: Date;
  approvedBy?: number;
  approvedDate?: Date;
};

export type Property = UnsavedProperty & {
  propertyId: number;
};

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

export async function readProperties(): Promise<Property[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch('/api/properties', req);
  if (!response.ok) {
    throw new Error('Failed to fetch catalog');
  }

  const data = (await response.json()) as Property[];
  return data;
}

export async function readProperty(
  propertyId: number
): Promise<Property | undefined> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch(`/api/properties/${propertyId}`, req);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return (await response.json()) as Property;
}

export async function readPropertiesAllUser(): Promise<Property[]> {
  const response = await fetch('/api/properties-allUser');
  if (!response.ok) {
    throw new Error('Failed to fetch catalog');
  }

  const data = (await response.json()) as Property[];
  return data;
}

export async function readPropertyAllUser(
  propertyId: number
): Promise<Property | undefined> {
  const response = await fetch(`/api/properties-allUser/${propertyId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return (await response.json()) as Property;
}

export async function insertProperty(
  property: UnsavedProperty
): Promise<Property> {
  const response = await fetch('/api/properties', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(property),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return (await response.json()) as Property;
}

export async function updateProperty(
  property: Partial<Property>
): Promise<Property> {
  const response = await fetch(`/api/properties/${property.propertyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(property),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return (await response.json()) as Property;
}

export async function removeProperty(propertyId: number): Promise<void> {
  const response = await fetch(`/api/properties/${propertyId}`, {
    method: 'delete',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}

export async function addFavorite(propertyId: number): Promise<void> {
  const response = await fetch('/api/favorites', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify({ propertyId }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}

export async function removeFavorite(propertyId: number): Promise<void> {
  const response = await fetch(`/api/favorites/${propertyId}`, {
    method: 'delete',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}
export async function readFavorites(): Promise<Property[]> {
  const response = await fetch('/api/favorites', {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }
  return (await response.json()) as Property[];
}
