const mongoose = require('mongoose');

exports.mongodbConfig=()=>{
    mongoose.connect('mongodb://localhost:27017/storageAPI', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
}