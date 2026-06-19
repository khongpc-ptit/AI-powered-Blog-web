import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

interface CategoryIds extends Array<ObjectId> {}

const seedBlogs = async (categoryIds: CategoryIds) => {
  console.log('🌱 Seeding Blogs collection...')

  // Xóa dữ liệu cũ nếu có
  await databaseService.blogs.deleteMany({})

  // Ánh xạ category index -> ObjectId
  // 0: Technology, 1: Startup, 2: Lifestyle, 3: Finance, 4: Education
  // 5: Travel, 6: Health, 7: Business, 8: Science, 9: Entertainment

  // Tạo 20 blogs
  const blogs = [
    // === Technology (categoryIds[0]) ===
    {
      _id: new ObjectId(),
      title: 'Hướng dẫn học lập trình Python cho người mới bắt đầu',
      subtitle: 'Từ cơ bản đến nâng cao - Học Python dễ dàng',
      description: `<h1>Hướng dẫn học lập trình Python cho người mới bắt đầu</h1>
        <p>Python là một trong những ngôn ngữ lập trình phổ biến nhất hiện nay, được sử dụng rộng rãi trong nhiều lĩnh vực từ web development đến AI và data science.</p>
        <h2>Tại sao nên chọn Python?</h2>
        <ul>
          <li>Cú pháp đơn giản, dễ đọc và dễ học</li>
          <li>Thư viện phong phú, hỗ trợ nhiều frameworks</li>
          <li>Cộng đồng lớn, tài liệu phong phú</li>
          <li>Ứng dụng rộng rãi trong AI, Machine Learning, Web Development</li>
        </ul>
        <h2>Cách bắt đầu</h2>
        <p>Để bắt đầu học Python, bạn cần cài đặt Python từ trang chủ python.org và chọn một IDE như VS Code hoặc PyCharm.</p>`,
      category_id: categoryIds[0],
      image: '/uploads/python_guide.jpg',
      isPublished: true,
      views: 1523,
      created_at: new Date('2025-02-10T10:00:00.000Z'),
      updated_at: new Date('2025-05-15T14:30:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: 'Xu hướng AI năm 2026: Những gì cần biết',
      subtitle: 'Cập nhật các xu hướng AI mới nhất',
      description: `<h1>Xu hướng AI năm 2026: Những gì cần biết</h1>
        <p>Trí tuệ nhân tạo đang thay đổi cách chúng ta làm việc và sống. Năm 2026, AI tiếp tục phát triển mạnh mẽ với nhiều ứng dụng mới.</p>
        <h2>Các xu hướng nổi bật</h2>
        <ul>
          <li><strong>AI tạo sinh (Generative AI)</strong> - Tạo nội dung tự động</li>
          <li><strong>Multimodal AI</strong> - Kết hợp text, image, audio</li>
          <li><strong>AI trong y tế</strong> - Chẩn đoán và điều trị</li>
          <li><strong>Edge AI</strong> - AI trên thiết bị cạnh</li>
        </ul>`,
      category_id: categoryIds[0],
      image: '/uploads/ai_trends.jpg',
      isPublished: true,
      views: 2341,
      created_at: new Date('2025-03-01T09:00:00.000Z'),
      updated_at: new Date('2025-06-10T11:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: 'React vs Vue: Nên chọn framework nào cho dự án web?',
      subtitle: 'So sánh chi tiết React và Vue.js',
      description: `<h1>React vs Vue: Nên chọn framework nào?</h1>
        <p>Khi bắt đầu một dự án web mới, việc chọn framework phù hợp là rất quan trọng. Hãy cùng so sánh React và Vue.</p>
        <h2>React</h2>
        <p>React được phát triển bởi Facebook, có cộng đồng lớn và nhiều thư viện hỗ trợ.</p>
        <h2>Vue</h2>
        <p>Vue được tạo bởi Evan You, nổi tiếng với cú pháp dễ học và tài liệu tuyệt vời.</p>`,
      category_id: categoryIds[0],
      image: '/uploads/react_vue.jpg',
      isPublished: true,
      views: 892,
      created_at: new Date('2025-04-05T14:00:00.000Z'),
      updated_at: new Date('2025-05-20T10:00:00.000Z')
    },

    // === Startup (categoryIds[1]) ===
    {
      _id: new ObjectId(),
      title: 'Cách xây dựng MVP cho startup công nghệ',
      subtitle: 'Hướng dẫn tạo sản phẩm tối thiểu khả thi',
      description: `<h1>Cách xây dựng MVP cho startup công nghệ</h1>
        <p>MVP (Minimum Viable Product) là phiên bản cơ bản nhất của sản phẩm với đủ tính năng để thu hút người dùng đầu tiên.</p>
        <h2>5 bước xây dựng MVP</h2>
        <ol>
          <li>Xác định vấn đề cần giải quyết</li>
          <li>Nghiên cứu thị trường và đối thủ</li>
          <li>Thiết kế giải pháp cơ bản</li>
          <li>Phát triển và ra mắt sản phẩm</li>
          <li>Thu thập feedback và cải thiện</li>
        </ol>`,
      category_id: categoryIds[1],
      image: '/uploads/mvp_startup.jpg',
      isPublished: true,
      views: 1105,
      created_at: new Date('2025-02-15T11:00:00.000Z'),
      updated_at: new Date('2025-04-10T09:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: '10 sai lầm thường gặp khi khởi nghiệp',
      subtitle: 'Những bài học xương máu từ các founder',
      description: `<h1>10 sai lầm thường gặp khi khởi nghiệp</h1>
        <p>Khởi nghiệp không dễ dàng. Dưới đây là những sai lầm phổ biến mà nhiều founder mắc phải.</p>
        <h2>1. Không validate ý tưởng</h2>
        <p>Nhiều người nhảy vào xây dựng sản phẩm mà chưa kiểm chứng nhu cầu thị trường.</p>
        <h2>2. Đốt tiền quá nhanh</h2>
        <p>Chi tiêu không kiểm soát dẫn đến cạn kiệt tài chính trước khi sản phẩm hoàn thiện.</p>`,
      category_id: categoryIds[1],
      image: '/uploads/startup_mistakes.jpg',
      isPublished: true,
      views: 1876,
      created_at: new Date('2025-03-10T08:30:00.000Z'),
      updated_at: new Date('2025-06-05T15:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: 'Fundraising 101: Cách gọi vốn cho startup',
      subtitle: 'Hướng dẫn từ A-Z về gọi vốn đầu tư',
      description: `<h1>Fundraising 101: Cách gọi vốn cho startup</h1>
        <p>Gọi vốn là một kỹ năng quan trọng mà mọi founder cần nắm vững.</p>
        <h2>Các nguồn vốn phổ biến</h2>
        <ul>
          <li>Bootstrapping - Tự tài trợ</li>
          <li>Angel Investors - Nhà đầu tư thiên thần</li>
          <li>Venture Capital - Quỹ đầu tư mạo hiểm</li>
          <li>Crowdfunding - Gọi vốn cộng đồng</li>
        </ul>`,
      category_id: categoryIds[1],
      image: '/uploads/fundraising.jpg',
      isPublished: true,
      views: 756,
      created_at: new Date('2025-04-20T10:00:00.000Z'),
      updated_at: new Date('2025-05-25T12:00:00.000Z')
    },

    // === Lifestyle (categoryIds[2]) ===
    {
      _id: new ObjectId(),
      title: '5 thói quen buổi sáng giúp tăng năng suất',
      subtitle: 'Bắt đầu ngày mới hiệu quả hơn',
      description: `<h1>5 thói quen buổi sáng giúp tăng năng suất</h1>
        <p>Cách bạn bắt đầu ngày sẽ ảnh hưởng lớn đến hiệu suất làm việc cả ngày.</p>
        <h2>1. Thức dậy sớm</h2>
        <p>Dậy sớm giúp bạn có thời gian riêng tư trước khi bắt đầu công việc.</p>
        <h2>2. Tập thể dục nhẹ</h2>
        <p>Vận động buổi sáng giúp cơ thể tỉnh táo và tràn đầy năng lượng.</p>
        <h2>3. Thiền định</h2>
        <p>5-10 phút thiền giúp tâm trí tĩnh lặng và tập trung.</p>`,
      category_id: categoryIds[2],
      image: '/uploads/morning_routine.jpg',
      isPublished: true,
      views: 3201,
      created_at: new Date('2025-01-20T07:00:00.000Z'),
      updated_at: new Date('2025-06-12T08:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: 'Cách cân bằng công việc và cuộc sống',
      subtitle: 'Work-life balance trong thời đại công nghệ',
      description: `<h1>Cách cân bằng công việc và cuộc sống</h1>
        <p>Trong thời đại bùng nổ công nghệ, việc cân bằng giữa công việc và cuộc sống ngày càng khó khăn hơn.</p>
        <h2>Đặt ranh giới rõ ràng</h2>
        <p>Học cách nói "không" với những công việc không cần thiết và bảo vệ thời gian nghỉ ngơi.</p>
        <h2>Ưu tiên sức khỏe</h2>
        <p>Ngủ đủ giấc, ăn uống lành mạnh và tập thể dục đều đặn.</p>`,
      category_id: categoryIds[2],
      image: '/uploads/work_life_balance.jpg',
      isPublished: true,
      views: 2156,
      created_at: new Date('2025-02-25T09:00:00.000Z'),
      updated_at: new Date('2025-06-08T10:30:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: 'Tips giảm stress hiệu quả cho dân văn phòng',
      subtitle: 'Chăm sóc sức khỏe tinh thần',
      description: `<h1>Tips giảm stress hiệu quả cho dân văn phòng</h1>
        <p>Áp lực công việc có thể gây ra nhiều vấn đề sức khỏe. Hãy học cách quản lý stress đúng cách.</p>
        <h2>Kỹ thuật thư giãn</h2>
        <p>Thực hành breathing exercises, progressive muscle relaxation hoặc yoga.</p>`,
      category_id: categoryIds[2],
      image: '/uploads/stress_relief.jpg',
      isPublished: true,
      views: 1789,
      created_at: new Date('2025-03-25T11:00:00.000Z'),
      updated_at: new Date('2025-06-15T14:00:00.000Z')
    },

    // === Finance (categoryIds[3]) ===
    {
      _id: new ObjectId(),
      title: 'Quản lý tài chính cá nhân: Hướng dẫn cho người trẻ',
      subtitle: 'Bắt đầu tiết kiệm và đầu tư từ sớm',
      description: `<h1>Quản lý tài chính cá nhân: Hướng dẫn cho người trẻ</h1>
        <p>Việc quản lý tài chính tốt từ sớm sẽ giúp bạn có nền tảng vững chắc cho tương lai.</p>
        <h2>Nguyên tắc 50/30/20</h2>
        <ul>
          <li>50% thu nhập cho nhu cầu thiết yếu</li>
          <li>30% cho mong muốn cá nhân</li>
          <li>20% cho tiết kiệm và đầu tư</li>
        </ul>`,
      category_id: categoryIds[3],
      image: '/uploads/personal_finance.jpg',
      isPublished: true,
      views: 2543,
      created_at: new Date('2025-01-25T08:00:00.000Z'),
      updated_at: new Date('2025-06-01T09:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: 'Đầu tư chứng khoán cho người mới bắt đầu',
      subtitle: 'Những kiến thức cơ bản về thị trường chứng khoán',
      description: `<h1>Đầu tư chứng khoán cho người mới bắt đầu</h1>
        <p>Chứng khoán là một kênh đầu tư phổ biến. Tuy nhiên, người mới cần nắm vững kiến thức cơ bản trước khi tham gia.</p>
        <h2>Các loại chứng khoán</h2>
        <ul>
          <li>Cổ phiếu - Sở hữu một phần công ty</li>
          <li>Trái phiếu - Cho vay tiền và nhận lãi</li>
          <li>Quỹ ETF - Danh mục đầu tư đa dạng</li>
        </ul>`,
      category_id: categoryIds[3],
      image: '/uploads/stock_investing.jpg',
      isPublished: true,
      views: 1876,
      created_at: new Date('2025-02-20T10:00:00.000Z'),
      updated_at: new Date('2025-05-30T11:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: 'Tiết kiệm thông minh: Những mẹo hiệu quả',
      subtitle: 'Cách tiết kiệm tiền mà không phải hy sinh chất lượng cuộc sống',
      description: `<h1>Tiết kiệm thông minh: Những mẹo hiệu quả</h1>
        <p>Tiết kiệm không có nghĩa là sống khổ. Hãy học cách tiết kiệm thông minh và hiệu quả.</p>
        <h2>Mẹo tiết kiệm hàng ngày</h2>
        <ul>
          <li>Mang cơm trưa từ nhà đi làm</li>
          <li>Hủy các subscription không cần thiết</li>
          <li>Mua sắm thông minh, so sánh giá</li>
          <li>Sử dụng coupon và khuyến mãi</li>
        </ul>`,
      category_id: categoryIds[3],
      image: '/uploads/saving_tips.jpg',
      isPublished: true,
      views: 1234,
      created_at: new Date('2025-04-15T09:30:00.000Z'),
      updated_at: new Date('2025-06-10T08:00:00.000Z')
    },

    // === Education (categoryIds[4]) ===
    {
      _id: new ObjectId(),
      title: 'Phương pháp học tập hiệu quả',
      subtitle: 'Học nhanh hơn, nhớ lâu hơn',
      description: `<h1>Phương pháp học tập hiệu quả</h1>
        <p>Không phải ai cũng biết cách học đúng. Dưới đây là những phương pháp được khoa học chứng minh hiệu quả.</p>
        <h2>Spaced Repetition</h2>
        <p>Học lại kiến thức theo khoảng cách thời gian đều đặn giúp ghi nhớ lâu hơn.</p>
        <h2>Active Recall</h2>
        <p>Tự kiểm tra bản thân thay vì chỉ đọc lại bài.</p>`,
      category_id: categoryIds[4],
      image: '/uploads/study_methods.jpg',
      isPublished: true,
      views: 2087,
      created_at: new Date('2025-03-05T14:00:00.000Z'),
      updated_at: new Date('2025-06-05T10:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: 'Học tiếng Anh hiệu quả tại nhà',
      subtitle: 'Tự học tiếng Anh không cần đến trung tâm',
      description: `<h1>Học tiếng Anh hiệu quả tại nhà</h1>
        <p>Tiếng Anh là ngôn ngữ quốc tế. Học tiếng Anh tại nhà có thể rất hiệu quả nếu bạn có phương pháp đúng.</p>
        <h2>Nghe nhiều</h2>
        <p>Nghe podcast, xem phim có phụ đề tiếng Anh để cải thiện listening.</p>`,
      category_id: categoryIds[4],
      image: '/uploads/english_learning.jpg',
      isPublished: true,
      views: 1654,
      created_at: new Date('2025-04-10T08:00:00.000Z'),
      updated_at: new Date('2025-06-12T11:00:00.000Z')
    },

    // === Travel (categoryIds[5]) ===
    {
      _id: new ObjectId(),
      title: 'Khám phá vẻ đẹp Hội An về đêm',
      subtitle: 'Trải nghiệm phố cổ về đêm',
      description: `<h1>Khám phá vẻ đẹp Hội An về đêm</h1>
        <p>Hội An về đêm mang một vẻ đẹp hoàn toàn khác so với ban ngày. Ánh đèn lồng đỏ lung linh, không khí mát mẻ.</p>
        <h2>Địa điểm không thể bỏ lỡ</h2>
        <ul>
          <li>Phố cổ Hội An</li>
          <li>Cầu Nhật Bản</li>
          <li>Chùa Cầu</li>
          <li>Khu ẩm thực đêm</li>
        </ul>`,
      category_id: categoryIds[5],
      image: '/uploads/hoian_night.jpg',
      isPublished: true,
      views: 987,
      created_at: new Date('2025-05-01T10:00:00.000Z'),
      updated_at: new Date('2025-06-08T09:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: '5 điểm đến hấp dẫn cho mùa hè 2026',
      subtitle: 'Những địa điểm du lịch hot nhất mùa hè này',
      description: `<h1>5 điểm đến hấp dẫn cho mùa hè 2026</h1>
        <p>Mùa hè là thời điểm lý tưởng để khám phá những vùng đất mới. Dưới đây là gợi ý cho bạn.</p>
        <h2>1. Đà Nẵng</h2>
        <p>Bãi biển đẹp, ẩm thực phong phú và nhiều điểm tham quan hấp dẫn.</p>`,
      category_id: categoryIds[5],
      image: '/uploads/summer_destinations.jpg',
      isPublished: true,
      views: 1432,
      created_at: new Date('2025-05-15T09:00:00.000Z'),
      updated_at: new Date('2025-06-10T14:00:00.000Z')
    },

    // === Health (categoryIds[6]) ===
    {
      _id: new ObjectId(),
      title: 'Dinh dưỡng cân bằng cho dân văn phòng',
      subtitle: 'Ăn uống lành mạnh dù bận rộn',
      description: `<h1>Dinh dưỡng cân bằng cho dân văn phòng</h1>
        <p>Công việc bận rộn không có nghĩa là phải ăn uống không lành mạnh. Hãy học cách cân bằng dinh dưỡng.</p>
        <h2>Nguyên tắc ăn uống lành mạnh</h2>
        <ul>
          <li>Ăn đủ rau xanh và trái cây</li>
          <li>Hạn chế thức ăn nhanh và đồ uống có đường</li>
          <li>Uống đủ nước mỗi ngày</li>
        </ul>`,
      category_id: categoryIds[6],
      image: '/uploads/healthy_eating.jpg',
      isPublished: true,
      views: 1765,
      created_at: new Date('2025-02-28T10:00:00.000Z'),
      updated_at: new Date('2025-06-05T11:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: 'Bài tập thể dục tại nhà cho người bận rộn',
      subtitle: 'Giữ dáng và khỏe mà không cần đến phòng gym',
      description: `<h1>Bài tập thể dục tại nhà cho người bận rộn</h1>
        <p>Không có thời gian đến gym? Không vấn đề gì! Bạn có thể tập luyện hiệu quả ngay tại nhà.</p>
        <h2>Bài tập không cần dụng cụ</h2>
        <ul>
          <li>Burpees</li>
          <li>Squats</li>
          <li>Push-ups</li>
          <li>Plank</li>
        </ul>`,
      category_id: categoryIds[6],
      image: '/uploads/home_workout.jpg',
      isPublished: true,
      views: 2198,
      created_at: new Date('2025-03-15T08:00:00.000Z'),
      updated_at: new Date('2025-06-12T10:00:00.000Z')
    },

    // === Business (categoryIds[7]) ===
    {
      _id: new ObjectId(),
      title: 'Digital Marketing 2026: Xu hướng và chiến lược',
      subtitle: 'Cập nhật xu hướng marketing mới nhất',
      description: `<h1>Digital Marketing 2026: Xu hướng và chiến lược</h1>
        <p>Digital marketing không ngừng thay đổi. Hãy cập nhật những xu hướng mới nhất để luôn dẫn đầu.</p>
        <h2>Xu hướng nổi bật</h2>
        <ul>
          <li>AI trong marketing</li>
          <li>Video marketing ngắn (Short-form video)</li>
          <li>Personalization</li>
          <li>Voice search optimization</li>
        </ul>`,
      category_id: categoryIds[7],
      image: '/uploads/digital_marketing.jpg',
      isPublished: true,
      views: 1321,
      created_at: new Date('2025-04-25T10:00:00.000Z'),
      updated_at: new Date('2025-06-15T09:00:00.000Z')
    },

    // === Science (categoryIds[8]) ===
    {
      _id: new ObjectId(),
      title: 'Khám phá vũ trụ: Những phát minh mới nhất',
      subtitle: 'Cập nhật từ NASA và các cơ quan hàng không vũ trụ',
      description: `<h1>Khám phá vũ trụ: Những phát minh mới nhất</h1>
        <p>Vũ trụ luôn là điều bí ẩn khiến con người tò mò. Những phát minh mới nhất mở ra nhiều hiểu biết mới.</p>
        <h2>Telescope James Webb</h2>
        <p>Đã phát hiện nhiều thiên hà xa xôi và hành tinh có tiềm năng sự sống.</p>`,
      category_id: categoryIds[8],
      image: '/uploads/space_exploration.jpg',
      isPublished: true,
      views: 876,
      created_at: new Date('2025-05-10T11:00:00.000Z'),
      updated_at: new Date('2025-06-01T14:00:00.000Z')
    },

    // === Entertainment (categoryIds[9]) ===
    {
      _id: new ObjectId(),
      title: 'Top 10 bộ phim hay nhất năm 2026',
      subtitle: 'Những bộ phim không thể bỏ lỡ',
      description: `<h1>Top 10 bộ phim hay nhất năm 2026</h1>
        <p>Năm 2026 hứa hẹn mang đến nhiều bộ phim blockbuster ấn tượng. Cùng điểm qua top 10 phim hay nhất.</p>
        <h2>Danh sách phim đáng chú ý</h2>
        <ol>
          <li>Avengers: Secret Wars</li>
          <li>Avatar 3</li>
          <li>Star Wars: New Trilogy Finale</li>
        </ol>`,
      category_id: categoryIds[9],
      image: '/uploads/best_movies.jpg',
      isPublished: true,
      views: 2567,
      created_at: new Date('2025-06-01T10:00:00.000Z'),
      updated_at: new Date('2025-06-15T12:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: 'Review Game hot nhất 2026',
      subtitle: 'Những tựa game được săn đón nhất năm',
      description: `<h1>Review Game hot nhất 2026</h1>
        <p>Năm 2026 là năm của những tựa game AAA với đồ họa tuyệt vời và gameplay hấp dẫn.</p>
        <h2>Game đáng chú ý</h2>
        <ul>
          <li>GTA VI</li>
          <li>Elden Ring 2</li>
          <li>Final Fantasy XVII</li>
        </ul>`,
      category_id: categoryIds[9],
      image: '/uploads/game_review.jpg',
      isPublished: true,
      views: 1987,
      created_at: new Date('2025-06-05T14:00:00.000Z'),
      updated_at: new Date('2025-06-18T10:00:00.000Z')
    },

    // === Blog Draft (isPublished: false) ===
    {
      _id: new ObjectId(),
      title: 'Hướng dẫn sử dụng Git cho người mới',
      subtitle: 'Version control cơ bản',
      description: `<h1>Hướng dẫn sử dụng Git cho người mới</h1>
        <p>Git là công cụ quản lý mã nguồn phổ biến nhất hiện nay. Học Git giúp bạn làm việc nhóm hiệu quả hơn.</p>
        <h2>Các lệnh Git cơ bản</h2>
        <p>git init, git add, git commit, git push...</p>`,
      category_id: categoryIds[0],
      image: '/uploads/git_guide.jpg',
      isPublished: false,
      views: 45,
      created_at: new Date('2025-06-10T09:00:00.000Z'),
      updated_at: new Date('2025-06-10T09:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      title: 'Kế hoạch kinh doanh mẫu cho startup',
      subtitle: 'Template kế hoạch kinh doanh',
      description: `<h1>Kế hoạch kinh doanh mẫu cho startup</h1>
        <p>Một kế hoạch kinh doanh tốt là nền tảng cho thành công của startup.</p>`,
      category_id: categoryIds[7],
      image: '/uploads/business_plan.jpg',
      isPublished: false,
      views: 23,
      created_at: new Date('2025-06-15T11:00:00.000Z'),
      updated_at: new Date('2025-06-15T11:00:00.000Z')
    }
  ]

  const result = await databaseService.blogs.insertMany(blogs)
  console.log(`✅ Inserted ${result.insertedCount} blogs`)

  // Lưu lại các ObjectId để sử dụng ở seeding comments
  const blogIds = blogs.map(blog => blog._id)

  return blogIds
}

export default seedBlogs
export { seedBlogs }
