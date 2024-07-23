import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({ 
  destination: function (req, file, cb) { cb(null, 'uploads/'); }, 
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }, 
});

// check the file type
// function fileFilter(file, cb) {
//   const filetypes = /jpg|jpeg|png|pdf/;
//   const mimetypes = /image\/jpe?g|image\/png|image\/pdf/;

//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Please check the type of the file'), false)
//   }
// }

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
   if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/pdf') {
    return cb(new Error('Only PNG, JPEG and PDF files are allowed.'));
   }
   cb(null, true);
  },
  limits: {
   fileSize: 1024 * 1024 * 5, // Limiting file size to 5 MB
  },
 })

 const uploadMultipleImages = upload.array('document', 5);

router.post('/', (req, res) => {
  uploadMultipleImages(req, res, function(err) {
    if (err) {
      res.status(400).send({ message: err.message });
    }

    const documents = req.files.map(file => ({
      url: `${file.filename}`,
      name: file.originalname,
    }));

    res.status(200).send({
      message: 'Files uploaded',
      documents,
    })
  })
})

export default router