const router = require('express').Router();

let Catalogy = require('../models/catalogy.model');
let Manga = require('../models/manga.model');

router.route('/').get((req,res)=>{
    Catalogy.find()
    .then(catalogys=>{
        res.json(catalogys);
    })
    .catch(err=>{
        res.status(400).json("ERROR: "+err);
    })
});

router.route('/catalogys-details').get((req,res)=>{
    let catalogysDetails=[];
    Catalogy.find()
    .then(catalogys=>{
        let size = catalogys.length;
        catalogys.forEach(catalogy=>{
            Manga.find({catalogy:catalogy.name})
                .limit(10)
                .then( mangas=>{
                    catalogysDetails.push({ 
                        catalogysDetails:catalogy,
                        mangas
                    });
                    if(size === catalogysDetails.length)res.json(catalogysDetails);
                })
                .catch(err=>res.status(500).json("ERROR: "+err))
        })
    })
    .catch(err=>res.status(500).json("ERROR: "+err))
})

router.route('/add').post((req,res)=>{
    const name = req.body.name;

    const newCatalogy = new Catalogy({
        name
    })

    newCatalogy.save()
    .then(res.json("add a catalogy succesfully!!"))
    .catch(err=>res.status(400).json("ERROR: "+err))
});

router.route('/:id').delete((req,res)=>{
    Catalogy.findByIdAndDelete(req.params.id)
    .then(res.json("delete succesfully"))
    .catch(err=>res.status(400).json("ERROR: "+err))
})

router.route('/update/:id').post((req,res)=>{
    Catalogy.findByIdAndUpdate(req.params.id)
    .then(catalogy=>{
        if(req.body.name) catalogy.name = req.body.name;

        catalogy.save()
        .then(res.json("add a catalogy successfully"))
        .catch(err=>res.status(400).json("ERROR: "+err))
    })
    .catch(err=>res.status(400).json("ERROR: "+err));
});

module.exports = router;