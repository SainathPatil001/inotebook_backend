const express=require('express')
const conectToMongoose = require('./db')

const cors=require("cors")



// db connection
conectToMongoose()

// server
const app=express()
app.use(cors())
app.use(express.json())
app.use("/api/auth",require("./routes/auth.js"))
app.use("/api/notes",require("./routes/notes.js"))

app.get("/",(req,res)=>{
    
    res.send("hello")
})
app.listen(8000,()=>{
    console.log("server is listening");
})