import { User, UserRole } from '../graphql/entities/User';
import { drizzleDb, schema } from '../db';
import { logger } from '../utils/logger';
import { eq, desc, asc, sql } from 'drizzle-orm';

interface CreateUserInput {
  email: string;
  password: string;
  fullname?: string;
  cvrNumber?: number;
  phone?: string;
  role?: UserRole;
  auth0Id?: string;
}

interface UpdateUserInput {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  avatar?: string;
  isVerified?: boolean;
  isActive?: boolean;
  role?: UserRole;
  lastLogin?: Date;
}

export class UserRepository {
  async findAll(limit = 50, offset = 0): Promise<User[]> {
    try {
      const result = await drizzleDb
        .select({
          id: schema.users.id,
          email: schema.users.email,
          fullName: schema.users.fullName,
          avatarUrl: schema.users.avatarUrl,
          phone: schema.users.phone,
          isVerified: schema.users.isVerified,
          isActive: schema.users.isActive,
          role: schema.users.role,
          createdAt: schema.users.createdAt,
          updatedAt: schema.users.updatedAt,
        })
        .from(schema.users)
        .orderBy(desc(schema.users.createdAt))
        .limit(limit)
        .offset(offset);

      return result.map(user => ({
        ...user,
        fullName: user.fullName ?? undefined,
        avatarUrl: user.avatarUrl ?? undefined,
        phone: user.phone ?? undefined,
        role: user.role as UserRole,
      }));
    } catch (error) {
      logger.error('Error finding all users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const result = await drizzleDb
        .select({
          id: schema.users.id,
          email: schema.users.email,
          fullName: schema.users.fullName,
          avatarUrl: schema.users.avatarUrl,
          phone: schema.users.phone,
          isVerified: schema.users.isVerified,
          isActive: schema.users.isActive,
          role: schema.users.role,
          createdAt: schema.users.createdAt,
          updatedAt: schema.users.updatedAt,
        })
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1);

      const user = result[0];
      if (!user) return null;

      return {
        ...user,
        username: user.fullName ?? undefined,
        avatar: user.avatarUrl ?? undefined,
        phone: user.phone ?? undefined,
        role: user.role as UserRole,
      };
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw new Error('Failed to fetch user');
    }
  }

  async findByEmail(
    email: string
  ): Promise<(User & { password: string }) | null> {
    try {
      const result = await drizzleDb
        .select({
          id: schema.users.id,
          email: schema.users.email,
          fullName: schema.users.fullName,
          avatarUrl: schema.users.avatarUrl,
          phone: schema.users.phone,
          isVerified: schema.users.isVerified,
          isActive: schema.users.isActive,
          role: schema.users.role,
          createdAt: schema.users.createdAt,
          updatedAt: schema.users.updatedAt,
          password: schema.users.passwordHash,
        })
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);

      const user = result[0];
      if (!user) return null;

      return {
        ...user,
        username: user.fullName ?? undefined,
        avatar: user.avatarUrl ?? undefined,
        phone: user.phone ?? undefined,
        role: user.role as UserRole,
        password: user.password,
      };
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw new Error('Failed to fetch user');
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await drizzleDb
        .select({
          id: schema.users.id,
          email: schema.users.email,
          fullName: schema.users.fullName,
          avatarUrl: schema.users.avatarUrl,
          phone: schema.users.phone,
          isVerified: schema.users.isVerified,
          isActive: schema.users.isActive,
          role: schema.users.role,
          createdAt: schema.users.createdAt,
          updatedAt: schema.users.updatedAt,
        })
        .from(schema.users)
        .where(eq(schema.users.fullName, username))
        .limit(1);

      const user = result[0];
      if (!user) return null;

      return {
        ...user,
        username: user.fullName ?? undefined,
        avatar: user.avatarUrl ?? undefined,
        phone: user.phone ?? undefined,
        role: user.role as UserRole,
      };
    } catch (error) {
      logger.error('Error finding user by username:', error);
      throw new Error('Failed to fetch user');
    }
  }

  async create(input: CreateUserInput): Promise<User> {
    try {
      const result = await drizzleDb
        .insert(schema.users)
        .values({
          email: input.email,
          passwordHash: input.password,
          fullName: input.fullname ?? '',
          phone: input.phone ?? null,
          cvrNumber: input.cvrNumber ?? 0,
          role: input.role ?? 'STAFF',
          auth0Id: input.auth0Id ?? crypto.randomUUID(),
          isVerified: false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({
          id: schema.users.id,
          email: schema.users.email,
          fullName: schema.users.fullName,
          avatarUrl: schema.users.avatarUrl,
          phone: schema.users.phone,
          isVerified: schema.users.isVerified,
          isActive: schema.users.isActive,
          role: schema.users.role,
          createdAt: schema.users.createdAt,
          updatedAt: schema.users.updatedAt,
        });

      const user = result[0];
      if (!user) {
        throw new Error('Failed to create user - no result returned');
      }

      return {
        ...user,
        username: user.fullName ?? undefined,
        avatar: user.avatarUrl ?? undefined,
        phone: user.phone ?? undefined,
        role: user.role as UserRole,
      };
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    try {
      // Build update object dynamically
      const updateData: Partial<typeof schema.users.$inferInsert> = {};

      if (input.email !== undefined) updateData.email = input.email;
      if (input.username !== undefined) updateData.fullName = input.username;
      if (input.phone !== undefined) updateData.phone = input.phone;
      if (input.avatar !== undefined) updateData.avatarUrl = input.avatar;
      if (input.isVerified !== undefined)
        updateData.isVerified = input.isVerified;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;
      if (input.role !== undefined) updateData.role = input.role;

      if (Object.keys(updateData).length === 0) {
        return this.findById(id);
      }

      // Always update the updatedAt timestamp
      updateData.updatedAt = new Date();

      const result = await drizzleDb
        .update(schema.users)
        .set(updateData)
        .where(eq(schema.users.id, id))
        .returning({
          id: schema.users.id,
          email: schema.users.email,
          fullName: schema.users.fullName,
          avatarUrl: schema.users.avatarUrl,
          phone: schema.users.phone,
          isVerified: schema.users.isVerified,
          isActive: schema.users.isActive,
          role: schema.users.role,
          createdAt: schema.users.createdAt,
          updatedAt: schema.users.updatedAt,
        });

      const user = result[0];
      if (!user) return null;

      return {
        ...user,
        username: user.fullName ?? undefined,
        avatar: user.avatarUrl ?? undefined,
        phone: user.phone ?? undefined,
        role: user.role as UserRole,
      };
    } catch (error) {
      logger.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
    try {
      const result = await drizzleDb
        .update(schema.users)
        .set({
          passwordHash: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, id));

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      logger.error('Error updating password:', error);
      throw new Error('Failed to update password');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await drizzleDb
        .delete(schema.users)
        .where(eq(schema.users.id, id));

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async count(): Promise<number> {
    try {
      const result = await drizzleDb
        .select({ count: sql<number>`count(*)` })
        .from(schema.users);

      return Number(result[0]?.count ?? 0);
    } catch (error) {
      logger.error('Error counting users:', error);
      throw new Error('Failed to count users');
    }
  }
}
