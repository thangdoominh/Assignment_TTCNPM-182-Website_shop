const pg = require('pg');

const express = require('express');
const app = express();
const port = 3000;

const config = {
    user: 'postgres',
    database: 'clothes',
    password: '1',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
}
const pool = new pg.Pool(config);

let hbs = require('express-hbs');

// Do Registration routes.
// require('./routes')(app);

//Set static content
app.use('/static', express.static('./public'));
//Set view engine
app.set('view engine', 'ejs');

//Set view folder
app.set('views', './views');

app.listen(port, function(err){
  if(err){
    console.error('Something error !!');
    console.error(err);
  }
  console.log('App listen on port ' + port);
});

// --------- show san pham --------//
app.get("/products/list", function(req, res){
  pool.connect(function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM shop ORDER BY id_product ASC', function(err, result) {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      // console.log(result.rows[0].ten_mat_hang);
      res.render("products.list.ejs", {danhsach:result})
    });
  });
});

// -------- show san pham len trang chu (homepage) ----------
app.get("/", (req, res) => {
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM shop ORDER BY id_product ASC', (err, result) => {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.render("homepage.ejs", {danhsach: result})
    });
  });
});

// ----------- Insert Product ----------------
// app.get
