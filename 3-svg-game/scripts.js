let SCREEN_HEIGHT = 700;
let increment = 0; 
let speed = 1;
let timerInterval;
    let seconds = 0;
    let minutes = 0;
    let hours = 0;

const popupOverlay = document.getElementById('popupOverlay');
const closePopupBtn = document.getElementById('closePopupBtn');

window.onload = showInstructions(); 

document.addEventListener('DOMContentLoaded', () => {
const rocketship = document.getElementById("rocketship");
let x = parseInt(rocketship.getAttribute('x')); // Get initial x position

const step = 50; // Movement increment

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                if (x > 0){
                    x -= step;
                }
                break;
            case 'ArrowRight':
                if (x < 400){
                    x += step;
                }
                break;
            }
            // Update the SVG element's x attribute
            rocketship.setAttribute('x', x);
        });
    });
                                   
let asteroids = ["asteroid0", "asteroid1", "asteroid2", "asteroid3"];
function animateObjects(){
    let score = 0;
    startTimer();
    for (let i = 0; i < asteroids.length; i++){
        animationInterval = setInterval(moveObjects, 10)
    }
}

function moveObjects(){

    increment++;
    if (increment == 50000){
        increment = 0;
        speed += 1;
        console.log(speed);
    }
    
    for (let i = 0; i < asteroids.length; i++){
        const object = document.getElementById(asteroids[i]);
        let y = parseInt(object.getAttribute('y'))

        object.setAttribute('y', y + speed)
        y += speed;
        
        if (y > SCREEN_HEIGHT){
            object.setAttribute('x', Math.random() * (500));
            object.setAttribute('y', Math.random() * (-180) - 20);
        }
        clearInterval();
    }
}

function startTimer(){
    timerInterval = setInterval(updateTimer, 1000);
}

 function updateTimer() {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
        }

        const displayHours = String(hours).padStart(2, '0');
        const displayMinutes = String(minutes).padStart(2, '0');
        const displaySeconds = String(seconds).padStart(2, '0');

        document.getElementById("timerDisplay").textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
    }

// function checkCollision(){

// }

function showInstructions() {
    console.log($("#popup-overlay").html())
    $("#popup-overlay").css("visibility", "visible");
}

function hideInstructions() {
    $("#instruction-popup").css("visibility", "hidden");
}

// Example: Show instructions when the page loads (or game starts)

// Close the popup when the button is clicked
$("#closePopupBtn").click(hideInstructions());