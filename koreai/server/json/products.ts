const faker = require('faker');

const products:any = [];
for (var i = 1; i <= 200; i++) {
  products.push({
    _id: i,
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(),
    price: faker.commerce.price(100, 999, 2),
    imageUrl: 'https://source.unsplash.com/1600x900/?product',
    quantity: faker.datatype.number(),
  });
}

module.exports = products;
