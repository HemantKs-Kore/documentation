//Documentation: https://www.npmjs.com/package/faker
var faker = require('faker');
var products = require('./json/products');
// var countries = require('./json/countries');
// var states = require('./json/states');
// var cities = require('./json/cities');

var database = {
  products,
};



console.log(JSON.stringify(database));
