const pg = require('pg');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const express = require('express');
const app = express();
const port = 3000;

const config = {
    user: 'postgres',
    database: 'sanpham',
    password: 'Luu123456',
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
app.get("/admin/products/list", function(req, res){
  pool.connect(function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM san_pham ORDER BY id_product ASC', function(err, result) {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      // console.log(result.rows[0].ten_mat_hang);
      res.render("products.list.ejs", {danhsach: result})
    });
  });
});

// -------- show san pham len trang chu (homepage) ----------
app.get("/", (req, res) => {
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM san_pham ORDER BY id_product ASC', (err, result) => {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.render("homepage.ejs", {danhsach: result})
    });
  });
});


// ----------- search as key ----------------------
app.get("/search", (req, res) => {
  const {term} = req.query;
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM san_pham WHERE ten_mat_hang ILIKE $1',['%'+ term +'%'], (err, result) => {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      // if(result !== {}){
      //   res.render("category.show.ejs", {danhsach: result});
      // }
      // else{
      //   res.render("error.ejs");
      // }
      if(result.length != 0) {
        res.render("category.show.ejs", {danhsach: result});
      } else {
        res.render("error.ejs");
      }
    });
  });
});

// ----------- Search as category ---------------

// ============================Áo===============================
app.get("/category/upper", (req, res) => {
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("select * from san_pham where loai_mat_hang ilike '%áo%'", (err, result) => {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.render("category.show.ejs", {danhsach: result})
    });
  });
});

// =============================Quần======================
app.get("/category/bottom", (req, res) => {
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("select * from san_pham where loai_mat_hang ilike '%quần%'", (err, result) => {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.render("category.show.ejs", {danhsach: result})
    });
  });
});
// =============================Giày========================
app.get("/category/shoe", (req, res) => {
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("select * from san_pham where loai_mat_hang ilike '%giày%'", (err, result) => {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.render("category.show.ejs", {danhsach: result})
    });
  });
});

// ==============================Phụ kiện=====================
app.get("/category/accessory", (req, res) => {
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("select * from san_pham where loai_mat_hang ilike '%phụ kiện%'", (err, result) => {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.render("category.show.ejs", {danhsach: result})
    });
  });
});

// ==================================Khác=================================
app.get("/category/else", (req, res) => {
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("select * from san_pham where loai_mat_hang ilike '%khác%'", (err, result) => {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.render("category.show.ejs", {danhsach: result})
    });
  });
});

// ----------- Insert Product ----------------
app.get("/admin/products/insert", (req, res) => {
  // getdata
  res.render("product.insert.ejs");
})

app.post("/admin/products/insert", urlencodedParser, (req, res) => {
  pool.connect((err, client, done) => {
    if(err) {
      console.log(err);
    }

    let ten_mat_hang = req.body.txt_ten_mat_hang;
    let loai_mat_hang = req.body.txt_loai_mat_hang;
    let so_luong_san_pham = req.body.txt_so_luong_san_pham;
    let gia_moi_san_pham = req.body.txt_gia_moi_san_pham;
    let mo_ta_san_pham = req.body.txt_mo_ta_san_pham;
    let hinh_anh_san_pham = req.body.txt_hinh_anh_san_pham;

    let query =`INSERT INTO san_pham(ten_mat_hang,
       loai_mat_hang,
       so_luong_san_pham,
       gia_moi_san_pham,
       mo_ta_san_pham,
       hinh_anh_san_pham)
       VALUES('${ten_mat_hang}',
       '${loai_mat_hang}',
       ${so_luong_san_pham},
       ${gia_moi_san_pham},
       '${mo_ta_san_pham}',
       '/static/img/${hinh_anh_san_pham}')`;

    client.query(query, (err, result) => {
      done();
      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.redirect("/admin/products/list");
    })
  })
})

// // ------------- Edit Product ----------------
//
// app.get()
//
// app.post()
//
// // ------------- Remove Product --------------
//
