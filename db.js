const mongoose = require('mongoose');


const conectToMongoose=()=>{
    mongoose.connect('mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false').then(()=>{
        console.log("db connected");
    }).catch(err=>console.log(err));
}


module.exports=conectToMongoose


// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));