const express=require('express')
const router=express.Router()
const fetchuser = require("../middlewares/fetchuser");
const Notes = require('../models/Notes');
const { body, validationResult } = require("express-validator");


// fetch all notes
router.get("/fetchallnotes",fetchuser,
async(req,res)=>{
    
    const note=await Notes.find({user:req.user.id})

    res.json(note)
})



// add a new note 
router.post("/addnote",fetchuser,
[
  body("title").isLength({ min: 3 }),
  body("description").isLength({ min: 5 }),
],async(req,res)=>{
       
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
    const {title,description,tag}=req.body

  
   const note= new Notes({
       title:title,
       description:description,
       tag:tag,
       user:req.user.id
   })

   const savedNote=await note.save();

   res.json({savedNote})
}
catch(err)
{
    res.status(400).json({ message: "Internal server Error" });
}

})



// update a note
router.put("/updatenote/:id",fetchuser,
[

],async(req,res)=>{

    const {title,description,tag}=req.body
const newNote={}
    if(title){newNote.title=title}
    if(description){newNote.description=description}
    if(tag){newNote.tag=tag}

     let note=await Notes.findById(req.params.id)

     if(!note)
     {
         return res.status(404).json({"error":"Not found"})
     }
   
     if(req.user.id !==note.user.toString())
     {
         return res.status(401).json({"error":"Unauthorized User"})
     }
   

     note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
     res.json(note)
})


// delete a note
router.delete("/deletenote/:id",fetchuser,
[

],async(req,res)=>{


    try{
    const {title,description,tag}=req.body
const newNote={}
    if(title){newNote.title=title}
    if(description){newNote.description=description}
    if(tag){newNote.tag=tag}

     let note=await Notes.findById(req.params.id)

     if(!note)
     {
         return res.status(404).json({"error":"Not found"})
     }
   
     if(req.user.id !==note.user.toString())
     {
         return res.status(401).json({"error":"Unauthorized User"})
     }
   

     note=await Notes.findByIdAndDelete(req.params.id)
     res.json(note)

    }
    catch(err)
    {
        res.status(400).json({ message: "Internal server Error" });
    }
})
module.exports=router