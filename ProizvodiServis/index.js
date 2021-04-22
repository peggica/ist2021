const { response } = require('express');
var express = require('express');
var proizvodi = require('proizvodi-modul');
var app = express();
const port = 3000;

app.use(express.urlencoded({ extended:false }));
app.use(express.json());

app.get('/',(request, response)=>{
    response.send("Server radi");
});

app.get('/sviproizvodi',(request, response)=>{
    response.send(proizvodi.sviProizvodi());
});

app.post('/dodajproizvod',(request, response)=>{
    proizvodi.addProizvod(request.body);
    response.end("OK");
})

app.get('/getproizvodbykategorija',(request, response)=>{
    response.send(proizvodi.getProizvodByKategorija(request.query["kategorija"]));
});

app.get('/getproizvod/:id',(request, response)=>{
    response.send(proizvodi.getProizvod(request.params["id"]));
});

app.delete('/deleteproizvod/:id',(request, response)=>{
    proizvodi.deleteProizvod(request.params["id"],request.body);
    response.end("OK");
});

app.post('/snimiakciju/:id',(request, response)=>{
    proizvodi.addAkcija(request.params["id"],request.body);
    response.end("OK");
})

app.post('/snimiizmene/:id',(request, response)=>{
    proizvodi.izmeniProizvod(request.params["id"],request.body);
    response.end("OK");
});

app.listen(port,() => {console.log(`server startovan na portu ${port}`)});