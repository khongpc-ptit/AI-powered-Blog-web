// cụ thể message cho từng lỗi nhỏ trong validation sẽ được định nghĩa ở đây
// lỗi cho User schema sẽ được định nghĩa ở đây
export const USER_MESSAGES = {
  // lỗi cho trường username
  USERNAME_LENGTH: 'Username must be between 1 and 50 characters',
  USERNAME_STRING: 'Username must be a string',
  USERNAME_NOT_EMPTY: 'Username cannot be empty',
  // lỗi cho trường email
  EMAIL_INVALID: 'Email must be a valid email address',
  EMAIL_NOT_EMPTY: 'Email cannot be empty',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  // lỗi cho trường password
  PASSWORD_LENGTH: 'Password must be between 6 and 50 characters',
  PASSWORD_STRONG:
    'Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  PASSWORD_NOT_EMPTY: 'Password cannot be empty',
  // lỗi cho trường confirm_password
  CONFIRM_PASSWORD_LENGTH: 'Confirm password must be between 6 and 50 characters',
  CONFIRM_PASSWORD_STRONG:
    'Confirm password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_NOT_EMPTY: 'Confirm password cannot be empty',
  CONFIRM_PASSWORD_MATCH: 'Confirm password must match password',
  // lỗi cho trường date_of_birth
  DATE_OF_BIRTH_NOT_EMPTY: 'Date of birth cannot be empty',
  DATE_OF_BIRTH_IS_ISO8601: 'Date of birth must be a valid ISO8601 date',
  // Login
  USER_NOT_FOUND: 'User not found',
  LOGIN_SUCCESS: 'Login successful',
  EMAIL_OR_PASSWORD_INVALID: 'Email or password is invalid',
  ACCESS_TOKEN_ISREQUIRED: 'Access token is required',
  //register
  REGISTER_SUCCESS: 'User registered successfully',
  //refresh token
  REFRESH_TOKEN_ISREQUIRED: 'Refresh token cannot be empty',
  REFRESH_TOKEN_NOT_EXISTS: 'Refresh token does not exist',
  REFRESH_TOKEN_INVALID: 'Refresh token is invalid',
  LOGOUT_SUCCESS: 'Logout success',
  // profile
  GET_PROFILE_SUCCESS: 'Get profile success',
  // Error/Validation Messages
  NO_DATA_TO_UPDATE: 'No valid data provided for update',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100 characters',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be a valid ISO 8601 format',
  LOCATION_MUST_BE_A_STRING: 'Location must be a string',
  UPDATE_PROFILE_SUCCESS: 'Update profile successfully',
  //Change password
  CHANGE_PASSWORD_SUCCESS: 'Change password successfully',
  password_IS_REQUIRED: 'Old password is required',
  NEW_PASSWORD_IS_REQUIRED: 'New password is required',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50 characters',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_MUST_MATCH: 'Confirm password must match the new password',
  password_INCORRECT: 'Old password is incorrect'
}

export const BLOG_MESSAGES = {
  GET_CATEGORIES_SUCCESS: 'Get categories successfully',
  GET_BLOGS_SUCCESS: 'Get blogs successfully',
  GET_BLOG_SUCCESS: 'Get blog successfully',
  BLOG_NOT_FOUND: 'Blog not found',
  GET_COMMENTS_SUCCESS: 'Get comments successfully',
  ADD_COMMENT_SUCCESS: 'Add comment successfully'
}

export const ADMIN_BLOG_MESSAGES = {
  GET_ALL_BLOGS_SUCCESS: 'Get all blogs successfully',
  CREATE_BLOG_SUCCESS: 'Create blog successfully',
  UPDATE_BLOG_SUCCESS: 'Update blog successfully',
  TOGGLE_PUBLISH_SUCCESS: 'Toggle blog publish status successfully',
  PROMPT_REQUIRED: 'Prompt is required for AI generation',
  GENERATE_CONTENT_SUCCESS: 'Generate content successfully',
  BLOG_NOT_FOUND: 'Blog not found'
}

export const PERMISSION_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  ROLE_NOT_FOUND: 'Access Denied: Role not found',
  INSUFFICIENT_PERMISSIONS: 'Access Denied: Insufficient permissions'
}

export const ADMIN_CATEGORY_MESSAGES = {
  GET_ALL_CATEGORIES_SUCCESS: 'Get all categories successfully',
  CREATE_CATEGORY_SUCCESS: 'Create category successfully',
  UPDATE_CATEGORY_SUCCESS: 'Update category successfully',
  DELETE_CATEGORY_SUCCESS: 'Delete category successfully',
  CATEGORY_NOT_FOUND: 'Category not found',
  CATEGORY_NAME_REQUIRED: 'Category name is required',
  CATEGORY_NAME_ALREADY_EXISTS: 'Category name already exists'
}

export const ADMIN_COMMENT_MESSAGES = {
  GET_ALL_COMMENTS_SUCCESS: 'Get all comments successfully',
  APPROVE_COMMENT_SUCCESS: 'Approve comment successfully',
  DELETE_COMMENT_SUCCESS: 'Delete comment successfully',
  COMMENT_NOT_FOUND: 'Comment not found'
}

export const ADMIN_USER_MESSAGES = {
  GET_ALL_USERS_SUCCESS: 'Get all users successfully',
  UPDATE_USER_SUCCESS: 'Update user successfully',
  DELETE_USER_SUCCESS: 'Delete user successfully',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  ROLE_NOT_FOUND: 'Role not found'
}

export const ADMIN_STAFF_MESSAGES = {
  GET_ALL_ADMINS_SUCCESS: 'Get all admins/staff successfully',
  CREATE_ADMIN_SUCCESS: 'Create admin account successfully',
  RESET_PASSWORD_SUCCESS: 'Reset admin password successfully',
  DELETE_ADMIN_SUCCESS: 'Delete admin account successfully',
  STAFF_NOT_FOUND: 'Staff or admin not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  ROLE_NOT_FOUND: 'Role not found'
}


