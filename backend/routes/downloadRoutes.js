import path from 'path';
import express from 'express';
import fs from 'fs';

const router = express.Router();

// @Desc Download a file
// @route GET /api/download/:filename
// @access Public
const __dirname = path.resolve();

router.get('/:filename', (req, res) => {
  console.log('Download route accessed');
  
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  console.log(`Attempting to download file from: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Could not download file', error: err.message });
      } else {
        console.log('File downloaded successfully');
      }
    });
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

export default router;
