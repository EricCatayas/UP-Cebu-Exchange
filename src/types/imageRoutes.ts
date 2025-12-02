import express from 'express';
import { upload } from '../types/multer';
import { uploadImage, deleteImage } from '../types/imageController';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);
router.delete('/delete', deleteImage);

export default router;
