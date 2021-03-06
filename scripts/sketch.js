// Bakeoff #2 - Seleção de Alvos Fora de Alcance
// IPM 2021-22, Período 3
// Entrega: até dia 22 de Abril às 23h59 através do Fenix
// Bake-off: durante os laboratórios da semana de 18 de Abril

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER = "5-AL";      // Add your group number here as an integer (e.g., 2, 3)
const BAKE_OFF_DAY = false;  // Set to 'true' before sharing during the bake-off day

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

const NEARBY_DISTANCE = 1/2;

let sound = {
    success: null,
    error: null,
};

// Cursor information
let snapCursor = {x: 0, y: 0, i: 0};
let lastPosition = {x: 0, y: 0};

// Color settings
COLORS = {}


// Target class (position and width)
class Target {
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
    }
}

function preload() {
    soundFormats('mp3');
    sound.success = loadSound("assets/success.mp3");
    sound.error = loadSound("assets/error.mp3");
}

// Runs once at the start
function setup() {
    createCanvas(700, 500);    // window size in px before we go into fullScreen()
    frameRate(60);             // frame rate (DO NOT CHANGE!)

    randomizeTrials();         // randomize the trial order at the start of execution

    textFont("Arial", 18);     // font size for the majority of the text
    drawUserIDScreen();        // draws the user start-up screen (student ID and display size)

    setUpColorScheme();
}

function setUpColorScheme() {
    COLORS.SNAP_CURSOR = color(67, 235, 52);
    COLORS.GHOST_CURSOR = color(132, 0, 255);
    COLORS.TARGET_MAIN = color(255,0,94);
    COLORS.NEXT_MAIN = color(0, 47, 255);
    COLORS.DEFAULT_MAIN = color(0,187,255);
    // COLORS.HOVER_TARGET_MINIATURE = color(55, 255, 0);
    COLORS.HOVER_TARGET_MINIATURE = color(255, 0, 0);
    COLORS.NEXT_MINIATURE = color(255,255,255);
    COLORS.HOVER_DEFAULT_MINIATURE = color(82, 82, 82);
    COLORS.TARGET_MINIATURE = color(255, 0, 0);
}


// Runs every frame and redraws the screen
function draw() {

    if (draw_targets) {
        // The user is interacting with the 6x3 target grid

        // Sets background to black
        background(color(0, 0, 0));        

        // Print trial count at the top left-corner of the canvas
        fill(color(255, 255, 255));
        textAlign(LEFT);

        text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

        strokeWeight(30);

        // Draw line from current to next target
        stroke(66, 66, 66);
        currentBounds = getTargetBounds(trials[current_trial]);
        nextBounds = getTargetBounds(trials[current_trial + 1]);
        line(currentBounds.x, currentBounds.y, nextBounds.x, nextBounds.y);

        // Draw line from previous to current target
        stroke(255,255,255);
        currentBounds = getTargetBounds(trials[current_trial]);
        previousBounds = getTargetBounds(trials[current_trial - 1]);
        line(currentBounds.x, currentBounds.y, previousBounds.x, previousBounds.y);

        // Draws grid around targets
        drawGrid();

        strokeWeight(2);

        // Draw all 18 targets
        for (var i = 0; i < 18; i++) drawTarget(i);

        // Draw the user input area
        drawInputArea();

        // Draw instructions
        drawInstructions();

        // Draw the (free) ghost cursor
        drawGhostCursor();

        // Draw the (real) snap cursor
        drawSnapCursor();

        // Draw the miniature of the targets on the input area
        drawMiniature();
    }
}

// Draw instructions
function drawInstructions() {
        stroke(color(255,255,255));
        strokeWeight(7);
        fill(color(255,0,94));
        circle(width * 0.6, height * 0.3, TARGET_SIZE);

        textSize(50);
        noStroke();
        fill(color(255,255,255));
        text("Instructions", width * 0.6, height * 0.2);

        textSize(30);
        text("Target repeated - double click", width * 0.6 + TARGET_SIZE, height * 0.3 + TARGET_SIZE / 4);
        strokeWeight(2);

        textSize(20);
        fill(color(0,0,0));
        noStroke();
        textStyle(BOLD);
        text("2x", width * 0.6 - TARGET_SIZE / 5, height * 0.3 + TARGET_SIZE / 7);
        textStyle(NORMAL);
}

