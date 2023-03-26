//Allows script to run once DOM is loaded.
$(document).ready(function () {

  var currentDate = $("header #currentDay"); //calls a selector to display current date.

  var eventCal = {};  //declares an object for storing daily data

  var hourDisplay = moment(); //displays the current hour.

  function displayCal(today, eventCal) { //displays the calendar upon loading the page.

      var rowHour = moment(today).hour(9); // rows are added starting at 9 AM
      var calendar = $("div.container"); // calls the calendar div by class.
      calendar.empty(); //required for clearing all past and present time frames.

      for (var i = 1; i < 10; i++) {  //for-loop is used to generate 9 rows for each hour from 9am to 5pm.

          var row = $("<div>").addClass("row"); //generates a new row per the given hour.
          
          var hourClass = "";  // sets the color for the hour-display elements depending on whether the time-frame is in the past, present and future
          if (today.isBefore(rowHour, "hour")) { //displays as green.
              hourClass = "future"
          } else if (today.isAfter(rowHour, "hour")) { 
              hourClass = "past" //displays as gray.
          } else {
              hourClass = "present" //displays as red
          };

          calendar.append(row);
          
          row.append($("<div>").addClass("col-2 hour").text(rowHour.format("h A"))); // adds the hour column to each row upon generation.
          var hourBlock = rowHour.format("hA"); //rows are formatted to display current hour and AM/PM.
          
          row.append($("<textarea>").addClass(`col-8 ${hourClass}`).text(eventCal[hourBlock])); // calls for textual data in eventCal object to display onto textarea.
          row.append($("<button>").addClass("col-2 saveBtn").html("<i class='fas fa-save'></i>").attr("aria-label", "Save").attr("id", rowHour.format("hA"))); // adds a save button column for each timeframe.

          rowHour.add(1, "hour"); // hours are displayed in increments of 1.
          hourDisplay = moment(); // sets calendar to display time.
      };
  };

  function renderCalendar() {  //renders the calendar upon page load.
      var today = moment(); //displays the current date
      currentDate.text(today.format("dddd, MMMM Do")); //Internationization for setting current date.
      displayCal(today, eventCal);
  };

  function loadCalendar() {  //load local storage data via JSON function.
      var storedCal = JSON.parse(localStorage.getItem("eventCal"));
      if (storedCal) {
          eventCal = storedCal;
      };
  };

  loadCalendar(); // Presents calendar data upon page load.
  renderCalendar(); // presents the date and calendar upon page load.
  currentHour(); // traces the current time and associates it with the hour block

  function currentHour() { //determines if hour blocks need to change color depending on the current time.
      var checkHourInterval = setInterval(function () {
          if (moment().isAfter(hourDisplay, "minute")) {
              renderCalendar(); // upon entering the next hour, the calendar is re-rendered to display the correct color blocks. 
          }
      }, 600000); //function occurs in ten minute intervals to clear all unsaved entries.
  };

  function storeCalendar() {  // stores calendar text/data in local storage.
      localStorage.setItem("eventCal", JSON.stringify(eventCal));
  };

  function calClear() {  // clear the calendar of all text/data
      eventCal = {};
      storeCalendar();
      renderCalendar();
  };

  $("button#clear-cal").on("click", calClear);  // Clears the calendar upon clicking.

  $(document).on("click", "button.saveBtn", function (event) {  //establishes Save button.
      var calText = event.currentTarget.parentElement.children[1].value; // store the data within each row.
      eventCal[event.currentTarget.id] = calText;
      storeCalendar(); // store the eventCal in local storage.
  });
});