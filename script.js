let canvas;
let brug;
let raster;
let eve;
let alice;
let bob;
let powerUp;
let invincibilityPowerUp;
let powerUpMessage = "";
let lastPowerUpTime = 0;
let powerUpInterval = 10000; // 10 seconds
let messageTimer = 0; // Timer for displaying power-up message
const messageDuration = 5000; // 5 seconds

class Raster {
  constructor(r, k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    for (let rij = 0; rij < this.aantalRijen; rij++) {
      for (let kolom = 0; kolom < this.aantalKolommen; kolom++) {
        rect(
          kolom * this.celGrootte,
          rij * this.celGrootte,
          this.celGrootte,
          this.celGrootte
        );
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer = 3;
    this.stapGrootte = null;
    this.gehaald = false;
    this.invincible = false;
  }

  beweeg() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x, 0, canvas.width);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    } else {
      return false;
    }
  }

  toon() {
    image(
      this.animatie[this.frameNummer],
      this.x,
      this.y,
      raster.celGrootte,
      raster.celGrootte
    );
  }
}

class Vijand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  }

  toon() {
    image(
      this.sprite,
      this.x,
      this.y,
      raster.celGrootte,
      raster.celGrootte
    );
  }
}

class PowerUp {
  constructor() {
    const gridX = floor(random(raster.aantalKolommen));
    const gridY = floor(random(raster.aantalRijen));
    this.x = gridX * raster.celGrootte;
    this.y = gridY * raster.celGrootte;
    this.active = true;
    this.radius = 30;
    this.color = color(255, 255, 0);
    this.collected = false;
    this.name = "Power Up"; // Name of the power-up
  }

  collect(jos) {
    const distance = dist(this.x, this.y, jos.x, jos.y);
    if (distance < this.radius && !this.collected) {
      this.collected = true;
      this.applyEffect(jos);
      powerUpMessage = `${this.name} Collected!`; // Display the power-up name in the message
      // Start the message timer
      messageTimer = messageDuration;
    }
  }

  applyEffect(jos) {
    jos.stapGrootte += 1; // Increase step size
  }

  draw() {
    if (!this.collected) {
      noStroke();
      fill(this.color);
      ellipse(
        this.x + raster.celGrootte / 2,
        this.y + raster.celGrootte / 2,
        this.radius * 2
      );
    }
  }
}

class InvincibilityPowerUp extends PowerUp {
  constructor(existingPowerUp) {
    super();
    do {
      const gridX = floor(random(raster.aantalKolommen));
      const gridY = floor(random(raster.aantalRijen));
      this.x = gridX * raster.celGrootte;
      this.y = gridY * raster.celGrootte;
    } while (
      dist(this.x, this.y, existingPowerUp.x, existingPowerUp.y) < this.radius
    );

    this.color = color(255, 0, 0); // Red color for invincibility power-up
    this.name = "Invincibility Power Up"; // Name of the invincibility power-up
  }

  applyEffect(jos) {
    jos.invincible = true;
    setTimeout(() => {
      jos.invincible = false;
      this.active = false;
    }, 5000); // 5000 milliseconds (5 seconds) of invincibility
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900, 600);
  canvas.parent();
  frameRate(5); // Decreased frame rate to 5
  textFont("Verdana");
  textSize(90);

  raster = new Raster(6, 9);
  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = 1 * raster.celGrootte;
  for (let b = 0; b < 6; b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700, 200);
  alice.stapGrootte = 1 * eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600, 400);
  bob.stapGrootte = 1 * eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  // Create the initial power-up
  powerUp = new PowerUp();

  // Create the invincibility power-up while avoiding collisions with the initial power-up
  invincibilityPowerUp = new InvincibilityPowerUp(powerUp);
}

function draw() {
  background(brug);
  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  powerUp.draw();
  invincibilityPowerUp.draw();

  // Decrement messageTimer and hide the message when it reaches 0
  if (messageTimer > 0) {
    messageTimer -= deltaTime;
    if (messageTimer <= 0) {
      powerUpMessage = ""; // Clear the message
    }
  }

  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob)) {
    noLoop();
  }

  if (eve.gehaald) {
    background('green');
    fill('white');
    text("Je hebt gewonnen!", 30, 300);
    noLoop();
  }
}
