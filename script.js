async function readJsonFile(questions) {
    try {
        const response = await fetch(questions);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation: ', error);
    }
}



//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let questionCount;
let scoreCount = 0;
let count = 11;
let countdown;
let jsonData; 

async function init() {
    jsonData = await readJsonFile("questions.json");
    if (!jsonData) {
        console.error("Nenhum dado JSON encontrado.");
    return;
    }
    initial();
}




//Next Button
nextBtn.addEventListener("click", (displayNext = () => {
    questionCount += 1;
    if (questionCount === jsonData.length) {
        displayContainer.classList.add("hide");
        scoreContainer.classList.remove("hide");
        userScore.innerHTML = "A tua pontuação foi " + scoreCount + " de " + jsonData.length;
    } else {
        countOfQuestion.innerHTML = (questionCount + 1) + " de " + jsonData.length + " perguntas";
        quizDisplay(questionCount);
        count = 11;
        clearInterval(countdown);
        timerDisplay();
    }
}));

//Timer
const timerDisplay = () => {
    countdown = setInterval(() => {
        count--;
        timeLeft.innerHTML = `${count}s`;
        if (count === 0) {
            clearInterval(countdown);
            displayNext();
        }
    }, 1000);
};

//Display quiz
const quizDisplay = (questionCount) => {
    let quizCards = document.querySelectorAll(".container-mid");
    quizCards.forEach((card) => {
        card.classList.add("hide");
    });
    quizCards[questionCount].classList.remove("hide");
};

//Quiz Creation
function quizCreator() {
    jsonData.sort(() => Math.random() - 0.5);

    for (let i of jsonData) {
        i.opcoes.sort(() => Math.random() - 0.5);
        let div = document.createElement("div");
        div.classList.add("container-mid", "hide");
        countOfQuestion.innerHTML = 1 + " de " + jsonData.length + " Perguntas";
        let question_DIV = document.createElement("p");
        question_DIV.classList.add("question");
        question_DIV.innerHTML = i.pergunta;
        div.appendChild(question_DIV);
        div.innerHTML += `
            <button class="option-div" onclick="checker(this)">${i.opcoes[0]}</button>
            <button class="option-div" onclick="checker(this)">${i.opcoes[1]}</button>
            <button class="option-div" onclick="checker(this)">${i.opcoes[2]}</button>
            <button class="option-div" onclick="checker(this)">${i.opcoes[3]}</button>
        `;
        quizContainer.appendChild(div);
    }
}

//Checker Function to check if option is correct or not
function checker(userOption) {
    let userSolution = userOption.innerText;
    let question = document.getElementsByClassName("container-mid")[questionCount];
    let options = question.querySelectorAll(".option-div");

    if (userSolution === jsonData[questionCount].resposta_correta) {
        userOption.classList.add("correct");
        scoreCount++;
    } else {
        userOption.classList.add("incorrect");
        options.forEach((element) => {
            if (element.innerText == jsonData[questionCount].resposta_correta) {
                element.classList.add("correct");
            }
        });
    }
    clearInterval(countdown);
    options.forEach((element) => {
        element.disabled = true;
    });
}

//setup inicial
function initial() {
    quizContainer.innerHTML = "";
    questionCount = 0;
    scoreCount = 0;
    count = 11;
    clearInterval(countdown);
    timerDisplay();
    quizCreator();
    quizDisplay(questionCount);
}

//Quando o usuário clica no botão de iniciar
startButton.addEventListener("click", () => {
    startScreen.classList.add("hide");
    displayContainer.classList.remove("hide");
    initial();
});

//Restart Quiz
restart.addEventListener("click", () => {
    initial();
    displayContainer.classList.remove("hide");
    scoreContainer.classList.add("hide");
});


//Esconder quiz e mostrar tela inicial
window.onload = () => {
    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
    init();  // Chamar a função de inicialização aqui
};