const req = require("express/lib/request");
const DataStore = require("nedb");
const bodyParser = require("body-parser");
var db = new DataStore();

    //URL 
const BASE_API_URL= "/api/v1";
const url_sergio = "/cryptocoin-stats";
const API_DOC_CC = "https://documenter.getpostman.com/view/19481690/UVyn1ycR";


module.exports = (app) => {
    console.log("Exporting Cryptocoin Stats API");
    
    
    

    app.use(bodyParser.json());

    // resource variable
    var cryptocoinstats = [
        {
            "country": "eeuu",
            "year": 2021,
            "ccelectr": 3894.83,
            "ccdemand": 14.92,
            "ccmining": 35.40
        },
        {
            "country": "eeuu",
            "year": 2020,
            "ccelectr": 3843.8,
            "ccdemand": 8.68,
            "ccmining": 10.41
        },
        {
            "country": "russia",
            "year": 2021,
            "ccelectr": 943.075,
            "ccdemand": 14.92,
            "ccmining": 11.23
        },
        {
            "country": "russia",
            "year": 2020,
            "ccelectr": 943.1,
            "ccdemand": 8.68,
            "ccmining": 7.16
        },
        {
            "country": "china",
            "year": 2021,
            "ccelectr": 6875.09,
            "ccdemand": 14.92,
            "ccmining": 43.98
        },
        {
            "country": "china",
            "year": 2020,
            "ccelectr": 6875.1,
            "ccdemand": 8.68,
            "ccmining": 53.27
        }

    ];

    

    db.insert(cryptocoinstats); //database initialized 
 
    // Redirect to POSTMAN
    app.get(BASE_API_URL + url_sergio +"/docs", (req,res) => {
        res.redirect(API_DOC_CC);
    });


    //Initial Load - Crypto
    app.get(BASE_API_URL + url_sergio + "/loadInitialData", (req,res)=> {
            db.remove({},{multi:true},function(err,data){
            });
            var cryptocoIni = [
            {
                "country": "eeuu",
                "year": 2021,
                "ccelectr": 3894.83,
                "ccdemand": 14.92,
                "ccmining": 35.40
            },
            {
                "country": "eeuu",
                "year": 2020,
                "ccelectr": 3843.8,
                "ccdemand": 8.68,
                "ccmining": 10.41
            },
            {
                "country": "russia",
                "year": 2021,
                "ccelectr": 943.075,
                "ccdemand": 14.92,
                "ccmining": 11.23
            },
            {
                "country": "russia",
                "year": 2020,
                "ccelectr": 943.1,
                "ccdemand": 8.68,
                "ccmining": 7.16
            },
            {
                "country": "china",
                "year": 2021,
                "ccelectr": 6875.09,
                "ccdemand": 14.92,
                "ccmining": 43.98
            },
            {
                "country": "china",
                "year": 2020,
                "ccelectr": 6875.1,
                "ccdemand": 8.68,
                "ccmining": 53.27
            }
    
        ];
            db.insert(cryptocoIni);
            res.send(JSON.stringify(cryptocoIni,null,2));
    });

    // GET - RESOURCE
    app.get(BASE_API_URL + url_sergio,(req,res)=>{
        db.find({}, function(err,docs){
            res.send(JSON.stringify(docs.map((c)=>{
                return {country : c.country, year : c.year, ccelectr : c.ccelectr, ccdemand : c.ccdemand, ccmining : c.ccdemand};
                // It is needed to do a map to the db so the 'id' doesn't show up
            }),null,2));
        });
        

    });

/*          ALTERNATIVE GET RESOURCE
    app.get(BASE_API_URL + url_sergio,(req,res)=>{
        var query = req.query;
        var dbInit = {};
        var offset = parseInt(query.offset);
        var limit = parseInt(query.limit);

        // PARSERS
        if(query.country) dbInit["country"] = query.country;
        if(query.year) dbInit["year"] = parseInt(query.year);
        if(query.ccelectr) dbInit["ccelectr"] = parseFloat(query.ccelectr);
        if(query.ccdemand) dbInit["ccdemand"] = parseFloat(query.ccdemand);
        if(query.ccmining) dbInit["ccmining"] = parseFloat(query.ccmining);

        // 1 --> regular order
        // -1 --> reverse order
        db.find(dbInit).sort({country:1,year:-1}).skip(offset).limit(limit).exec((error,cryptocoin)=>{
            cryptocoin.forEach((c)=>{
                delete c._id
            });

            res.send(JSON.stringify(cryptocoin,null,2));
            console.log("GET REQUEST have been sent.")

        });
 
    });
*/


    // GET - SUBREPOSITORY - COUNTRY
    app.get(BASE_API_URL + url_sergio + "/:country", (req, res)=>{ 
        var ccCountry = req.params.country;

        db.find({country : ccCountry},{_id:0}, function(err,data){
            if(err){
                console.error("ERROR GET"+err);
                res.sendStatus(500);
            } else {
                if(data.length != 0){
                    res.send(JSON.stringify(data,null,2));
                    res.status(200);
                } else {
                    console.error("Data not found");
                    res.status(404);
                    res.send("Data not found");
                    
                }
            }
        });

    });


    // GET - ELEMENT
    app.get(BASE_API_URL + url_sergio + "/:country/:year", (req, res)=>{
        var ccCountry = req.params.country;
        var ccYear = parseInt(req.params.year);

        db.find({country : ccCountry, year: ccYear}, {_id:0}, function(err,data){
            if(err){
                console.error("ERROR GET: "+err);
                res.sendStatus(500);
            } else {
                if(data.length != 0){
                    res.send(JSON.stringify(data,null,2));
                    res.status(200);
                } else{
                    console.error("Data not found");
                    res.status(404);
                    res.send("Data not found");
                    
                }
            }
        });

    });

    // POST - RESOURCE
    app.post(BASE_API_URL + url_sergio,(req,res)=>{
        
        cc_body = req.body;
        cc_country = req.body.country;
        cc_year = parseInt(req.body.year);

        db.find({country: cc_country, year: cc_year}, function(err,data){
            if(err){
                console.error("ERROR POST: "+err);
                res.sendStatus(500);
            } else {
                if(data.length == 0){
                    if(!cc_body.country || !cc_body.year || !cc_body.ccelectr || !cc_body.ccmining || !cc_body.ccdemand){
                        console.log("Data is missing or incorrect. Perhaps number of parameters is incorrect?");
                        return res.sendStatus(400);
                    } else {
                        db.insert(cc_body);
                        return res.status(201).send(JSON.stringify(cc_body,null,2));
                        // CANT SEPARATE "status" FROM "send" IN DIFFERENT LINES. CRASHES.
                    }
                } else {
                    console.log("Conflict");
                    res.sendStatus(409);
                 }
            }
        });
    });

    // POST - ELEMENT (405) 
    app.post(BASE_API_URL + url_sergio + "/:country/:year",(req,res)=>{
        res.sendStatus(405, "Unable to POST a element");
    });


    // DELETE - RESOURCE
    app.delete(BASE_API_URL + url_sergio, (req, res)=>{
        db.remove({},{multi:true}, function (err,dbRemoved){
            if(err || dbRemoved == 0){
                console.log("ERROR IN DELETING DB:"+err);
                res.sendStatus(500);
            } else{
                console.log("The database has been successfully removed.");
                res.sendStatus(200);
            }
        });
    });


    // DELETE - ELEMENT
    app.delete(BASE_API_URL + url_sergio+ "/:country/:year", (req, res)=>{
        var ccCountry = req.params.country;
        var ccYear = parseInt(req.params.year);

        db.remove({country : ccCountry, year : ccYear},{multi:true},function(err,data){
            if(err){
                console.error(err);
                res.sendStatus(500);
            } else if(data == 0){
                console.log("Data not found in database.");
                res.status(404);
            } else {
                console.log("DELETE REQUEST");
                res.status(200).send("All data with "+ccCountry+" and "+ccYear+" has been removed.")
            }
        });
        
        
    });

    // PUT - RESOURCE
    app.put(BASE_API_URL + url_sergio, (req,res)=>{
        res.sendStatus(405,"Unabe to PUT a resource list");
    });

    // PUT - SUBRESOURCE
    app.put(BASE_API_URL + url_sergio + "/:country", (req,res)=>{
        res.sendStatus(405,"UnabLe to PUT a resource list");
    });

    // PUT - ELEMENT
    app.put(BASE_API_URL + url_sergio + "/:country/:year", (req,res)=>{
        var cc_body = req.body;             // resource updated

        var ccCountry = req.params.country;
        var ccYear = parseInt(req.params.year);

        if(!cc_body.country || !cc_body.year || !cc_body.ccelectr || !cc_body.ccmining || !cc_body.ccdemand){
            console.log("Data is missing or incorrect");
            return res.sendStatus(400);
            // Un dato pasado con un PUT debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

        } else {
            db.update({$and: [{country:ccCountry},{year:ccYear}]}, {$set:cc_body},{},function(err,data){
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    if(data == 0){
                        console.log("Data not found");
                        res.sendStatus(404,"Data not found");
                    } else {
                        console.log("Data updated.");
                        res.sendStatus(200,"Element successfully updated.");
                    }
                }
            });
            
        }
    });

};






