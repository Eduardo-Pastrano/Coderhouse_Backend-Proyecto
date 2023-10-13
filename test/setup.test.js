import mongoose from "mongoose";

before(async () => {
    await mongoose.connect('mongodb+srv://epastranom:coder123456@ecommerce.ycqslwp.mongodb.net/testing?retryWrites=true&w=majority')
})

after(async () => {
    mongoose.connection.close();
})