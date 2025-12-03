import cloudinary from '@/types/cloudinary';

export class ImageService {
  async uploadImage(filePath: string, options = {}) {
    try {
      const result = await cloudinary.uploader.upload(filePath, options);
      return { success: true, url: result.secure_url };
    } catch (error) {
      console.error('Image upload error:', error);
      return { success: false, error: 'Failed to upload image' };
    }
  }

  async deleteImage(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return { success: true };
    } catch (error) {
      console.error('Image deletion error:', error);
      return { success: false, error: 'Failed to delete image' };
    }
  }
}
