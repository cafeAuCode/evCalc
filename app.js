const express = require('express');
const ejsMate = require('ejs-mate');
const app = express();
const port = 3000;
var path = require('path');


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/', (req, res) => {
    res.redirect()
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})