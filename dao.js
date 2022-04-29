

const os      = require('os');
const path    = require('path');
const sqlite3 = require('sqlite3');

const dbfile  = 'Database/Models_R_US.db';
const db      = new (sqlite3.verbose()).Database(dbfile);
const GET_ALL_ID = 'SELECT * FROM Category';
const GET_CATEGORY = 'SELECT id, catid, name, description, cost FROM product where catid = ?';
const GET_PRODUCT = 'SELECT id, catid, name, description, cost FROM product where id = ?';
const GET_ID = 'SELECT id, name FROM Category where id = ?';
const { get } = require('http');


module.exports = {

    getCategory(id, success){
        db.all(GET_CATEGORY, [id], (err, rows) => {
            if (err) {
              throw err;
            }
            success(rows);
          });
    },

    getProduct(id, success){
        db.all(GET_PRODUCT, [id], (err, rows) => {
            if (err) {
              throw err;
            }
            success(rows);
          });
    },

    getAllCatalog(success) {
      db.all(GET_ALL_ID, [], (err, rows) => {
        if (err) {
          throw err;
        }
        success(rows);
      });
    },
  
    getCatalog(id, success) {
      db.all(GET_ID, [id], (err, rows) => {
        if (err) {
          throw err;
        }
        success(rows);
      });
    }

    
};
