const router = require('express').Router();

let Like = require('../models/like.model');
let Manga = require('../models/manga.model');

router.route('/:mangaId/:userId').get((req,res)=>{
    const userId = req.params.userId;
    const mangaId = req.params.mangaId;
    Like.where('userId')
        .equals(userId)
        .where('mangaId')
        .equals(mangaId)
        .then(likes=>{
            if(likes.length > 0) res.json(true);
            else res.json(false);
        })
        .catch(err=>res.status(500).json("something went wrong"))
})

router.route('/:mangaId').post((req, res) => {
    const mangaId = req.params.mangaId;
    const userId = req.body.userId;

    const newLike = new Like({
        mangaId,
        userId
    });

    Like.where('mangaId')
        .equals(mangaId)
        .where('userId')
        .equals(userId)
        .then(like => {
            if (like.length === 0) {
                newLike.save()
                    .then(
                        Manga.findByIdAndUpdate(mangaId)
                            .then(manga => {
                                manga.likeCount++;
                                manga.save()
                                    .then(res.json('like a manga succesfully'))
                                    .catch(err => res.status(400).json("ERROR: " + err))
                            })
                            .catch(err=>res.status(400).json("ERROR: " + err))
                    )
                    .catch(err => res.status(400).json("ERROR: " + err))
            } else {
                res.json('manga have already liked before!!!')
            }
        })
        .catch(err => res.status(400).json("ERROR: " + err))
})

router.route('/:mangaId/:userId').delete((req, res) => {
    const mangaId = req.params.mangaId;
    const userId = req.params.userId;
    Like.where('mangaId')
        .equals(mangaId)
        .where('userId')
        .equals(userId)
        .then(like => {
            if (like.length > 0) {
                Like.findByIdAndDelete(like[0]._id)
                    .then(
                        Manga.findByIdAndUpdate(mangaId)
                            .then(manga => {
                                manga.likeCount--;
                                manga.save()
                                    .then(res.json('like a manga succesfully'))
                                    .catch(err => res.status(400).json("ERROR: " + err))
                            })
                            .catch(err=>res.status(400).json("ERROR: " + err))
                    )
                    .catch(err => res.status(400).json("ERROR: " + err))
            } else {
                res.json('manga have not liked before!!!')
            }
        })
        .catch(err => res.status(400).json("ERROR: " + err))
})

module.exports = router;