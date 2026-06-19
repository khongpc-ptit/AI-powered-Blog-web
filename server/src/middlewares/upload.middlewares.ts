import multer from 'multer'

// Sử dụng memoryStorage thay vì diskStorage
// File sẽ được giữ trong bộ nhớ dưới dạng Buffer để upload lên Cloudinary
const storage = multer.memoryStorage()

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn file 5MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận hình ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!') as any, false)
    }
  }
})

export default upload
