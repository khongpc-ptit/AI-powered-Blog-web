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
  LOGOUT_SUCCESS: 'Logout success'
}
