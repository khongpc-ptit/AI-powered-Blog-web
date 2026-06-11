# Backend API Documentation for List Features

This document provides the API requirements for the frontend list features (pagination, search, sorting, and filtering).

## Table of Contents
- [Overview](#overview)
- [Common Query Parameters](#common-query-parameters)
- [API Endpoints](#api-endpoints)
- [Response Format](#response-format)
- [Frontend Integration Notes](#frontend-integration-notes)

---

## Overview

The frontend implements reusable list features with:
- **Pagination**: Navigate through large datasets
- **Search**: Full-text search across specified fields
- **Sorting**: Sort by any field in ascending/descending order
- **Filtering**: Filter by date range (today/week/month) and other custom filters

---

## Common Query Parameters

All list endpoints should support these query parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Current page number (1-indexed) | `?page=1` |
| `limit` | integer | Items per page | `?limit=10` |
| `search` | string | Search query string | `?search=technology` |
| `sortBy` | string | Field name to sort by | `?sortBy=createdAt` |
| `sortOrder` | string | Sort order: `asc` or `desc` | `?sortOrder=desc` |
| `dateFilter` | string | Date range filter: `all`, `today`, `week`, `month` | `?dateFilter=month` |
| `customFilter` | string | Additional filter value (e.g., status, category) | `?customFilter=published` |

---

## API Endpoints

### 1. GET /api/blogs - List All Blogs (Public)

**Description**: Returns a paginated list of published blogs for the public homepage.

**Query Parameters**:
- All [Common Query Parameters](#common-query-parameters)
- `category` (optional): Filter by category

**Example Request**:
```http
GET /api/blogs?page=1&limit=12&search=tech&sortBy=createdAt&sortOrder=desc&dateFilter=month&category=Technology
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "6805ee7dd8f584af5da78d37",
      "title": "A detailed step by step guide to manage your lifestyle",
      "description": "<h1>A Simple Step-by-Step Guide...</h1>",
      "category": "Lifestyle",
      "image": "/uploads/blog_pic_1.png",
      "subTitle": "A Simple Step-by-Step Guide to Managing Your Lifestyle",
      "createdAt": "2025-04-21T07:06:37.508Z",
      "updatedAt": "2025-04-24T08:26:29.750Z",
      "isPublished": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 12
  },
  "filters": {
    "search": "tech",
    "sortBy": "createdAt",
    "sortOrder": "desc",
    "dateFilter": "month",
    "category": "Technology"
  }
}
```

---

### 2. GET /api/admin/blogs - List All Blogs (Admin)

**Description**: Returns ALL blogs (published and unpublished) for admin management.

**Authentication**: Required (Admin JWT token)

**Query Parameters**:
- All [Common Query Parameters](#common-query-parameters)
- `status` (optional): Filter by `published`, `unpublished`, or `all`

**Example Request**:
```http
GET /api/admin/blogs?page=1&limit=10&search=title&sortBy=createdAt&sortOrder=desc&dateFilter=week&status=published
Authorization: Bearer <admin_token>
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "6805ee7dd8f584af5da78d37",
      "title": "A detailed step by step guide to manage your lifestyle",
      "category": "Lifestyle",
      "image": "/uploads/blog_pic_1.png",
      "createdAt": "2025-04-21T07:06:37.508Z",
      "isPublished": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "itemsPerPage": 10
  },
  "filters": {
    "search": "title",
    "sortBy": "createdAt",
    "sortOrder": "desc",
    "dateFilter": "week",
    "status": "published"
  }
}
```

---

### 3. GET /api/admin/comments - List All Comments (Admin)

**Description**: Returns all comments for admin management.

**Authentication**: Required (Admin JWT token)

**Query Parameters**:
- All [Common Query Parameters](#common-query-parameters)
- `approvalStatus` (optional): Filter by `approved`, `pending`, or `all`

**Example Request**:
```http
GET /api/admin/comments?page=1&limit=10&search=john&sortBy=createdAt&sortOrder=desc&dateFilter=month&approvalStatus=pending
Authorization: Bearer <admin_token>
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "6811ed9e7836a82ba747cb25",
      "blog": {
        "_id": "6805ee7dd8f584af5da78d37",
        "title": "A detailed step by step guide to manage your lifestyle"
      },
      "name": "John Doe",
      "content": "This is a nice blog",
      "isApproved": false,
      "createdAt": "2025-04-30T09:30:06.918Z",
      "updatedAt": "2025-04-30T09:30:06.918Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 5,
    "itemsPerPage": 10
  },
  "filters": {
    "search": "john",
    "sortBy": "createdAt",
    "sortOrder": "desc",
    "dateFilter": "month",
    "approvalStatus": "pending"
  }
}
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  },
  "filters": {
    "search": "",
    "sortBy": "createdAt",
    "sortOrder": "desc",
    "dateFilter": "all",
    "customFilter": "all"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (optional)"
}
```

---

## Frontend Integration Notes

### Frontend Components
The frontend uses a reusable `DataTable` component located at:
- `client/src/components/DataTable.jsx` - Reusable table component

### Date Filter Implementation
The frontend sends `dateFilter` with values:
- `all` - No date filter
- `today` - Posts from today only
- `week` - Posts from current week (Sunday to Saturday)
- `month` - Posts from current month

**Backend should implement date filtering**:
```javascript
// Date filter calculation (reference implementation)
const getDateRange = (filter) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter) {
    case "today":
      return { start: today, end: new Date(today.getTime() + 86400000) };
    case "week":
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      return { start: weekStart, end: weekEnd };
    case "month":
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return { start: monthStart, end: monthEnd };
    default:
      return null;
  }
};
```

### Search Implementation
The frontend sends `search` as a plain text string. Backend should implement case-insensitive partial matching on searchable fields:
- **Blogs**: `title`, `description`, `subTitle`, `category`
- **Comments**: `name`, `content`

### Sortable Fields

**Blogs**:
- `title` - Blog title
- `createdAt` - Creation date
- `updatedAt` - Last update date
- `category` - Category name
- `isPublished` - Publication status

**Comments**:
- `name` - Commenter name
- `createdAt` - Comment date
- `isApproved` - Approval status

### Default Values
If parameters are not provided, use these defaults:
- `page`: 1
- `limit`: 10
- `sortBy`: `createdAt`
- `sortOrder`: `desc`
- `dateFilter`: `all`

---

## Mongoose Schema Reference

### Blog Schema Fields
```javascript
{
  title: String,           // Required, searchable
  description: String,    // HTML content, searchable
  subTitle: String,       // Subtitle, searchable
  category: String,       // Enum: Technology, Startup, Lifestyle, Finance
  image: String,          // Image URL
  isPublished: Boolean,   // Default: false
  createdAt: Date,        // Auto timestamps
  updatedAt: Date          // Auto timestamps
}
```

### Comment Schema Fields
```javascript
{
  blog: ObjectId,          // Reference to Blog
  name: String,           // Commenter name, searchable
  content: String,        // Comment text, searchable
  isApproved: Boolean,    // Default: false
  createdAt: Date,        // Auto timestamps
  updatedAt: Date          // Auto timestamps
}
```

---

## Implementation Example (Express.js)

```javascript
// Example controller implementation
const getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      dateFilter = 'all',
      category = 'all'
    } = req.query;

    // Build query
    const query = { isPublished: true }; // For public endpoint

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category !== 'all') {
      query.category = category;
    }

    // Date filter
    const dateRange = getDateRange(dateFilter);
    if (dateRange) {
      query.createdAt = { $gte: dateRange.start, $lt: dateRange.end };
    }

    // Sorting
    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Pagination
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)),
      Blog.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      filters: { search, sortBy, sortOrder, dateFilter, category }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

## Summary

The backend team needs to:

1. **Add query parameter handling** to existing list endpoints
2. **Implement date range filtering** based on `dateFilter` parameter
3. **Implement search functionality** with case-insensitive matching
4. **Implement sorting** for sortable fields
5. **Implement pagination** with consistent response format
6. **Return pagination metadata** in the response
7. **Support additional filters** like `category`, `status`, `approvalStatus`

All endpoints should return consistent JSON structure with `success`, `data`, `pagination`, and `filters` fields.
