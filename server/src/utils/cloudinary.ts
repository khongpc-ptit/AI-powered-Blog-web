import { v2 as cloudinary } from 'cloudinary'

// Cấu hình Cloudinary từ biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * Upload ảnh lên Cloudinary từ buffer (multer memoryStorage)
 * @param fileBuffer - Buffer của file ảnh
 * @param folder - Thư mục trên Cloudinary (mặc định: 'blog-images')
 * @returns URL của ảnh đã upload
 */
export const uploadToCloudinary = (fileBuffer: Buffer, folder: string = 'blog-images'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' } // Tự động tối ưu chất lượng và định dạng
        ]
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result!.secure_url)
        }
      }
    )
    uploadStream.end(fileBuffer)
  })
}

/**
 * Xóa ảnh trên Cloudinary theo public_id
 * @param imageUrl - URL đầy đủ hoặc public_id của ảnh
 */
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    // Trích xuất public_id từ URL Cloudinary
    // VD: https://res.cloudinary.com/xxx/image/upload/v123/blog-images/abc.jpg -> blog-images/abc
    const urlParts = imageUrl.split('/')
    const uploadIndex = urlParts.indexOf('upload')
    if (uploadIndex !== -1) {
      const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/') // Bỏ qua version (v123)
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '') // Bỏ extension
      await cloudinary.uploader.destroy(publicId)
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
  }
}

export default cloudinary
