// TODO: Put correct info

const LINA_QUESTIONS = [
    {
        question: "Quando foi criado o lina?",
        correctAnswer: "Junho de 2017",
        wrongAnswers: ["Julho de 2017", "Junho de 2018", "Julho de 2018"],
    },
    {
        question: "Quantos membros existiam no dia de criação do lina.",
        correctAnswer: "7",
        wrongAnswers: ["5", "6", "8"],
    },
    {
        question: "Qual o significado da rosa?",
        correctAnswer: "Senhoria do apartamento do Nuno",
        wrongAnswers: ["Empregrada do dinho", "Flor favorita dos membros", "Nome da prima de um membro"],
    },
    {
        question: "Quando foi crido lina e binas?",
        correctAnswer: "Setembro de 2019",
        wrongAnswers: ["Outubro de 2019", "Agosto de 2018", "Outubro de 2018"],
    },
    {
        question: "Que linas se conhecem há mais tempo?",
        correctAnswer: "Peg, xu, mario, nuno",
        wrongAnswers: ["Peg, xu, be, nuno", "Mario, peg, be, nuno", "Renata, dinho, mario, peg"],
    },
    {
        question: "Como surgiu o nome xu?",
        correctAnswer: "Liga-te elvas",
        wrongAnswers: ["Campo de ferias MTA", "Projeto de ferias 2º ciclo", "Verao do 9º ano"],
    },
    {
        question: "Qual a bebida favorita do peg?",
        correctAnswer: "Leite morno",
        wrongAnswers: ["Absinto", "Vodka", "Espumante"],
    },
    {
        question: "Quantos jantares de Natal já se celebraram no grupo?",
        correctAnswer: "2",
        wrongAnswers: ["1", "3", "4"],
    },
    {
        question: "Qual o nome da mãe do peg?",
        correctAnswer: "Albertina",
        wrongAnswers: ["Concertina", "Jorgina", "Valentina"],
    },
    {
        question: "Quem foi o/a primeiro/a lina/femea com carta?",
        correctAnswer: "Be",
        wrongAnswers: ["Peg", "H", "Boti"],
    },
    {
        question: "Para que vila se deslocaram os lina no verão de 2019",
        correctAnswer: "Seixas",
        wrongAnswers: ["Moledo", "Esposende", "Vila Praia de Ancora"],
    },
    {
        question: "Que cidade europeia iam os Lina visitar este verão?",
        correctAnswer: "Malta",
        wrongAnswers: ["Marbella", "Malaga", "Paris"],
    },
    {
        question: "Porque foi criado o grupo?",
        correctAnswer: "Organizar aniversario Iris",
        wrongAnswers: ["Organizar festa surpresa do Peg",
                        "Combinar Noite Branca",
                        "Trabalho de grupo"],
    },
    {
        question: "O grupo foi criado para organizar uma dormida. Qual a organização nessa dormida?",
        correctAnswer: "Casa 1 - xu, did, H; Casa 2 - Be, mar, nuno, peg",
        wrongAnswers: ["Casa 1 - nuno, mar, H; Casa 2 - xu, did, nuno, peg",
                        "Casa 1 - xu, did, mar; Casa 2 - Be, H, nuno, peg",
                        "Casa 1 - nuno, did, peg, dinho; Casa 2 - xu, mar, H"
        ]
    },
    {
        question: "Qual a frase que surge em latim no logo dos lina?",
        correctAnswer: "Semper fidelis",
        wrongAnswers: ["Veni vidi vici", "Carpem diem", "Cogito, ergo sum"],
    },
    {
        question: "Quantos membros do grupo têm animais de estimação?",
        correctAnswer: "7",
        wrongAnswers: ["6", "8", "10"],
    },
    {
        question: "Quantos membros tinha o lina e femeas à data da sua criação?",
        correctAnswer: "13",
        wrongAnswers: ["12", "11", "10"],
    },
    {
        question: "Qual a melhor francesinha de Braga?",
        correctAnswer: "Taberna Belga",
        wrongAnswers: ["Taberna Londrina", "Lado B", "Taberna Holandesa"],
    },
];

