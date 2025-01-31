import path from 'node:path';
import multer from 'multer';

const imagesDirectory = 'public/images';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, imagesDirectory);
  },
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExtension);
    const name = `${fileName}-${Date.now()}${fileExtension}`;
    callback(null, name);
  },
});

export const uploadsMiddleware = multer({ storage });
