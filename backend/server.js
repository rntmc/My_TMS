import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import {notFound, errorHandler} from './middleware/errorMiddleware.js'
import loadRoutes from './routes/loadRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from './routes/userRoutes.js'
import carrierRoutes from './routes/carrierRoutes.js'
import supplierRoutes from './routes/supplierRoutes.js'

const port = process.env.PORT || 5000;

connectDB() //Connect to MongoDB

const app = express();

//Body parser middleware - so we can access req.body
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('API is running...')
})

app.use('/api/loads', loadRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/carriers', carrierRoutes)
app.use('/api/suppliers', supplierRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))