// Dependencies
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

// Scraping
const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

const PORT = 8080;

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/xinhuaScraper';
mongoose.connect(MONGODB_URI);
// mongoose.connect('mongodb://localhost/xinhuaScraper', { useNewUrlParser: true });

// Scrape Data
app.get('/scrape', (req, res) => {
  // axios.get('http://www.xinhuanet.com/english/sci/index.htm').then((response) => {
  axios.get('http://www.xinhuanet.com/tech/index.htm').then((response) => {
    const $ = cheerio.load(response.data);

    $('li.clearfix').each((i, element) => {
      const result = {};
      result.title = $(element).find('h3').find('a').text();
      result.link = $(element).find('h3').find('a').attr('href');
      result.summary = $(element).find('p').text();

      db.Article.create(result)
        .then((dbArticle) => {
          console.log(dbArticle);
        })
        .catch(err => res.json(err));

      // const chTitle = $(element).find('h3').find('a').text();
      // const link = $(element).find('h3').find('a').attr('href');
      // const summary = $(element).find('p').text();
    });
    // console.log(results);
    res.send("That's the bottom of the barrel.");
  });
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
