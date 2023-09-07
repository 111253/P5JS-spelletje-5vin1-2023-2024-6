var x = 50;
var y = 50;

function setup() {
  canvas = createCanvas(1000,400);
  textFont("Verdana");
  textSize(14);
  noStroke();
  frameRate(50);
}

function draw() {
  background('olive');
  
  if (keyIsDown(LEFT_ARROW)) {
    x -= 5;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    x += 5;
  }
  if (keyIsDown(UP_ARROW)) {
    y -= 5;
  }
  if (keyIsDown(DOWN_ARROW)) {
    y += 5;
  }
  x = constrain(x,0,width - 100);
  y = constrain(y,0,height - 100); //zorgt ervoor dat je niet uit het canvas kan


  

  if (x >= 700 && x <= 875 && y >= 75 && y <= 225) { // omdat het blokje zich dan op dezelfde y positie bevind
    fill('chartreuse');
  }
  else {
    fill('darkkhaki');
  }
  
  
  rect(800,175,75,50);
  
  fill('moccasin');
  rect(x,y,100,100);   
}