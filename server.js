// Dependencies
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

// Scraping
const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/xinhuaScraper';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect('mongodb://localhost/xinhuaScraper', { useNewUrlParser: true });


// Scrape Data
app.get('/scrape', (req, res) => {
  // axios.get('http://www.xinhuanet.com/english/sci/index.htm').then((response) => {
  axios.get('http://www.xinhuanet.com/tech/index.htm').then((response) => {
    const $ = cheerio.load(response.data);

    $('li.clearfix').each((i, element) => {
      if (i < 10) {
        const result = {};
        result.title = $(element).find('h3').find('a').text();
        result.link = $(element).find('h3').find('a').attr('href');
        result.summary = $(element).find('p').text();


        db.Article.create(result)
          .then((dbArticle) => {
            console.log(dbArticle);
          })
          .catch(err => res.json(err));
      }
    });
  });
});

// Grabbing all from the barrel
app.get('/articles', (req, res) => {
  db.Article.find({})
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch(err => res.json(err));
});

// Populating
app.get('/articles/:id', (req, res) => {
  db.Article.findOne({ _id: req.params.id })
    .populate('note')
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch(err => res.json(err));
});

// Saving note
app.post('/articles/:id', (req, res) => {
  db.Note.create(req.body)
    .then(dbNote => db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })) // eslint-disable-line
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch(err => res.json(err));
});

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});


// Translating
// const chTitle = '1.5万亿零钱被闲置';
// const URL = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20181109T072320Z.67cf8a4ea712f6bd.bab826710edbfde8ec4ceda55f336829f069e019&text=${chTitle}&lang=zh-en`;

// axios.get(URL)
//   .then(translated => console.log(translated))
//   .catch(err => console.log(err));

// axios({
//   method: 'get',
//   url: URL,
//   responseType: 'json',
// })
//   .then((translated) => {
//     console.log(translated);
//   });
// .catch(err => console.log(err));
