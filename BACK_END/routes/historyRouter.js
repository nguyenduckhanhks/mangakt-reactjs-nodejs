const router = require('express').Router();

const History = require('../models/history.model');
const Manga = require('../models/manga.model');

router.route('/:userid').get((req, res) => {
    const userId = req.params.userid;

    if (!userId) res.status(500).json('you must login for this function');
    else
        History.where('userId')
            .equals(userId)
            .limit(10)
            .then(history => {
                const size = history[0].mangaIds.length;
                let mangas = [];
                if(size > 0)
                {
                    history[0].mangaIds.forEach(mangaId => {
                        Manga.findById(mangaId)
                            .then(manga=>{
                                mangas.push({
                                    name: manga.name,
                                    _id: manga._id,
                                    chapters: manga.chapters,
                                    likeCount: manga.likeCount,
                                    imageUrl: manga.imageUrl
                                })
                                if(mangas.length === size){
                                    res.json(mangas)
                                }
                            })
                            .catch(err=>res.status(400).json(err))
                    });
                }
                else res.json([])
            })
            .catch(err => {
                res.status(400).json(err);
            })
})

router.route('/add').post((req, res) => {
    const userId = req.body.userId;
    const mangaId = req.body.mangaId;

    if (!userId || !mangaId) res.status(500).json('not enough information')
    else {
        History.where('userId')
            .equals(userId)
            .then(history => {
                if (history[0]) {
                    let before = history[0].mangaIds.indexOf(mangaId);
                    if(before !== -1)
                    {
                        history[0].mangaIds.splice(before,1);
                    }
                    
                    history[0].mangaIds.push(mangaId);
                    history[0].save()
                        .then(res.json('sucessfully'))
                        .catch(err => res.status(400).json( err))
                }
                else{
                    const mangaIds = [
                        mangaId
                    ];
                    const newHistory = new History({
                        userId,
                        mangaIds
                    })
                    newHistory.save()
                        .then(res.json('sucessfully'))
                        .catch(err => res.status(400).json("a "+ err))
                }
            })
            .catch(err => res.status(400).json(err))
    }
})

module.exports = router;