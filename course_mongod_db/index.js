/* coursename author price enroll   */
const express=require("express")
const cors=require("cors")
const {MongoClient,ObjectId}=require("mongodb")
const app=express()
app.listen(8080,()=>console.log("server is running 8080...."))

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
let db=null;
const mongo=new MongoClient("mongodb://localhost:27017")
mongo.connect()
.then((conn)=>{
    console.log("database connected...")
    db=conn.db("user")
})
.catch(()=>console.log("database error"))

app.post('/course',async(req,res)=>{
    try{
        const courseCollection=db.collection('courses')
        await courseCollection.insertOne(req.body)
        res.status(200).json({message:"Course Added Successfully"})

    }
    catch(err){
        res.status(500).json({message:"error occured"})
    }
})

app.get('/course',async(req,res)=>{
    try{
        const courseCollection= db.collection("courses")
        const courses=await courseCollection.find().toArray()
        res.status(200).json(courses)
    }
    catch(err){
        res.status(500).json({message:"error occured"})

    }
})

app.put("/course/:id",async(req,res)=>{
    try{
        const id=new ObjectId(req.params.id);
        const body=req.body;
        const courseCollection=db.collection("courses")
        await courseCollection.updateOne({_id:id},{$set:body})
        res.status(200).json({message:"update succesfully"})
    }
    catch(err){
        res.status(500).json({message:"error occured"})

    }
})

app.delete("/course/:id",async(req,res)=>{
    try{
        const id=new ObjectId(req.params.id)
        const courseCollection=db.collection("courses")
        await courseCollection.deleteOne({_id:id})
        res.status(200).json({message:"delete successfully !"})
    }
    catch(err){
        res.status(500).json({message:"error occured"})

    }
})