const pg = require('pg');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const express = require('express');
const app = express();
const port = 3000;

global.name_1;
const config = {
    user: 'postgres',
    database: 'sanpham',
    password: 'Luu123456',
    database: 'postgres',
    password: 'yuuki93',
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


// ----------- search as key ----------------------
app.get("/search", (req, res) => {
  const {term} = req.query;
app.get("/search",urlencodedParser ,(req, res) => {
  const{term} = req.query;
  name_1 = term;
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM san_pham WHERE ten_mat_hang ILIKE $1',['%'+ term +'%'], (err, result) => {
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
      res.render("category.show.ejs", {danhsach: result,});
    });
  });
});
// app.get("/search",(req, res) => {
//       res.render("category.show.ejs");
// });
//
// app.post("/search",urlencodedParser ,(req, res) => {
//   // const{term} = req.query;
//   // name_1 = term;
//   pool.connect( (err, client, done) => {
//     if(err) {
//       return console.error('error fetching client from pool', err);
//     }
//     var key = req.body.term;
//     client.query('SELECT * FROM shop WHERE ten_mat_hang ILIKE $1',['%'+ key +'%'], (err, result) => {
//       done();
//       if(err) {
//         res.end();
//         return console.error('error running query', err);
//       }
//       res.render("category.show.ejs", {danhsach: result});
//     });
//   });
// });

// ----------- Search as category ---------------

