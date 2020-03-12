const router = require('express').Router();

let Chapter = require('../models/chapter.model');
let Manga = require('../models/manga.model');
let User = require('../models/user.model');
let Comment = require('../models/comment.model');

router.route('/').get((req, res) => {
    Chapter.find()
        .then(chapters => {
            res.json(chapters)
        })
        .catch(err => res.status(400).json("ERROR: " + err))
});

router.route('/:mangaId/:chapter').get((req, res) => {
    Chapter.where('mangaId')
        .equals(req.params.mangaId)
        .where('stt')
        .equals(req.params.chapter)
        .then(chapter => {
            if (chapter.length > 0) {
                let result = [];
                Comment.where('chapterId')
                    .equals(chapter[0]._id)
                    .limit(10)
                    .then(comments => {
                        const size = comments.length;
                        if (comments.length > 0) {
                            comments.forEach(comment => {
                                User.findById(comment.userId)
                                    .then(user => {
                                        result.push({
                                            comment,
                                            user
                                        })
                                        if (result.length === size) {
                                            res.json({
                                                data: chapter[0],
                                                comment: result
                                            });
                                        }
                                    })
                                    .catch(err => res.status(400).json("ERROR: " + err))
                            })
                        }
                        else res.json({
                            data: chapter[0]
                        })
                    })
                    .catch(err => res.status(400).json("ERROR: " + err))
            }
            else res.json({
                data: chapter[0]
            })
        })
        .catch(err => { res.status(400).json("ERROR: " + err) })
});

router.route('/add').post((req, res) => {
    const mangaId = req.body.idmanga;
    const listImage = req.body.listImage;
    const stt = req.body.stt;

    if (!stt)
        res.json({ Error: "Please enter number of chapter" });
    else
        if (listImage.length === 0)
            res.json({ Error: "Please enter image of chapter" });
        else {
            const newChapter = new Chapter({
                mangaId,
                listImage,
                stt
            })


            Chapter.where('mangaId')
                .equals(newChapter.mangaId)
                .where('stt')
                .equals(newChapter.stt)
                .then(chapter => {
                    if (chapter.length > 0) res.json({ Error: "chapter already ready!" })
                    else {
                        newChapter.save()
                            .then(() => {
                                Manga.findByIdAndUpdate(mangaId)
                                    .then(manga => {
                                        manga.chapterCount++;
                                        manga.chapters.push(stt);
                                        manga.save()
                                            .then(() => {
                                                res.json({ Error: 'add a chapter succesfully' })
                                            })
                                            .catch(err => res.status(500).json('ERROR:  ' + err))
                                    })
                                    .catch(err => { res.status(401).json("ERROR: " + err) });
                            })
                            .catch(err => { res.status(401).json("ERROR: " + err) })
                    }
                })
                .catch(err => { res.status(400).json("ERROR: " + err) })
        }
});

router.route('/:id').delete((req, res) => {
    Chapter.findByIdAndDelete(req.params.id)
        .then(res.json("delete a chapter succesfully!"))
        .catch(err => { res.status(400).json("ERROR: " + err) })
});

router.route('/update/:id').post((req, res) => {
    Chapter.findByIdAndUpdate(req.params.id)
        .then(chapter => {
            if (req.body.listImage) chapter.listImage = req.body.listImage;
            if (req.body.stt) chapter.stt = req.body.stt;

            chapter.save()
                .then(res.json('update a chapter sucessfully'))
                .catch(err => { res.status(400).json("ERROR: " + err) })
        })
});

module.exports = router;