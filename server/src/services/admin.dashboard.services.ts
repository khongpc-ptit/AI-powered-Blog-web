import databaseService from './database.services'

class AdminDashboardService {
  async getDashboardStats() {
    // Chạy đồng thời 4 truy vấn để tối ưu thời gian
    const [publishedBlogsCount, draftBlogsCount, totalComments, latestBlogs] = await Promise.all([
      databaseService.blogs.countDocuments({ isPublished: true }),
      databaseService.blogs.countDocuments({ isPublished: false }),
      databaseService.comments.countDocuments({}),
      databaseService.blogs
        .find({})
        .project({ description: 0 }) // Ẩn bớt description cho nhẹ data
        .sort({ created_at: -1 })
        .limit(5)
        .toArray()
    ])

    return {
      published_blogs_count: publishedBlogsCount,
      draft_blogs_count: draftBlogsCount,
      total_comments: totalComments,
      latest_blogs: latestBlogs
    }
  }
}

const adminDashboardService = new AdminDashboardService()
export default adminDashboardService
