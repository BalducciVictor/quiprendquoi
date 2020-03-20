const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//demande par le client le l'URL / send la page index
app.get('/', function(req, res) {
    res.render('index', { title: 'Qui prend quoi ?' });
});

//recupere les infos du form action =/party
app.post('/party', function(req, res) {
    console.log(req.body);
    axios.post(`${process.env.API_URL}/party`, req.body)
        .then(({ data }) => res.redirect(`/party/${data._id}`))
        .catch((err) => res.send(err));
  });

// affiche la page de l'evenement avec l'id et passe les données dans party
app.get('/party/:id', function(req, res) {
    axios.get(`${process.env.API_URL}/party/${req.params.id}`)
    .then(({ data }) =>
        res.render('party', {
        party: data,
        title: data.name,
        url: `${process.env.FRONT_URL}:${process.env.PORT}/party/${data._id}`,
        gift: [data.gift]
        }),
    )
    .catch((err) => console.log(err));
});


//Recupere le form action =/party/gift
app.post('/party/gift', function(req, res) {
    const obj = req.body;
    const name = 'name';
    const user = 'user';
    obj[name] = "author";
    obj[user] = 'name';
    console.log(obj);

    //Recuperer les données avec un call axios id user et author
    console.log(req.params.id);
    //Ici id est undefined 

    //Post les données a l'api
    axios.post(`${process.env.API_URL}/party/${req.params.id}/items
    P`, obj)
        .then(({ data }) => res.redirect(`/party/${data._id}`))
        .catch((err) => res.send(err));
  });

app.listen(process.env.PORT, () => console.log(`Front app listening on port ${process.env.PORT}!`));