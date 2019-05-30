const pg = require('pg');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const express = require('express');
const app = express();
const port = 3000;
global.name_1;

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
    client.query('SELECT * FROM shop ORDER BY id_product ASC', function(err, result) {
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
app.get("/admin/product/insert", (req, res) => {
  res.render("product.insert.ejs");
})

app.post("/admin/product/insert", urlencodedParser, (req, res) => {
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

    let query =`INSERT INTO shop(ten_mat_hang,
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

// ------------- Edit Product ----------------

app.get("/admin/product/edit/:id_product", (req, res) => {
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    let id_pro = req.params.id_product;
    let query = `SELECT * FROM shop WHERE id_product = ${id_pro}`;
    client.query(query, (err, result) => {
      done();
      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.render("product.edit.ejs", {product: result.rows[0]});
    })
  })
})

app.post("/admin/product/edit/:id_product", urlencodedParser, (req, res) => {
  pool.connect( (err, client, done) => {
    if (err) {
      return console.log("Error fetching client from pool", err);
    } else {
      let id_pro = req.body.txt_id_product;
      let ten_mat_hang = req.body.txt_ten_mat_hang;
      let loai_mat_hang = req.body.txt_loai_mat_hang;
      let so_luong_san_pham = req.body.txt_so_luong_san_pham;
      let gia_moi_san_pham = req.body.txt_gia_moi_san_pham;
      let mo_ta_san_pham = req.body.txt_mo_ta_san_pham;
      let hinh_anh_san_pham = req.body.txt_hinh_anh_san_pham;
      let confirm = req.body.btn_confirm;
      let cancel = req.body.btn_cancel;

      console.log(confirm);
      console.log(cancel);

      if (confirm){
        let query =`UPDATE shop SET ten_mat_hang = '${ten_mat_hang}',
        loai_mat_hang = '${loai_mat_hang}',
        so_luong_san_pham = ${so_luong_san_pham},
        gia_moi_san_pham = ${gia_moi_san_pham},
        mo_ta_san_pham = '${mo_ta_san_pham}',
        hinh_anh_san_pham = '/static/img/${hinh_anh_san_pham}'
        WHERE id_product = ${id_pro}`;
        client.query(query, (err, result) => {
          done();
          if (err) {
            res.end();
            return console.error("Error running query", err);
          }
          res.redirect("/admin/products/list");
        })
      }

      if (cancel){
        res.redirect("/admin/products/list");
      }

    }
  })
})

// ------------- Remove Product --------------
app.get("/admin/product/remove/:id_product", (req, res) => {
  pool.connect(( err, client, done) => {
    var id_product = req.params.id_product;
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    let query = `DELETE FROM shop WHERE id_product = ${id_product}`;
    client.query(query, (err, result) => {
      done();
      if (err) {
        res.end();
        return console.error('error running query', err);
      }
      res.redirect("/admin/products/list");
    })
  })
})



// ----------- search as key ----------------------
app.get("/search", (req, res) => {
  const {term} = req.query;
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    name_1 = term;
    client.query('SELECT * FROM shop WHERE ten_mat_hang ILIKE $1',['%'+ name_1 +'%'], (err, result) => {
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
    client.query("select * from shop where loai_mat_hang ilike '%áo%'", (err, result) => {
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
    client.query("select * from shop where loai_mat_hang ilike '%quần%'", (err, result) => {
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
    client.query("select * from shop where loai_mat_hang ilike '%giày%'", (err, result) => {
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
    client.query("select * from shop where loai_mat_hang ilike '%phụ kiện%'", (err, result) => {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.render("category.show.ejs", {danhsach: result})
    });
  });
});

// //------------- List_View--------------------
app.get("/list_view", (req, res) => {
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
      res.render("view.list.ejs", {danhsach: result})
    });
  });
});

// // ------------ Grid_View--------------------
app.get("/grid_view", (req, res) => {
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
      res.render("view.grid.ejs", {danhsach: result})
    });
  });
});

//------------------show_details------------------
app.get("/pro_:id", function(req, res) {
  var id = req.params['id'];
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
      res.render("show_details.ejs", {danhsach: result,
                                      idx : id})
    });
  });
});

app.get("/list_view_search", (req, res) => {
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM shop WHERE ten_mat_hang ILIKE $1',['%'+ name_1 +'%'], (err, result) => {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.render("view.list.search.ejs", {danhsach: result})
    });
  });
});

app.get("/grid_view_search", (req, res) => {
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM shop WHERE ten_mat_hang ILIKE $1',['%'+ name_1 +'%'], (err, result) => {
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.render("view.grid.search.ejs", {danhsach: result})
    });
  });
});
