const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('pwa'));

//demande par le client le l'URL / send la page index
app.get('/', function(req, res) {
    res.render('index', { title: 'Qui prend quoi ?' });
});

//recupere les infos du form action =/party et post sur l'API
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
        }),
    )
    .catch((err) => console.log(err));
});
//recupere les infos du form action =/party/:id/items et post sur API
app.post('/party/:id/items', (req, res) => {
    console.log(req.body)
    axios.post(`${ process.env.API_URL }/party/${req.params.id}/items`, req.body)
    .then(() => res.redirect(`/party/${req.params.id}`))
    .catch((err) => res.send(err));
  });
  //recupere les infos du form action =/party/:id/items/:idItem et delete sur API
app.post('/party/:id/items/:idItem', (req, res) => {
    console.log(req.body)
    axios.delete(`${ process.env.API_URL }/party/${req.params.id}/items/${req.params.idItem}`, req.body)
    .then(() => res.redirect(`/party/${req.params.id}`))
    .catch((err) => res.send(err));
});

//Mette a disposition notre app sur le port 3000
app.listen(process.env.PORT, () => console.log(`Front app listening on port ${process.env.PORT}!`));