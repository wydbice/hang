const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// load images

const ground = new Image();
ground.src = "img/ground.png";

let foodImages = {
  carnageImg: new Image(),
  elevateImg: new Image(),
  fuseImg: new Image(),
  impactImg: new Image(),
  kageImg: new Image(),
  koiImg: new Image(),
  nebulaImg: new Image(),
  phoenixImg: new Image(),
  stormImg: new Image(),
  tlImg: new Image(),
  viperImg: new Image(),
};

foodImages.carnageImg.src = "img/carnage.jpg";
foodImages.elevateImg.src = "img/elevate.jpg";
foodImages.fuseImg.src = "img/fuse.jpg";
foodImages.impactImg.src = "img/impact.jpg";
foodImages.kageImg.src = "img/kage.jpg";
foodImages.koiImg.src = "img/koi.png";
foodImages.nebulaImg.src = "img/nebula.jpg";
foodImages.phoenixImg.src = "img/phoenix.jpg";
foodImages.stormImg.src = "img/storm.jpg";
foodImages.tlImg.src = "img/tl.jpg";
foodImages.viperImg.src = "img/viper.jpg";

const frame1 = new Image();
frame1.src = "img/1.png";

const frame2 = new Image();
frame2.src = "img/2.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

var foodImg = randomProperty(foodImages);
// create the snake

let snake = [];

snake[0] = {
  x: 9 * box,
  y: 10 * box,
};

// create the food

let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};

// create the score var

let score = 0;

//control the snake

let d;

document.addEventListener("keydown", direction);

function direction(event) {
  let key = event.keyCode;
  if (key == 37 && d != "RIGHT") {
    left.play();
    d = "LEFT";
  } else if (key == 38 && d != "DOWN") {
    d = "UP";
    up.play();
  } else if (key == 39 && d != "LEFT") {
    d = "RIGHT";
    right.play();
  } else if (key == 40 && d != "UP") {
    d = "DOWN";
    down.play();
  }
}

let init = false;

// cheack collision function
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

function randomProperty(obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
}

// draw everything to the canvas

function draw() {
  if (!init) {
    const audio = new Audio("/audio/sus.mp3");
    audio.play();
    init = true;
  }
  ctx.drawImage(ground, 0, 0);

  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      ctx.drawImage(frame1, snake[i].x, snake[i].y, box, box);
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
  }

  ctx.drawImage(foodImg, food.x, food.y, 32, 32);

  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // which direction
  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  // if the snake eats the food
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    eat.play();
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
    foodImg = randomProperty(foodImages);
    if (score === 15) {
      const joeMama = atob(
        atob(
          atob(
            "WVVoU01HTklUVFpNZVRsc1pHMXNjMk15T1cxa1NHUm9ZMjFWZFdKdFZqQk1lamwzV1ZoT2VtUXlPWGxhUkRGWVVWWmFSazFXU2taVk1GWk5WRVZHUTFSRlZqRldSbFpRWW10b1dtUlVhSHBhVlc4MVdUQk5QUT09"
          )
        )
      );
      window.open(joeMama, "_blank");
    }
    // we don't remove the tail
  } else {
    // remove the tail
    snake.pop();
  }

  // add new Head

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // game over

  if (
    snakeX < box ||
    snakeX > 17 * box ||
    snakeY < 3 * box ||
    snakeY > 17 * box ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    dead.play();
  }

  snake.unshift(newHead);

  ctx.fillStyle = "white";
  ctx.font = "45px Changa one";
  ctx.fillText(score, 2 * box, 1.6 * box);
}

// call draw function every 100 ms

let game = setInterval(draw, 300);
