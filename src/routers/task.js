const express = require('express');
const Task = require('../models/task')
const auth = require("../middleware/auth")
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e)
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })

})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {

    const match = {};
    const sort = {};

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    
    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }

    try {
        // const tasks = await Task.find({});
        
        // This is completely valid
        //const task = await Task.find({ owner: req.user._id });

        // But we can also do this

        // in sort ascending in 1 and descending is -1
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                skip: parseInt(req.query.skip),
                limit: parseInt(req.query.limit),
                sort
            }
        }).execPopulate();

        res.send(req.user.tasks);
    } catch (e) {
        console.log(e);
        
        res.status(404).send();
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks);
    // }).catch((e) => {
    //     res.status(404).send();
    // })

})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    
    try {
        // const task = Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }

        res.send(task);    
    } catch (e) {
        res.status(500).send();
    }

    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send();
    //     }

    //     res.send(task);
    // }).catch((e) => {
    //     res.status(500).send();
    // })

})

router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid operations!!" });
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, 
        //     { new: true, runValidators: true });

        const task = await task.findOne({ _id: req.params.id, owner: req.user._id })
        
        // const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    } catch (e) {
        res.status(400).send();
    }

})

router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        //const task = await Task.findByIdAndDelete(id);
        const task = await task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(400).send();
    }
})

module.exports = router;