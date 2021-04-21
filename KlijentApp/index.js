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
            let oznake="";
            element.oznake.forEach(oznaka=>{
                oznake+=`${oznaka} `
            })
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.cena.iznos} ${element.cena.valuta}</td>
            <td>${element.tekstoglasa}</td>
            <td>${oznake}</td>
            <td>`;
            if(element.akcije.length!=0){
                element.akcije.forEach(akcija=>{
                    prikaz+=`${akcija.cena.iznos} ${akcija.cena.valuta} ${akcija.datumisteka}<br>`;
                })
            }
            prikaz+=`</td><td><a href="/dodajakciju/${element.id}">Dodaj akciju</a></td>
            </td><td><a href="/izmeni/${element.id}">Izmeni</a></td>
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
            let oznake="";
            element.oznake.forEach(oznaka=>{
                oznake+=`${oznaka} `
            })
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.cena.iznos} ${element.cena.valuta}</td>
            <td>${element.tekstoglasa}</td>
            <td>${oznake}</td>
            <td>`;
            if(element.akcije.length!=0){
                element.akcije.forEach(akcija=>{
                    prikaz+=`${akcija.cena.iznos} ${akcija.cena.valuta} ${akcija.datumisteka}<br>`;
                })
            }
            prikaz+=`</td><td><a href="/dodajakciju/${element.id}">Dodaj akciju</a></td>
            </td><td><a href="/izmeni/${element.id}">Izmeni</a></td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
        </tr>`;
         });

         res.send(procitajPogledZaNaziv("sviproizvodi").replace("#{data}",prikaz));
     })
});

app.get("/dodajproizvod",(req,res)=>{
    res.send(procitajPogledZaNaziv("formazadodavanje"));
});

app.get("/dodajakciju/:id",(request,response)=>{
    axios.get(`http://localhost:3000/getproizvod/${request.params["id"]}`)
    .then(res=>{
        oznake="";
        res.data.oznake.forEach(oznaka=>{
            oznake+=`${oznaka} `;
        });
        let dataproizvod=`<td>${res.data.id}</td> <td>${res.data.kategorija}</td> <td>${res.data.cena.iznos} ${res.data.cena.valuta}</td> <td>${res.data.tekstoglasa}</td> <td>${oznake}</td>`
        let dataakcija=``;
        res.data.akcije.forEach(akcija=>{
           dataakcija+=`<tr><td>${akcija.cena.iznos} ${akcija.cena.valuta}</td> <td>${akcija.datumisteka}</td></tr>`
        })
        let urldata=`/snimiakciju/${request.params["id"]}`;
    response.send(procitajPogledZaNaziv("dodajakciju").replace("#{dataproizvod}",dataproizvod).replace("#{dataakcija}",dataakcija).replace("$[urldata]",urldata));
    })
    .catch(error => {
        console.log(error);
    });
});

app.post("/snimiakciju/:id",(req,res)=>{
    console.log(req.body);
    axios.post(`http://localhost:3000/snimiakciju/${req.params["id"]}`,{
            cena:{valuta:req.body.valuta,iznos:req.body.iznos},
            datumisteka:req.body.datum}
    )
    res.redirect("/sviproizvodi");
});

app.get("/obrisi/:id",(req,res)=>{
    axios.delete(`http://localhost:3000/deleteproizvod/${req.params["id"]}`)
    res.redirect("/sviproizvodi");
});

app.post("/snimiproizvod",(req,res)=>{
    let oznake=req.body.oznake.split(' ');
    axios.post(`http://localhost:3000/dodajproizvod`,{
        kategorija:req.body.kategorija,
        cena:{valuta:req.body.valuta,iznos:req.body.iznos},
        tekstoglasa:req.body.tekstoglasa,
        oznake:oznake,
        akcije:[]
    })
    .catch(error => {
        console.log(error);
    });
    res.redirect("/sviproizvodi");
});

app.listen(port,()=>{console.log(`klijent na portu ${port}`)});