const OBSTACLES = [
    {name: "blank", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            removeLife();
            playing = true;
        }
    },
    {name: "carlao", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            showBooleanQuestion(
                "Que sorte, encontraste o Carlão!",
                "Ligar ao dinho",
                "Oferecer um cigarro",
                () => {
                    setText("Sabes como ele gosta de nites...");
                },
                () => {
                    setText("Mais uma noite com o dinheiro a faturar");
                }
            );
        }
    },
    {name: "stephanie", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            showBooleanQuestion(
                "Olha quem está ali ao fundo. É a Stephanie!!",
                "Fazer coisa um",
                "Fazer coisa dois",
                () => console.log("Correct"),
                () => console.log("Wrong")
            );
        }
    },
    {name: "casaLina", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            let i = Math.floor(Math.random() * LINA_QUESTIONS.length);
            let question = LINA_QUESTIONS[i];
            showMultipleChoice(
                question.question,
                question.correctAnswer,
                question.wrongAnswers,
                () => setText(""),
                () => setText("")
            )
        }
    },
    {name: "exame", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            showBooleanQuestion(
                "Oh não estou a ver a época de exames ao longe!",
                "Ir para a nova fingir que estudo",
                "Ir para santos com o xu",
                () => console.log("Correct"),
                () => console.log("Wrong")
            );
        }
    },
    {name: "metro", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            showBooleanQuestion(
                "Está na hora de ir embora",
                "Vou chamar um uber, porque não me quero perder",
                "Olha a praça do Saldanha ali ao fundo, vou apanhar o metro!",
                () => console.log("Correct"),
                () => console.log("Wrong")
            );
        },
    },
    {name: "shot", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            showBooleanQuestion(
                "O xu oferece-te um shot de absinto canabis",
                "Não sei se vou ainda",
                "Sim, claro que quero",
                () => console.log("Correct"),
                () => console.log("Wrong")
            );
        },
    },
    {name: "boti", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            showBooleanQuestion(
                "Pergunta sobre a boti 1",
                "Resposta certa",
                "Resposta errada",
                () => console.log("Correct"),
                () => console.log("Wrong")
            );
        },
    },
    {name: "montanha-russa", question: "O que fazes?", correctAnswer: "", wrongAnswer: "", 
        parse : () => {
            showBooleanQuestion(
                "Que divertido, uma montanha-russa!",
                "Tenho de fumar um nite",
                "Bora, adoro isto!",
                () => console.log("Correct"),
                () => console.log("Wrong")
            )
        },
    }
];

const MIN_TIME = 500; // 0.5 seconds between obstacles (minimum)
const TIME_DELTA = 1500; // 0.5 to 0.5 + 1.5 seconds between obstacles

const pegCharacter = document.getElementById("peg-character");
const progressBar = document.querySelector(".filled-bar");
const obstacles = document.querySelectorAll(".obstacle");
const lifeContainer = document.querySelector(".life-container");
const textContainer = document.querySelector(".text-container");
const booleanQuestion = document.querySelector(".boolean-question");
const multipleChoiceQuestion = document.querySelector(".multiple-choice-question");
let time = 0;
let lifes = 5;
let score = 0;
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

const setText = (text) => { textContainer.textContent = text; };

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
    obj.parse();
    // TODO: remove event listener for jumping
    notColidedObstacles.forEach(obj => obj.remove());
};

setInterval(() => {
    if (time == 100) { endGame(true); };
    increaseProgressBar();
    increaseScore(1);
}, 1200);

const increaseScore = (n) => {
    if (playing) {
        const scoreSpan = document.querySelector(".score-container .score");
        score += n;
        scoreSpan.textContent = score;
    }
}

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
    if (lifes == 0) { endGame(false); };
};

const endGame = (won) => {
    playing = false;
    const endContainer = document.querySelector(".end-container");
    endContainer.style.display = "flex";
    const endText = document.querySelector("end-text");
    if (won) {
        const image = document.querySelector("#win-image");
        endText.textContent = "Chegaste ao privado com sucesso!";
        image.style.display="block";
    }
    else {
        const image = document.querySelector("#lose-image");
        endText.textContent = "Mais uma noite em casa a beber leite morno...";
        image.style.display="block";
    }
};

function obstacle () {
    // let i = Math.floor(Math.random() * 30);
    // if (i > 8) i = 3;
    let i = 3;
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
        if (playing) {
            startJump(pegCharacter);
            setTimeout(() => stopJump(pegCharacter), 700);
        }
    }
);

const newTimeout = () => {
    setTimeout(() => {
        if (playing) obstacle();
        newTimeout();
    }, MIN_TIME + Math.floor(Math.random() * TIME_DELTA));
}

newTimeout();

