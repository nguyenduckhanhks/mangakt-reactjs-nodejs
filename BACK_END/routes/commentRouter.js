const router = require('express').Router();

let Comment = require('../models/comment.model');
let Manga = require('../models/manga.model');
let User = require('../models/user.model');

router.route('/add').post((req, res) => {
    const body = req.body.body;
    const chapterId = req.body.chapterId;
    const userId = req.body.userId;

    const newComment = new Comment({
        body,
        chapterId,
        userId
    })

    newComment.save()
        .then(() => {
            Manga.findByIdAndUpdate(req.body.mangaId)
                .then(manga => {
                    manga.commentCount++;
                    manga.save()
                        .then(res.json('comment a manga succesfully'))
                        .catch(err => res.status(500).json("ERROR: " + err))
                })
                .catch(err => res.status(401).json("ERROR: " + err))
        })
        .catch(err => res.status(402).json("ERROR" + err))
});

router.route('/:commentId').delete((req, res) => {
    Comment.findOneAndDelete(req.params.commentId)
        .then(
            Manga.findByIdAndUpdate(mangaId)
                .then(manga => {
                    manga.commentCount--;
                    manga.save()
                        .then(res.json('delete a manga succesfully'))
                        .catch(err => res.status(400).json("ERROR: " + err))
                })
                .catch(err => res.status(400).json("ERROR: " + err))
        )
        .catch(err => res.status(400).json("ERROR" + err))
});

router.route('/:chapterId').get((req, res) => {
    let result = [];
    Comment.where('chapterId')
        .equals(req.params.chapterId)
        .limit(10)
        .then(comments => {
            const size = comments.length;
            comments.forEach(comment => {
                User.findById(comment.userId)
                    .then(user => {
                        result.push({
                            comment,
                            user
                        })
                        if (result.length === size) res.json(result)
                    })
                    .catch(err => res.status(400).json("ERROR: " + err))
            });
        })
        .catch(err => res.status(400).json("ERROR: " + err))
});

module.exports = router;