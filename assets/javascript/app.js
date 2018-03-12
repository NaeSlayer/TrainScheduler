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
    var trainName = "";
    var destination = "";
    var firstTime = "";
    var firstTimeConverted = "";
    var frequency = "";
    var currentTime = "";
    var diffTime = "";
    var remainder = "";
    var nextTrain = "";
    var nextArrival = "";
    var minutesAway = "";

    // capture button on click
    $("#add-train-btn").on("click", function () {
        event.preventDefault();

        trainName = $("#train-name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTime = $("#start-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log("FirstTimeConverted: " + firstTimeConverted);

        currentTime = moment();
        console.log("Current Time: " + moment(currentTime).format("HH:mm"));

        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("Difference in Time: " + diffTime);

        remainder = diffTime % frequency;
        console.log("Remainder: " + remainder);

        minutesAway = frequency - remainder;
        console.log("Minutes till Train: " + minutesAway);

        nextTrain = moment().add(minutesAway, "minutes");
        console.log("nextTrain: " + nextTrain);

        console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));

        nextArrival = moment(nextTrain).format("h:mm a");


        database.ref().set({
            trainName: trainName,
            destination: destination,
            firstTime: firstTime,
            remainder: remainder,
            frequency: frequency,
            minutesAway: minutesAway,
            nextArrival: nextArrival


        });
        $(".form-control").val("");
    })

    // firebase watcher + initial loader
    // The createRow function takes data returned by firebase
    database.ref().on("value", function (data) {
        console.log(data.val());

        // Get reference to exising tbody element, create new table row element
        var tBody = $("tBody");
        var tRow = $("<tr>");
        var child = data.val();

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