var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed,lastFed;
var BG;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
BG = loadImage("bg.png");
}

function setup() {
  //add database obj in the firebase
  database = firebase.database();
  
  //canvas
  createCanvas(850, 400);

  //create every required object one by one
  foodObj = new Food();

  //foodstock to database to read 'food''s info 
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  dog = createSprite(800, 280, 150, 150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //required buttons
  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Milk");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(BG);
  //display
  foodObj.display();

  //read fedtime value from the database 
  fedTime=database.ref('FeedTime')
  fedTime.on("value",function(data)
  { lastFed=data.val(); });
  
  //text for 'lastFed'
  fill("offwhite");
  textSize(15);
  if(lastFed>=12){ 
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
  }else if(lastFed==0){ 
    text("Last Fed : 12 AM", 350, 30);
  }else{ 
    text("Last Fed : "+ lastFed + " AM", 350,30); 
  }
  
  //text for 0 milk
  if (foodS === 0){
    textSize(25);
    text("Oops! we're out of Milk!", 318, 325);
    textSize(20);
    text("Click on 'Add Milk' button to get more milk!", 273, 350);
  }
  //dislay sprites
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  //update food stock and last fed time
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
      foodObj.updateFoodStock(food_stock_val *0);
  }
  else{
      foodObj.updateFoodStock(food_stock_val -1);
  }
  database.ref('/').update({
  Food:food_stock_val, 
  FeedTime:hour() //hour for keeping a track of time
 })
}

//function to add food in stock and updating the database ' food ' 
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
/*
#DhRiTiD
#DD
*/
