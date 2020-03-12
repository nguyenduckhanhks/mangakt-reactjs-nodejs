const router = require('express').Router();
let Manga = require('../models/manga.model');

router.route('/').get((req,res)=>{
    Manga.find()
    .then(mangas=>{res.json(mangas)})
    .catch(err=>{res.status(400).json("ERROR" + err)})
});

router.route('/:id').get((req,res)=>{
    Manga.where('_id')
    .equals(req.params.id)
    .then(manga=>res.json(manga))
    .catch(err=>{res.status(400).json("ERROR: "+err)})
});

router.route('/:catalogy').get((req,res)=>{
    Manga.find({catalogy:req.params.catalogy})
        .then(mangas=>{res.json(mangas)})
        .catch(err=>{res.status(400).json("ERROR: "+err)})
})

router.route('/add').post((req,res)=>{
    const name = req.body.name;
    const description = req.body.description;
    const catalogy = req.body.catalogy;
    const imageUrl = req.body.imageUrl;
    const author = req.body.author;

    if(!name || !description || !imageUrl || !author || catalogy.length === 0)
        res.json({Error:'please enter infomation of manga'})
    else{
        const newManga = new Manga({
            name,
            description,
            status:false,
            catalogy,
            imageUrl,
            author,
            chapters:[],
            chapterCount:0,
            likeCount:0,
            commentCount:0
        })
    
        newManga.save()
        .then(()=>{
            res.json({Error:'add Chapter succesfully'});
        })
        .catch(err=>{
            res.status(400).json("ERROR: "+err);
        })
    }
});

router.route('/:id').delete((req,res)=>{
    Manga.findByIdAndDelete(req.params.id)
    .then(()=>res.json("Delete a manga succesfully!"))
    .catch(err=>res.status(400).json("ERROR: "+ err))
});

router.route('/update/:id').post((req,res)=>{
    Manga.findByIdAndUpdate(req.params.id)
    .then(manga=>{
        if(req.body.name) manga.name = req.body.name;
        if(req.description) manga.description = req.body.description;
        if(req.status) manga.description = req.body.status;
        if(req.catalogy) manga.catalogy = req.body.catalogy;
        if(req.imageUrl) manga.description = req.body.imageUrl;
        if(req.likeCount) manga.description = req.body.likeCount;
        if(req.commentCount) manga.description = req.body.commentCount;

        manga.save()
        .then(res.json('update succesfully!!'))
        .catch(err=>res.status(400).json("ERROR: "+err))
    })
});

module.exports = router;