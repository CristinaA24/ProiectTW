const express = require("express");
const fs = require("fs");

//etapa5
const{Client}=require("pg");
const sharp=require("sharp");
const ejs=require("ejs");
const sass=require("sass");
const formidable=require("formidable");
const {Utilizator}=require("./resources/js/utilizator.js");
const AccesBD=require("./resources/js/accessbd.js");

//etapa5
// var client= new Client({database:"proiect",
//         user:"cristina",
//         password:"parola",
//         host:"localhost",
//         port:5432});
// client.connect();

var instantaBD=AccesBD.getInstance({init:"local"});
var client=instantaBD.getClient();

instantaBD.select({campuri:["nume", "tarife"], tabel:"produse"}, function(err,rez){
    if(err)
    console.log(err);
    else
    console.log(rez);
})

app = express();
//app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");
app.use("/resources", express.static(__dirname+"/resources"));
app.get(["/","/index","/home"], function(req, res) {
    console.log("ceva");
    res.render("pages/index", {ip: req.ip, imagini:obGlobal.imagini});
});



//etapa5-se afiseaza pe server cand apelezi localhost:8080/produse
app.get("/produse", function(req, res){
    client.query("select * from produse", function(err, rez){
        if(err){
            console.log(err);
            renderError(res,2);}
        else
            res.render("pages/produse", {produse:rez.rows, optiuni:[]});
    });
});

app.get("/produse",function(req, res){
    console.log(req.query);
    client.query("select * from unnest(enum_range(null::eveniment)", function(err, rezEv){
        console.log(200)
        continuareQuery=""
        if (req.query.eveniment)
            continuareQuery+=` and veniment='${req.query.eveniment}'` //"tip='"+req.query.tip+"'"
        client.query("select * from produse where 1=1 " + continuareQuery , function( err, rez){
            console.log(300)
            if(err){
                console.log(err);
                renderError(res, 2);
            }
            else
                res.render("pages/produse", {produse:rez.rows, optiuni:rezEv.rows});
        });
    });
    console.log(100)
});


//etapa5-se afiseaza pe server cand apelezi localhost:8080/produs
app.get("/produs/:id", function(req, res){
    client.query("select * from produse where id="+req.params.id, function(err, rez){
        if(err){
            console.log(err);
            renderError(res,2);}
        else
            res.render("pages/produs", {prod:rez.rows[0]});
    });
});

obGlobal={
    erori:null,
    imagini:null
    
}
function createImages(){
    var continutFisier = fs.readFileSync(__dirname+ "/resources/json/galerie.json").toString("utf8");
    var continutObiect= JSON.parse(continutFisier);
    obGlobal.imagini = continutObiect.imagini;
    obGlobal.imagini.forEach(function(elem){
        elem.fisier= continutObiect.cale_galerie+"/"+elem.fisier;
    })
    //console.log(obErori.erori);
}
createImages();

function createErrors(){
    var continutFisier = fs.readFileSync(__dirname+ "/resources/json/erori.json").toString("utf8");
    obGlobal.erori = JSON.parse(continutFisier);
    //console.log(obErori.erori);
}
createErrors();

function renderError(res,identificator,titlu,text,imagine){
   var eroare = obGlobal.erori.info_erori.find(function(elem){
        return elem.identificator == identificator;
    })
    titlu = titlu || (eroare && eroare.titlu) || obGlobal.erori.eroare_default.titlu; 
    text = text || (eroare && eroare.text) || obGlobal.erori.eroare_default.text; 
    imagine = imagine || (eroare && obGlobal.erori.cale_baza+ "/"+ eroare.imagine) || obGlobal.erori.eroare_default.imagine; 
    if(eroare && eroare.status){
        res.status(eroare.identificator).render("pages/eroare", {titlu:titlu, text:text, imagine:imagine});
    }
    else {
        res.render("pages/eroare", {titlu:titlu, text:text, imagine:imagine});

    }
}

////////utilizatori

app.post("/inregistrare",function(req, res){
    var username;
    console.log("ceva");
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){//4
        console.log(campuriText);

        var eroare="";

        var utilizNou=new Utilizator();
        try{
            utilizNou.setareNume=campuriText.nume;
            utilizNou.setareUsername=campuriText.username;
            utilizNou.email=campuriText.email
            utilizNou.prenume=campuriText.prenume
            
            utilizNou.parola=campuriText.parola;
            utilizNou.culoare_chat=campuriText.culoare_chat
            utilizNou.salvareUtilizator();

        }
        catch(e){ eroare+=e.message;
            console.log(eroare);
        }
    


        if(!eroare){

            
        }
        else
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
    });
    formular.on("field", function(nume,val){  // 1 
	
        console.log(`--- ${nume}=${val}`);
		
        if(nume=="username")
            username=val;
    }) 
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
		
        console.log(nume,fisier);
		//TO DO in folderul poze_uploadate facem folder cu numele utilizatorului

    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    }); 
});




app.get("/*.ejs", function(req, res){
    renderError(res,403)

});


app.get("/*", function(req, res) {
    console.log("url: ", req.url);
    res.render("pages"+req.url, function(err,rezRandare){
        //console.log("Eroare", err);
        //console.log("Rezultat randare", rezRandare);

        if(err){
            if(err.message.includes("Failed to lookup view")){
                renderError(res,404,"Access denied");
            }
            else{

            }
        }
        else{
            res.send(rezRandare);
        }
    });
});


console.log("hello world");
app.listen(8080);
console.log("serverul a pornit");