function drawGrid() {
    const MARGIN_TOP = TOP_PADDING + MARGIN - TARGET_SIZE / 2;
    const BOX_HEIGHT = MARGIN + 5 * (TARGET_SIZE + TARGET_PADDING);
    const MARGIN_LEFT = LEFT_PADDING + MARGIN - TARGET_SIZE / 2;
    const BOX_WIDTH = MARGIN + 2 * (TARGET_SIZE + TARGET_PADDING);

    const COL1 = LEFT_PADDING + MARGIN;
    const ROW1 = TOP_PADDING + MARGIN;
    const COL_COUNT = 3;
    const ROW_COUNT = 6;

    const CELL_SIDE = (TARGET_PADDING + TARGET_SIZE);

    strokeWeight(2);

    for (let i = 0; i < COL_COUNT + 1; i++) {
        line(COL1 + (TARGET_PADDING + TARGET_SIZE) * i - CELL_SIDE / 2, MARGIN_TOP - CELL_SIDE / 4, COL1 + (TARGET_PADDING + TARGET_SIZE) * i - CELL_SIDE / 2, MARGIN_TOP + BOX_HEIGHT + CELL_SIDE / 4); 
    }

    for (let i = 0; i < ROW_COUNT + 1; i++) {
        line(MARGIN_LEFT - CELL_SIDE / 4, ROW1 + (TARGET_PADDING + TARGET_SIZE) * i - CELL_SIDE / 2,MARGIN_LEFT + BOX_WIDTH + CELL_SIDE / 4, ROW1 + (TARGET_PADDING + TARGET_SIZE) * i - CELL_SIDE / 2);
    }
}

function distanceCursorTarget(i) {
    let virtualX = map(mouseX, inputArea.x, inputArea.x + inputArea.w, 0, width);
    let virtualY = map(mouseY, inputArea.y, inputArea.y + inputArea.h, 0, height);

    target = getTargetBounds(i);

    distance = Math.sqrt((target.x - virtualX) ** 2 + (target.y - virtualY) ** 2);
    
    return distance;
}

function getClosestTarget() {
    let closestDistance = distanceCursorTarget(0);
    let closest = 0;
    let distance;
    
    for (var i = 1; i < 18; i++) {
        distance = distanceCursorTarget(i);
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = i;
        }
    }

    return closest;
}

function drawSnapCursor() {
    closest = getClosestTarget();
    closestBounds = getTargetBounds(closest);

    snapCursor.i = closest;
    snapCursor.x = closestBounds.x;
    snapCursor.y = closestBounds.y;

    fill(COLORS.SNAP_CURSOR);
    circle(closestBounds.x, closestBounds.y, 0.5 * PPCM);
}

