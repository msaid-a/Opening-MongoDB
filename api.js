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
    /*
        1. Kirim pesan error jika name, role , age kosong
            template err = Tolong isi data 'name', 'role', 'age'
    */
    app.post('/users',(req, res)=>{
        let {name, role, age} = req.body
        if(name|| role ||age === false){
            return res.send({err :'Tolong isi data name,role,age'})
        }


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
     /*
        1. Kirim pesan error jika user tidak memberikan salah satu atau kedua data (name, age)
            template err = Mohon isi data untuk properti 'name', 'age'
        
        2. Jika data tidak ditemukan, kirim object dg property 'err'
            templat err = Tidak dapat menemukan user dengan nama ... dan umur ...
    */
    app.get('/users/one', (req,res) =>{
    //   req.query = {name, age}
        let {age,name} =req.query

        age = parseInt(age)
        if(!name || isNaN(age)){
            return res.send({err : 'Mohon isi properti name, age'})
        }
    
        db.collection('users').findOne({name, age})
            .then(resp => {
                if(!resp){
                   return res.send({err :`tidak dapat menemukan user dengan nama ${name} dan umur ${age}`})
                }
                res.send(resp)
            }).catch (err => {
                res.send(err)
            })
    })

    // GET All Data with 'QUERY'
    /*
        1. Kirim pesan error ketika age kosong / tidak di isi data
        2. Jika data tidak ditemukan maka kirim respon dalam bentuk object yang memiliki propert 'err'
            templat pesan err = Data dengan umur ... tidak di temukan
    */
    app.get('/users/many',(req,res) => {
        let { age} = req.query
        age= parseInt(age)
        if(isNaN(age)){
            return res.send({err :'Age tolong di isi'})
        }
        db.collection('users').find({age}).toArray()
            .then(resp =>{
                if(resp.length ===0){
                    return res.send({err:`Data dengan umur ${age} tidak di temukan`})
                }
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


    // DELETE ONE USER BY AGE
    app.delete('/users/:age', (req, res) => {
        age = parseInt(req.params.age)
        db.collection('users').deleteOne({age : age})
        .then(resp => {
            res.send(resp)
        }).catch(err => {
            res.send(err)
        })
    })
})







app.listen(port, () => {
    console.log('API success Running in port '+ port)
})




// callback function pada listen akan di panggil atau di running saat berhasil menjalankan api