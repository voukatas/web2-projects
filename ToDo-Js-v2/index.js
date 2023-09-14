import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';


const app = express();
const port = 3000;

//let work = [];
let defaultItems = [];

// Define the Mongoose schema and model outside db_int() so that they are accessible in your routes
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "No name specified"]
  }
});

const Item = mongoose.model("Item", itemSchema);

async function db_int() {
  await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

  const count = await Item.countDocuments();

  if (count === 0) {
    const item1 = new Item({
      name: "Item 1"
    });

    const item2 = new Item({
      name: "Item 2"
    });

    const item3 = new Item({
      name: "Item 3"
    });

    await Item.insertMany([item1, item2, item3]);
    console.log("All items were entered in the DB");
  } else {
    console.log("Items already exist in the DB, skipping insert.");
  }

  // Close the MongoDB connection, in a web server you never close the connection
  // mongoose.connection.close();
}


db_int().catch(console.error);

// middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", async (req, res) => {
  console.log("request get section");
  try {
    const items = await Item.find({});//in case you don't want to have also the _id use this ,'name -_id'
    console.log("All items:", items);
    res.render("index.ejs", { myArray: items });

  } catch (err) {
    res.status(500).send('Something broke!')
    console.log(err);
  }
});

app.post("/", async (req, res) => {
  const newItem = req.body["newItem"];
  // const btnVal = req.body["list"];

  const item = new Item({
    name: newItem
  });

  try {
    await item.save();
    res.redirect("/");

  } catch (err) {
    res.status(500).send('Something broke!')
    console.log(err);
  }

});

app.post("/delete", async (req, res) => {
  const itemForDeletion = req.body["checkbox"];
  console.log(`Deletion item is: ${itemForDeletion}`);
  try {
    const deletedItem = await Item.findByIdAndRemove(itemForDeletion);

    //	await Item.deleteOne({_id: itemForDeletion}) 
    res.redirect("/");

  } catch (err) {
    res.status(500).send('Something broke!')
    console.log(err);
  }


});
// server start
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
