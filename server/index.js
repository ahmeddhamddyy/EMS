import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import connectToDatabase from './db/db.js'


connectToDatabase()
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/department", departmentRouter)


const PORT = process.env.PORT || 5000
app.listen(process.env.PORT, () =>{
    console.log(`SERVER IS CURRENTLY WORKING ON PORT ${process.env.PORT}`)
})