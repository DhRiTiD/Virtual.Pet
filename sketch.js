var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var FeedTheDog
var foodObj;

//create feed and lastFed variable here
var feed,lastFed


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
BG = loadImage("bg.png")
}

function setup() {
  database=firebase.database();
  createCanvas(850, 400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  dog=createSprite(800,280,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  FeedTheDog=createButton("Feed the Dog");
  FeedTheDog.position(700,95);
  FeedTheDog.mousePressed(feedDog);

  addFood=createButton("Add Milk");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(BG);
  foodObj.display();

  //write code to read fedtime value from the database 
  fedTime=database.ref('FeedTime')
  fedTime.on("value",function(data)
  { lastFed=data.val(); });
  fill("offwhite");
  textSize(15);
  if(lastFed>=12){ 
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
  }else if(lastFed==0){ 
    text("Last Fed : 12 AM", 350, 30);
  }else{ 
    text("Last Fed : "+ lastFed + " AM", 350,30); 
  }
  
  if (foodS === 0){
    textSize(25);
    text("Oops! we're out of Milk!", 318, 325);
    textSize(20);
    text("Click on 'Add Milk' button to get more milk!", 273, 350);
  }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  //write code here to update food stock and last fed time
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
      foodObj.updateFoodStock(food_stock_val *0);
  }
  else{
      foodObj.updateFoodStock(food_stock_val -1);
  }
  database.ref('/').update({
  Food:food_stock_val, 
  FeedTime:hour()
 })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}