// GLOBALS
const SCREEN_HEIGHT = 700;
const INCREMENT = 0; 
const SPEED = 2;
const SHIP_Y = 550; 
let SECONDS = 0;
let MINUTES = 0;
let HOURS = 0;
let ANIMATION_INTERVAL;
let SHIP_CURRENT_X;
let TIMER_INTERVAL = 1000;

// Runs as soon as the website loads and pulls up the instructions overlay
const popupOverlay = $("#popup-overlay");
const closePopupBtn = $("#closePopupBtn");

// Stores each asteroid in a list so that its position can updated and accessed 
let asteroids = ["asteroid0" ,"asteroid1", "asteroid2", "asteroid3", "asteroid4"];


$(function() { //Shorthand that allows a function to be run as soon as page loads
   showInstructions();
});

function showInstructions() {
    $("#popup-overlay").css("visibility", "visible");
}

function hideInstructions() {
    $("#instruction-popup").css("visibility", "hidden");
    $("#popup-overlay").hide();
    animateObjects();
}

// Starts the motion of the asteroids
function animateObjects(){
    startTimer();
    ANIMATION_INTERVAL = setInterval(moveObjects, 2);
}

// Updates the postions of the asteroids and resets it to the top of the screen when it passes the bottom 
// Also checks for collision
function moveObjects(){
    for (let i = 0; i < asteroids.length; i++){
        const asteroid = document.getElementById(asteroids[i]);
        let asteroidY = parseInt(asteroid.getAttribute("y"));

        asteroid.setAttribute("y", asteroidY + SPEED);
        asteroidY += SPEED;
        
        // If collision is detected, the game over screen and restart button is presented 
        // the timer is cleared, and the animation is halted 
        if (calculateOverlap(asteroid)){
            clearInterval(timer);
            clearInterval(ANIMATION_INTERVAL);

            $("#game_over").html("DEAD");
            $("#game_over").css("visibility", "visible");
            $("#restart_button").css("visibility", "visible");
            
        }
        
        // Update asteroidsX,Y with coordinates for this asteroid
        if (asteroidY > SCREEN_HEIGHT){
            let x = Math.random() * (500);
            let y = Math.random() * (-180) - 20;
            asteroid.setAttribute("x", x);
            asteroid.setAttribute("y", y);
        }
    }
}

// Determines if the rocketship has made collision with any of the asteroids
function calculateOverlap(asteroid){
    // Get X1 Y1 X2 Y2 of both the asteroids and the rocketship
    let asteroidX1 = parseInt(asteroid.getAttribute("x")); 
    let asteroidX2 =  asteroidX1 + 50;
    let asteroidY = parseInt(asteroid.getAttribute("y"));
    let rocketshipX1 = SHIP_CURRENT_X;
    let rocketshipX2 = rocketshipX1 + 75;

    // Gives the location of the top and bottom of the ship
    let rocketshipTop = 560;
    let rocketshipBottom = 640; 

    // Creates a buffer to the left and right of the rocketship
    let xBuffer = 15;

    if ((asteroidX1 >= (rocketshipX1 + xBuffer) && asteroidX1 <= (rocketshipX2 - xBuffer)) || 
        (asteroidX2 >= (rocketshipX1 + xBuffer) && asteroidX2 <= (rocketshipX2 - xBuffer))){
        if (asteroidY >= rocketshipTop && asteroidY <= rocketshipBottom){
            return true;
        }   
    }
}

// Allows the user to restart the game without having to reload the window 
function restartGame() {
    // Reset timer values
    SECONDS = 0;
    MINUTES = 0;
    HOURS = 0;
    $("#timerDisplay").html("00:00:00");

    // Reset asteroid positions
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = document.getElementById(asteroids[i]);
        let x = Math.random() * 500;
        let y = Math.random() * (-180) - 20; // spawn slightly above the screen
        asteroid.setAttribute("x", x);
        asteroid.setAttribute("y", y);
    }

    //Hide the Game Over message
    $("#game_over").html("");

    //Hide the restart button
    $("#restart_button").css("visibility", "hidden");

    // Restart the game
    animateObjects();    
}

// Starts and updates the timer which acts as the "score" for this game
function startTimer(){
    timer = setInterval(updateTimer, TIMER_INTERVAL);
}

function updateTimer() {
    SECONDS++;
    if (SECONDS == 60) {
        SECONDS = 0;
        MINUTES++;
        if (MINUTES == 60) {
            MINUTES = 0;
            HOURS++;
        }
    }

    const displayHours = String(HOURS).padStart(2, "0");
    const displayMinutes = String(MINUTES).padStart(2, "0");
    const displaySeconds = String(SECONDS).padStart(2, "0");

    document.getElementById("timerDisplay").textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
}

// Allows user input to control the rocketship as soon as the website loads
document.addEventListener("DOMContentLoaded", () => {
    const rocketship = document.getElementById("rocketship");
    let x = parseInt(rocketship.getAttribute('x')); // Get initial x position
    
    // How much the rocketship moves to the left/right when the arrow keys are pressed
    const step = 50; 
    
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowLeft":
            if (x > 0){
                x -= step;
            }
        break;
        case "ArrowRight":
            if (x < 400){
                x += step;
            }
        break;
    }
    // Update the SVG element's x attribute
    rocketship.setAttribute("x", x);
    SHIP_CURRENT_X = x; 

    });
});