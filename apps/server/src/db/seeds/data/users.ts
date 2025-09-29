import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { users, type NewUser } from '../../schema/users';
import type { SeederData } from '../types';

export const generate = async (): Promise<SeederData<NewUser>> => {
  const records: NewUser[] = [];

  const superAdminPassword = await bcrypt.hash('admin123', 12);
  records.push({
    id: uuidv4(),
    email: 'superadmin@foodime.com',
    fullName: 'Super Admin',
    isVerified: true,
    isActive: true,
    role: 'SUPER_ADMIN',
    passwordHash: superAdminPassword,
    auth0Id: uuidv4(),
    status: 'ACTIVE',
    cvrNumber: 10000001,
  });

  const adminPassword = await bcrypt.hash('admin123', 12);
  records.push({
    id: uuidv4(),
    email: 'admin@foodime.com',
    fullName: 'Admin Admin',
    isVerified: true,
    isActive: true,
    role: 'ADMIN',
    passwordHash: adminPassword,
    auth0Id: uuidv4(),
    status: 'ACTIVE',
    cvrNumber: 10000002,
  });

  const ownerPassword = await bcrypt.hash('owner123', 12);
  records.push({
    id: uuidv4(),
    email: 'owner2@restaurant.com',
    fullName: 'Restaurant Owner',
    isVerified: true,
    isActive: true,
    role: 'MANAGER',
    passwordHash: ownerPassword,
    auth0Id: uuidv4(),
    status: 'ACTIVE',
    cvrNumber: 10000003,
  });

  for (let i = 0; i < 5; i++) {
    const password = await bcrypt.hash('user123', 12);
    records.push({
      id: uuidv4(),
      email: `user${i + 1}@example.com`,
      fullName: `User ${i + 1}`,
      isVerified: true,
      isActive: true,
      role: 'STAFF',
      passwordHash: password,
      auth0Id: uuidv4(),
      status: 'ACTIVE',
      cvrNumber: 10000010 + i,
    });
  }

  return {
    tableName: 'users',
    records,
    table: users,
  };
};
