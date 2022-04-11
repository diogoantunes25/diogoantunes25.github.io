// Bakeoff #2 - Seleção de Alvos Fora de Alcance
// IPM 2021-22, Período 3
// Entrega: até dia 22 de Abril às 23h59 através do Fenix
// Bake-off: durante os laboratórios da semana de 18 de Abril

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER = 0;      // Add your group number here as an integer (e.g., 2, 3)
const BAKE_OFF_DAY = true;  // Set to 'true' before sharing during the bake-off day

// Target and grid properties (DO NOT CHANGE!)
let PPI, PPCM;
let TARGET_SIZE;
let TARGET_PADDING, MARGIN, LEFT_PADDING, TOP_PADDING;
let continue_button;
let inputArea = { x: 0, y: 0, h: 0, w: 0 }    // Position and size of the user input area

// Metrics
let testStartTime, testEndTime;// time between the start and end of one attempt (54 trials)
let hits = 0;      // number of successful selections
let misses = 0;      // number of missed selections (used to calculate accuracy)
let database;                  // Firebase DB  

// Study control parameters
let draw_targets = false;  // used to control what to show in draw()
let trials = [];     // contains the order of targets that activate in the test
let current_trial = 0;      // the current trial number (indexes into trials array above)
let attempt = 0;      // users complete each test twice to account for practice (attemps 0 and 1)
let fitts_IDs = [];     // add the Fitts ID for each selection here (-1 when there is a miss)

// Versions

const NEARBY_DISTANCE = 3/5;

const VERSIONS = {
	V1: 0, // Colors
	V2: 1, // Colors + line to next
	V3: 2, // Colors + line to next and to previous
	V4: 3, // Colors + line to next + background change
	V5: 4, // Colors + line to next and to previous + background change
	V6: 5, // Colors + line to next and to previous + box
	V7: 6, // Colors + line to next and to previous + different color for next
	V8: 7, // Colors + line to next and to previous + different color for next + cursor changes color
	V9: 8, // Colors + line to next and to previous + different color for next + target changes color
    TEST_1_1: 9,
    TEST_1_2: 10,
    TEST_1_3: 11,
    TEST_1_4: 12,
    TEST_2_1: 13,
    TEST_2_2: 14,
	count: 15
};

const VERSIONS_TO_TEST = [
    VERSIONS.TEST_1_1,
    VERSIONS.TEST_1_2,
    VERSIONS.TEST_1_3,
    VERSIONS.TEST_1_4,
];

let version;

const CURRENT_REPEATED_FACTOR = 1.8;

// Target class (position and width)
class Target {
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
    }
}

// Runs once at the start
function setup() {
    createCanvas(700, 500);    // window size in px before we go into fullScreen()
    frameRate(60);             // frame rate (DO NOT CHANGE!)

    selectVersion();

    randomizeTrials();         // randomize the trial order at the start of execution

    textFont("Arial", 18);     // font size for the majority of the text
    drawUserIDScreen();        // draws the user start-up screen (student ID and display size)
}

function selectVersion() {
    do {
        version = Math.floor(Math.random() * VERSIONS.count);
    } while (!VERSIONS_TO_TEST.includes(version)); 


    // Create div to store the version

    let div = document.createElement("div");
    document.body.appendChild(div);

    if (version == VERSIONS.TEST_1_1) {
        div.textContent = "Teste 1_1";
    } else if (version == VERSIONS.TEST_1_2) {
        div.textContent = "Teste 1_2";
    } else if (version == VERSIONS.TEST_1_3) {
        div.textContent = "Teste 1_3";
    } else if (version == VERSIONS.TEST_1_4) {
        div.textContent = "Teste 1_4";
    } else {
        div.textContent = "No test"
    }

	console.log("The version is " + (version + 1));
}

