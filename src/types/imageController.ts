import { Request, Response } from 'express';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/CloudinaryService';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await uploadToCloudinary(req.file.buffer, 'my_uploads');

    return res.status(200).json({
      message: 'Upload successful',
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: 'publicId required' });

    const result = await deleteFromCloudinary(publicId);

    return res.status(200).json({
      message: 'Delete successful',
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