// ------------------------ CÓDIGO ANTES DE BASE DE DATOS ------------------------------ //

/*              
// GET - CONJUNTO
    app.get(BASE_API_URL + url_sergio,(req,res)=>{
        db.find({}, function(err,docs){
            console.log(JSON.stringify(docs,null,2));
            res.send(JSON.stringify(docs.map((c)=>{
                return {country : c.country};
            }),null,2));
        });
        

    });




    // GET - PAISES CONCRETOS
    app.get(BASE_API_URL + url_sergio + "/:country", (req, res)=>{
        var ccCountry = req.params.country;

        filteredCrypto = cryptocoinstats.filter((cryptocoinstats)=>{
            return (cryptocoinstats.country == ccCountry);
        });

        if(filteredCrypto == 0){
            res.sendStatus(404, "NOT FOUND");
        }else{
            res.status(200);
            res.send(JSON.stringify(filteredCrypto,null,2)); 

        }

    });

    // GET - AÑO CONCRETO
    app.get(BASE_API_URL + url_sergio + "?:year", (req, res)=>{
        var ccYear = req.params.year;

        filteredCrypto = cryptocoinstats.filter((cryptocoinstats)=>{
            return (cryptocoinstats.year == ccYear);
        });

        if(filteredCrypto == 0){
            res.sendStatus(404, "NOT FOUND");
        }else{
            res.status(200);
            res.send(JSON.stringify(filteredCrypto,null,2)); 

        }

    });



    // GET - ELEMENTO CONCRETO
    app.get(BASE_API_URL + url_sergio + "/:country/:year", (req, res)=>{
        var ccCountry = req.params.country;
        var ccYear = req.params.year;


        filteredCrypto = cryptocoinstats.filter((cryptocoinstats)=>{
            return (cryptocoinstats.country == ccCountry && cryptocoinstats.year == ccYear );
        });

        if(filteredCrypto == 0){
            res.sendStatus(404, "NOT FOUND");
        }else{
            res.status(200);
            res.send(JSON.stringify(filteredCrypto[0],null,2)); 
            //Por si acaso hay mas de 1 elemento (no debería)
            //se escoge el primero
        }

    });

    // POST - CONJUNTO
    app.post(BASE_API_URL + url_sergio,(req,res)=>{
        cc_body = req.body;
        cc_country = req.body.country;
        cc_year = req.body.year;

        if(!cc_body.country || !cc_body.year || !cc_body.ccelectr || !cc_body.ccmining || !cc_body.ccdemand){
            console.log("Data is missing or incorrect");
            return res.sendStatus(400);
            // Un dato pasado con un POST debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

        } else {
            for(var i = 0; i < cryptocoinstats.length; i++){
                if(cryptocoinstats[i].country == cc_country && cryptocoinstats[i].year == cc_year){
                    return res.sendStatus(409);
                }
            }
            cryptocoinstats.push(req.body);
            res.sendStatus(201, "CREATED");

        }
    });

    // POST - ELEMENTO 
    app.post(BASE_API_URL + url_sergio + "/:country/:year",(req,res)=>{
        res.sendStatus(405, "Unable to POST a element");
    });


    // DELETE - CONJUNTO
    app.delete(BASE_API_URL + url_sergio, (req, res)=>{
        cryptocoinstats = [];
        res.sendStatus(200, "OK");
    });


    // DELETE - ELEMENTO
    app.delete(BASE_API_URL + url_sergio+ "/:country/:year", (req, res)=>{
        var ccCountry = req.params.country;
        var ccYear = req.params.year;
        var cc_body = req.body;
        var antiguo_array = cryptocoinstats;

        cryptocoinstats = cryptocoinstats.filter((cryptocoinstats)=>{
            return (cryptocoinstats.country != ccCountry || cryptocoinstats.year != ccYear);
        });

        if(cryptocoinstats.length == antiguo_array.length){
            res.sendStatus(404);
        } else {
            res.sendStatus(200, "OK");
        }
        
        
    });

    // PUT - CONJUNTO
    app.put(BASE_API_URL + url_sergio, (req,res)=>{
        res.sendStatus(405,"Unabe to PUT a resource list");
    });

    // PUT - SUBCONJUNTO
    app.put(BASE_API_URL + url_sergio + "/:country", (req,res)=>{
        res.sendStatus(405,"Unabe to PUT a resource list");
    });

    // PUT - ELEMENTO CONCRETO
    app.put(BASE_API_URL + url_sergio + "/:country/:year", (req,res)=>{
        var cc_params = req.params;         // variable a actualizar
        var cc_body = req.body;             // recurso actualizado

        var ccCountry = req.params.country;
        var ccYear = req.params.year;

        if(!cc_body.country || !cc_body.year || !cc_body.ccelectr || !cc_body.ccmining || !cc_body.ccdemand){
            console.log("Data is missing or incorrect");
            return res.sendStatus(400);
            // Un dato pasado con un PUT debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

        } else {
            for(var i = 0; i < cryptocoinstats.length; i++){
                if(cryptocoinstats[i].country == ccCountry && cryptocoinstats[i].year == ccYear){
                    cryptocoinstats[i] = cc_body;
                    console.log(cryptocoinstats[i].body);
                    return res.sendStatus(200, "OK");
                }
            }
            res.sendStatus(404,"NOT FOUND");
            
        }
    });

*/