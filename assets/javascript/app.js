
// JavaScript function that wraps everything
$(document).ready(function () {
    
    // Some questions are from the following web sites.
    // http://www.sciencefun.org/1st-grade-trivia/
    // https://www.helpteaching.com/questions/Geography/Grade_1
    var QUESTION_ARRAY = ["Who is Winnie the Pooh's best friend?",
        "Who is the head of Slytherin House?",
        "What is the force that keeps us from floating in the air?",
        "When the moon is just a tiny sliver, what is it called?",
        "What do we call the place where an organism lives?",
        "What does a ruler measure?",
        "In Frozen, who is Elsa's sister?",
        "In Ninjago, who is the Elemental Master of Fire?",
        "How many states are in the United States of America?",
        "The compass on a map helps you to find ___________."];
    var CHOICE_ARRAY = [["Tigger", "Roo", "Piglet", "Owl"],
    ["Prof Dumbledore", "Prof Snape", "Haggrid", "Prof McGonagol"],
    ["Gravity", "Magnetism", "Balance", "Glue Shoes"],
    ["Gibbous", "New moon", "First quarter", "Crescent"],
    ["Habitat", "House", "Tank", "Herbivore"],
    ["Length", "Weight", "Volume", "Gas"],
    ["Olaf", "Anna", "Sophia", "Moana"],
    ["Sensei Wu", "Nya", "Cole", "Kai"],
    ["40", "20", "13", "50"],
    ["your mom", "the direction", "your house", "your lunch"]];
    var ANSWER_ARRAY = [2, 1, 0, 3, 0, 0, 1, 3, 3, 1];
    var IMAGE_ARRAY = ["piglet.jpg","snape.jpg","gravity.jpg","crescent.jpg","habitat.jpg","ruler.jpg",
    "anna.jpg","kai.jpg","states.jpg","compass.jpg"];
    
    // Subset of questions used for testing.
    /*
    var QUESTION_ARRAY = ["Who is Winnie the Pooh's best friend?",
        "Who is the head of Slytherin House?"];
    var CHOICE_ARRAY = [["Tigger", "Roo", "Piglet", "Owl"],
    ["Prof Dumbledore", "Prof Snape", "Haggrid", "Prof McGonagol"]];
    var ANSWER_ARRAY = [2, 1];
    */

    var currentIdx = -1;
    var QUIZ_TIME_PER_QUESTION_SECS = 10;
    var ANSWER_TIME_SECS = 3;
    var secondsTimer;
    var answerTimer; // Timeout for displaying the answer.
    var timeRemaining;
    var audioElement;
    var numCorrect;
    var numIncorrect;
    var numUnanswered;

    // FUNCTIONS
    function initializeGame() {

        // Gets Link for School Bell sound
        audioElement = document.createElement("audio");
        audioElement.setAttribute("src", "./assets/audio/timeup.mp3");

        $("#startButtonDiv").show();

        // Bind the start button click callback.
        $("#startButton").on("click", function () {

            // Start a new game.
            newGame();

        });

        // Bind the try again button click callback.
        $("#tryAgainButton").on("click", function () {

            // Start a new game.
            newGame();

        });
    }

    // Reset the game.
    function newGame() {
        numCorrect = 0;
        numIncorrect = 0;
        numUnanswered = 0;

        // Hide the time up message.
        $("#timeUpDiv").hide();

        // Hide the timer notice message.
        $("#timeRemainingDiv").hide();
        $("#timeRemaining").text("00:00");

        hideAll();

        // Build the first question and show it.
        currentIdx = -1;
        showNextQuestion();
    }

    // Hide all the divs.
    function hideAll() {
        $("#questionsDiv").hide();
        $("#answersDiv").hide();
        $("#startButtonDiv").hide();
        $("#resultsDiv").hide();
    }

    // Build and show the next question.
    // Star the timer.
    function showNextQuestion() {

        currentIdx++; // Move to next question.

        // Go to next question if there are more.
        if (currentIdx < QUESTION_ARRAY.length) {
            buildQuestion(currentIdx);

            hideAll();
            
            // Show the questions.
            $("#questionsDiv").show();

            // Update the timer display.
            restartTimer();
        }
        else { // No more questions.  Show the results.
            showResults();
        }
    }

    // Clear the interval timer.
    function cancelTimer() {
        console.log("cancelTimer");
        clearInterval(secondsTimer);
    }

    // Restart the timer.
    function restartTimer() {
        // Hide the Time Up message.
        $("#timeUpDiv").hide();

        cancelTimer();

        console.log("restartTimer");
        // Update the timer display.
        timeRemaining = QUIZ_TIME_PER_QUESTION_SECS;
        $("#timeRemaining").text(timeConverter(timeRemaining));
        $("#timeRemainingDiv").show();
        // Start the timer to fire every second.
        secondsTimer = setInterval(updateTime, 1000);
    }

    // Build the question card for the given question index.
    function buildQuestion(idx) {

        // Clear old question.
        $("#questionsCardBodyCol").empty();

        // Create question display.
        var newDiv = $("<div>");
        newDiv.attr("id", "questionsRow" + idx);
        newDiv.addClass("row");
        var questionText = "<p>" + QUESTION_ARRAY[idx] + "</p>";
        newDiv.html(questionText);
        $("#questionsCardBodyCol").append(newDiv);

        newDiv = $("<div>");

        // Create choice display.
        newDiv = $("<div>");
        newDiv.attr("id", "ChoiceRow" + idx);
        newDiv.addClass("btn-group-vertical");
        // Add in 4 buttons.
        for (var j = 0; j < 4; j++) {

            var newButton = $("<button>");
            newButton.attr("id", j);
            newButton.addClass("btn btn-primary");
            newButton.text(CHOICE_ARRAY[idx][j]);

            // Bind the try again button click callback.
            newButton.on("click", function () {

                // Cancel the timer.
                cancelTimer();

                var myChoice = parseInt(this.id);
                // Show the answer.
                showAnswer(idx, myChoice);

                // Update results counters.
                updateResults(idx, myChoice);

            });


            newDiv.append(newButton);

        }

        $("#questionsCardBodyCol").append(newDiv);

    }

    // Build the answers card.
    function buildAnswer(idx, option) {

        console.log("buildAnswer : " + idx);
        console.log("buildAnswer option : " + option);
        // Hide answers.
        $("#answersDiv").hide();

        // Put in new image.
        // var image_src = "./assets/images/" + IMAGE_ARRAY[idx];
        // $("#answerCardImage").attr("src",image_src);

        // Empty old answer.
        $("#answersCardBody").empty();

        // Check whether answer was correct.
        var message = "YOU DID NOT ANSWER";
        // TODO : Check for valid option>-1.  Update not answered.
        if (option === -1) {
            console.log("No answer chosen.");
        }
        else if (ANSWER_ARRAY[idx] === option) {
            message = "CORRECT";
        }
        else {
            message = "SORRY.  INCORRECT";
        }
        var answerText = CHOICE_ARRAY[idx][ANSWER_ARRAY[idx]];
        console.log(answerText);
        $("#answersCardBody").append("<p>" + message + "</p>");
        $("#answersCardBody").append("<p>Answer : " + answerText + "</p>");

    }

    // This function is from the stopwatch class activity.
    function timeConverter(t) {

        var minutes = Math.floor(t / 60);
        var seconds = t - (minutes * 60);

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        if (minutes === 0) {
            minutes = "00";
        }
        else if (minutes < 10) {
            minutes = "0" + minutes;
        }

        return minutes + ":" + seconds;
    }

    // Update the time display.  This is a timeout callback.
    function updateTime() {
        console.log("Time remaining : " + timeRemaining);
        timeRemaining--;

        // Have we run out of time?
        if (timeRemaining === 0) {
            timeUp();
            // Build the answer and show it.
            showAnswer(currentIdx, -1);
            // Update the results.
            updateResults(currentIdx, -1);
        }
        else {
            // Update the timer display.
            $("#timeRemaining").text(timeConverter(timeRemaining));

        }
    }

    function showAnswer(idx, answerChoice) {
        console.log("showAnswer");

        // Update the answer card.
        buildAnswer(idx, answerChoice);

        hideAll();

        // Show the answer.
        $("#answersDiv").show();

        // Set a timeout.
        answerTimer = setTimeout(function () { showNextQuestion(); }, ANSWER_TIME_SECS * 1000);
    }

    // Timer callback.
    function timeUp() {

        cancelTimer();

        // Hide the time remaining.
        $("#timeRemainingDiv").hide();

        // Display time up message.
        $("#timeUpDiv").show();

    }

    // Calculate the number of correct answers and display.
    function updateResults(idx, answerChoice) {

        // Check for no answer.
        if (answerChoice == -1) {
            numUnanswered++;
        }
        else if (answerChoice === ANSWER_ARRAY[idx]) {
            numCorrect++;
        }
        else {
            numIncorrect++;
        }
    }

    function showResults() {
        console.log("showResults");

        // Update the answer card.
        buildResults();

        hideAll();

        // Show the answer.
        $("#resultsDiv").show();

        // Play the audio for 2 seconds.
        audioElement.play();
        setTimeout(function () { audioElement.pause(); }, 2000);

    }

    function buildResults() {
        console.log("buildResults");

        $("#numCorrect").text(numCorrect);
        $("#numIncorrect").text(numIncorrect);
        $("#numUnanswered").text(numUnanswered);
    }

    // RUN CODE
    initializeGame();

});
