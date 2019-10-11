// API Confg
const express = require('express')
const app = express()
const port = 2099

app.use(express.json())


// MongoDB Conf
const mongodb = require('mongodb')
// Memuat koneksi ke mongodb
const mongodbClient = mongodb.MongoClient

const url = 'mongodb://localhost:27017'
const databaseName = 'bdg-mongodb'

// mongodbClient.connect(url, option, callback ())

mongodbClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) =>{
    if(err){
        return console.log(err)
    }

    const db = client.db(databaseName)

    // INIT Data
    app.get('/initdata', (req,res) =>{
        db.collection('users').insertMany([
            { name: 'Jhonny', age: 28 },
            { name: 'Deep', age: 38 },
            { name: 'Bean', age: 19 },
            { name: 'Dora', age: 22 },
            { name: 'Marvel', age: 32 },
            { name: 'Benjamin', age: 32 },
        ]).then(resp => {
            res.send("<h1>Data Init Berhasil di tambahkan</h1>")
        }).catch(err => {
            res.send("<h1>Gagal Menambahkan </h1>")
        })
    })

    // POST DATA
    app.post('/users',(req, res)=>{
        let {name, role, age} = req.body
        db.collection('users').insertOne(
            {    
                name, 
                role, 
                age,
            }
        ).then(resp => {
            res.send({
                pesan : 'Data berhasil di input',
                response : {
                    insertedData : resp.ops[0]
                            }
            })
        }).catch(err =>{
            res.send(err)
        })
    })
    // Get ALL
    app.get('/users',(req,res)=>{
        db.collection('users').find({}).toArray()
        .then(resp => {
            
            if(resp.length === 0){
                return res.send({messege :'Data Kosong'})
            }

            res.send(resp)
        }).catch(err => {
            res.send(err)
        })
    })

    //Home
    app.get('/',(req,res) => {
        res.send("<h1>Ini halaman home</h1>")
    }) 


    // get one data with 'QUERY'
    app.get('/users/one', (req,res) =>{
    //   req.query = {name, age}
        let {age,name} =req.query

        age = parseInt(age)
        db.collection('users').findOne({name, age})
            .then(resp => {
                res.send(resp)
            }).catch (err => {
                res.send('Data not found')
            })
    })

    // GET All Data with 'QUERY'
    app.get('/users/many',(req,res) => {
        let { age} = req.query
        age= parseInt(age)
        db.collection('users').find({age}).toArray()
            .then(resp =>{
                res.send(resp)
            }).catch(err => {
                res.send(err)
            })
    })


    
    // PUT / EDIT DATA
    app.put('/users/:name', (req,res) => {
        // req.params.name (KRITERIA)
        
        // DATA BARU
        // req.body.name
        // req.body.age
        db.collection('users').updateOne({
            name : req.params.name
        },{ $set : {
                    name : req.body.name,
                    age : req.body.age
                    }
        } ).then(resp =>{
            res.send(resp)
        }).catch (err =>{
            res.send(err)
        })
    })



})







app.listen(port, () => {
    console.log('API success Running in port '+ port)
})




// callback function pada listen akan di panggil atau di running saat berhasil menjalankan api