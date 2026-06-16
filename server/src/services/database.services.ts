import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Role from '~/models/schemas/Role.schema'
import User from '~/models/schemas/User.schema'
const uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ac-kuiimxw-shard-00-00.woqzpal.mongodb.net:27017,ac-kuiimxw-shard-00-01.woqzpal.mongodb.net:27017,ac-kuiimxw-shard-00-02.woqzpal.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-lk4c4u-shard-0&authSource=admin&appName=Backend`
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } finally {
      // Ensures that the client will close when you finish/error
      // await this.client.close()
    }
  }
  get users(): Collection<User> {
    // đại diện cho collection users trong MongoDB và
    // chứa các phương thức để thực hiện các thao tác CRUD trên collection đó.
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
  get roles(): Collection<Role> {
    return this.db.collection(process.env.DB_ROLES_COLLECTION as string)
  }
}
const databaseService = new DatabaseService()
export default databaseService
