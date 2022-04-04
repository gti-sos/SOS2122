const req = require("express/lib/request");
const DataStore = require("nedb");
const bodyParser = require("body-parser");
var db = new DataStore();


//URLs
const BASE_API_URL= "/api/v1";
const url_javier = "/stsatellites-stats";
const javier_doc = "https://documenter.getpostman.com/view/20110246/UVyn2yXJ";


//----------------------------------------------------------------------------------------------------
module.exports = (app) => {
    console.log("Exporting Satellites Stats API");

    app.use(bodyParser.json());

    //Resource
    var satellitesIns = [
        { 
            "country": "eeuu", 
            "year": 2020 ,
            "quarter": "second", 
            "stlaunched": 529, 
            "storbit": 362, 
            "stdestroyed": 8 
        },
        {
            "country": "eeuu", 
            "year": 2020 ,
            "quarter": "third", 
            "stlaunched": 664, 
            "storbit": 441, 
            "stdestroyed": 14
        },
        {
            "country": "eeuu", 
            "year": 2021 ,
            "quarter": "first", 
            "stlaunched": 880, 
            "storbit": 652, 
            "stdestroyed": 58
        },
        {
            "country": "eeuu", 
            "year": 2021 ,
            "quarter": "second", 
            "stlaunched": 1610, 
            "storbit": 973, 
            "stdestroyed": 67
        },
        {
            "country": "eeuu", 
            "year": 2021 ,
            "quarter": "third", 
            "stlaunched": 1929, 
            "storbit": 1503, 
            "stdestroyed": 145
        }
    ];

    db.insert(satellitesIns); //database initialized 


    //POSTMAN
    app.get(BASE_API_URL + url_javier +"/docs", (req,res) => {
        res.redirect(javier_doc);
    });

    //Load inicial
    app.get(BASE_API_URL + url_javier + "/loadInitialData", (req, res)=>{
        db.remove({},{multi:true},function(err,data){
        });
        var satellitesIni = [
            { 
                "country": "eeuu", 
                "year": 2020 ,
                "quarter": "second", 
                "stlaunched": 529, 
                "storbit": 362, 
                "stdestroyed": 8 
            },
            {
                "country": "eeuu", 
                "year": 2020 ,
                "quarter": "third", 
                "stlaunched": 664, 
                "storbit": 441, 
                "stdestroyed": 14
            },
            {
                "country": "eeuu", 
                "year": 2021 ,
                "quarter": "first", 
                "stlaunched": 880, 
                "storbit": 652, 
                "stdestroyed": 58
            },
            {
                "country": "eeuu", 
                "year": 2021 ,
                "quarter": "second", 
                "stlaunched": 1610, 
                "storbit": 973, 
                "stdestroyed": 67
            },
            {
                "country": "eeuu", 
                "year": 2021 ,
                "quarter": "third", 
                "stlaunched": 1929, 
                "storbit": 1503, 
                "stdestroyed": 145
            }
        ];

        db.insert(satellitesIni);
        res.send(JSON.stringify(satellitesIni,null,2));
    });

    //GET 

    //Conjunto
    app.get(BASE_API_URL + url_javier, (req, res)=>{
        db.find({}, function(err,docs){
            res.send(JSON.stringify(docs.map((s)=>{
                return {country : s.country, year : s.year, quarter : s.quarter, stlaunched : s.stlaunched, storbit : s.storbit, stdestroyed : s.stdestroyed};
                // It is needed to do a map to the db so the 'id' doesn't show up
            }),null,2));
        });
        
    });

    //Elemento
    app.get(BASE_API_URL + url_javier + "/:country/:year/:quarter", (req, res)=>{
        var satYear = parseInt(req.params.year);
        var satCountry = req.params.country;
        var satQ = req.params.quarter;

        db.find({country : satCountry, year: satYear, quarter: satQ}, {_id:0}, function(err,data){
            console.log("0");
            if(err){
                console.log("1");
                console.error("ERROR GET: "+ err);
                res.sendStatus(500, "Internal Server Error");
            }else {
                console.log("2");
                if(data.length != 0){
                    console.log("3");
                    res.send(JSON.stringify(data,null,2));
                    res.status(200);
                } else{
                    console.log("4");
                    console.error("Data not found");
                    res.status(404);
                    res.send("Data not found");
                }
            }
        });

    });
    
    //POST

    //Conjunto
    app.post(BASE_API_URL + url_javier,(req, res)=>{
        satBody = req.body;
        satCountry = req.body.country;
        satYear = parseInt(req.body.year);
        satQ = req.body.quarter;

        db.find({country : satCountry, year: satYear, quarter: satQ}, function(err,data){
            console.log("1");
            if(err){
                console.error("ERROR POST: "+err);
                res.sendStatus(500, "Internal Server Error");
            }else{
                if(data.length == 0){
                    if(!satBody.country || !satBody.year || !satBody.quarter || !satBody.stlaunched || !satBody.storbit || !satBody.stdestroyed){
                        console.log("Data is missing or incorrect. Perhaps number of parameters is incorrect?");
                        return res.sendStatus(400, "Bad Request");
                    }else{
                        db.insert(satBody);
                        return res.status(201,"Created").send(JSON.stringify(satBody,null,2));
                        // CANT SEPARATE "status" FROM "send" IN DIFFERENT LINES. CRASHES.
                    }
                }else{
                    console.log("Conflict");
                    res.sendStatus(409,"Conflict");
                }
            }
        });
    });
    
    //Elemento
    app.post(BASE_API_URL + url_javier + "/:country/:year/:quarter",(req,res)=>{
        res.sendStatus(405, "Method not allowed");
    });

    //DELETE

    //Conjunto
    app.delete(BASE_API_URL + url_javier, (req, res)=>{
        db.remove({},{multi:true}, function (err, dbRemoved){
            if(err || dbRemoved == 0){
                console.log("ERROR IN DELETING DB:"+err);
                res.sendStatus(500, "Internal Server Error");
            }else{
                console.log("Database has been successfully removed");
                res.sendStatus(200, "Ok");
            }
        });
    });


    //Elemento
    app.delete(BASE_API_URL + url_javier + "/:country/:year/:quarter", (req, res)=>{
        var satC = req.body.country;
        var satY = parseInt(req.body.year);
        var satQt = req.body.quarter;

        db.remove({country : satC, year: satY, quarter: satQt},{multi:true}, function(err,data){
            console.log("0");
            if(err){
                console.log("1");
                res.sendStatus(500, "Internal Server Error");
            }else if(data == 0){
                console.log("2");
                res.status(404);
                res.send("Data not found");
            }else{
                console.log("3");
                res.sendStatus(200);
            }
        });
    });

    //PUT

    //Elemento
    app.put(BASE_API_URL + url_javier + "/:country/:year/:quarter", (req,res)=>{
        var satBody = req.body;             // recurso actualizado

        var satQ = req.params.quarter;
        var satCountry = req.params.country;
        var satYear = parseInt(req.params.year);

        if(!satBody.country || !satBody.year || !satBody.quarter || !satBody.stlaunched || !satBody.storbit || !satBody.stdestroyed){
            return res.sendStatus(400, "Bad Request");
            // Un dato pasado con un PUT debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

        } else {
            db.update({$and: [{country : satCountry}, {year: satYear}, {quarter: satQ}]}, {$set:satBody},{},function(err,data){
                if(err){
                    res.sendStatus(500, "Internal Server Error");
                }else{
                    if(data==0){
                        res.status(404);
                        res.send("Data not found");
                    }else{  
                        res.sendStatus(200, "OK");
                    }
                }
            });     
        }
    });

    //Conjuto
    //1
    app.put(BASE_API_URL + url_javier, (req,res)=>{
        res.sendStatus(405,"Unabe to PUT a resource list");
    });
    //2
    app.put(BASE_API_URL + url_javier + "/:country", (req,res)=>{
        res.sendStatus(405,"Unabe to PUT a resource list");
    });
    //3
    app.put(BASE_API_URL + url_javier + "/:country/:year", (req,res)=>{
        res.sendStatus(405,"Unabe to PUT a resource list");
    });
};



