import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

const seedCategories = async () => {
  console.log('🌱 Seeding Categories collection...')

  // Xóa dữ liệu cũ nếu có
  await databaseService.categories.deleteMany({})

  // Tạo 10 categories
  const categories = [
    {
      _id: new ObjectId(),
      name: 'Technology',
      description: 'Các bài viết về công nghệ, lập trình, AI, machine learning và xu hướng công nghệ mới nhất',
      created_at: new Date('2025-01-05T08:00:00.000Z'),
      updated_at: new Date('2025-01-05T08:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Startup',
      description: 'Chia sẻ kinh nghiệm khởi nghiệp, xây dựng thương hiệu và phát triển doanh nghiệp',
      created_at: new Date('2025-01-05T08:05:00.000Z'),
      updated_at: new Date('2025-01-05T08:05:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Lifestyle',
      description: 'Mẹo cuộc sống, sức khỏe, thói quen tốt và cách cân bằng công việc',
      created_at: new Date('2025-01-05T08:10:00.000Z'),
      updated_at: new Date('2025-01-05T08:10:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Finance',
      description: 'Quản lý tài chính cá nhân, đầu tư, tiết kiệm và các kiến thức kinh tế',
      created_at: new Date('2025-01-05T08:15:00.000Z'),
      updated_at: new Date('2025-01-05T08:15:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Education',
      description: 'Giáo dục, học tập, phát triển kỹ năng và các phương pháp học hiệu quả',
      created_at: new Date('2025-01-10T09:00:00.000Z'),
      updated_at: new Date('2025-01-10T09:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Travel',
      description: 'Khám phá địa điểm du lịch, chia sẻ kinh nghiệm du lịch và văn hóa các nước',
      created_at: new Date('2025-01-10T09:05:00.000Z'),
      updated_at: new Date('2025-01-10T09:05:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Health',
      description: 'Sức khỏe, dinh dưỡng, tập luyện và chăm sóc sức khỏe tinh thần',
      created_at: new Date('2025-01-10T09:10:00.000Z'),
      updated_at: new Date('2025-01-10T09:10:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Business',
      description: 'Chiến lược kinh doanh, marketing, bán hàng và phát triển thị trường',
      created_at: new Date('2025-01-15T10:00:00.000Z'),
      updated_at: new Date('2025-01-15T10:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Science',
      description: 'Khoa học, nghiên cứu, khám phá và các phát minh mới',
      created_at: new Date('2025-01-15T10:05:00.000Z'),
      updated_at: new Date('2025-01-15T10:05:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Entertainment',
      description: 'Phim ảnh, âm nhạc, game và các hoạt động giải trí',
      created_at: new Date('2025-01-15T10:10:00.000Z'),
      updated_at: new Date('2025-01-15T10:10:00.000Z')
    }
  ]

  const result = await databaseService.categories.insertMany(categories)
  console.log(`✅ Inserted ${result.insertedCount} categories`)

  // Lưu lại các ObjectId để sử dụng ở các seeding khác
  const categoryIds = categories.map(cat => cat._id)

  return categoryIds
}

export default seedCategories
export { seedCategories }