// Runs every frame and redraws the screen
function draw() {
    if (draw_targets) {
        // The user is interacting with the 6x3 target grid

        // Sets background to black
        let target = getTargetBounds(trials[current_trial]);
        background(color(0, 0, 0));        
        if (insideInputArea(mouseX, mouseY)) {
            let virtual_x = map(mouseX, inputArea.x, inputArea.x + inputArea.w, 0, width)
            let virtual_y = map(mouseY, inputArea.y, inputArea.y + inputArea.h, 0, height)

            if (version == VERSIONS.V4 || version == VERSIONS.V5) {
                if (dist(target.x, target.y, virtual_x, virtual_y) < target.w * NEARBY_DISTANCE) background(color(34, 255, 0));
            }
        }

        // Print trial count at the top left-corner of the canvas
        fill(color(255, 255, 255));
        textAlign(LEFT);
        text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

        if (version != VERSIONS.V1) {
            // Draw line from current to next target
            stroke(66, 66, 66);
            currentBounds = getTargetBounds(trials[current_trial]);
            nextBounds = getTargetBounds(trials[current_trial + 1]);
            line(currentBounds.x, currentBounds.y, nextBounds.x, nextBounds.y);
        }

        if (version == VERSIONS.V3 || version == VERSIONS.V5 || version == VERSIONS.V6) {
            // Draw line from previous to current target
            stroke(255,255,255);
            currentBounds = getTargetBounds(trials[current_trial]);
            previousBounds = getTargetBounds(trials[current_trial - 1]);
            line(currentBounds.x, currentBounds.y, previousBounds.x, previousBounds.y);
        }

        // Draw all 18 targets
        for (var i = 0; i < 18; i++) drawTarget(i);

        // Draw the user input area
        drawInputArea();

        updateCursor();
        // Draw container box
        if (version == VERSIONS.V6 || version == VERSIONS.TEST_1_2 || version == VERSIONS.TEST_1_4) {

            const marginTop = TOP_PADDING + MARGIN - TARGET_SIZE / 2;
            const boxHeight = MARGIN + 5 * (TARGET_SIZE + TARGET_PADDING);
            const marginLeft = LEFT_PADDING + MARGIN - TARGET_SIZE / 2;
            const boxWidth = MARGIN + 2 * (TARGET_SIZE + TARGET_PADDING);

            line(marginLeft, marginTop, marginLeft, marginTop + boxHeight);
            line(marginLeft, marginTop, marginLeft + boxWidth, marginTop);
            line(marginLeft, marginTop + boxHeight, marginLeft + boxWidth, marginTop + boxHeight);
            line(marginLeft + boxWidth, marginTop, marginLeft + boxWidth, marginTop + boxHeight);
        }
    }
}

function updateCursor() {
    // Draw the virtual cursor
    let x = map(mouseX, inputArea.x, inputArea.x + inputArea.w, 0, width);
    let y = map(mouseY, inputArea.y, inputArea.y + inputArea.h, 0, height);

    const cursorRadius = PPCM / 2;

    const marginTopModified = TOP_PADDING + MARGIN - TARGET_SIZE / 2 + cursorRadius / 2;
    const boxHeightModified = MARGIN + 5 * (TARGET_SIZE + TARGET_PADDING) - cursorRadius;

    const marginLeftModified = LEFT_PADDING + MARGIN - TARGET_SIZE / 2 + cursorRadius / 2;
    const boxWidthModified = MARGIN + 2 * (TARGET_SIZE + TARGET_PADDING) - cursorRadius;

    if (version == VERSIONS.V6 || version == VERSIONS.TEST_1_2 || version == VERSIONS.TEST_1_4) {
		if (x < marginLeftModified) {
		    x = marginLeftModified;
		    mouseX = map(x, 0, width, inputArea.x, inputArea.x + inputArea.w);
		}
		else if (x > marginLeftModified + boxWidthModified) {
		    x = marginLeftModified + boxWidthModified;   
		    mouseX = map(x, 0, width, inputArea.x, inputArea.x + inputArea.w);
		}

		if (y < marginTopModified) {
		    y = marginTopModified;
		    mouseY = map(y, 0, height, inputArea.y, inputArea.y + inputArea.h);
		}
		else if (y > marginTopModified + boxHeightModified) {
		    y = marginTopModified + boxHeightModified;
		    mouseY = map(y, 0, height, inputArea.y, inputArea.y + inputArea.h);
		}

	}

    if (version == VERSIONS.V8 || version == VERSIONS.TEST_1_1 || version == VERSIONS.TEST_1_2) {

        let target = getTargetBounds(trials[current_trial]);
        let virtual_x = map(mouseX, inputArea.x, inputArea.x + inputArea.w, 0, width)
        let virtual_y = map(mouseY, inputArea.y, inputArea.y + inputArea.h, 0, height)

        if (dist(target.x, target.y, virtual_x, virtual_y) < target.w * NEARBY_DISTANCE) {
            fill(color(34, 255, 0));
        }
        else {
            fill(color(132, 0, 255));
        }
    }
    else {
        fill(color(132, 0, 255));
    }

	circle(x, y, 0.5 * PPCM);

}

