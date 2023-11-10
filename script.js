
class Bom {
  constructor(x,y){
    this.x = floor(random(18,raster.aantalRijen-3))*raster.celGrootte;
    this.y = floor(random(0,raster.aantalRijen-2))*raster.celGrootte;
    this.sprite = bom;
    this.snelheden = [0.25,0.5,1]
    this.stapGrootte = random(this.snelheden)*raster.celGrootte;
  }
  beweeg() {
    this.y += this.stapGrootte;
    if (this.y >= canvas.height-50 || this.y < 10) {
        this.stapGrootte *= -1;
    }
  }
  toon() {
    image(bom,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}
class Appel {
  constructor(x,y){
    this.x = floor(random(0,raster.aantalRijen))*raster.celGrootte;
    this.y = floor(random(0,raster.aantalRijen))*raster.celGrootte;
    this.sprite = appeltje;
    this.x = constrain(this.x,49,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }
  
   toon() {
    image(appeltje,this.x,this.y,raster.celGrootte,raster.celGrootte);
   }
}
class Raster {
  constructor(r,k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    for (var rij = 0;rij<this.aantalRijen;rij++) {
      for (var kolom = 0;kolom<this.aantalKolommen;kolom++) {
    if (rij == 6|| kolom == 0) {
      fill('orange');
      stroke('orange');
    }
    else {
      noFill();
      stroke('grey');
    }
      

        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      } 
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 0;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
    this.staOpBom = false; 
   
    this.opgestapteBom = null;
  }
  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }



  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    }
    else {
      return false;
    }
  }
  
  staatOp(bommenLijst) {
    for (var b = 0;b < bommenLijst.length;b++) {
      if (bommenLijst[b].x == this.x && bommenLijst[b].y == this.y) {
        this.staOpBom = true;
        this.opgestapteBom = b;
      }
    }
    return this.staOpBom;
    return this .opgestapteBom;
  }

  
  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,49,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
   bom = loadImage("images/sprites/bom_100px.png");

  appeltje = loadImage("images/sprites/appel_1.png")
}
var bommenArray = []; 
var levens = 3;

function setup() {
canvas = createCanvas(900,600);
canvas.parent();
frameRate(10);
textFont("Verdana");
textSize(1000);

raster = new Raster(12,18);
raster.berekenCelGrootte();
  for (var b = 0;b < 5;b++) {
    bommenArray.push(new Bom());
  
}
  appel = new Appel();
  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");  
}

function draw() {
background(brug);
raster.teken();
text("HP:" + levens,0, 25);
textSize(25);
  for (var b = 0;b < bommenArray.length;b++) {
    bommenArray[b].beweeg();
  }

  for (var b = 0;b < bommenArray.length;b++) {
    bommenArray[b].toon();
  }


   
    eve.beweeg();
    alice.beweeg();
    bob.beweeg();
    eve.toon();
    alice.toon();
    bob.toon();
    appel.toon();
   
  
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob)) {
    levens--;
  }
  if (eve.wordtGeraakt(appel)) {
    levens++;
    appel.x = 1000;
  }
  if (eve.staatOp(bommenArray)) {
    eve.staOpBom = false;
    levens--;
    bommenArray.splice(eve.opgestapteBom, 1)
  }
   if (levens == 0) {
      background('red');
      fill('white');
      text("Je hebt verloren!",300,300);
     textSize(100);
      noLoop();  }
    if (eve.gehaald) {
      background('green');
      fill('white');
      text("Je hebt gewonnen!",300,300);
      textSize(100);
      noLoop();
       
    }
}