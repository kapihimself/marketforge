import { v2 as cloudinary } from 'cloudinary';
import { servicesConfig } from '../config/database';

// Configure Cloudinary
cloudinary.config({
  cloud_name: servicesConfig.cloudinary.cloudName,
  api_key: servicesConfig.cloudinary.apiKey,
  api_secret: servicesConfig.cloudinary.apiSecret,
  secure: servicesConfig.cloudinary.secure,
});

export class FileService {
  /**
   * Upload file to Cloudinary
   */
  async uploadFile(
    file: string,
    options: {
      folder?: string;
      publicId?: string;
      resourceType?: 'image' | 'video' | 'raw' | 'auto';
      transformation?: any;
      tags?: string[];
    } = {}
  ): Promise<{
    publicId: string;
    secureUrl: string;
    url: string;
    format: string;
    size: number;
    width?: number;
    height?: number;
  }> {
    try {
      const uploadOptions = {
        folder: options.folder || 'digital-commerce',
        resource_type: options.resourceType || 'auto',
        ...(options.publicId && { public_id: options.publicId }),
        ...(options.transformation && { transformation: options.transformation }),
        ...(options.tags && { tags: options.tags }),
      };

      const result = await cloudinary.uploader.upload(file, uploadOptions);

      return {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        url: result.url,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw new Error('File upload failed');
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: Array<{
      file: string;
      folder?: string;
      publicId?: string;
      resourceType?: 'image' | 'video' | 'raw' | 'auto';
      tags?: string[];
    }>
  ): Promise<Array<{
    publicId: string;
    secureUrl: string;
    url: string;
    format: string;
    size: number;
    width?: number;
    height?: number;
  }>> {
    try {
      const uploadPromises = files.map(fileData => 
        this.uploadFile(fileData.file, {
          folder: fileData.folder,
          publicId: fileData.publicId,
          resourceType: fileData.resourceType,
          tags: fileData.tags,
        })
      );

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Multiple file upload failed:', error);
      throw new Error('Multiple file upload failed');
    }
  }

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'raw'): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete failed:', error);
      throw new Error('File deletion failed');
    }
  }

  /**
   * Generate signed URL for secure file access
   */
  generateSignedUrl(
    publicId: string,
    options: {
      resourceType?: 'image' | 'video' | 'raw';
      transformation?: any;
      expiresIn?: number; // seconds
    } = {}
  ): string {
    try {
      const urlOptions = {
        resource_type: options.resourceType || 'auto',
        expires_in: options.expiresIn || 3600, // 1 hour default
        ...(options.transformation && { transformation: options.transformation }),
      };

      return cloudinary.url(publicId, urlOptions);
    } catch (error) {
      console.error('Signed URL generation failed:', error);
      throw new Error('Signed URL generation failed');
    }
  }

  /**
   * Transform image (resize, crop, etc.)
   */
  transformImage(
    publicId: string,
    transformations: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
      format?: string;
      gravity?: string;
    }
  ): string {
    try {
      return cloudinary.url(publicId, {
        transformation: transformations,
      });
    } catch (error) {
      console.error('Image transformation failed:', error);
      throw new Error('Image transformation failed');
    }
  }

  /**
   * Get file information
   */
  async getFileInfo(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'raw'): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: resourceType,
      });

      return {
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        url: result.secure_url,
        createdAt: result.created_at,
        tags: result.tags,
      };
    } catch (error) {
      console.error('Get file info failed:', error);
      throw new Error('Get file info failed');
    }
  }

  /**
   * Create folder
   */
  async createFolder(folderName: string): Promise<boolean> {
    try {
      // Cloudinary doesn't have explicit folder creation
      // Folders are created automatically when files are uploaded to them
      return true;
    } catch (error) {
      console.error('Folder creation failed:', error);
      throw new Error('Folder creation failed');
    }
  }

  /**
   * List files in folder
   */
  async listFiles(folderName: string, options: {
    maxResults?: number;
    nextCursor?: string;
    resourceType?: 'image' | 'video' | 'raw';
  } = {}): Promise<{
    resources: any[];
    nextCursor?: string;
  }> {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderName,
        max_results: options.maxResults || 50,
        next_cursor: options.nextCursor,
        resource_type: options.resourceType || 'auto',
      });

      return {
        resources: result.resources,
        nextCursor: result.next_cursor,
      };
    } catch (error) {
      console.error('List files failed:', error);
      throw new Error('List files failed');
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{
    totalBytes: number;
    totalResources: number;
    usedBytes: number;
    usedResources: number;
  }> {
    try {
      const result = await cloudinary.api.usage();

      return {
        totalBytes: result.plan_limits.bytes,
        totalResources: result.plan_limits.resources,
        usedBytes: result.used_quota.bytes,
        usedResources: result.used_quota.resources,
      };
    } catch (error) {
      console.error('Get storage stats failed:', error);
      throw new Error('Get storage stats failed');
    }
  }
}

export const fileService = new FileService();
