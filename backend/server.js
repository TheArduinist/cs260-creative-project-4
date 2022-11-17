const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const baseURL = "/api";
const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

async function main() {
    console.log("Connecting to Mongo...");
    await mongoose.connect(`mongodb://127.0.0.1:27017/riddles`);
    console.log("Success!");

    const riddleSchema = {
        riddle: String,
        answer: String,
        category: String
    };

    const Riddle = mongoose.model("riddle", riddleSchema);

    const categorySchema = {
        name: String
    };

    const Category = mongoose.model("category", categorySchema);
    
    app.get(`${baseURL}/riddles/:category`, async (req, res) => {
        res.send([...(await Riddle.find({ category: req.params.category }))]);
    });
    
    app.post(`${baseURL}/riddles`, async (req, res) => {
        await new Riddle(req.body).save();
        res.sendStatus(200);
    });
    
    app.delete(`${baseURL}/riddles/:id`, async (req, res) => {
        await Riddle.deleteOne({ _id: req.params.id });
        res.sendStatus(200);
    });

    app.get(`${baseURL}/categories`, async (req, res) => {
        res.send(await Category.find());
    });
    
    app.post(`${baseURL}/categories`, async (req, res) => {
        await new Category(req.body).save();
        res.sendStatus(200);
    });
    
    app.post(`${baseURL}/categories/:id`, async (req, res) => {
        await Category.updateOne({ _id: req.params.id }, req.body);
        res.sendStatus(200);
    });
    
    app.delete(`${baseURL}/categories/:id`, async (req, res) => {
        await Category.deleteOne({ _id: req.params.id });
        await Riddle.deleteMany({ category: req.params.id });
        res.sendStatus(200);
    });
    
    await app.listen(3000, () => console.log('Server listening on port 3000!'));
}

main().catch(console.error);