'use strict';
const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const chocoSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    email: String,
    
})

const chocoModel = mongoose.model('chocolate', chocoSchema);

mongoose.connect(process.env.MONGO_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
server.get('/', Home);
server.get('/getApi', getApi);
server.post('/addFav', addFav);
server.get('/getFav',getFav);
server.delete('/deleteFav/:ID',deleteFav);
server.put('/updateFav/:ID',updateFav);

class chocolate {
    constructor(item) {
        this.title = item.title;
        this.imageUrl = item.imageUrl;
    }
}
function Home(req, res) {
    res.send('welcome to home page');
}

///server.get('/getApi',getApi); https://ltuc-asac-api.herokuapp.com/allChocolateData
async function getApi(req, res) {

    let Url = `https://ltuc-asac-api.herokuapp.com/allChocolateData`;
    let chocoData = await axios.get(Url);
    // console.log('chocoData', chocoData.data);
    let newData = chocoData.data.map(item => {
        return new chocolate(item);
    })
    res.send(newData);
}
// server.post('/addFav',addFav);
async function addFav(req, res) {
    let { title, imageUrl, email } = req.body;
    let newObj = new chocoModel({
        title: title,
        imageUrl: imageUrl,
        email: email,
    })
    await newObj.save();
    chocoModel.find({ email: email }, (err, Data) => {
        if (err) {
            console.log(err);
        }
        else {
            // console.log('Data!!!', Data)
            res.send(Data);
        }
    })
}
// server.get('/getFav',getFav);
async function getFav(req,res){
let email = req.query.email;
chocoModel.find({ email: email }, (err, Data) => {
    if (err) {
        console.log(err);
    }
    else {
        // console.log('Data!!!', Data)
        res.send(Data);
    }
})
}
// server.delete('/deleteFav/:ID',deleteFav)
async function deleteFav(req,res){
    // let email = req.body;
    let ID = req.params.ID;
    console.log(ID);
    chocoModel.remove({_id:ID},(err,Data)=>{
        if(err){
            console.log(err);
        }else{
            chocoModel.find({ }, (err, deletedData) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('deletedData!!!', deletedData)
                    res.send(deletedData);
                }
            }) 
        }
      
    })
  
}
// server.put('/updateFav/:ID',updateFav);
async function updateFav(req,res){
    let { title, imageUrl, email } = req.body;
    let ID = req.params.ID;
    console.log(ID);
    chocoModel.findByIdAndUpdate(ID,{title, imageUrl},(err,Data)=>{
        if(err){
            console.log(err);
        }else{
            chocoModel.find({email:email}, (err, updateData) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('updateData!!!', updateData)
                    res.send(updateData);
                }
            }) 
        }
      
    })
}

server.listen(PORT, () => {
    console.log('All gooooood');
})