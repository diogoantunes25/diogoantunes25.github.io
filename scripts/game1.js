// TODO: Put correct info
const OBSTACLES = [
    {name: "blank", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            console.log(`Parsing ${this.name}`);
        }
    },
    {name: "carlao", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            console.log(`Parsing ${this.name}`);
        }
    },
    {name: "stephanie", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            console.log(`Parsing ${this.name}`);
        }
    },
    {name: "casaLina", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            console.log(`Parsing ${this.name}`);
        }
    },
    {name: "exame", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            console.log(`Parsing ${this.name}`);
        }
    },
    {name: "metro", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            console.log(`Parsing ${this.name}`);
        },
    },
    {name: "shot", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            console.log(`Parsing ${this.name}`);
        },
    },
    {name: "boti", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            console.log(`Parsing ${this.name}`);
        },
    },
    {name: "montanha-russa", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            console.log(`Parsing ${this.name}`);
        },
    }
];

const MIN_TIME = 500; // 0.5 seconds between obstacles (minimum)
const TIME_DELTA = 3000; // 0.5 to 0.5 + 3 seconds between obstacles

const pegCharacter = document.getElementById("peg-character");
const progressBar = document.querySelector(".filled-bar");
const obstacles = document.querySelectorAll(".obstacle");
const lifeContainer = document.querySelector(".life-container");
const booleanQuestion = document.querySelector(".boolean-question");
const multipleChoiceQuestion = document.querySelector(".multiple-choice-question");
let time = 0;
let lifes = 5;
let playing = true;
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
            parseCollition(obstacle.obstacle);
        }
    })}
, 200);

const parseCollition = (obj) => {
    playing = false;
    if (obj.parse()) removeLife();
    removeLife(); // TODO: This only happens if people make the wrong choice
    // TODO: remove event listener for jumping
    notColidedObstacles.forEach(obj => obj.remove());
};

setInterval(() => { increaseProgressBar(); }, 1200);

const increaseProgressBar = () => {
    if (playing) {
        progressBar.style.width = `${time}%`;
        time += 1;
    }
}

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
    lifes--;
    lifeContainer.children[lifes].style.opacity = 0;
};

function obstacle () {
    const i = Math.floor(Math.random() * 8);
    const newObstacle = document.createElement("div");
    const obstacleList = document.querySelector(".obstacles-container");
    notColidedObstacles.push(newObstacle);
    obstacleList.appendChild(newObstacle);
    newObstacle.classList.add(`obstacle-${i}`);
    newObstacle.classList.add(`obstacle`);
    newObstacle.obstacle = OBSTACLES[i];
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
        if (playing) obstacle();
        newTimeout();
    }, MIN_TIME + Math.floor(Math.random() * TIME_DELTA));
}

newTimeout();

const showBooleanQuestion = (question, correctAnswer, wrongAnswer) => {
    let correctI = Math.floor(Math.random() * 2);
    booleanQuestion.children[0].textContent = question;
    booleanQuestion.children[correctI + 1].textContent = correctAnswer;
    for (let i = 1; i < 5; i++) {
        let child = booleanQuestion.children[i];
        if (booleanQuestion.children[correctI + 1 != child]) {
            child.textContent = wrongAnswers[aux];
            aux++;
        }
    }

    booleanQuestion.parentElement.style.display = "block";
    booleanQuestion.style.display = "block";
};

const showMultipleChoice = (question, correctAnswer, wrongAnswers) => {
    let correctI = Math.floor(Math.random() * 4);
    let aux = 0;
    multipleChoiceQuestion.children[0].textContent = question;
    multipleChoiceQuestion.children[correctI + 1].textContent = correctAnswer;
    for (let i = 1; i < 5; i++) {
        let child = multipleChoiceQuestion.children[i];
        if (multipleChoiceQuestion.children[correctI + 1] != child) {
            child.textContent = wrongAnswers[aux];
            aux++;
        }
    }

    multipleChoiceQuestion.parentElement.style.display = "block";
    multipleChoiceQuestion.style.display = "block";
};


setTimeout(() => {
    showBooleanQuestion("a", "b", "c");
}, 1000);
