import { pool } from '../config/database';
import { User, CreateUserData, UpdateUserData } from '../types';

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const { email, password, firstName, lastName, role = 'buyer' } = userData;
    
    const query = `
      INSERT INTO users (email, password, first_name, last_name, role, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, password, first_name, last_name, role, is_verified, avatar, bio, created_at, updated_at
    `;
    
    const values = [email, password, firstName, lastName, role, false];
    const result = await pool.query(query, values);
    
    return this.mapRowToUser(result.rows[0]);
  }

  static async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, email, password, first_name, last_name, role, is_verified, avatar, bio, created_at, updated_at
      FROM users WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, password, first_name, last_name, role, is_verified, avatar, bio, created_at, updated_at
      FROM users WHERE email = $1
    `;
    
    const result = await pool.query(query, [email]);
    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  static async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (userData.firstName !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(userData.firstName);
    }
    if (userData.lastName !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(userData.lastName);
    }
    if (userData.bio !== undefined) {
      fields.push(`bio = $${paramCount++}`);
      values.push(userData.bio);
    }
    if (userData.avatar !== undefined) {
      fields.push(`avatar = $${paramCount++}`);
      values.push(userData.avatar);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, password, first_name, last_name, role, is_verified, avatar, bio, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  static async verifyEmail(id: string): Promise<User | null> {
    const query = `
      UPDATE users 
      SET is_verified = true, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, password, first_name, last_name, role, is_verified, avatar, bio, created_at, updated_at
    `;

    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  static async findAll(options: { page?: number; limit?: number } = {}): Promise<User[]> {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, email, password, first_name, last_name, role, is_verified, avatar, bio, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, [limit, offset]);
    return result.rows.map(row => this.mapRowToUser(row));
  }

  private static mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role,
      isVerified: row.is_verified,
      avatar: row.avatar,
      bio: row.bio,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
