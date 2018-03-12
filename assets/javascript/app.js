$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDkP_GBociCCPr8Xyj2b0ARAwxD9J27teA",
        authDomain: "train-scheduler-9f078.firebaseapp.com",
        databaseURL: "https://train-scheduler-9f078.firebaseio.com",
        projectId: "train-scheduler-9f078",
        storageBucket: "",
        messagingSenderId: "592550973942"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // initial values
    // var trainName = "";
    // var destination = "";
    // var firstTime = "";
    // var firstTimeConverted = "";
    // var frequency = "";
    // var currentTime = "";
    // var diffTime = "";
    // var remainder = "";
    // var nextTrain = "";
    // var nextArrival = "";
    // var minutesAway = "";

    // capture button on click
    $("#add-train-btn").on("click", function () {
        event.preventDefault();

        var trainName = $("#train-name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var firstTime = $("#start-input").val().trim();
        var frequency = $("#frequency-input").val().trim();

        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log("FirstTimeConverted: " + firstTimeConverted);

        var currentTime = moment();
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var remainder = diffTime % frequency;
        var minutesAway = frequency - remainder;
        var nextTrain = moment().add(minutesAway, "minutes");
        var nextArrival = moment(nextTrain).format("h:mm a");

        // creates a temporary object for holding train data
        // var newTrain = {
        //     trainName: trainName,
        //     destination: destination,
        //     firstTime: firstTime,
        //     remainder: remainder,
        //     frequency: frequency,
        //     minutesAway: minutesAway,
        //     nextArrival: nextArrival
        // }

        // uploads new train data to the database
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTime: firstTime,
            remainder: remainder,
            frequency: frequency,
            minutesAway: minutesAway,
            nextArrival: nextArrival
        });

        // clears all of the text boxes
        $(".form-control").val("");

        // logs everything to teh console
        console.log("Current Time: " + moment(currentTime).format("HH:mm"));
        console.log("Difference in Time: " + diffTime);
        console.log("Remainder: " + remainder);
        console.log("Minutes till Train: " + minutesAway);
        console.log("nextTrain: " + nextTrain);
        console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));

    })

    // firebase watcher + initial loader
    // The createRow function takes data returned by firebase
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {
        console.log(childSnapshot.val());

        // Get reference to exising tbody element, create new table row element
        var tBody = $("tBody");
        var tRow = $("<tr>");
        var child = childSnapshot.val();

        // methods run on jquery selectors return the selector they were run on
        // this is why we can create and save a reference to a td in the same statement we update its text
        var trainNameTd = $("<td>").text(child.trainName);
        var destinationTd = $("<td>").text(child.destination);
        var frequencyTd = $("<td>").text(child.frequency);
        var nextArrivalTd = $("<td>").text(child.nextArrival);
        var minutesAwayTd = $("<td>").text(child.minutesAway);




        // append the newly created table data to the table row
        tRow.append(trainNameTd, destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd);
        // append the table row to the table body
        tBody.append(tRow);
    })
})