const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height= 700;

let x = canvas.width;
let y = canvas.height;
let player, bullet, enemy, rock;
let playerX = (x / 2) - 24;
let playerY = canvas.height - 58;
let score = 0;
let gameover = false;

let left = false;
let right = false;
let up = false;
let down = false;

const bulletList = [];
const enemyList = [];
const rockList = [];

const loadImg = () => {
  player = new Image();
  player.src = "assets/img/player01.png";

  bullet = new Image();
  bullet.src = "assets/img/bullet01.png";

  enemy = new Image();
  enemy.src = "assets/img/enemy.png";

  rock = new Image();
  rock.src = "assets/img/rock.png";
}

const render = () => {
  ctx.clearRect(0, 0, x, y);
  ctx.drawImage(player, playerX, playerY);
  
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive){
      ctx.drawImage(bullet, bulletList[i].x, bulletList[i].y);
    }
  }
  
  for (let k = 0; k < enemyList.length; k++){
    ctx.drawImage(enemy, enemyList[k].x, enemyList[k].y);
  }

  for (let r = 0; r < rockList.length; r++) {
    ctx.drawImage(rock, rockList[r].x, rockList[r].y);
  }
}

const generateX = (img) => {
  let num = Math.floor(Math.random() * (x - img.width));
/*   let direction = 1;

  num += (65 * direction);
  if (num > x - enemy.width * 2) {
    direction = -1;
  }
  if (num < enemy.width){
    direction = 1;
  } */
  return num;
}


class RockValue {
  x = 0;
  y = 0;
  
  init() {
    this.x = generateX(rock);
    this.y = -rock.height;
    
    rockList.push(this);
  }

  checkRockHit() {
    for (let r = 0; r < rockList.length; r++){
      if ((this.y + rock.height) === playerX) {
        gameover = true;
      }
    }
  }
}

const createRock = () => {
  const interval = setInterval( function() {
    let eachRock = new RockValue();
    eachRock.init();
  }, 3000);
  console.log(rockList);
}

class EnemyValue {
  x = 0;
  y = 0;
  init() {
    this.x = generateX(enemy);
    this.y = -enemy.height;
    enemyList.push(this);
  }
}

const createEnemy = () => {
  const interval = setInterval( function(){
    let eachEnemy = new EnemyValue();
    eachEnemy.init();
  } , 500)
}

class BulletValue{
  x = 0;
  y = 0;
  init() {
    this.x = playerX + 20;
    this.y = playerY - bullet.height;
    this.alive = true;
    bulletList.push(this);
  };
  checkHit() {
    for (let c = 0; c < enemyList.length; c++){
      if (this.y <= enemyList[c].y && this.x >= enemyList[c].x && this.x <= (enemyList[c].x + enemy.width)) {
        score++;
        this.alive = false;
        enemyList.splice(c, 1);
        console.log(score);
      }
    }
  }
}

const createBullet = () => {
  let shoot = new BulletValue();
  shoot.init();
  console.log(bulletList);
}

const keyDownCheck = (evt) => {
  /* console.log(evt.keyCode); */
  if (evt.keyCode === 37) { left = true;}
  if (evt.keyCode === 38) { up = true;}
  if (evt.keyCode === 39) { right = true;}
  if (evt.keyCode === 40) { down = true;}
}
const keyUpCheck = (evt) => {
  if (evt.keyCode === 37) { left = false;}
  if (evt.keyCode === 38) { up = false;}
  if (evt.keyCode === 39) { right = false;}
  if (evt.keyCode === 40) { down = false;}
  if (evt.keyCode === 32) { createBullet(); }
}
document.addEventListener('keydown', keyDownCheck);
document.addEventListener('keyup', keyUpCheck);

const Move = () => {
  // keydown에 따른 이동
  if (right) {
    playerX += 5;
  } else if (left) {
    playerX -= 5;
  } else if (up) {
    playerY -= 5;
  } else if (down) {
    playerY += 5;
  }
  // X축 이동거리 제한
  if (playerX <= 0) {
    playerX = 0;
  } else if (playerX >= x - player.width){
    playerX = x - player.width;
  }
  // Y축 이동거리 제한
  if (playerY <= 0) {
    playerY = 0;
  } else if (playerY >= y - player.height){
    playerY = y - player.height;
  }

  for (let j = 0; j < bulletList.length; j++) {
    if (bulletList[j].alive) {
      bulletList[j].y -= 8;
      bulletList[j].checkHit();
    }
  }

  for (let n = 0; n < enemyList.length; n++) {
    enemyList[n].y += 2;
  }

  for (let c = 0; c < rockList.length; c++) {
    rockList[c].y += 1;
    /* rockList[c].checkRockHit(); */
  }
}

const adjustRender = () => {
  if (!gameover) {
    Move();
    render();
    requestAnimationFrame(adjustRender);
  }
}

createRock();
createEnemy();
loadImg();
adjustRender();
