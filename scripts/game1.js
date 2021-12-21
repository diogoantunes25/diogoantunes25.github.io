const pegCharacter = document.getElementById("peg-character");
const obstacles = document.querySelectorAll(".obstacle");

setInterval(() => {
        console.log("HI");
        obstacles.forEach((obstacle) => {
            obstacle.classList.add("moved");
        })
    }, 3000
);

const startJump = (peg) => { peg.classList.add("high"); }
const stopJump = (peg) => { peg.classList.remove("high"); }
const areColiding = (el1, el2) => {
    // Use offsets to check if there is a collision
}

window.addEventListener("space", () => (jump(pegCharacter)));
window.addEventListener("touchstart", () => {
        startJump(pegCharacter);
        setTimeout(() => stopJump(pegCharacter), 300);
    }
);




