const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri,{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('mongoDb open successfully');
})

const userRoute = require('./routes/userRoute');
app.use('/users',userRoute);
const mangaRoute = require('./routes/mangaRoute');
app.use('/manga',mangaRoute);
const catalogyRoute = require('./routes/catalogyRouter');
app.use('/catalogy',catalogyRoute);
const chapterRoute = require('./routes/chapterRouter');
app.use('/chapter',chapterRoute);
const likeRoute = require('./routes/likeRouter');
app.use('/like',likeRoute);
const commentRoute = require('./routes/commentRouter');
app.use('/comment',commentRoute);
const historyRouter = require('./routes/historyRouter');
app.use('/history',historyRouter);

app.listen(port,  ()=>{
    console.log("server is started!!!");
})