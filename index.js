require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

const port = process.env.PORT || 9000;


//middleware
app.use(cors());
app.use(express.json());


//Connect with mongoDB
const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const connectDB = async () => {
    try {
        await client.connect();

        const coffeeCollection = client.db("coffeeDB").collection("coffee");
        const userCollection = client.db("coffeeDB").collection("user");

        //GET all coffee
        app.get("/coffee", async (req, res) => {
            const coffee = await coffeeCollection.find().toArray();
            res.send(coffee);
        });


        //GET individual coffee
        app.get("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const coffee = await coffeeCollection.findOne(query);
            res.send(coffee);
        })

        //POST new coffee
        app.post("/add", async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        });


        //PUT a coffee
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const updatedCoffee = req.body;

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const newCoffee = {
                $set: {
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    supplier: updatedCoffee.supplier,
                    category: updatedCoffee.category,
                    photo: updatedCoffee.photo,
                    taste: updatedCoffee.taste,
                    details: updatedCoffee.details,
                    price: updatedCoffee.price
                }
            }

            const result = await coffeeCollection.updateOne(filter, newCoffee, options);
            res.send(result);
        })

        //DELETE a coffee
        app.delete("/delete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        });




        //User APIs
        app.post("/user", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })









        console.log("Connection with database established successfully!");
    }
    finally {

    }
}
connectDB().catch(console.dir)










app.get("/", (req, res) => {
    res.send("Server is running...")
});


app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
});