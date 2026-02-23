import cloudinary from '@/config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

const FOLDER_NAME = process.env.CLOUDINARY_FOLDER_NAME || 'UP Cebu Exchange';

export default class ImageService {
  async uploadImages(
    Uint8ArrayFiles: Uint8Array[],
    options = {}
  ): Promise<{ success: boolean; results?: UploadApiResponse[]; error?: string }> {
    try {
      const uploadResults = [];

      for (const buffer of Uint8ArrayFiles) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: FOLDER_NAME,
                ...options,
              },
              function (error, result) {
                if (error) {
                  console.error('Image upload error:', error);
                  reject({ success: false, error: error instanceof Error ? error.message : 'Failed to upload images' });
                } else {
                  resolve(result);
                }
              }
            )
            .end(buffer);
        });
        uploadResults.push(result);
      }

      return { success: true, results: uploadResults };
    } catch (error) {
      console.error('Image upload error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to upload images' };
    }
  }

  async uploadImage(
    Uint8ArrayFiles: Uint8Array,
    options = {}
  ): Promise<{ success: boolean; result?: UploadApiResponse; error?: string }> {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: FOLDER_NAME,
              ...options,
            },
            function (error, result) {
              if (error) {
                console.error('Image upload error:', error);
                reject({ success: false, error: 'Failed to upload image' });
              } else {
                resolve(result);
              }
            }
          )
          .end(Uint8ArrayFiles);
      });

      return { success: true, result: result as UploadApiResponse };
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
