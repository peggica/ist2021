const express = require("express");
const fs = require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const port = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let procitajPogledZaNaziv = (naziv) => {
    return fs.readFileSync(path.join(__dirname+"/view/"+naziv+".html"),"utf-8")
}

app.get("/",(req,res)=>{
    res.send(procitajPogledZaNaziv("index"));
});

app.get("/sviproizvodi",(req,res)=>{
    axios.get('http://localhost:3000/sviproizvodi')
    .then(response => {
        let prikaz="";
        response.data.forEach(element => {
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.cena.iznos} ${element.cena.valuta}</td>
            <td>${element.tekstoglasa}</td><td>`;
            element.akcije.forEach(akcija=>{
                prikaz+=`${akcija.cena.iznos} ${akcija.cena.valuta} ${akcija.datumisteka}`;
            })
            prikaz+=`</td><td><a href="/izmeni/${element.id}">Izmeni</a></td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
        </tr>`;
        });
        
        res.send(procitajPogledZaNaziv("sviproizvodi").replace("#{data}",prikaz));
    })
    .catch(error => {
        console.log(error);
    });

});

app.post("/filtrirajproizvodezakategoriju",(req,res)=>{
    axios.get(`http://localhost:3000/getproizvodbykategorija?kategorija=${req.body.kategorija}`)
     .then(response=>{
         let prikaz="";
         response.data.forEach(element => {
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.cena.iznos} ${element.cena.valuta}</td>
            <td>${element.tekstoglasa}</td><td>`;
            element.akcije.forEach(akcija=>{
                prikaz+=`${akcija.cena.iznos} ${akcija.cena.valuta} ${akcija.datumisteka}`
            })
            prikaz+=`</td><td><a href="/izmeni/${element.id}">Izmeni</a></td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
        </tr>`;
         });

         res.send(procitajPogledZaNaziv("sviproizvodi").replace("#{data}",prikaz));
     })
});

app.get("/dodajproizvod",(req,res)=>{
    res.send(procitajPogledZaNaziv("formazadodavanje"));
});

app.get("/obrisi/:id",(req,res)=>{
    axios.delete(`http://localhost:3000/deleteproizvod/${req.params["id"]}`)
    res.redirect("/sviproizvodi");
})

app.post("/snimiproizvod",(req,res)=>{
    axios.post("http://localhost:3000/dodajproizvod",{
        kategorija:req.body.kategorija.value,
        iznos:req.body.cena,
        valuta:req.body.valuta.value,
        tekstoglasa:req.body.tekstoglasa,
        oznake:req.body.oznake,
        //dodati za sve
    })
    res.redirect("/sviproizvodi");
});

app.listen(port,()=>{console.log(`klijent na portu ${port}`)});