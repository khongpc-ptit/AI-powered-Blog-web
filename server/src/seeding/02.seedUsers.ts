import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { passwordHash } from '~/utils/bcrypt'

interface RoleIds {
  USER: ObjectId
  SUPER_ADMIN: ObjectId
  ADMIN: ObjectId
  CONTENT_MANAGER: ObjectId
  BLOGGER: ObjectId
}

const seedUsers = async (roleIds: RoleIds) => {
  console.log('🌱 Seeding Users collection...')

  // Xóa dữ liệu cũ nếu có
  await databaseService.users.deleteMany({})

  // Hash password mẫu (Password123@)
  const hashedPassword = await passwordHash('Password123@')

  // Tạo 20 users (5 admin/staff + 15 user thường)
  const users = [
    // === SUPER ADMIN ===
    {
      _id: new ObjectId(),
      name: 'Super Admin',
      email: 'superadmin@ptitblog.com',
      password: hashedPassword,
      date_of_birth: new Date('1990-05-15'),
      role_id: roleIds.SUPER_ADMIN,
      location: 'TP. Hồ Chí Minh, Việt Nam',
      created_at: new Date('2025-01-15T08:00:00.000Z'),
      updated_at: new Date('2025-01-15T08:00:00.000Z')
    },

    // === ADMIN ===
    {
      _id: new ObjectId(),
      name: 'Trần Thị Lan',
      email: 'admin@ptitblog.com',
      password: hashedPassword,
      date_of_birth: new Date('1992-08-22'),
      role_id: roleIds.ADMIN,
      location: 'TP. Hồ Chí Minh, Việt Nam',
      created_at: new Date('2025-02-01T09:30:00.000Z'),
      updated_at: new Date('2025-02-01T09:30:00.000Z')
    },

    // === CONTENT MANAGER ===
    {
      _id: new ObjectId(),
      name: 'Lê Hoàng Nam',
      email: 'content.manager@ptitblog.com',
      password: hashedPassword,
      date_of_birth: new Date('1995-03-10'),
      role_id: roleIds.CONTENT_MANAGER,
      location: 'Đà Nẵng, Việt Nam',
      created_at: new Date('2025-02-15T10:00:00.000Z'),
      updated_at: new Date('2025-02-15T10:00:00.000Z')
    },

    // === BLOGGER ===
    {
      _id: new ObjectId(),
      name: 'Phạm Minh Tuấn',
      email: 'blogger1@ptitblog.com',
      password: hashedPassword,
      date_of_birth: new Date('1998-11-25'),
      role_id: roleIds.BLOGGER,
      location: 'Hải Phòng, Việt Nam',
      created_at: new Date('2025-03-01T14:00:00.000Z'),
      updated_at: new Date('2025-03-01T14:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Hoàng Thu Hà',
      email: 'blogger2@ptitblog.com',
      password: hashedPassword,
      date_of_birth: new Date('1997-07-18'),
      role_id: roleIds.BLOGGER,
      location: 'Cần Thơ, Việt Nam',
      created_at: new Date('2025-03-10T11:30:00.000Z'),
      updated_at: new Date('2025-03-10T11:30:00.000Z')
    },

    // === USERS THƯỜNG (10 users) ===
    {
      _id: new ObjectId(),
      name: 'Nguyễn Thị Mai',
      email: 'mainguyen@gmail.com',
      password: hashedPassword,
      date_of_birth: new Date('2000-01-20'),
      role_id: roleIds.USER,
      location: 'Hà Nội, Việt Nam',
      created_at: new Date('2025-03-15T08:00:00.000Z'),
      updated_at: new Date('2025-03-15T08:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Trần Đình Phong',
      email: 'phongtran@yahoo.com',
      password: hashedPassword,
      date_of_birth: new Date('1999-06-30'),
      role_id: roleIds.USER,
      location: 'TP. Hồ Chí Minh, Việt Nam',
      created_at: new Date('2025-03-20T10:15:00.000Z'),
      updated_at: new Date('2025-03-20T10:15:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Lê Thị Hương',
      email: 'huongle@gmail.com',
      password: hashedPassword,
      date_of_birth: new Date('2001-04-12'),
      role_id: roleIds.USER,
      location: 'Đà Nẵng, Việt Nam',
      created_at: new Date('2025-03-25T09:00:00.000Z'),
      updated_at: new Date('2025-03-25T09:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Phạm Quang Huy',
      email: 'huypham@gmail.com',
      password: hashedPassword,
      date_of_birth: new Date('1998-09-05'),
      role_id: roleIds.USER,
      location: 'Hải Dương, Việt Nam',
      created_at: new Date('2025-04-01T14:30:00.000Z'),
      updated_at: new Date('2025-04-01T14:30:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Vũ Thị Lan',
      email: 'lanvu@gmail.com',
      password: hashedPassword,
      date_of_birth: new Date('2002-12-08'),
      role_id: roleIds.USER,
      location: 'Nam Định, Việt Nam',
      created_at: new Date('2025-04-05T11:00:00.000Z'),
      updated_at: new Date('2025-04-05T11:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Đặng Minh Đức',
      email: 'ducdang@gmail.com',
      password: hashedPassword,
      date_of_birth: new Date('1996-02-28'),
      role_id: roleIds.USER,
      location: 'Quảng Ninh, Việt Nam',
      created_at: new Date('2025-04-10T08:45:00.000Z'),
      updated_at: new Date('2025-04-10T08:45:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Bùi Thị Thu',
      email: 'thubui@gmail.com',
      password: hashedPassword,
      date_of_birth: new Date('2000-07-14'),
      role_id: roleIds.USER,
      location: 'Thanh Hóa, Việt Nam',
      created_at: new Date('2025-04-15T10:20:00.000Z'),
      updated_at: new Date('2025-04-15T10:20:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Ngô Văn Sơn',
      email: 'sonngo@gmail.com',
      password: hashedPassword,
      date_of_birth: new Date('1994-10-22'),
      role_id: roleIds.USER,
      location: 'Nghệ An, Việt Nam',
      created_at: new Date('2025-04-20T09:30:00.000Z'),
      updated_at: new Date('2025-04-20T09:30:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Trịnh Thị Minh',
      email: 'minhtrinh@gmail.com',
      password: hashedPassword,
      date_of_birth: new Date('2001-03-17'),
      role_id: roleIds.USER,
      location: 'Hà Tĩnh, Việt Nam',
      created_at: new Date('2025-04-25T14:00:00.000Z'),
      updated_at: new Date('2025-04-25T14:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Đinh Văn Tuấn',
      email: 'tuandinhh@gmail.com',
      password: hashedPassword,
      date_of_birth: new Date('1999-08-09'),
      role_id: roleIds.USER,
      location: 'Bắc Ninh, Việt Nam',
      created_at: new Date('2025-05-01T08:00:00.000Z'),
      updated_at: new Date('2025-05-01T08:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'Lưu Thị Hồng',
      email: 'hongluu@gmail.com',
      password: hashedPassword,
      date_of_birth: new Date('2003-01-25'),
      role_id: roleIds.USER,
      location: 'Vĩnh Phúc, Việt Nam',
      created_at: new Date('2025-05-05T10:45:00.000Z'),
      updated_at: new Date('2025-05-05T10:45:00.000Z')
    }
  ]

  const result = await databaseService.users.insertMany(users)
  console.log(`✅ Inserted ${result.insertedCount} users`)

  // Lưu lại các ObjectId để sử dụng ở các seeding khác
  const userIds = users.map(user => user._id)

  return userIds
}

export default seedUsers
export { seedUsers }
