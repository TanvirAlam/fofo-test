import { v4 as uuidv4 } from 'uuid';
import { restaurants, type Restaurant } from '../../schema/restaurants';
import type { SeederData } from '../types';

export const generate = async (): Promise<SeederData<Restaurant>> => {
  const records: Restaurant[] = [];

  const sampleRestaurants = [
    {
      name: 'The Gourmet Kitchen',
      address: '123 Main Street',
      status: 'OPEN',
      isActive: true,
    },
    {
      name: 'Pizza Paradise',
      address: '456 Elm Avenue',
      status: 'OPEN',
      isActive: true,
    },
    {
      name: 'Sushi World',
      address: '789 Oak Lane',
      status: 'PENDING',
      isActive: true,
    },
    {
      name: 'Burger Hub',
      address: '321 Pine Road',
      status: 'OPEN',
      isActive: true,
    },
    {
      name: 'Cafe Delight',
      address: '654 Maple Blvd',
      status: 'CLOSED',
      isActive: false,
    },
  ];

  for (const r of sampleRestaurants) {
    records.push({
      id: uuidv4(),
      name: r.name,
      address: r.address,
      status: r.status,
      isActive: r.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return {
    tableName: 'restaurants',
    records,
    table: restaurants,
  };
};
