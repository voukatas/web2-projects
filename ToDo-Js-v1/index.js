import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let work = [];
let everything_else = [];

// middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// routes
app.get("/",(req, res) => {
    console.log("request get section");
    res.render("index.ejs",{myArray:everything_else});
});

app.get("/work",(req, res) => {
    console.log("request get section");
    res.render("index.ejs", {isWork:true,myArray:work});
});

app.post("/", (req, res) => {
    const newItem = req.body["newItem"];
    const btnVal = req.body["list"];

    if (btnVal === "work"){
        work.push(newItem);
        res.render("index.ejs",{isWork:true,myArray:work});
    }else{
        everything_else.push(newItem);
        res.render("index.ejs",{myArray: everything_else});
    }

    console.log(everything_else);
    console.log(work);
    // console.log(newItem);
    // res.send("ok!");

});

// server start
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});