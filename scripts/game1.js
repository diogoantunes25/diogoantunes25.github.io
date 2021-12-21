// TODO: Put correct info
const OBSTACLES = [
    {name: "blank", question: "O que fazes?", correctAnswer: "", wrongAnswer: ""},
    {name: "carlao", question: "O que fazes?", correctAnswer: "", wrongAnswer: ""},
    {name: "stephanie", question: "O que fazes?", correctAnswer: "", wrongAnswer: ""},
    {name: "casaLina", question: "O que fazes?", correctAnswer: "", wrongAnswer: ""},
    {name: "exame", question: "O que fazes?", correctAnswer: "", wrongAnswer: ""},
    {name: "metro", question: "O que fazes?", correctAnswer: "", wrongAnswer: ""},
    {name: "shot", question: "O que fazes?", correctAnswer: "", wrongAnswer: ""},
    {name: "boti", question: "O que fazes?", correctAnswer: "", wrongAnswer: ""},
    {name: "montanha-russa", question: "O que fazes?", correctAnswer: "", wrongAnswer: ""},
];

const MIN_TIME = 500; // 0.5 seconds between obstacles (minimum)
const TIME_DELTA = 3000; // 0.5 to 0.5 + 3 seconds between obstacles

const pegCharacter = document.getElementById("peg-character");
const obstacles = document.querySelectorAll(".obstacle");
let notColidedObstacles = [];
obstacles.forEach((obs) => {notColidedObstacles.push(obs)});

setTimeout(() => {
        obstacles.forEach((obstacle) => {
            obstacle.classList.add("moved");
        })
    }, 3000
);

const startJump = (peg) => { peg.classList.add("high"); }
const stopJump = (peg) => { peg.classList.remove("high"); }

setInterval(() => {
    notColidedObstacles.forEach( (obstacle) => {
        if (areColiding(pegCharacter, obstacle)) {
            notColidedObstacles = notColidedObstacles.filter((obs) => obs != obstacle);
            console.log("collision");
        }
    })}
, 200);


const areColiding = (a, b) => {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}

const removeLife = () => {
};

function obstacle () {
    const i = Math.floor(Math.random() * 8);
    const newObstacle = document.createElement("div");
    const obstacleList = document.querySelector(".obstacles-container");
    notColidedObstacles.push(newObstacle);
    obstacleList.appendChild(newObstacle);
    newObstacle.classList.add(`obstacle-${i}`);
    newObstacle.classList.add(`obstacle`);
    setTimeout(() => {
        newObstacle.classList.add("moved");
    }, 2);

    setTimeout(() => {
        newObstacle.remove();
        notColidedObstacles = notColidedObstacles.filter((obs) => obs != newObstacle);
    }, 30000);


    return newObstacle;
} 

window.addEventListener("space", () => (jump(pegCharacter)));
window.addEventListener("touchstart", () => {
        startJump(pegCharacter);
        setTimeout(() => stopJump(pegCharacter), 300);
    }
);

const newTimeout = () => {
    setTimeout(() => {
        obstacle();
        newTimeout();
    }, MIN_TIME + Math.floor(Math.random() * TIME_DELTA));
}

newTimeout();
