import multer from 'multer'
import fs from 'fs'
import path from 'path'

// Khởi tạo thư mục uploads nếu chưa có
const uploadDir = path.resolve('uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất tránh trùng lặp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

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
