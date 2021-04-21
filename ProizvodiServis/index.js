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

app.delete('/deleteproizvod/:id',(request, response)=>{
    proizvodi.deleteProizvod(request.params["id"]);
    response.end("OK");
});

app.listen(port,() => {console.log(`server startovan na portu ${port}`)});