import 'dotenv/config'
import databaseService from '~/services/database.services'
import { seedRoles } from './01.seedRoles'
import { seedUsers } from './02.seedUsers'
import { seedCategories } from './03.seedCategories'
import { seedBlogs } from './05.seedBlogs'
import { seedComments } from './06.seedComments'

 async function runSeeding() {
  console.log('='.repeat(50))
  console.log('🚀 STARTING DATABASE SEEDING...')
  console.log('='.repeat(50))

  try {
    // Kết nối database
    await databaseService.connect()
    console.log('✅ Database connected\n')

    // Chạy seeding theo thứ tự (có quan hệ)
    // 1. Seed Roles trước vì Users tham chiếu đến Roles
    const roleIds = await seedRoles()
    console.log('')

    // 2. Seed Users sau Roles
    const userIds = await seedUsers(roleIds)
    console.log('')

    // 3. Seed Categories (không phụ thuộc Users)
    const categoryIds = await seedCategories()
    console.log('')

    // 5. Seed Blogs sau Categories
    const blogIds = await seedBlogs(categoryIds)
    console.log('')

    // 6. Seed Comments sau Blogs và Users
    const commentIds = await seedComments(blogIds, userIds)
    console.log('')

    console.log('='.repeat(50))
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!')
    console.log('='.repeat(50))
    console.log('\nSummary:')
    console.log(`  - Roles: 5`)
    console.log(`  - Users: ${userIds.length}`)
    console.log(`  - Categories: ${categoryIds.length}`)
    console.log(`  - Blogs: ${blogIds.length}`)
    console.log(`  - Comments: ${commentIds.length}`)
    console.log('\nTest accounts:')
    console.log('  Super Admin: superadmin@ptitblog.com')
    console.log('  Admin: admin@ptitblog.com')
    console.log('  Content Manager: content.manager@ptitblog.com')
    console.log('  Blogger: blogger1@ptitblog.com')
    console.log('  User: mainguyen@gmail.com')
    console.log('  Password for all: Password123@')
    console.log('')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {

    console.log('Database connection closed.')
  }
}

// Chạy seeding
runSeeding()