const showBooleanQuestion = (question, correctAnswer, wrongAnswer, correctFunction, wrongFunction) => {
    let correctI = Math.floor(Math.random() * 2);

    booleanQuestion.children[0].textContent = question;

    const auxFunction1 = () => {
        console.log("Here");
        correctElement.classList.add("correct");
        wrongElement.classList.add("wrong");
        setTimeout(() => {
            correctFunction();
            textContainer.classList.add("on");
            booleanQuestion.style.display = "none";
            setTimeout(() => {
                playing = true;
                correctElement.classList.remove("correct");
                wrongElement.classList.remove("wrong");
                textContainer.classList.remove("on");
                booleanQuestion.parentElement.style.display = "none";
                // TODO: have to remove the event listener
            }, 0);
        }, 1000);
        // TODO: somehow remove the classes after showing the next text
        correctElement.removeEventListener("touchstart", auxFunction1);
        wrongElement.removeEventListener("touchstart", auxFunction2);
   }

    const auxFunction2 = () => {
        correctElement.classList.add("correct");
        wrongElement.classList.add("wrong");
        removeLife();
        setTimeout(() => {
            wrongFunction();
            textContainer.classList.add("on");
            booleanQuestion.style.display = "none";
            setTimeout(() => {
                playing = true;
                correctElement.classList.remove("correct");
                wrongElement.classList.remove("wrong");
                textContainer.classList.remove("on");
                booleanQuestion.parentElement.style.display = "none";
                // TODO: have to remove the event listener
            }, 0);
        }, 1000);
        correctElement.removeEventListener("touchstart", auxFunction1);
        wrongElement.removeEventListener("touchstart", auxFunction2);
    };

    const correctElement = booleanQuestion.children[correctI + 1];
    correctElement.textContent = correctAnswer;
    correctElement.addEventListener("touchstart", auxFunction1);

    const wrongElement = booleanQuestion.children[2 - correctI]
    wrongElement.textContent = wrongAnswer;
    wrongElement.addEventListener("touchstart", auxFunction2);

    booleanQuestion.parentElement.style.display = "block";
    booleanQuestion.style.display = "block";
};

const showMultipleChoice = (question, correctAnswer, wrongAnswers, correctFunction, wrongFunction) => {
    let correctI = Math.floor(Math.random() * 4) + 1;
    let aux = 0;

    multipleChoiceQuestion.children[0].textContent = question;

    const correctElement = multipleChoiceQuestion.children[correctI] ;
    correctElement.textContent = correctAnswer;

    const wrongElements = [];

    for (let i = 1; i < 5; i++) {
        let child = multipleChoiceQuestion.children[i];
        if (multipleChoiceQuestion.children[correctI] != child) {
            child.textContent = wrongAnswers[aux];
            aux++;
            wrongElements.push(child);
        }
    }

    const auxFunction1 = () => {
        correctElement.classList.add("correct");
        wrongElements.forEach((wrongElement) => {
            wrongElement.classList.add("wrong");
        });
        setTimeout(() => {
            correctFunction();
            textContainer.classList.add("on");
            multipleChoiceQuestion.style.display = "none";
            setTimeout(() => {
                playing = true;
                correctElement.classList.remove("correct");
                wrongElements.forEach((wrongElement) => {
                    wrongElement.classList.remove("wrong");
                });
                textContainer.classList.remove("on");
                multipleChoiceQuestion.parentElement.style.display = "none";
                correctElement.removeEventListener("touchstart", auxFunction1);
                wrongElements.forEach((el) => {
                    el.removeEventListener("touchstart", auxFunction2);
                });
            }, 0);
        }, 1000);
    };

    const auxFunction2 = () => {
        correctElement.classList.add("correct");
        wrongElements.forEach((wrongElement) => {
            wrongElement.classList.add("wrong");
        });
        removeLife();
        setTimeout(() => {
            wrongFunction();
            textContainer.classList.add("on");
            multipleChoiceQuestion.style.display = "none";
            setTimeout(() => {
                playing = true;
                correctElement.classList.remove("correct");
                wrongElements.forEach((wrongElement) => {
                    wrongElement.classList.remove("wrong");
                });
                textContainer.classList.remove("on");
                multipleChoiceQuestion.parentElement.style.display = "none";
                // TODO: have to remove the event listener
            }, 0);
        }, 1000);
        correctElement.removeEventListener("touchstart", auxFunction1);
        wrongElements.forEach((el) => {
            el.removeEventListener("touchstart", auxFunction2);
        });
    };

    correctElement.addEventListener("touchstart", auxFunction1);

    wrongElements.forEach((wrongElement) => {
        wrongElement.addEventListener("touchstart", auxFunction2);
    });

    multipleChoiceQuestion.parentElement.style.display = "block";
    multipleChoiceQuestion.style.display = "block";
};