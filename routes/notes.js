const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note')
const router = express.Router()

// Route 1: Fetch all the notes related to the unique user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        let note = await Note.find({user: req.user.id});
        res.send(note)      
    } catch (error) {
        console.error(error.message)
        res.send(500).send("Internal server error")
    }
})

// Route 2: Add a new note
router.post('/addnote', fetchuser, [
    body('title', "Enter the title with at least length of 3").isLength({ min: 3}),
    body('description', "Enter the description with at least length of 5").isLength({ min: 5}),
    // body('tag', "Enter the tag with at least length of 3").isLength({ min: 3}),
], async (req, res) => {
    try {
        const err = validationResult(req)
        if(!err.isEmpty()) {
            return res.status(400).send("Enter data correctly")
        }
    
        const {title, description, tags} = req.body
        const note = await new Note({
            title, description, tags, user: req.user.id
        })
        const savedNote = await note.save();
        res.send(savedNote)
        
    } catch (error) {
        console.error(error.message)
        res.status(401).send("Internal Server Error")
    }
    
})

// Route 3: Updating the current note.
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const {title, description, tags} = req.body
        const newNote = {}
        if(title) newNote.title = title
        if(description) newNote.description = description
        if(tags) newNote.tags = tags
    
        let note = await Note.findById(req.params.id)
        if(!note) {return res.status(401).send("Not found")}
    
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.send({note})
        
    } catch (error) {
        console.error(error.message)
        res.status(401).send("Internal Server Error")
    }
})

//Route 4: Delete an existing note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id)
        if(!note) {return res.status(401).send("Not found")}
    
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
    
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Sucess": "The note is deleted", note: note})
        
    } catch (error) {
        console.error(error.message)
        res.status(401).send("Internal Server Error")
    }
})
module.exports = router