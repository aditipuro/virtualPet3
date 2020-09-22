//Create variables here
var dog, happyDog, database, foodS, foodStock;
var happyDogImg, dogImg;
var readStock; 
var milkBottle;
var feed, addFood;
var fedTime, lastFed;
var foodObj;
var bedroom_img, garden_img, washroom_img;

function preload()  {
  //load images here
  happyDogImg = loadImage("images/dogImg1.png");
  dogImg = loadImage("images/dogImg.png");
  bedroom_img = loadImage("images/Bed Room.png");
  garden_img = loadImage("images/Garden.png");
  washroom_img = loadImage("images/Wash Room.png");
  }


function setup() {

  createCanvas(1000, 500);
  dog = createSprite(250, 250, 20, 20);
  dog.scale = 0.5;
  dog.addImage(dogImg);

  happyDog = createSprite(250, 250, 20, 20);
  happyDog.scale = 0.5;
 
  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("Feed the Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  foodObj = new Food();

  readState = database.ref('gameState');
readState.on("value", function(data){
  gameState = data.val();
});
}


function draw() {  
background(46, 139, 87);

fedTime = database.ref('feedTime');
fedTime.on("value", function(data){
  lastFed = data.val();
});

currentTime = hour();

if(currentTime == (lastFed+1)){
  update("Playing");
  foodObj.garden();
}
else if(currentTime == (lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}
else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4))  {
  update("Bathing");
  foodObj.washroom();
}
else {
  update("Hungry");
  foodObj.display();
}

foodObj.display();

fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed: " + lastFed%12 + " PM", 350, 30);
    }
  else if(lastFed == 0){
    text("Last Feed: 12 AM", 350, 30);
  }
  else  {
    text("Last Feed: " + lastFed + " AM", 350, 30);
        }

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  } 
else  {
  feed.show();
  addFood.show();
  dog.addImage(dogImg);
  }   

  drawSprites();
}


function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
  }


function writeStock(x){
  if(x <= 0 ) {
    x = 0;
    } 
  else {
    x = x-1;
    }

   database.ref('/').update({
      Food:x
    })
  }


  function feedDog() {
    dog.visible = false;
    happyDog.addImage(happyDogImg);
    happyDog.visible = true;
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedTime:hour()
    })
  }

  
  function addFoods() {
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
    
  }
  function update(state)  {
    database.ref('/').update({
      gameState : state

    });
  }


