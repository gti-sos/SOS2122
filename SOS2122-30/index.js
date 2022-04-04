const cool = require("cool-ascii-faces");
const express = require("express");

//Para parsear el json
const bodyParser = require("body-parser");
const backend_crypto = require("./src/back/cryptocoins_stats/index");
const backend_td = require("./src/back/td-stats/index");
const backend_satellites = require("./src/back/stsatellites/index");

const app = express();
const port = process.env.PORT || 8080;

const BASE_API_URL= "/api/v1";
    

app.use(bodyParser.json());






//-----------------------------------------------------------------------------

app.use("/", express.static('public'));

backend_crypto(app); // FALTA POR IMPLEMENTAR LA BASE DE DATOS


backend_td(app);

backend_satellites(app);



app.get("/cool",(req,res)=>{
    console.log("Requested /cool route");
    res.send("<html><body><h1>"+cool()+"</h1></body></html>");
});

app.get("/time",(req,res)=>{
    console.log("Requested /time route");
    res.send("<html><body><h1>"+new Date()+"</h1></body></html>");
});

app.listen(port, () => {
    console.log(`Server TRULY ready at port ${port}`);
});

console.log(`Server ready at port ${port}`);

console.log(cool());