import path from 'path';
import express from 'express'
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|pdf|webp/;
  const mimetypes = /image\/jpe?g|image\/png|application\/pdf|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);
  if(extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Valid document format only!'), false);
  }
}

const upload = multer({
  storage, 
  fileFilter,
  limits: {fileSize: parseInt(process.env.LIMIT_FILE_SIZE, 10) || 5 * 1024 * 1024} // 5mb limit
})
const uploadMultipleFiles = upload.array('document', 8);

router.post('/', (req, res) => {
  uploadMultipleFiles(req, res, function (err) {
    if (err) {
      // Handle specific errors
      if (err.message === 'File too large') {
        return res.status(400).json({ message: 'File too large. Max 5mb allowed' });
      }
      if (err.message === 'Valid document format only!') {
        return res.status(400).json({ message: 'Invalid document format: pdf, jpg, jpeg and png only!' });
      }
      return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
    const files = req.files.map(file=>({
      url: `/${file.path}`,
      name: file.originalname
    }));
    res.status(200).send({
      message: 'Files Uploaded successfully',
      files
    })
  })
})

export default router;