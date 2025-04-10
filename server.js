require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/Note');




const app = express();

const cors = require("cors");
app.use(cors());

// Load environment variables
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
async function connectDB() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    }
}

connectDB();

// Sample Route

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});

// Home Route

// Create Content
app.post('/notes', async (req,res)=> {

    try{
        const note = new Note(req.body);
        await note.save();
        res.status(201).json(note);

    }

    catch (err){
        res.status(400).json({error: err.message});
    }

});


// Get All Notes (GET)
// Get All Notes (Newest First)
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Get Note by ID (GET)

app.get('/notes/:id', async(req, res)=>{
    try{

        const note = await Note.findById(req.params.id);

        if(!note) return res.status(404).json({error: 'Note Not Found'});

        res.status(200).json(note)

    }

    catch(err){

        res.status(500).json({error: err.message})

    }
})


// update by ID

app.put('/notes/:id', async(req,res)=>{
   try{

    const note = await Note.findByIdAndUpdate(req.params.id,req.body, { new: true, runValidators:true});
    if(!note) return res.status(404).json({error: 'Note Not Found'});
    res.status(200).json(note);
   }

   catch (e){
   res.status(400).json({error: e.message})
   }
})

// Delete Note BY ID
app.delete('/notes/:id', async(req, res)=>{
    try{
        const note = await Note.findByIdAndDelete(req.params.id);
        if(!note) return res.status(404).json({error: 'Note Not Found'});
            res.status(200).json({message: 'Note Deleted'});
    }

    catch (e){
        res.status(500).json({error: e.message})
    }
})