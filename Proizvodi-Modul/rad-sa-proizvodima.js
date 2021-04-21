const fs = require('fs');
const PATH = "proizvodi.json";

let procitajPodatkeIzFajla = () => {
    let proizvodi=fs.readFileSync(PATH, (err,data) => {
        if (err) throw err;
        return data;
    });
    return JSON.parse(proizvodi);
}

let snimiProizvode = (data) => {
    fs.writeFileSync(PATH,JSON.stringify(data));
}

exports.sviProizvodi = () => {
    return procitajPodatkeIzFajla();
}

exports.addProizvod = (noviProizvod) => {
    let id=1;
    let proizvodi=this.sviProizvodi();
    if(proizvodi.length>0){
        id=proizvodi[proizvodi.length-1].id+1;
    }
    noviProizvod.id=id;
    proizvodi.push(noviProizvod);
    snimiProizvode(proizvodi);
}

exports.addAkcija = (id,novaAkcija) => {
    proizvodi=this.sviProizvodi();
    proizvodi.forEach(proizvod => {
        if(proizvod.id==id){
            proizvod.akcije.push(novaAkcija);
        }
    });
    snimiProizvode(proizvodi);   
}

exports.deleteProizvod = (id) => {
    snimiProizvode(this.sviProizvodi().filter(proizvod=>proizvod.id!=id));
}

exports.getProizvod = (id) => {
    return this.sviProizvodi().find(x => x.id == id);
}

exports.getProizvodByKategorija = (kategorija) =>{
    return this.sviProizvodi().filter(proizvod=>proizvod.kategorija==kategorija);
}