const req = require("express/lib/request");
const DataStore = require("nedb");
const bodyParser = require("body-parser");
var db = new DataStore();

const BASE_API_URL= "/api/v1";
const url_jaime = "/technology_devices_stats";
const jaime_URL_API = "https://documenter.getpostman.com/view/19584746/UVyoUwqe";

module.exports = (app) => {
    console.log("Exporting Technology Devices Stats")

    app.use(bodyParser.json());
    

    var technology_devices_stats = [
        {
            "country": "EEUU",
            "year": 2019,
            "tdwasted": 6918,
            "mpdisuse": 220,
            "mpreused": 74
        },
        {
            "country": "Spain",
            "year": 2019,
            "tdwasted": 1450,
            "mpdisuse": 45.4,
            "mpreused": 89
        },
        {
            "country": "UK",
            "year": 2019,
            "tdwasted": 2695,
            "mpdisuse": 83.1,
            "mpreused": 83
        },
        {
            "country": "Germany",
            "year": 2019,
            "tdwasted": 2549,
            "mpdisuse": 84.7,
            "mpreused": 84
        },
        {
            "country": "France",
            "year": 2019,
            "tdwasted": 2129,
            "mpdisuse": 66.4,
            "mpreused": 76
        },
        {
            "country": "Canada",
            "year": 2019,
            "tdwasted": 739,
            "mpdisuse": 22.5,
            "mpreused": 70
        }

    ];

    db.insert(technology_devices_stats);

    /***/
    app.get(BASE_API_URL + url_jaime +"/docs", (req,res) => {
        res.redirect(jaime_URL_API);
    });


    //LOAD INICIAL
    app.get(BASE_API_URL + url_jaime + "/loadInitialData", (req,res)=>{
        db.remove({},{multi:true},function(err,data){
        });
        var technology_devices_stats = [
            {
                "country": "EEUU",
                "year": 2019,
                "tdwasted": 6918,
                "mpdisuse": 220,
                "mpreused": 74
            },
            {
                "country": "Spain",
                "year": 2019,
                "tdwasted": 1450,
                "mpdisuse": 45.4,
                "mpreused": 89
            },
            {
                "country": "UK",
                "year": 2019,
                "tdwasted": 2695,
                "mpdisuse": 83.1,
                "mpreused": 83
            },
            {
                "country": "Germany",
                "year": 2019,
                "tdwasted": 2549,
                "mpdisuse": 84.7,
                "mpreused": 84
            },
            {
                "country": "France",
                "year": 2019,
                "tdwasted": 2129,
                "mpdisuse": 66.4,
                "mpreused": 76
            },
            {
                "country": "Canada",
                "year": 2019,
                "tdwasted": 739,
                "mpdisuse": 22.5,
                "mpreused": 70
            }
    
        ];
        db.insert(technology_devices_stats);
        res.send(JSON.stringify(technology_devices_stats,null,2));
    });

    //GET 

    //Conjunto
    app.get(BASE_API_URL + url_jaime,(req,res)=>{
        db.find({}, function(err,docs){
            res.send(JSON.stringify(docs.map((m)=>{
                return {country : m.country, year : m.year, tdwasted : m.tdwasted, mpdisuse : m.mpdisuse, mpreused : m.mpreused};
            }),null,2));
        });
    });

    //Elemento
    app.get(BASE_API_URL + url_jaime + "/:country/:year", (req, res)=>{
        var tdYear = parseInt(req.params.year);
        var tdCountry = req.params.country;


        db.find({country : tdCountry, year: tdYear}, {_id:0}, function(err,data){
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
    app.post(BASE_API_URL + url_jaime,(req, res)=>{
        tdBody = req.body;
        tdCountry = req.body.country;
        tdYear = parseInt(req.body.year);
        

        db.find({country : tdCountry, year: tdYear}, function(err,data){
            console.log("1");
            if(err){
                console.error("ERROR POST: "+err);
                res.sendStatus(500, "Internal Server Error");
            }else{
                if(data.length == 0){
                    if(!tdBody.country || !tdBody.year || !tdBody.tdwasted || !tdBody.mpdisuse || !tdBody.mpreused){
                        console.log("Data is missing or incorrect.");
                        return res.sendStatus(400, "Bad Request");
                    }else{
                        db.insert(tdBody);
                        return res.status(201,"Created").send(JSON.stringify(tdBody,null,2));
                        
                    }
                }else{
                    console.log("Conflict");
                    res.sendStatus(409,"Conflict");
                }
            }
        });
    });


    //Elemento
    app.post(BASE_API_URL + url_jaime + "/:country/:year",(req,res)=>{

        res.sendStatus(405, "Method not allowed");

    });


    //DELETE

    //Conjunto
    app.delete(BASE_API_URL + url_jaime, (req, res)=>{
        db.remove({},{multi:true}, function (err, dbRemoved){
            if(err || dbRemoved == 0){
                console.log("ERROR IN DELETING DB:"+err);
                res.sendStatus(500, "Internal Server Error");
            }else{
                console.log("Successfully removed");
                res.sendStatus(200, "Ok");
            }
        });
    });


    //Elemento
    app.delete(BASE_API_URL + url_jaime+ "/:country/:year", (req, res)=>{
        var tdCountry = req.body.country;
        var tdYear = parseInt(req.body.year);
        

        db.remove({country : tdCountry, year: tdYear},{multi:true}, function(err,data){
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

    //CONJUNTO
    app.put(BASE_API_URL + url_jaime, (req,res)=>{
        res.sendStatus(405,"Unabe to PUT a resource list");
    });

    //ELEMENTO

    app.put(BASE_API_URL + url_jaime + "/:country/:year", (req,res)=>{
        var td_params = req.params;         
        var td_body = req.body;

        var tdCountry = td_params.country;
        var tdYear = parseInt(td_params.year);

        if(!td_body.country || !td_body.year || !td_body.tdwasted || !td_body.mpdisuse || !td_body.mpreused){
            console.log("Data is missing or incorrect");
            return res.sendStatus(400);
            

        } else {
            db.update({$and: [{country : tdCountry}, {year: tdYear}]}, {$set:td_body},
                function(err,data){
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



    };

    /*
    //LOAD INICIAL
    app.get(BASE_API_URL + url_jaime + "/loadInitialData", (req,res)=>{
        var td =  technology_devices_stats.length;
        if (td == 0){
            technology_devices_stats = technology_devices_stats2;
            res.redirect(BASE_API_URL + url_jaime);
        } else{
            res.sendStatus(409, "Conflict");
        }
    });

    //GET 

    //Conjunto
    app.get(BASE_API_URL + url_jaime,(req,res)=>{
        res.send(JSON.stringify(technology_devices_stats,null,2));

    });

    //Elemento
    app.get(BASE_API_URL + url_jaime + "/:country", (req, res)=>{
        var tdCountry = req.params.country;
        
        
        filteredTD = technology_devices_stats.filter((technology_devices_stats)=>{
            return(technology_devices_stats.country == tdCountry);
        });
        if(filteredTD == 0){
            res.sendStatus(404, "NOT FOUND");
        }else{
            res.status(200);
            res.send(JSON.stringify(filteredTD,null,2)); 
        }
    });


    //POST

    //Conjunto
    app.post(BASE_API_URL + url_jaime, (req,res)=>{
        tdBody = req.body;
        td_Country = req.body.country;
        td_Year = req.body.year;
        if(!tdBody.country || !tdBody.year || !tdBody.tdwasted || !tdBody.mpdisuse || !tdBody.mpreused){
            console.log("Data is missing or incorrect");
            return res.sendStatus(400);
        }else {
            for(var i = 0; i < technology_devices_stats.length; i++){
                if(technology_devices_stats[i].country == td_Country && technology_devices_stats[i].year == td_Year){
                    return res.sendStatus(409);
                }
            }
            technology_devices_stats.push(tdBody);
            res.sendStatus(201, "CREATED");

        }
    });


    //Elemento
    app.post(BASE_API_URL + url_jaime + "/:country/:year",(req,res)=>{

        res.sendStatus(405, "Method not allowed");

    });


    //DELETE

    //Conjunto
    app.delete(BASE_API_URL + url_jaime, (req, res)=>{
        technology_devices_stats = [];
        res.sendStatus(200, "OK");
    });


    //Elemento
    app.delete(BASE_API_URL + url_jaime+ "/:country/:year", (req, res)=>{
        var tdCountry = req.params.country;
        var tdYear = req.params.year;
        

        technology_devices_stats = technology_devices_stats.filter((td)=>{
            return (td.name != tdYear || td.country != tdCountry);
        });

        if(technology_devices_stats2.length == technology_devices_stats){
            res.sendStatus(404, "NOT FOUND");
        } else {
            res.sendStatus(200, "OK");
        }
        
        
    });


    //PUT

    //CONJUNTO
    app.put(BASE_API_URL + url_jaime, (req,res)=>{
        res.sendStatus(405,"Unabe to PUT a resource list");
    });

    //ELEMENTO

    app.put(BASE_API_URL + url_jaime + "/:country/:year", (req,res)=>{
        var td_params = req.params;         
        var td_body = req.body;

        var tdCountry = td_params.country;
        var tdYear = td_params.year;

        if(!td_body.country || !td_body.year || !td_body.tdwasted || !td_body.mpdisuse || !td_body.mpreused){
            console.log("Data is missing or incorrect");
            return res.sendStatus(400);
            

        } else {
            for(var i = 0; i < technology_devices_stats.length; i++){
                if(technology_devices_stats[i].country == tdCountry && technology_devices_stats[i].year == tdYear){
                    technology_devices_stats[i] = td_body;
                    console.log(technology_devices_stats[i].body);
                    break;
                }
            }
            res.sendStatus(200, "OK");
        }
    }); 
    */