import bcrypt from 'bcrypt'

export function passwordHash(password: string) {
  return bcrypt.hash(password, 10) //10 là số lần băm (salt rounds) để tăng độ bảo mật của mật khẩu đã mã hóa
}
//compare la mot promise
//compare dung de so sanh password va tra ve true or false
export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
