import jwt, { JwtPayload } from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/UserReqRegister'

//jwt.sign(payload, secretOrPrivateKey, [options, callback])
export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token as string)
      }
    })
  })
}
export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET as string, // mặc định sẽ lấy secret key từ env không cần truyền vào
  options = { algorithms: ['HS256'] }
}: {
  token: string
  secretOrPublicKey?: string
  options?: jwt.VerifyOptions
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, options, (err, decoded) => {
      if (err) {
        reject(err)
      }
      resolve(decoded as TokenPayload) // decoded là object bao gồm payload lúc sign
    })
  })
}
