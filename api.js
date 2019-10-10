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

mongodbClient.connect(url, {}, (err, client) =>{
    if(err){
        return console.log(err)
    }

    const db = client.db(databaseName)

})



app.listen(port, () => {
    console.log('API success Running in port '+port)
})




// callback function pada listen akan di panggil atau di running saat berhasil menjalankan api