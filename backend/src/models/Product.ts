import { pool } from '../config/database';
import { Product, CreateProductData, UpdateProductData } from '../types';

export class ProductModel {
  static async create(productData: CreateProductData & { sellerId: string }): Promise<Product> {
    const {
      sellerId,
      title,
      description,
      price,
      category,
      tags,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      thumbnailUrl
    } = productData;

    const query = `
      INSERT INTO products (
        seller_id, title, description, price, category, tags, file_url, 
        file_name, file_size, file_type, thumbnail_url, status, download_count, rating, review_count
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, seller_id, title, description, price, category, tags, file_url, 
                file_name, file_size, file_type, thumbnail_url, status, download_count, 
                rating, review_count, created_at, updated_at
    `;

    const values = [
      sellerId, title, description, price, category, JSON.stringify(tags),
      fileUrl, fileName, fileSize, fileType, thumbnailUrl, 'draft', 0, 0, 0
    ];

    const result = await pool.query(query, values);
    return this.mapRowToProduct(result.rows[0]);
  }

  static async findById(id: string): Promise<Product | null> {
    const query = `
      SELECT id, seller_id, title, description, price, category, tags, file_url, 
             file_name, file_size, file_type, thumbnail_url, status, download_count, 
             rating, review_count, created_at, updated_at
      FROM products WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
  }

  static async findBySeller(sellerId: string, options: { page?: number; limit?: number } = {}): Promise<Product[]> {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, seller_id, title, description, price, category, tags, file_url, 
             file_name, file_size, file_type, thumbnail_url, status, download_count, 
             rating, review_count, created_at, updated_at
      FROM products 
      WHERE seller_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [sellerId, limit, offset]);
    return result.rows.map(row => this.mapRowToProduct(row));
  }

  static async findAll(options: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<Product[]> {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      status = 'active',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;
    const conditions = ['status = $1'];
    const values: any[] = [status];
    let paramCount = 2;

    if (category) {
      conditions.push(`category = $${paramCount++}`);
      values.push(category);
    }

    if (minPrice !== undefined) {
      conditions.push(`price >= $${paramCount++}`);
      values.push(minPrice);
    }

    if (maxPrice !== undefined) {
      conditions.push(`price <= $${paramCount++}`);
      values.push(maxPrice);
    }

    const query = `
      SELECT id, seller_id, title, description, price, category, tags, file_url, 
             file_name, file_size, file_type, thumbnail_url, status, download_count, 
             rating, review_count, created_at, updated_at
      FROM products 
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT $${paramCount++} OFFSET $${paramCount++}
    `;

    values.push(limit, offset);
    const result = await pool.query(query, values);
    return result.rows.map(row => this.mapRowToProduct(row));
  }

  static async search(query: string, options: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  } = {}): Promise<Product[]> {
    const { page = 1, limit = 10, category, minPrice, maxPrice } = options;
    const offset = (page - 1) * limit;

    const conditions = [
      'status = $1',
      '(title ILIKE $2 OR description ILIKE $2 OR category ILIKE $2)'
    ];
    const values: any[] = ['active', `%${query}%`];
    let paramCount = 3;

    if (category) {
      conditions.push(`category = $${paramCount++}`);
      values.push(category);
    }

    if (minPrice !== undefined) {
      conditions.push(`price >= $${paramCount++}`);
      values.push(minPrice);
    }

    if (maxPrice !== undefined) {
      conditions.push(`price <= $${paramCount++}`);
      values.push(maxPrice);
    }

    const sqlQuery = `
      SELECT id, seller_id, title, description, price, category, tags, file_url, 
             file_name, file_size, file_type, thumbnail_url, status, download_count, 
             rating, review_count, created_at, updated_at
      FROM products 
      WHERE ${conditions.join(' AND ')}
      ORDER BY rating DESC, created_at DESC
      LIMIT $${paramCount++} OFFSET $${paramCount++}
    `;

    values.push(limit, offset);
    const result = await pool.query(sqlQuery, values);
    return result.rows.map(row => this.mapRowToProduct(row));
  }

  static async update(id: string, productData: UpdateProductData): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (productData.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(productData.title);
    }
    if (productData.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(productData.description);
    }
    if (productData.price !== undefined) {
      fields.push(`price = $${paramCount++}`);
      values.push(productData.price);
    }
    if (productData.category !== undefined) {
      fields.push(`category = $${paramCount++}`);
      values.push(productData.category);
    }
    if (productData.tags !== undefined) {
      fields.push(`tags = $${paramCount++}`);
      values.push(JSON.stringify(productData.tags));
    }
    if (productData.thumbnailUrl !== undefined) {
      fields.push(`thumbnail_url = $${paramCount++}`);
      values.push(productData.thumbnailUrl);
    }
    if (productData.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(productData.status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE products 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, seller_id, title, description, price, category, tags, file_url, 
                file_name, file_size, file_type, thumbnail_url, status, download_count, 
                rating, review_count, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
  }

  static async incrementDownloadCount(id: string): Promise<void> {
    const query = `
      UPDATE products 
      SET download_count = download_count + 1, updated_at = NOW()
      WHERE id = $1
    `;
    await pool.query(query, [id]);
  }

  static async updateRating(id: string, rating: number, reviewCount: number): Promise<void> {
    const query = `
      UPDATE products 
      SET rating = $1, review_count = $2, updated_at = NOW()
      WHERE id = $3
    `;
    await pool.query(query, [rating, reviewCount, id]);
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  static async getCategories(): Promise<string[]> {
    const query = `
      SELECT DISTINCT category 
      FROM products 
      WHERE status = 'active' 
      ORDER BY category
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.category);
  }

  static async getStats(sellerId: string): Promise<{
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    averageRating: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total_products,
        COALESCE(SUM(download_count), 0) as total_sales,
        COALESCE(AVG(rating), 0) as average_rating
      FROM products 
      WHERE seller_id = $1 AND status = 'active'
    `;

    const result = await pool.query(query, [sellerId]);
    const stats = result.rows[0];

    return {
      totalProducts: parseInt(stats.total_products),
      totalSales: parseInt(stats.total_sales),
      totalRevenue: 0, // Will be calculated from orders
      averageRating: parseFloat(stats.average_rating),
    };
  }

  private static mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      sellerId: row.seller_id,
      title: row.title,
      description: row.description,
      price: parseFloat(row.price),
      category: row.category,
      tags: JSON.parse(row.tags || '[]'),
      fileUrl: row.file_url,
      fileName: row.file_name,
      fileSize: parseInt(row.file_size),
      fileType: row.file_type,
      thumbnailUrl: row.thumbnail_url,
      status: row.status,
      downloadCount: parseInt(row.download_count),
      rating: parseFloat(row.rating),
      reviewCount: parseInt(row.review_count),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
