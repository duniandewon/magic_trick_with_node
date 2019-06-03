const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = process.env.DATABASEURL || 'mongodb://localhost:27017/magic_trick';
const path = require('path');

// App configuration
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({
    extended: true
}));

// Connect to database
mongoose.connect(connectDB, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connection succesful!!');
}).catch(err => {
    console.log("Error:", err.message);
});

// Magic database schema
const magicSchema = new mongoose.Schema({
    name: String,
    card: String
});

const Magic = mongoose.model('Magic', magicSchema);

// Routes
app.get('/', (req, res) => res.redirect('/secret'));

app.get('/secret', (req, res) => res.render('secret'));

app.post('/secret', (req, res) => {
    const newMagic = {
        name: req.body.name.toLowerCase(),
        card: `${req.body.number}_of_${req.body.suit}`
    }

    Magic.create(newMagic, (err, newMagic) => {
        if (err) {
            console.log(err)
        } else {
            console.log(newMagic);
            res.send('New card input successful');
        }
    });
});

app.get('/secret/:name', (req, res) => {
    Magic.findOne({
        name: req.params.name
    }, (err, foundMagic) => {
        if (err || !foundMagic) {
            console.log(err);
            res.send("Name doesn't exist");
        } else {
            res.sendFile(path.join(__dirname + `/cards/${foundMagic.card}.png`));
        }
    })
});

app.get('/delete', (req, res) => {
    Magic.deleteMany({}, err => {
        if (err) {
            console.log(err);
        } else {
            res.send('Database is cleared');
        }
    })
})


app.listen(PORT, () => {
    console.log('Server is up');
});