// ============================Áo===============================
app.get("/category/upper", (req, res) => {
  pool.connect( (err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("select * from san_pham where loai_mat_hang ilike '%áo%'", (err, result) => {
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
    client.query("select * from san_pham where loai_mat_hang ilike '%quần%'", (err, result) => {
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
    client.query("select * from san_pham where loai_mat_hang ilike '%giày%'", (err, result) => {
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
    client.query("select * from san_pham where loai_mat_hang ilike '%phụ kiện%'", (err, result) => {
    client.query("select * from shop where loai_mat_hang ilike '%phụ%'", (err, result) => {
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
    client.query("select * from shop where loai_mat_hang ilike '%khác%'", (err, result) => {
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
app.get("/admin/product/insert", (req, res) => {
  res.render("product.insert.ejs");
})

app.post("/admin/products/insert", urlencodedParser, (req, res) => {
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

    let query =`INSERT INTO san_pham(ten_mat_hang,
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

// // ------------- Edit Product ----------------
//
// app.get()
//
// app.post()
//

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

// // ------------- Remove Product --------------
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
// // ------------ Grid_View--------------------

// // ------------Paging------------------------
// app.get('/:page', function(req, res, next) {
//     var perPage = 2
//     var page = req.params.page || 1
//
//         .find({})
//         .skip((perPage * page) - perPage)
//         .limit(perPage)
//         .exec(function(err, products) {
//             danhsach.rows.count().exec(function(err, count) {
//                 if (err) return next(err)
//                 res.render('/test.ejs', {
//                     products: products,
//                     current: page,
//                     pages: Math.ceil(count / perPage)
//                 })
//             })
//         })
// })



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
// app.get('/pro_2', (req, res) => {
//   pool.connect( (err, client, done) => {
//     client.query('SELECT * FROM shop ORDER BY id_product ASC ', (err, result) => {
//       done();
//       res.render('show_details.ejs', {danhsach: result})
//     });
//   });
// });
// app.get('/pro_3', (req, res) => {
//   pool.connect( (err, client, done) => {
//     client.query('SELECT * FROM shop ORDER BY id_product ASC ', (err, result) => {
//       done();
//       res.render('pro_3.ejs', {danhsach: result})
//     });
//   });
// });
// app.get('/pro_4', (req, res) => {
//   pool.connect( (err, client, done) => {
//     client.query('SELECT * FROM shop ORDER BY id_product ASC ', (err, result) => {
//       done();
//       res.render('pro_4.ejs', {danhsach: result})
//     });
//   });
// });

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

//----------------------hiển thị list khuyến mãi--------------------------------
app.get("/admin/listkm", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM promotion ORDER BY id ASC', function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.render("dskm.ejs", {danhsach:result});
    });
  });
});

//----------------------thêm khuyến mãi-----------------------------------------
app.get("/admin/themkm", function(req, res){
  res.render("themkm.ejs");
});
app.post("/admin/themkm", urlencodedParser, function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var idsp = req.body.txt_idsp;
    var poster = req.body.txt_poster;
    var linknd = req.body.txt_linknd;
    var gia = req.body.txt_gia;
    var ngaykt = req.body.txt_ngaykt;
    var a = req.body.txt_gia;
    client.query(" INSERT INTO promotion(idsp, poster, link_nd, gia, ngaykt) VALUES('"+idsp+"', '"+poster+"', '"+linknd+"', '"+gia+"', '"+ngaykt+"')" , function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
    });
    client.query(" SELECT * FROM shop WHERE id = '"+idsp+"';" , function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
    a=result.rows[0].gia_moi_san_pham;
    client.query(" UPDATE promotion SET giatruoc = '"+a+"'WHERE idsp='"+idsp+"' ", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
    });
    });
    client.query(" UPDATE shop SET gia_moi_san_pham = '"+gia+"' WHERE id= '"+idsp+"'", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
    res.redirect("../admin/listkm");
    });
  });
});
//----------------------sửa list khuyến mãi-------------------------------------
app.get("/admin/sua/:id", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var id = req.params.id;
    client.query("SELECT * FROM promotion WHERE id ='"+id+"'", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.render("sua.ejs", {sv:result.rows[0]});
    });
  });
});
app.post("/admin/sua", urlencodedParser, function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var  id = req.body.txt_id;
    var poster = req.body.txt_poster;
    var linknd = req.body.txt_linknd;
    var ngaykt = req.body.txt_ngaykt;
    client.query("UPDATE promotion SET poster ='"+poster+"', link_nd ='"+linknd+"', ngaykt ='"+ngaykt+"' WHERE id='"+id+"'  ", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
          res.redirect("../admin/listkm");
    });
  });
});

//----------------------xóa khuyến mãi------------------------------------------
app.get("/admin/xoa/:id", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var  id = req.params.id;
    client.query(" SELECT * FROM promotion WHERE id = '"+id+"' " , function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      var  a=result.rows[0].giatruoc;
      var  b=result.rows[0].idsp;
      client.query("UPDATE shop SET  gia_moi_san_pham ='"+a+"'WHERE id ='"+b+"' ", function(err, result){
        done();
        if(err){
          res.end();
          return console.error('error runing query', err);
        }
      });
    });

    client.query("DELETE FROM promotion WHERE id='"+id+"'  ", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.redirect("../../admin/listkm");
    });
  });
})
1
//-----------------------list quảng cáo-----------------------------------------
app.get("/admin/listqc", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM quangcao ORDER BY id ASC', function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.render("dsqc.ejs", {danhsach:result});
    });
  });
});

//---------------------thêm quảng cáo-------------------------------------------
app.get("/admin/themqc", function(req, res){
  res.render("themqc.ejs");
});
app.post("/admin/themqc", urlencodedParser, function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var img = req.body.txt_img;
    var link = req.body.txt_link;
    var a = req.body.txt_gia;
    client.query(" INSERT INTO quangcao(img, link) VALUES('"+img+"', '"+link+"')" , function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.redirect("../../admin/themqc");
    });
  });
});

//-----------------sửa quảng cáo------------------------------------------------
app.get("/admin/suaqc/:id", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var id = req.params.id;
    client.query("SELECT * FROM quangcao WHERE id ='"+id+"'", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.render("suaqc.ejs", {sv:result.rows[0]});
    });
  });
});
app.post("/admin/suaqc", urlencodedParser, function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var  id = req.body.txt_id;
    var img = req.body.txt_img;
    var link = req.body.txt_link;
    client.query("UPDATE quangcao SET img ='"+img+"', link ='"+link+"' WHERE id='"+id+"'  ", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
          res.redirect("../admin/listqc");
    });
  });
});

//-----------------------xóa quảng cáo------------------------------------------
app.get("/admin/xoaqc/:id", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var  id = req.params.id;

    client.query("DELETE FROM quangcao WHERE id='"+id+"'  ", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.redirect("../../admin/listqc");
    });
  });
})