/*
//DELETE

//Conjunto
app.delete(BASE_API_URL + s, (req, res)=>{
    satellites = [];
    res.sendStatus(200, "OK");
});


//Elemento
app.delete(BASE_API_URL + s + "/:country/:year", (req, res)=>{
    var satYear = req.params.year;
    var satCoun = req.params.country;

    satellites = satellites.filter((satellite)=>{
        return (satellite.name != satYear || satellite.country != satCoun);
    });

    if(satellites_2.length == satellites){
        res.sendStatus(404, "Not Found");
    }else{
        res.sendStatus(200, "OK");
    }
});


//PUT

//Elemento

app.put(BASE_API_URL + s + "/:country/:year/:quarter", (req,res)=>{
    var cc_params = req.params;         // variable a actualizar
    var satBody = req.body;             // recurso actualizado

    var satQ = req.params.quarter;
    var satCountry = req.params.country;
    var satYear = req.params.year;

    if(!satBody.country || !satBody.year || !satBody.quarter || !satBody['st-launched'] || !satBody['st-orbit'] || !satBody['st-destroyed']){
        return res.sendStatus(400, "Bad Request");
        // Un dato pasado con un PUT debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

    } else {
        for(var i = 0; i < satellites.length; i++){
            if(satellites[i].country == satCountry && satellites[i].year == satYear && satellites[i].quarter ==satQ){
                satellites[i] = satBody;
                break;
            }
        }
        res.sendStatus(200, "OK");
    }
});

//Conjuto

app.put(BASE_API_URL + s, (req,res)=>{
    res.sendStatus(405,"Unabe to PUT a resource list");
});
}


//Load inicial
    app.get(BASE_API_URL + s + "/loadInitialData", (req, res)=>{
    var Sat = satellites.length;
    if(Sat == 0){
        satellites = satellites_2;
        res.redirect(BASE_API_URL + s);
    }else{
        res.sendStatus(409, "Conflict");
    }
*/