// Print and save results at the end of 54 trials
function printAndSavePerformance() {
    // DO NOT CHANGE THESE! 
    let accuracy = parseFloat(hits * 100) / parseFloat(hits + misses);
    let test_time = (testEndTime - testStartTime) / 1000;
    let time_per_target = nf((test_time) / parseFloat(hits + misses), 0, 3);
    let penalty = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
    let target_w_penalty = nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
    let timestamp = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();

    background(color(0, 0, 0));   // clears screen
    fill(color(255, 255, 255));   // set text fill color to white
    text(timestamp, 10, 20);    // display time on screen (top-left corner)

    textAlign(CENTER);
    text("Attempt " + (attempt + 1) + " out of 2 completed!", width / 2, 60);
    text("Hits: " + hits, width / 2, 100);
    text("Misses: " + misses, width / 2, 120);
    text("Accuracy: " + accuracy + "%", width / 2, 140);
    text("Total time taken: " + test_time + "s", width / 2, 160);
    text("Average time per target: " + time_per_target + "s", width / 2, 180);
    text("Average time for each target (+ penalty): " + target_w_penalty + "s", width / 2, 220);

    // Print Fitts IDS (one per target, -1 if failed selection, optional)
    // 

    // Saves results (DO NOT CHANGE!)
    let attempt_data =
    {
        project_from: GROUP_NUMBER,
        assessed_by: student_ID,
        test_completed_by: timestamp,
        attempt: attempt,
        hits: hits,
        misses: misses,
        accuracy: accuracy,
        attempt_duration: test_time,
        time_per_target: time_per_target,
        target_w_penalty: target_w_penalty,
        fitts_IDs: fitts_IDs
    }

    // Send data to DB (DO NOT CHANGE!)
    if (BAKE_OFF_DAY) {
        // Access the Firebase DB
        if (attempt === 0) {
            firebase.initializeApp(firebaseConfig);
            database = firebase.database();
        }

        // Add user performance results
        let db_ref = database.ref('G' + GROUP_NUMBER);
        db_ref.push(attempt_data);
    }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() {
    // Only look for mouse releases during the actual test
    // (i.e., during target selections)
    updateCursor();

    if (draw_targets) {
        // Get the location and size of the target the user should be trying to select
        let target = getTargetBounds(trials[current_trial]);

        // Check to see if the virtual cursor is inside the target bounds,
        // increasing either the 'hits' or 'misses' counters

        if (insideInputArea(mouseX, mouseY)) {
            let virtual_x = map(mouseX, inputArea.x, inputArea.x + inputArea.w, 0, width)
            let virtual_y = map(mouseY, inputArea.y, inputArea.y + inputArea.h, 0, height)

            if (dist(target.x, target.y, virtual_x, virtual_y) < target.w / 2) hits++;
            else misses++;

            current_trial++;                 // Move on to the next trial/target
        }

        // Check if the user has completed all 54 trials
        if (current_trial === trials.length) {
            testEndTime = millis();
            draw_targets = false;          // Stop showing targets and the user performance results
            printAndSavePerformance();     // Print the user's results on-screen and send these to the DB
            attempt++;

            // If there's an attempt to go create a button to start this
            if (attempt < 2) {
                continue_button = createButton('START 2ND ATTEMPT');
                continue_button.mouseReleased(continueTest);
                continue_button.position(width / 2 - continue_button.size().width / 2, height / 2 - continue_button.size().height / 2);
            }
        }
    }
}

// Draw target on-screen
function drawTarget(i) {
    // Get the location and size for target (i)
    let target = getTargetBounds(i);

    // Check whether this target is the target the user should be trying to select
    if (trials[current_trial] === i) {
        // Highlights the target the user should be trying to select
        // with a white border
        stroke(color(220, 220, 220));
        strokeWeight(2);

        // Remember you are allowed to access targets (i-1) and (i+1)
        // if this is the target the user should be trying to select
        //
    }
    // Does not draw a border if this is not the target the user
    // should be trying to select
    else noStroke();

    // Draws the target
    if (i == trials[current_trial]) {
        if (version != VERSIONS.V1) {
            if (trials[current_trial] == trials[current_trial + 1]) {
                stroke(color(255,255,255));
                strokeWeight(4);
            }
        }


        if (version == VERSIONS.V9 || version == VERSIONS.TEST_1_3 || version == VERSIONS.TEST_1_4) {
            let virtual_x = map(mouseX, inputArea.x, inputArea.x + inputArea.w, 0, width)
            let virtual_y = map(mouseY, inputArea.y, inputArea.y + inputArea.h, 0, height)
            let target = getTargetBounds(trials[current_trial]);

            if (dist(target.x, target.y, virtual_x, virtual_y) < target.w * NEARBY_DISTANCE) {
                fill(color(34, 255, 0));
            }
            else {
                fill(color(255,0,94));
            }
        }
        else {
            fill(color(255,0,94));
        }

    }
    else if (i == trials[current_trial + 1]){
        // Special case: current == next 
        stroke(color(255,255,255));
        fill(color(0, 47, 255));
    }
    else {
        fill(color(0,187,255));
    }

    circle(target.x, target.y, target.w);
    strokeWeight(1);
}

// Returns the location and size of a given target
function getTargetBounds(i) {
    var x = parseInt(LEFT_PADDING) + parseInt((i % 3) * (TARGET_SIZE + TARGET_PADDING) + MARGIN);
    var y = parseInt(TOP_PADDING) + parseInt(Math.floor(i / 3) * (TARGET_SIZE + TARGET_PADDING) + MARGIN);

    return new Target(x, y, TARGET_SIZE);
}

// Evoked after the user starts its second (and last) attempt
function continueTest() {
    // Re-randomize the trial order
    shuffle(trials, true);
    current_trial = 0;
    print("trial order: " + trials);

    // Resets performance variables
    hits = 0;
    misses = 0;
    fitts_IDs = [];

    continue_button.remove();

    // Shows the targets again
    draw_targets = true;
    testStartTime = millis();
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    let display = new Display({ diagonal: display_size }, window.screen);

    // DO NOT CHANGE THESE!
    PPI = display.ppi;                        // calculates pixels per inch
    PPCM = PPI / 2.54;                         // calculates pixels per cm
    TARGET_SIZE = 1.5 * PPCM;                         // sets the target size in cm, i.e, 1.5cm
    TARGET_PADDING = 1.5 * PPCM;                         // sets the padding around the targets in cm
    MARGIN = 1.5 * PPCM;                         // sets the margin around the targets in cm

    // Sets the margin of the grid of targets to the left of the canvas (DO NOT CHANGE!)
    LEFT_PADDING = width / 3 - TARGET_SIZE - 1.5 * TARGET_PADDING - 1.5 * MARGIN;

    // Sets the margin of the grid of targets to the top of the canvas (DO NOT CHANGE!)
    TOP_PADDING = height / 2 - TARGET_SIZE - 3.5 * TARGET_PADDING - 1.5 * MARGIN;

    // Defines the user input area (DO NOT CHANGE!)
    inputArea = {
        x: width / 2 + 2 * TARGET_SIZE,
        y: height / 2,
        w: width / 3,
        h: height / 3
    }

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
}

// Responsible for drawing the input area
function drawInputArea() {
    noFill();
    stroke(color(220, 220, 220));
    strokeWeight(2);

    rect(inputArea.x, inputArea.y, inputArea.w, inputArea.h);
}
