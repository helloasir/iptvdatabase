"use strict";

const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const path = require('path')
const exphbs = require('express-handlebars')



app.use(express.static(path.join(__dirname, 'public')));
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/ps", express.static(path.join(__dirname, "node_modules/@popperjs/core/dist/umd"))); // <- This will use the contents of 'bootstrap/dist/css' which is placed in your node_modules folder as if it is in your '/styles/css' directory.


// Initialize built-in middleware for urlencoding and json
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.engine('.hbs', exphbs.engine({ extname: '.hbs',
                                   helpers: {
                                   }
                                  }));
app.set('view engine', 'hbs');

app.get('/', function(req, res,next) {
    res.render('index', { title: 'IPTV Database' });  //Render index.hbs
  });

  app.get('/home', function(req, res) {
    res.render('home', { title: 'home' });  //Render index.hbs
  });
  app.get('/a', function(req, res) {
    res.render('home', { title: 'a' });  //Render index.hbs
  });
  app.get('/data', function(req, res) {
  
    const fs = require('fs');
    let jsonData = fs.readFileSync('./public/data.json');
    let data = JSON.parse(jsonData);
  
    res.render('data', { data: JSON.stringify(data),title:'Data table' });
  
  });


  app.get('/data/isbn/:name', function(req, res) {
    
    const fs = require('fs');
    let jsonData = fs.readFileSync('./public/data.json');
    let data = JSON.parse(jsonData);
  
    let i = req.params['name'];
    if(typeof data[i] != 'undefined') {
        
      res.render('tvdata', { data: data[i]['name'], name: i});
    }
    else {
      res.render('tvdata', { data: 'Invalid index entered!', name: i});
    }
  
  });
  
  //(/data/search/isbn)
  app.get('/data/search/iptv', (req, res) => {
  
    res.render('searchform');
  })
  
  app.post('/data/search/isbn', function (req, res) {
  
    let isbn = (req.body)['isbn'];
  
    const fs = require('fs');
  
    let jsonData = fs.readFileSync('./public/data.json');
    let data = JSON.parse(jsonData);
    let flag = false;
    let bookIndex = -1;
  
    for(let i = 0; i < data.length; i++) {
  
        if(data[i]['title'] == isbn) {
            flag = true;
            bookIndex = i;
            break;
        }
    }
  
    res.render('searchdata', { data: data[bookIndex], flag: flag});
  });
  app.get('/data/search/title', (req, res) => {

    res.render('titleform');
  })
  
  app.post('/data/search/title', function (req, res) {
  
    let title = (req.body)['title'].toLowerCase();
  
    const fs = require('fs');
  
    let jsonData = fs.readFileSync('./public/data.json');
    let data = JSON.parse(jsonData);
    let bookArray = [];
  
    for(let i = 0; i < data.length; i++) {
  
        if(data[i]['name'].toLowerCase().includes(title)) {
            
            bookArray.push(data[i]);
        }
    }
  
    res.render('titledata', { data: bookArray, hasBook: (bookArray.length > 0)});  
  
  });
  app.listen(port, "0.0.0.0", function() {
  console.log(`IPTV app listening on port ${port}`)
})

module.exports = app;