// Draw the fake virtual cursor (does not snap)
function drawGhostCursor() {
    let x = map(mouseX, inputArea.x, inputArea.x + inputArea.w, 0, width);
    let y = map(mouseY, inputArea.y, inputArea.y + inputArea.h, 0, height);

    const CURSOR_RADIUS = PPCM / 2;
    const CELL_SIDE = (TARGET_PADDING + TARGET_SIZE);
    const MARGIN_TOP = TOP_PADDING + MARGIN - TARGET_SIZE / 2 - CELL_SIDE/4 + CURSOR_RADIUS / 2;
    const BOX_HEIGHT = MARGIN + 5 * (TARGET_SIZE + TARGET_PADDING) + CELL_SIDE /2 - CURSOR_RADIUS;
    const MARGIN_LEFT = LEFT_PADDING + MARGIN - TARGET_SIZE / 2 - CELL_SIDE/4 + CURSOR_RADIUS / 2;
    const BOX_WIDTH = MARGIN + 2 * (TARGET_SIZE + TARGET_PADDING) + CELL_SIDE/2 - CURSOR_RADIUS;

    // If cursor goes out of container box, move it back in
    if (x < MARGIN_LEFT) {
        x = MARGIN_LEFT;
        mouseX = map(x, 0, width, inputArea.x, inputArea.x + inputArea.w);
    }
    else if (x > MARGIN_LEFT + BOX_WIDTH) {
        x = MARGIN_LEFT + BOX_WIDTH;   
        mouseX = map(x, 0, width, inputArea.x, inputArea.x + inputArea.w);
    }

    if (y < MARGIN_TOP) {
        y = MARGIN_TOP;
        mouseY = map(y, 0, height, inputArea.y, inputArea.y + inputArea.h);
    }
    else if (y > MARGIN_TOP + BOX_HEIGHT) {
        y = MARGIN_TOP + BOX_HEIGHT;
        mouseY = map(y, 0, height, inputArea.y, inputArea.y + inputArea.h);
    }

    fill(COLORS.GHOST_CURSOR);
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

    const INITIAL_HEIGHT = 350;
    const VARIABLE_HEIGHT = 23;

    textAlign(CENTER);
    text("Fitts index performance", width / 2, INITIAL_HEIGHT - 50);

    // Print first column of fits IDs
    for (let i = 0; i < fitts_IDs.length / 2; i++) {
        if (fitts_IDs[i] != -1) {
            text("Target " + (i + 1) + ": " + fitts_IDs[i], width/3, INITIAL_HEIGHT + VARIABLE_HEIGHT * i);
        }
        else {
            text("Target: MISSED", width/3, INITIAL_HEIGHT + VARIABLE_HEIGHT * i);
        }
    }

    // Print second column of fits IDs
    for (let i = fitts_IDs.length / 2; i < fitts_IDs.length; i++) {
        if (fitts_IDs[i] != -1) {
            text("Target " + (i + 1) + ": " + fitts_IDs[i], (width/3) * 2, INITIAL_HEIGHT + VARIABLE_HEIGHT * (i - fitts_IDs.length/2));
        }
        else {
            text("Target: MISSED", (width/3) * 2, INITIAL_HEIGHT + VARIABLE_HEIGHT * (i - fitts_IDs.length/2));
        }
    }

    // Saves results (DO NOT CHANGE!)
    let attempt_data = 
    {
        project_from:       GROUP_NUMBER,
        assessed_by:        student_ID,
        test_completed_by:  timestamp,
        attempt:            attempt,
        hits:               hits,
        misses:             misses,
        accuracy:           accuracy,
        attempt_duration:   test_time,
        time_per_target:    time_per_target,
        target_w_penalty:   target_w_penalty,
        fitts_IDs:          fitts_IDs
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

function getFittsId() {
    if (current_trial == 0) return 0;
    distance = dist(mouseX, lastPosition.x, mouseY, lastPosition.y);
    lastPosition.x = mouseX;
    lastPosition.y = mouseY;

    return Math.log2(distance/TARGET_SIZE + 1);
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() {
    // Only look for mouse releases during the actual test
    // (i.e., during target selections)


    if (draw_targets) {
        // Get the location and size of the target the user should be trying to select
        let target = getTargetBounds(trials[current_trial]);

        // Check to see if the snap virtual cursor is inside the target bounds,
        // increasing either the 'hits' or 'misses' counters

        if (insideInputArea(mouseX, mouseY)) {
            if (dist(target.x,target.y, snapCursor.x, snapCursor.y) < target.w / 2) {
                hits++;
                sound.success.play();
                fitts_IDs.push(getFittsId());
            }
            else {
                misses++;
                sound.error.play();
                fitts_IDs.push(-1);
            }

            current_trial++;                 // Move on to the next trial/target
        }

        // Check if the user has completed all 54 trials
        if (current_trial === trials.length) {

            noStroke();

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
        else if (current_trial === 1) testStartTime = millis();
    }
}

// Draw target on-screen
function drawTarget(i) {
    // Get the location and size for target (i)
    let target = getTargetBounds(i);

    // Marks current target
    if (i == trials[current_trial]) {
        if (trials[current_trial] == trials[current_trial + 1]) {
            stroke(color(255,255,255));
            strokeWeight(4);
        }
        
        fill(COLORS.TARGET_MAIN);
    }
    // Marks next target
    else if (i == trials[current_trial + 1]){
        stroke(color(255,255,255));
        fill(COLORS.NEXT_MAIN);
    }
    else {
        fill(COLORS.DEFAULT_MAIN);
    }

    circle(target.x, target.y, target.w);
    strokeWeight(1);

    // Mark duplicate target (current equals the next target)
    if (i == trials[current_trial] && i == trials[current_trial + 1]) {
        textSize(20);
        fill(color(0,0,0));
        noStroke();
        textStyle(BOLD);
        text("2x", target.x - TARGET_SIZE / 5, target.y + TARGET_SIZE / 7);
        textStyle(NORMAL);
    }

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

function drawMiniature() {

    // Original dimensions and positions
    const CURSOR_RADIUS = PPCM / 2;
    const CELL_SIDE = (TARGET_PADDING + TARGET_SIZE);
    const MARGIN_TOP = TOP_PADDING + MARGIN - TARGET_SIZE / 2 - CELL_SIDE/4 + CURSOR_RADIUS / 2;
    const MARGIN_LEFT = LEFT_PADDING + MARGIN - TARGET_SIZE / 2 - CELL_SIDE/4 + CURSOR_RADIUS / 2;
    const COL_COUNT = 3;
    const ROW_COUNT = 6;

    // Get new dimensions and positions
    x1 = map(MARGIN_LEFT, 0, width, inputArea.x, inputArea.x + inputArea.w);
    y1 = map(MARGIN_TOP, 0, height, inputArea.y, inputArea.y + inputArea.h);
    cell_side = map(CELL_SIDE, 0, width, inputArea.x, inputArea.x + inputArea.w) - inputArea.x;
    x2 = x1 + cell_side * COL_COUNT;
    y2 = y1 + cell_side * ROW_COUNT;
    target_padding = map(MARGIN_LEFT, 0, width, inputArea.x, inputArea.x + inputArea.w) - inputArea.x;
    target = map(MARGIN_LEFT, 0, width, inputArea.x, inputArea.x + inputArea.w) - inputArea.x;

    stroke(255,255,255);
    strokeWeight(2);

    // Draw miniature skeleton
    for (let i = 0; i < COL_COUNT + 1; i++) {
        line(x1 + cell_side * i, y1, x1 + cell_side * i, y2);
    }

    for (let i = 0; i < ROW_COUNT + 1; i++) {
        line(x1, y1 + cell_side * i, x2, y1 + cell_side * i);
    }
    
    // Paint selected target
    fill(COLORS.TARGET_MINIATURE);
    xSelected = x1 + cell_side * (trials[current_trial] % 3);
    ySelected = y1 + cell_side * Math.floor(trials[current_trial] / 3);
    rect(xSelected, ySelected, cell_side, cell_side);

    xNext = x1 + cell_side * (trials[current_trial + 1] % 3);
    yNext = y1 + cell_side * Math.floor(trials[current_trial + 1] / 3);

    if (trials[current_trial] == trials[current_trial+1]) {
        strokeWeight(5); 
        stroke(255,255,255);
        rect(xSelected, ySelected, cell_side, cell_side);
        strokeWeight(2);
    }

    // Paint next target
    else {
        fill(COLORS.NEXT_MINIATURE);
        rect(xNext, yNext, cell_side, cell_side);
    }

    // Paint hover
    xHover = x1 + cell_side * (snapCursor.i % 3);
    yHover = y1 + cell_side * Math.floor(snapCursor.i / 3);
    if (snapCursor.i == trials[current_trial]) fill(COLORS.HOVER_TARGET_MINIATURE); else fill(COLORS.HOVER_DEFAULT_MINIATURE);
    rect(xHover, yHover, cell_side, cell_side);

    // Paint duplicate
    if (trials[current_trial] == trials[current_trial+1]) {
        noStroke();
        fill(0,0,0);
        text("2x", xSelected + cell_side / 4, ySelected + cell_side * 7 / 10);
    }
}
