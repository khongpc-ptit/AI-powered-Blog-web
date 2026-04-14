import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js'; //db.js
import adminRouter from './routes/adminRoutes.js'; //adminRoutes.js
import blogRouter from './routes/blogRoutes.js'; //blogRoutes.js
const app = express();

await connectDB();
//Middlewware
app.use(cors());
app.use(express.json());
//route
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{ console.log(`Server running on port ${PORT}`)});

export default app;
