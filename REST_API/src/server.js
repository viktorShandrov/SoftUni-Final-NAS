const express = require('express');
const path = require("path")

const { expressConfig } = require('./config/expressConfig');
const { mongodbConfig } = require('./config/mongoDBConfig');



const app = express();



expressConfig(app)

mongodbConfig()



app.get("/",(req,res)=>{
  console.log("home");
    res.sendFile(path.join(__dirname, 'index.html'))
})








app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
