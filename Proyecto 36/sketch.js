var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//crea aquí las variables feed y lastFed 
var feed, lastFed


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //crea aquí el boton Alimentar al perro
  addFood=createButton("Agregar Alimento");
  addFood.position(800,94);
  addFood. mousePressed (addFoods);

  feed=createButton("Alimentar");
  feed.position(950,94);
  feed.mousePressed(feedDog);

}

function draw() {
  background(46,139,87);
  foodObj.display();
  feedTime = database.ref("FeedTime");
  feedTime.on("value", function(data){
  lastFed = data.val();
  })
 
  if(lastFed>=12){
    text("Ultima hora en que se alimento " + lastFed%12, 350, 30);
  }else if(lastFed==0){
    text("Ultima hora en que se alimento : 12 PM", 350, 30);
  }else{
    text("Ultima hora en que se alimento " + lastFed, 350, 30);
  }
 
  
 
  drawSprites();
}

//función para leer la Existencia de alimento
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  //var food_stock_val = foodObj.getFoodStock();
  if (foodObj.getFoodStock() <= 0) {
  foodObj.updateFoodStock(foodObj.getFoodStock() *0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock() -1);
  }
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
  //escribe el código aquí para actualizar las existencia de alimento, y la última vez que se alimentó al perro
}

//funcón para agregar alimento al almacén
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
