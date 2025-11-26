/* PLEASE DO NOT CHANGE THIS FRAMEWORK ....
the get requests are all implemented and working ... 
so there is no need to alter ANY of the existing code: 
rather you just ADD your own ... */

window.onload = function () {
  document.querySelector("#queryChoice").selectedIndex = 0;
  //create once :)
  let description = document.querySelector("#Ex4_title");
  //array to hold the dataPoints
  let dataPoints = [];

  // /**** GeT THE DATA initially :: default view *******/
  // /*** no need to change this one  **/
  runQueryDefault("onload");

  /***** Get the data from drop down selection ****/
  let querySelectDropDown = document.querySelector("#queryChoice");

  querySelectDropDown.onchange = function () {
    console.log(this.value);
    let copyVal = this.value;
    console.log(copyVal);
    runQuery(copyVal);
  };

  /******************* RUN QUERY***************************  */
  async function runQuery(queryPath) {
    // // //build the url -end point
    const url = `/${queryPath}`;
    try {
      let res = await fetch(url);
      let resJSON = await res.json();
      console.log(resJSON);

      //reset the
      document.querySelector("#childOne").innerHTML = "";
      description.textContent = "";
      document.querySelector("#parent-wrapper").style.background =
        "rgba(51,102,255,.2)";

      switch (queryPath) {
        case "default": {
          displayAsDefault(resJSON);
          break;
        }
        case "one": {
          //sabine done
          displayInCirclularPattern(resJSON);
          break;
        }
        case "two": {
          //sabine done
          displayByGroups(resJSON, "weather", "eventName");
          break;
        }
        /***** TO DO FOR EXERCISE 4 *************************
         ** 1: Once you have implemented the mongodb query in server.py,
         ** you will receive it from the get request (THE FETCH HAS ALREADY BEEN IMPLEMENTED:: SEE ABOVE) 
         ** and will automatically will enter into the correct select case
         **  - based on the value that the user chose from the drop down list...)
         ** You need to design and call a custom display function FOR EACH query that you construct ...
         ** 4 queries - I want 4 UNIQUE display functions - you can use the ones I created
         ** as inspiration ONLY - DO NOT just copy and change colors ... experiment, explore, change ...
         ** you can create your own custom objects - but NO images, video or sound... (will get 0).
         ** bonus: if your visualizations(s) are interactive or animate.
         ****/
        case "three": {
          console.log("three")
          displayThree(resJSON.results);
          break;
        }
        case "four": {
          console.log("four")
          displayFour(resJSON.results);

          break;
        }

        case "five": {
          console.log("five")
          displayFive(resJSON.results);
          break;
        }

        case "six": {
          console.log("six")
          displaySix(resJSON.results);

          break;
        }
        default: {
          console.log("default case");
          break;
        }
      } //switch
    } catch (err) {
      console.log(err);
    }
  }
  //will make a get request for the data ...

  /******************* RUN DEFAULT QUERY***************************  */
  async function runQueryDefault(queryPath) {
    // // //build the url -end point
    const url = `/${queryPath}`;
    try {
      let res = await fetch(url);
      let resJSON = await res.json();
      console.log(resJSON);
      displayAsDefault(resJSON);
    } catch (err) {
      console.log(err);
    }
  }
  /*******************DISPLAY AS GROUP****************************/

  function displayByGroups(resultObj, propOne, propTwo) {
    dataPoints = [];
    let finalHeight = 0;
    //order by WEATHER and Have the event names as the color  ....

    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(51, 153, 102,1)";
    description.textContent = "BY WEATHER AND ALSO HAVE EVENT NAMES {COLOR}";
    description.style.color = "rgb(179, 230, 204)";

    let coloredEvents = {};
    let resultSet = resultObj.results;

    //reget
    let possibleEvents = resultObj.events;
    let possibleColors = [
      "rgb(198, 236, 217)",
      "rgb(179, 230, 204)",
      "rgb(159, 223, 190)",
      "rgb(140, 217, 177)",
      "rgb(121, 210, 164)",
      "rgb(102, 204, 151)",
      "rgb(83, 198, 138)",
      "rgb(64, 191, 125)",
      "rgb(255, 204, 179)",
      "rgb(255, 170, 128)",
      "rgb(255, 153, 102)",
      "rgb(255, 136, 77)",
      "rgb(255, 119, 51)",
      "rgb(255, 102, 26)",
      "rgb(255, 85, 0)",
      "rgb(230, 77, 0)",
      "rgb(204, 68, 0)",
    ];

    for (let i = 0; i < possibleColors.length; i++) {
      coloredEvents[possibleEvents[i]] = possibleColors[i];
    }

    let offsetX = 20;
    let offsetY = 150;
    // find the weather of the first one ...
    let currentGroup = resultSet[0][propOne];
    console.log(currentGroup);
    let xPos = offsetX;
    let yPos = offsetY;

    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].event_name,
          //map to the EVENT ...
          coloredEvents[resultSet[i].event_name],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point_two"
        )
      );

      /** check if we have changed group ***/
      if (resultSet[i][propOne] !== currentGroup) {
        //update
        currentGroup = resultSet[i][propOne];
        offsetX += 150;
        offsetY = 150;
        xPos = offsetX;
        yPos = offsetY;
      }
      // if not just keep on....
      else {
        if (i % 10 === 0 && i !== 0) {
          xPos = offsetX;
          yPos = yPos + 15;
        } else {
          xPos = xPos + 15;
        }
      } //end outer else

      dataPoints[i].update(xPos, yPos);
      finalHeight = yPos;
    } //for

    document.querySelector("#childOne").style.height = `${finalHeight + 20}px`;
  } //function

  /*****************DISPLAY IN CIRCUlAR PATTERN:: <ONE>******************************/
  function displayInCirclularPattern(resultOBj) {
    //reset
    dataPoints = [];
    let xPos = 0;
    let yPos = 0;
    //for circle drawing
    let angle = 0;
    let centerX = window.innerWidth / 2;
    let centerY = 350;

    let scalar = 300;
    let yHeight = Math.cos(angle) * scalar + centerY;

    let resultSet = resultOBj.results;
    let coloredMoods = {};

    let possibleMoods = resultOBj.moods;
    let possibleColors = [
      "rgba(0, 64, 255,.5)",
      "rgba(26, 83, 255,.5)",
      "rgba(51, 102, 255,.7)",
      "rgba(51, 102, 255,.4)",
      "rgba(77, 121,255,.6)",
      "rgba(102, 140, 255,.6)",
      "rgba(128, 159, 255,.4)",
      "rgba(153, 179, 255,.3)",
      "rgba(179, 198, 255,.6)",
      "rgba(204, 217, 255,.4)",
    ];

    for (let i = 0; i < possibleMoods.length; i++) {
      coloredMoods[possibleMoods[i]] = possibleColors[i];
    }

    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(0, 26, 102,1)";
    description.textContent = "BY AFTER MOOD";
    description.style.color = "rgba(0, 64, 255,.5)";

    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].event_name,
          //map to the day ...
          coloredMoods[resultSet[i].after_mood],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point_two"
        )
      );
      /*** circle drawing ***/
      xPos = Math.sin(angle) * scalar + centerX;
      yPos = Math.cos(angle) * scalar + centerY;
      angle += 0.13;

      if (angle > 2 * Math.PI) {
        angle = 0;
        scalar -= 20;
      }
      dataPoints[i].update(xPos, yPos);
    } //for

    document.querySelector("#childOne").style.height = `${yHeight}px`;
  } //function

  /*****************DISPLAY AS DEFAULT GRID :: AT ONLOAD ******************************/
  function displayAsDefault(resultOBj) {
    //reset
    dataPoints = [];
    let xPos = 0;
    let yPos = 0;
    const NUM_COLS = 50;
    const CELL_SIZE = 20;
    let coloredDays = {};
    let resultSet = resultOBj.results;
    possibleDays = resultOBj.days;
    /*
  1: get the array of days (the second entry in the resultOBj)
  2: for each possible day (7)  - create a key value pair -> day: color and put in the
  coloredDays object
  */
    console.log(possibleDays);
    let possibleColors = [
      "rgb(255, 102, 153)",
      "rgb(255, 77, 136)",
      "rgb(255, 51, 119)",
      "rgb(255, 26, 102)",
      "rgb(255, 0, 85)",
      "rgb(255, 0, 85)",
      "rgb(255, 0, 85)",
    ];

    for (let i = 0; i < possibleDays.length; i++) {
      coloredDays[possibleDays[i]] = possibleColors[i];
    }
    /* for through each result
    1: create a new MyDataPoint object and pass the properties from the db result entry to the object constructor
    2: set the color using the coloredDays object associated with the resultSet[i].day
    3:  put into the dataPoints array.
    **/
    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(255,0,0,.4)";
    description.textContent = "DEfAULT CASE";
    description.style.color = "rgb(255, 0, 85)";

    //last  element is the helper array...
    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].evnet_name,
          //map to the day ...
          coloredDays[resultSet[i].day],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point"
        )
      );

      /** this code is rather brittle - but does the job for now .. draw a grid of data points ..
//*** drawing a grid ****/
      if (i % NUM_COLS === 0) {
        //reset x and inc y (go to next row)
        xPos = 0;
        yPos += CELL_SIZE;
      } else {
        //just move along in the column
        xPos += CELL_SIZE;
      }
      //update the position of the data point...
      dataPoints[i].update(xPos, yPos);
    } //for
    document.querySelector("#childOne").style.height = `${yPos + CELL_SIZE}px`;
  } //function

  function visualizeThree(data) {
    clearCanvas();

    data.forEach((d, i) => {
      const strength = d.after_mood_strength;
      const x = Math.random() * canvas.width;
      const y = canvas.height - strength * 40;

      // weather → color mapping
      const colorMap = {
        sunny: "yellow",
        cloudy: "lightgray",
        stormy: "purple",
        raining: "blue",
        clear: "white",
        snowing: "lightblue",
        grey: "gray",
        fog: "silver"
      };

      const color = colorMap[d.weather] || "white";

      drawCircle(x, y, strength * 3, color);
    });
  }
  function visualizeFour(data) {
    clearCanvas();

    // get event groups
    const eventMap = {};
    data.forEach((d) => {
      if (!eventMap[d.event_name]) eventMap[d.event_name] = [];
      eventMap[d.event_name].push(d);
    });

    const events = Object.keys(eventMap);

    events.forEach((eventName, index) => {
      const x = 80 + index * 60;

      eventMap[eventName].forEach((entry, i) => {
        const y = 50 + i * 8;
        drawCircle(x, y, 4, "white");
      });

      drawText(eventName, x - 20, canvas.height - 20);
    });
  }
  function visualizeFive(data) {
    clearCanvas();

    const leftX = canvas.width * 0.25;
    const rightX = canvas.width * 0.75;

    data.forEach((d) => {
      const x = (d.day === "Monday") ? leftX : rightX;
      const y = canvas.height - d.event_affect_strength * 40;
      const size = d.after_mood_strength * 2;

      drawCircle(
        x + (Math.random() - 0.5) * 80,
        y,
        size,
        (d.day === "Monday") ? "cyan" : "pink"
      );
    });

    drawText("MONDAY", leftX - 30, 40);
    drawText("TUESDAY", rightX - 30, 40);
  }
  function displayThree(resultSet) {
    dataPoints = [];

    // background + title
    document.querySelector("#parent-wrapper").style.background = "rgba(255, 240, 180, 0.5)";
    description.textContent = "POSITIVE AFTER-MOOD VISUALIZATION";
    description.style.color = "rgb(255, 180, 0)";

    // weather → color mapping
    const colorMap = {
      sunny: "yellow",
      cloudy: "lightgray",
      stormy: "purple",
      raining: "blue",
      clear: "white",
      snowing: "lightblue",
      grey: "gray",
      fog: "silver"
    };

    let xPos, yPos;

    for (let i = 0; i < resultSet.length; i++) {
      const e = resultSet[i];

      xPos = Math.random() * 600; // random horizontal spread
      yPos = 50 + e.after_mood_strength * 40; // stacked by strength

      dataPoints.push(
        new myDataPoint(
          e.dataId,
          e.day,
          e.weather,
          e.start_mood,
          e.after_mood,
          e.after_mood_strength,
          e.event_affect_strength,
          e.event_name,
          colorMap[e.weather] || "white",
          document.querySelector("#childOne"),
          "point_two"
        )
      );

      dataPoints[i].update(xPos, yPos);
    }

    document.querySelector("#childOne").style.height = "600px";
  }
  function displayFour(resultSet) {
    dataPoints = [];

    // background + title
    document.querySelector("#parent-wrapper").style.background = "rgba(100, 80, 200, 0.3)";
    description.textContent = "ENTRIES SORTED BY EVENT NAME";
    description.style.color = "rgb(120, 60, 200)";

    // Create unique color per event
    const eventColors = {};
    const uniqueEvents = [...new Set(resultSet.map(e => e.event_name))];

    const palette = [
      "#ff9999", "#ffcc99", "#ffff99", "#ccff99", "#99ff99",
      "#99ffcc", "#99ffff", "#99ccff", "#9999ff", "#cc99ff",
      "#ff99ff", "#ff99cc", "#ff6699", "#ff9933", "#66ffcc",
      "#66ccff", "#cc66ff", "#ff66cc"
    ];

    uniqueEvents.forEach((event, i) => {
      eventColors[event] = palette[i % palette.length];
    });

    let xStart = 50;   // first column X
    let colSpacing = 130;

    uniqueEvents.forEach((eventName, colIndex) => {
      const entries = resultSet.filter(e => e.event_name === eventName);

      let x = xStart + colIndex * colSpacing;
      let y = 80; // reset top for each column

      // Add event label above
      const label = document.createElement("div");
      label.textContent = eventName;
      label.style.position = "absolute";
      label.style.left = `${x - 40}px`;
      label.style.top = `20px`;
      label.style.color = "black";
      label.style.width = "120px";
      label.style.fontSize = "12px";
      label.style.textAlign = "center";
      document.querySelector("#childOne").appendChild(label);

      entries.forEach((e) => {
        let color = eventColors[eventName];

        dataPoints.push(
          new myDataPoint(
            e.dataId,
            e.day,
            e.weather,
            e.start_mood,
            e.after_mood,
            e.after_mood_strength,
            e.event_affect_strength,
            e.event_name,
            color,
            document.querySelector("#childOne"),
            "point_square"
          )
        );

        // update dot position
        const dp = dataPoints[dataPoints.length - 1];
        dp.update(x, y);

        y += 15; // spacing downward
      });
    });

    // Allow scroll
    document.querySelector("#childOne").style.height = "1500px";
  }
  function displayFive(resultSet) {
    dataPoints = [];

    // background + title
    document.querySelector("#parent-wrapper").style.background =
      "rgba(0, 80, 120, 0.25)";
    description.textContent = "MONDAY VS TUESDAY — EVENT AFFECT STRENGTH";
    description.style.color = "rgb(0, 80, 120)";

    // color gradient for after_mood_strength
    const strengthColors = [
      "#e0f7fa", "#b2ebf2", "#80deea", "#4dd0e1", "#26c6da",
      "#00bcd4", "#00acc1", "#0097a7", "#00838f", "#006064"
    ];

    // layout
    const leftX = 200;   // Monday column
    const rightX = 600;  // Tuesday column

    resultSet.forEach((e, i) => {
      let x = e.day === "Monday" ? leftX : rightX;

      // stronger affect strength pushes dot lower
      let y = 80 + e.event_affect_strength * 40;

      let color = strengthColors[e.after_mood_strength] || "#fff";

      dataPoints.push(
        new myDataPoint(
          e.dataId,
          e.day,
          e.weather,
          e.start_mood,
          e.after_mood,
          e.after_mood_strength,
          e.event_affect_strength,
          e.event_name,
          color,
          document.querySelector("#childOne"),
          "point_two"
        )
      );

      dataPoints[i].update(
        x + (Math.random() * 80 - 40), // small horizontal jitter
        y
      );
    });

    // labels
    let lblMon = document.createElement("div");
    lblMon.textContent = "MONDAY";
    lblMon.style.position = "absolute";
    lblMon.style.left = `${leftX - 20}px`;
    lblMon.style.top = "20px";
    lblMon.style.color = "black";
    lblMon.style.fontWeight = "bold";
    document.querySelector("#childOne").appendChild(lblMon);

    let lblTue = document.createElement("div");
    lblTue.textContent = "TUESDAY";
    lblTue.style.position = "absolute";
    lblTue.style.left = `${rightX - 20}px`;
    lblTue.style.top = "20px";
    lblTue.style.color = "black";
    lblTue.style.fontWeight = "bold";
    document.querySelector("#childOne").appendChild(lblTue);

    document.querySelector("#childOne").style.height = "1000px";
  }
  function displaySix(resultSet) {
    dataPoints = [];

    document.querySelector("#parent-wrapper").style.background =
      "rgba(180, 180, 200, 0.3)";
    description.textContent = "NEGATIVE → NEGATIVE MOOD TRANSITIONS BY WEATHER";
    description.style.color = "rgb(80, 60, 120)";

    // Colors for negative moods
    const moodColors = {
      sad: "#455A64",
      angry: "#B71C1C",
      neutral: "#9E9E9E",
      calm: "#4DD0E1",
      anxious: "#7B1FA2",
      moody: "#6A1B9A",
      hurt: "#8D6E63"
    };

    // group entries by weather
    const weatherMap = {};
    resultSet.forEach((e) => {
      if (!weatherMap[e.weather]) weatherMap[e.weather] = [];
      weatherMap[e.weather].push(e);
    });

    const weathers = Object.keys(weatherMap);

    let startY = 80;

    weathers.forEach((weather, index) => {
      const entries = weatherMap[weather];

      // Weather label
      const lbl = document.createElement("div");
      lbl.textContent = weather.toUpperCase();
      lbl.style.position = "absolute";
      lbl.style.left = "20px";
      lbl.style.top = `${startY - 10}px`;
      lbl.style.color = "black";
      lbl.style.fontWeight = "bold";
      document.querySelector("#childOne").appendChild(lbl);

      let x = 200;

      entries.forEach((e) => {
        // First dot = start mood color
        let dp1 = new myDataPoint(
          e.dataId,
          e.day,
          e.weather,
          e.start_mood,
          e.after_mood,
          e.after_mood_strength,
          e.event_affect_strength,
          e.event_name,
          moodColors[e.start_mood] || "black",
          document.querySelector("#childOne"),
          "point_two"
        );
        dp1.update(x, startY);

        // Second dot = after mood color
        let dp2 = new myDataPoint(
          e.dataId,
          e.day,
          e.weather,
          e.start_mood,
          e.after_mood,
          e.after_mood_strength,
          e.event_affect_strength,
          e.event_name,
          moodColors[e.after_mood] || "black",
          document.querySelector("#childOne"),
          "point_two"
        );
        dp2.update(x + 12, startY);

        x += 30; // move to next capsule
      });

      startY += 90; // move down to next weather lane
    });

    document.querySelector("#childOne").style.height = `${startY + 200}px`;
  }

  /***********************************************/
};
