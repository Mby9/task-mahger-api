const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require("sharp");
const { sendWelcomeEmail, sendCancelEmail } = require("../emails/account")

const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send(e);
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })    

});

router.post('/users/login', async (req, res) => {
    try {

        console.log(req.body);

        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        //res.send({ user: user.getPublicProfile(), token });

        res.send({ user, token });
    } catch (e) {
        console.log(e);
        res.status(404).send();
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users', async (req, res) => {
    
    try {
        const users = await User.find({})
        res.status(401).send(users);
    } catch (e) {
        res.status(500).send();
    }

    // User.find({}).then((users) => {
    //     res.send(users);
    // }).catch((e) => {
    //     res.status(500).send();
    // })
})

router.get('/users/me', auth, async(req, res) => {
    res.send(req.user);
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id; 

//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send();
//         }
        
//         res.send(user);
//     } catch (e) {
//         res.status(500).send();
//     }

//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send();
//     //     }

//     //     res.send(user);
//     // }).catch((e) => {
//     //     res.status(500).se nd();
//     // })
// })

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!!'});
    }

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body,
        //     { new: true, runValidators: true });

        // const user = await User.findById(req.params.id);

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();

        res.send(req.user);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

router.delete('/users/me', auth, async (req, res) => {
    //const _id = req.user._id;

    try {
        sendCancelEmail(req.user.email, req.user.name);

        // const user = await User.findByIdAndDelete(id);
        await req.user.remove();
        res.send(req.user);

    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error("Please upload images only!"));
        }
        callback(undefined, true);
    }
});

// we can add multiple middlewares
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer)
                            .resize({ width: 250, height: 250 })
                            .png().toBuuffer();
    //req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();

}, (error, req, res, next) => {
    res.status.send({ error: error.message });
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();

})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
})

module.exports = router;