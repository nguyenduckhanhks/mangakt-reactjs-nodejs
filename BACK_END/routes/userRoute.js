const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/signup').post((req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const repeatpass = req.body.repeatpass;
    const imageUrl = req.body.imageUrl;
    const admin = req.body.admin;

    if(password !== repeatpass) res.json({Error: "password must repeat"})

    const newUser = new User({
        name,
        username,
        password,
        imageUrl,
        admin
    });

    User.where('username')
        .equals(newUser.username)
        .exec()
        .then(users=>{
            if(users.length === 0){
                newUser.save()
                .then(() => res.json({Error:''}))
                .catch(err => res.status(400).json("Error: " + err));
            }else{
                res.json({Error:"Username already ready!"});
            }
        })
        .catch((err) => {
            res.status(400).json("ERROR: "+ err);
        })
});

router.route('/login').post((req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.where('username')
        .equals(username)
        .where('password')
        .equals(password)
        .then(user=>user.length > 0 ? res.json(
            {
                status:"login succesfully",
                user: user[0]
            }
        ) : res.status(500).json('username or password is wrong'))
        .catch(err=>res.status(400).json("ERROR: " + err))
});

router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json("delete a user sucessfully!!"))
});

router.route('/update/:id').post((req, res) => {
    User.findByIdAndUpdate(req.params.id)
        .then(user => {
            if (req.body.password) user.password = req.body.password;
            if (req.body.admin) user.admin = req.body.admin;
            if (req.body.imageUrl) user.imageUrl = req.body.imageUrl;

            user.save()
                .then(() => {
                    res.json("Update succesfully");
                })
                .catch(err => res.status(500).json("ERROR: " + err));
        })
        .catch(err=>res.status(400).json("ERROR: "+ err))
});

module.exports = router;