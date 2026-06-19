import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

interface BlogIds extends Array<ObjectId> {}
interface UserIds extends Array<ObjectId> {}

const seedComments = async (blogIds: BlogIds, userIds: UserIds) => {
  console.log('🌱 Seeding Comments collection...')

  // Xóa dữ liệu cũ nếu có
  await databaseService.comments.deleteMany({})

  // Lấy thông tin users để lấy name
  const users = await databaseService.users.find({}).toArray()
  const userMap = new Map(users.map(u => [u._id.toString(), u.name]))

  // Tạo 20+ comments cho các blogs
  const comments = [
    // === Comments cho Blog 0 (Python Guide) ===
    {
      _id: new ObjectId(),
      blog_id: blogIds[0],
      user_id: userIds[5].toString(), // Nguyễn Thị Mai
      name: userMap.get(userIds[5].toString()) || 'Nguyễn Thị Mai',
      content: 'Bài viết rất chi tiết và dễ hiểu. Cảm ơn tác giả đã chia sẻ!',
      is_approved: true,
      created_at: new Date('2025-02-12T14:30:00.000Z'),
      updated_at: new Date('2025-02-12T14:30:00.000Z')
    },
    {
      _id: new ObjectId(),
      blog_id: blogIds[0],
      user_id: userIds[6].toString(), // Trần Đình Phong
      name: userMap.get(userIds[6].toString()) || 'Trần Đình Phong',
      content: 'Mình mới bắt đầu học Python, bài này giúp mình hiểu rõ hơn về ngôn ngữ này.',
      is_approved: true,
      created_at: new Date('2025-02-15T10:00:00.000Z'),
      updated_at: new Date('2025-02-15T10:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      blog_id: blogIds[0],
      user_id: userIds[7].toString(), // Lê Thị Hương
      name: userMap.get(userIds[7].toString()) || 'Lê Thị Hương',
      content: 'Có video hướng dẫn không ạ?',
      is_approved: false,
      created_at: new Date('2025-02-18T16:00:00.000Z'),
      updated_at: new Date('2025-02-18T16:00:00.000Z')
    },

    // === Comments cho Blog 1 (AI Trends) ===
    {
      _id: new ObjectId(),
      blog_id: blogIds[1],
      user_id: userIds[8].toString(), // Phạm Quang Huy
      name: userMap.get(userIds[8].toString()) || 'Phạm Quang Huy',
      content: 'AI đang phát triển rất nhanh. Hy vọng bài viết tiếp theo sẽ đi sâu hơn vào AI tạo sinh!',
      is_approved: true,
      created_at: new Date('2025-03-05T11:30:00.000Z'),
      updated_at: new Date('2025-03-05T11:30:00.000Z')
    },
    {
      _id: new ObjectId(),
      blog_id: blogIds[1],
      user_id: userIds[9].toString(), // Vũ Thị Lan
      name: userMap.get(userIds[9].toString()) || 'Vũ Thị Lan',
      content: 'Rất hữu ích! Mình đang tìm hiểu về Edge AI.',
      is_approved: true,
      created_at: new Date('2025-03-08T09:15:00.000Z'),
      updated_at: new Date('2025-03-08T09:15:00.000Z')
    },

    // === Comments cho Blog 3 (Startup MVP) ===
    {
      _id: new ObjectId(),
      blog_id: blogIds[3],
      user_id: userIds[10].toString(), // Đặng Minh Đức
      name: userMap.get(userIds[10].toString()) || 'Đặng Minh Đức',
      content: 'Bài viết rất thực tế. Mình đang có ý tưởng startup và đang trong giai đoạn xây dựng MVP.',
      is_approved: true,
      created_at: new Date('2025-02-18T15:00:00.000Z'),
      updated_at: new Date('2025-02-18T15:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      blog_id: blogIds[3],
      user_id: userIds[11].toString(), // Bùi Thị Thu
      name: userMap.get(userIds[11].toString()) || 'Bùi Thị Thu',
      content: 'Cho mình hỏi thời gian xây dựng MVP trung bình là bao lâu?',
      is_approved: true,
      created_at: new Date('2025-02-20T10:30:00.000Z'),
      updated_at: new Date('2025-02-20T10:30:00.000Z')
    },

    // === Comments cho Blog 4 (Startup Mistakes) ===
    {
      _id: new ObjectId(),
      blog_id: blogIds[4],
      user_id: userIds[12].toString(), // Ngô Văn Sơn
      name: userMap.get(userIds[12].toString()) || 'Ngô Văn Sơn',
      content: 'Rất đúng! Mình từng mắc sai lầm không validate ý tưởng trước khi xây dựng sản phẩm.',
      is_approved: true,
      created_at: new Date('2025-03-15T14:00:00.000Z'),
      updated_at: new Date('2025-03-15T14:00:00.000Z')
    },

    // === Comments cho Blog 6 (Morning Routine) ===
    {
      _id: new ObjectId(),
      blog_id: blogIds[6],
      user_id: userIds[13].toString(), // Trịnh Thị Minh
      name: userMap.get(userIds[13].toString()) || 'Trịnh Thị Minh',
      content: 'Bài viết truyền cảm hứng! Mình sẽ thử áp dụng từ ngày mai.',
      is_approved: true,
      created_at: new Date('2025-01-25T08:00:00.000Z'),
      updated_at: new Date('2025-01-25T08:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      blog_id: blogIds[6],
      user_id: userIds[14].toString(), // Đinh Văn Tuấn
      name: userMap.get(userIds[14].toString()) || 'Đinh Văn Tuấn',
      content: 'Dậy sớm thật sự thay đổi cuộc sống của mình. Highly recommend!',
      is_approved: true,
      created_at: new Date('2025-01-28T07:30:00.000Z'),
      updated_at: new Date('2025-01-28T07:30:00.000Z')
    },
    {
      _id: new ObjectId(),
      blog_id: blogIds[6],
      user_id: userIds[15].toString(), // Lưu Thị Hồng
      name: userMap.get(userIds[15].toString()) || 'Lưu Thị Hồng',
      content: 'Mình thường dậy lúc 6h, có nên dậy sớm hơn không?',
      is_approved: false,
      created_at: new Date('2025-02-01T06:00:00.000Z'),
      updated_at: new Date('2025-02-01T06:00:00.000Z')
    },

    // === Comments cho Blog 9 (Personal Finance) ===
    {
      _id: new ObjectId(),
      blog_id: blogIds[9],
      user_id: userIds[5].toString(), // Nguyễn Thị Mai
      name: userMap.get(userIds[5].toString()) || 'Nguyễn Thị Mai',
      content: 'Nguyên tắc 50/30/20 thật sự hữu ích! Mình đã áp dụng và tiết kiệm được kha khá.',
      is_approved: true,
      created_at: new Date('2025-01-30T12:00:00.000Z'),
      updated_at: new Date('2025-01-30T12:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      blog_id: blogIds[9],
      user_id: userIds[6].toString(), // Trần Đình Phong
      name: userMap.get(userIds[6].toString()) || 'Trần Đình Phong',
      content: 'Có bài viết nào về đầu tư cho người mới không?',
      is_approved: true,
      created_at: new Date('2025-02-05T09:00:00.000Z'),
      updated_at: new Date('2025-02-05T09:00:00.000Z')
    },

    // === Comments cho Blog 11 (Study Methods) ===
    {
      _id: new ObjectId(),
      blog_id: blogIds[11],
      user_id: userIds[7].toString(), // Lê Thị Hương
      name: userMap.get(userIds[7].toString()) || 'Lê Thị Hương',
      content: 'Spaced Repetition thật sự hiệu quả! Mình dùng Anki để học từ vựng.',
      is_approved: true,
      created_at: new Date('2025-03-10T15:00:00.000Z'),
      updated_at: new Date('2025-03-10T15:00:00.000Z')
    },

    // === Comments cho Blog 12 (English Learning) ===
    {
      _id: new ObjectId(),
      blog_id: blogIds[12],
      user_id: userIds[8].toString(), // Phạm Quang Huy
      name: userMap.get(userIds[8].toString()) || 'Phạm Quang Huy',
      content: 'Mình recommend podcast "6 Minute English" của BBC cho người mới.',
      is_approved: true,
      created_at: new Date('2025-04-15T11:00:00.000Z'),
      updated_at: new Date('2025-04-15T11:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      blog_id: blogIds[12],
      user_id: userIds[9].toString(), // Vũ Thị Lan
      name: userMap.get(userIds[9].toString()) || 'Vũ Thị Lan',
      content: 'Xem phim có phụ đề tiếng Anh có giúp cải thiện speaking không?',
      is_approved: true,
      created_at: new Date('2025-04-18T10:00:00.000Z'),
      updated_at: new Date('2025-04-18T10:00:00.000Z')
    },

    // === Comments cho Blog 14 (Summer Destinations) ===
    {
      _id: new ObjectId(),
      blog_id: blogIds[14],
      user_id: userIds[10].toString(), // Đặng Minh Đức
      name: userMap.get(userIds[10].toString()) || 'Đặng Minh Đức',
      content: 'Đà Nẵng mùa hè nắng nóng lắm, nên đi tháng 5 hoặc tháng 9 sẽ tốt hơn!',
      is_approved: true,
      created_at: new Date('2025-05-20T14:00:00.000Z'),
      updated_at: new Date('2025-05-20T14:00:00.000Z')
    },

    // === Comments cho Blog 16 (Home Workout) ===
    {
      _id: new ObjectId(),
      blog_id: blogIds[16],
      user_id: userIds[11].toString(), // Bùi Thị Thu
      name: userMap.get(userIds[11].toString()) || 'Bùi Thị Thu',
      content: 'Mình tập plank được 30 giây thôi, có cần tập lâu hơn không?',
      is_approved: true,
      created_at: new Date('2025-03-20T08:00:00.000Z'),
      updated_at: new Date('2025-03-20T08:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      blog_id: blogIds[16],
      user_id: userIds[12].toString(), // Ngô Văn Sơn
      name: userMap.get(userIds[12].toString()) || 'Ngô Văn Sơn',
      content: '30 giây là OK rồi! Từ từ tăng lên 1 phút, rồi 2 phút.',
      is_approved: true,
      created_at: new Date('2025-03-22T09:00:00.000Z'),
      updated_at: new Date('2025-03-22T09:00:00.000Z')
    },

    // === Comments cho Blog 19 (Best Movies) ===
    {
      _id: new ObjectId(),
      blog_id: blogIds[19],
      user_id: userIds[13].toString(), // Trịnh Thị Minh
      name: userMap.get(userIds[13].toString()) || 'Trịnh Thị Minh',
      content: 'Mình đặt vé xem Avatar 3 rồi! Hóng quá!',
      is_approved: true,
      created_at: new Date('2025-06-05T18:00:00.000Z'),
      updated_at: new Date('2025-06-05T18:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      blog_id: blogIds[19],
      user_id: userIds[14].toString(), // Đinh Văn Tuấn
      name: userMap.get(userIds[14].toString()) || 'Đinh Văn Tuấn',
      content: 'Hy vọng GTA VI không delay nữa, mình đợi mỏi cả năm rồi!',
      is_approved: true,
      created_at: new Date('2025-06-08T20:00:00.000Z'),
      updated_at: new Date('2025-06-08T20:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      blog_id: blogIds[19],
      user_id: userIds[15].toString(), // Lưu Thị Hồng
      name: userMap.get(userIds[15].toString()) || 'Lưu Thị Hồng',
      content: 'Có bài viết nào về series mới không?',
      is_approved: false,
      created_at: new Date('2025-06-10T12:00:00.000Z'),
      updated_at: new Date('2025-06-10T12:00:00.000Z')
    }
  ]

  const result = await databaseService.comments.insertMany(comments)
  console.log(`✅ Inserted ${result.insertedCount} comments`)

  return comments.map(c => c._id)
}

export default seedComments
export { seedComments }
