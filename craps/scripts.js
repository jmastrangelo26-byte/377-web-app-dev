let point = 0;

/*
 * Checks the result of the current roll and declare a win, loss, or continuation.
 */
function checkRoll(roll) {
    if (point == 0) { // New round
        if (roll == 7 || roll == 11) {
            $("#message").text("You win!");
        } else if (roll == 2 || roll == 3 || roll == 12) {
            $("#message").text("You lose!");
        } else {
            $("#point").text(roll);
            point = roll;
        }
    } else { // Existing round
        if (roll == point) {
            $("#message").text("You win!");
            point = 0;
        } else if (roll == 7) {
            $("#message").text("You lose!");
            point = 0;
        }
    }
}

/*
 * Rolls both dice at the same time and checks the results.
 */
function rollDice() {
    if (point == 0) {
        $("#point").text("X");
    }
    $("#message").text("");

    let roll1 = rollDie("d1");
    let roll2 = rollDie("d2");
    let total = roll1 + roll2;

    console.log("Total: " + total);

    checkRoll(total);
}

/*
 * Rolls the given die which updates the pips and returns the number rolled.
 *
 * dieNum - the ID of the die to roll
 */
function rollDie(dieNum) {
    // Step 1: hide every pip
    $("#" + dieNum + " ~ .pip").css("visibility", "hidden");

    // Step 2: generate a random number between 1 and 6 (inclusive)
    let roll = Math.ceil(Math.random() * 6);
    console.log(dieNum + ": " + roll);

    // Step 3: show the appropriate pips based on the roll
    if (roll == 1) {
        $("#" + dieNum + "p4").css("visibility", "visible");
    } else if (roll == 2) {
        $("#" + dieNum + "p1").css("visibility", "visible");
        $("#" + dieNum + "p7").css("visibility", "visible");
    } else if (roll == 3) {
        $("#" + dieNum + "p1").css("visibility", "visible");
        $("#" + dieNum + "p4").css("visibility", "visible");
        $("#" + dieNum + "p7").css("visibility", "visible");
    } else if (roll == 4) {
        $("#" + dieNum + "p1").css("visibility", "visible");
        $("#" + dieNum + "p3").css("visibility", "visible");
        $("#" + dieNum + "p5").css("visibility", "visible");
        $("#" + dieNum + "p7").css("visibility", "visible");
    } else if (roll == 5) {
        $("#" + dieNum + "p1").css("visibility", "visible");
        $("#" + dieNum + "p3").css("visibility", "visible");
        $("#" + dieNum + "p4").css("visibility", "visible");
        $("#" + dieNum + "p5").css("visibility", "visible");
        $("#" + dieNum + "p7").css("visibility", "visible");
    } else  { // roll == 6
        $("#" + dieNum + "p1").css("visibility", "visible");
        $("#" + dieNum + "p2").css("visibility", "visible");
        $("#" + dieNum + "p3").css("visibility", "visible");
        $("#" + dieNum + "p5").css("visibility", "visible");
        $("#" + dieNum + "p6").css("visibility", "visible");
        $("#" + dieNum + "p7").css("visibility", "visible");
    }

    return roll;
}