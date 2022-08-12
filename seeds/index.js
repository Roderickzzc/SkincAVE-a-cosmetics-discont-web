
const mongoose = require('mongoose');
const Product = require('../models/product');
const productData = require('./productData')

mongoose.connect('mongodb://localhost:27017/skin-cave')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Product.deleteMany({});
    for (let i = 0; i < productData.length; i++) {
        const c = new Product({
            author: '62ed8941936d9792f8266a19',
            name: `${productData[i].name}`,
            // image: 'https://www.esteelauder.com/media/export/cms/products/640x640/el_sku_PG5001_640x640_0.jpg',
            brand: `${productData[i].brand}`,
            category: `${productData[i].category}`,
            originPrice: `${productData[i].originPrice}`,
            ml: `${productData[i].ml}`,
            lowestPrice: `${productData[i].lowestPrice}`,
            lowestPerMl: `${productData[i].lowestPerMl}`,
            description: "dadadada",
            image: [
                {
                    url: 'https://res.cloudinary.com/dx46c6r7s/image/upload/v1660025831/yuijsze0lt0ykzmmfr4g.png',
                    filename: 'SkincAVE/ymfv3vkvyjiz4pnv3udd'

                },
                {
                    url: 'https://res.cloudinary.com/dx46c6r7s/image/upload/v1660024785/dfzxusklvavxfp0xzivs.jpg',
                    filename: 'SkincAVE/gvah7wjyefjw9mobv3ga'
                }
            ]
        });
        await c.save();
    }

}


seedDB().then(() => {
    mongoose.connection.close();
})

