const secretCode = "LOVE";
let collectedLetters = "";
let currentStage = 1;
let currentQuestion = 0;
let correctAnswers = 0;

const numberOfHearts = 25;
const secondStepWords = ["Міні Дід", "Гніздечко", "Річниця", "Весілля"];

const quizQuestions = [
    {
        question: "Що найперше тобі подарував старий?",
        options: ["Іграшку", "Духи", "Подушку", "Шмотку"],
        correctAnswer: "Духи"
    },
    {
        question: "Що старому в тобі перше всього запало в сердечко?",
        options: ["Очі", "Фігура", "Волосся", "Голос"],
        correctAnswer: "Голос"
    },
    {
        question: "Де на дідову думку найромантичніший вечерю можна влаштувати? :D",
        options: ["На пляжі вечером", "На балконі в Парижі", "Будь де біля моря/океану", "На повітряній кулі"],
        correctAnswer: "На балконі в Парижі"
    },
    {
        question: "Чого старий хоче найбільше?",
        options: ["Мерседеса :D", "Бути завжди з тобою", "Робити тебе завжди щасливою", "Подорожувати з тобою"],
        correctAnswer: "Робити тебе завжди щасливою"
    },
    {
        question: "Скільки дід тебе буде любити?",
        options: ["Тільки вічність", "25 років", "50 років", "Поки с ксьодзом не почне говорити"],
        correctAnswer: "Поки с ксьодзом не почне говорити"
    }
];

const valentinText = "Ця Валентинка для тебе моя кічя!"

function startQuest() {
    document.getElementById('welcome-screen').classList.add('hidden');
    setupStage1();
}

function setupStage1() {
    const heartsContainer = document.getElementById('hearts-container');
    heartsContainer.innerHTML = '';
    
    const correctHeartIndex = Math.floor(Math.random() * numberOfHearts);
    const hearts = [];

    for (let i = 0; i < numberOfHearts; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.addEventListener('click', () => checkHeart(i, correctHeartIndex));
        
        // Set random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        heart.style.left = `${left}%`;
        heart.style.top = `${top}%`;
        
        heartsContainer.appendChild(heart);
        hearts.push(heart);
    }

    document.getElementById('stage1').classList.remove('hidden');
}

function makeNotification(elementId, message) {
    const messageContainer = document.getElementById(elementId);
    messageContainer.classList.remove('hidden');
    messageContainer.textContent = message;
    setTimeout(() => {
        messageContainer.classList.add('hidden');
    }, 700);

}

function checkHeart(index, correctHeartIndex) {
    if (index === correctHeartIndex) {

        makeNotification('stage1-message', "Супер, ти знайшла ключ!.");
        collectedLetters += secretCode[0];
        document.getElementById('key1').classList.add('found');
        
        // Hide all other hearts
        const hearts = document.querySelectorAll('#hearts-container .heart');
        hearts.forEach((heart, i) => {
            if (i !== index) {
                heart.style.opacity = '0';
                heart.style.transition = 'opacity 0.5s';
            }
        });

        setTimeout(() => {
            document.getElementById('stage1').classList.add('hidden');
            setupStage2();
        }, 1500);
    } else {
        makeNotification('stage1-message', "Оу ноу, ля поліція, пробуй ще раз!.");
        const clickedHeart = document.querySelectorAll('#hearts-container .heart')[index];
        clickedHeart.style.opacity = '0';
        clickedHeart.style.transition = 'opacity 0.5s';
    }
}


function setupStage2() {

    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    let i = Math.floor(Math.random() * secondStepWords.length);

    const correctDecryption = secondStepWords[i];

    const encryptedMessage = shuffleString(correctDecryption);
    
    document.getElementById('encrypted-message').textContent = encryptedMessage;
    document.getElementById('stage2').classList.remove('hidden');

    document.getElementById('decrypted-input').value = '';
    document.getElementById('decrypted-input').addEventListener('keydown', step2Submit);
    document.getElementById('stage2-message').textContent = '';

    function checkDecryption() {
        const userInput = document.getElementById('decrypted-input').value;
        if (userInput.toLowerCase() === correctDecryption.toLowerCase()) {
            makeNotification('stage2-message', "Правильно! Ти знайшла ще один ключик.");
            collectedLetters += secretCode[1];
            document.getElementById('key2').classList.add('found');
            setTimeout(() => {
                document.getElementById('stage2').classList.add('hidden');
                setupStage3();
            }, 1000);
        } else {
            makeNotification('stage2-message', "Курва Бобер, давай ще раз!.");
        }
    }

    window.checkDecryption = checkDecryption;
}

function setupStage3() {
    document.getElementById('stage3').classList.remove('hidden');
    showQuestion(currentQuestion);
}

function showQuestion(index) {
    const quizContainer = document.getElementById('quiz-container');
    const question = quizQuestions[index];

    let optionsHtml = '';
    question.options.forEach((option, i) => {
        optionsHtml += `<div class="quiz-option" onclick="checkAnswer('${option}')">${option}</div>`;
    });

    quizContainer.innerHTML = `
        <h3>${question.question}</h3>
        <div class="quiz-options">${optionsHtml}</div>
        <div class="quiz-progress">
            ${Array(5).fill('').map((_, i) => 
                `<div class="progress-dot${i < correctAnswers ? ' correct' : ''}"></div>`
            ).join('')}
        </div>
    `;
}

function checkAnswer(selectedAnswer) {
    const currentQuiz = quizQuestions[currentQuestion];
    if (selectedAnswer === currentQuiz.correctAnswer) {
        correctAnswers++;
        makeNotification('stage3-message', "Правильно!");
        
        if (correctAnswers === 5) {
            collectedLetters += secretCode.slice(2);
            document.getElementById('key3').classList.add('found');
            document.getElementById('fireworks').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('stage3').classList.add('hidden');
                document.getElementById('final-screen').classList.remove('hidden');
                setTimeout(() => {
                    document.getElementById('fireworks').classList.add('hidden');
                }, 3000);
            }, 2000);
        } else {
            currentQuestion++;
            setTimeout(() => showQuestion(currentQuestion), 700);
        }
    } else {
        makeNotification('stage3-message', "Йомайо, да що ж таке!");
    }
}

function showFullscreenHeart() {
    collectedLetters += secretCode.slice(2);
    document.getElementById('key3').classList.add('found');
    document.getElementById('stage3').classList.add('hidden');
    document.getElementById('final-screen').classList.remove('hidden');
}

function step2Submit(e) {
    if (e.keyCode === 13) {
        checkDecryption();
    }
}

function finalHeart() {

    const heart = document.getElementById('final-heart');
    const video = document.getElementById('final-video');

    // зупиняємо пульсацію і запускаємо збільшення
    heart.classList.remove('pulsating');
    heart.classList.add('growing');

    // чекаємо поки серце збільшиться
    setTimeout(() => {

        // показуємо відео
        video.classList.remove('hidden');

        // трохи чекаємо щоб спрацював fade
        setTimeout(() => {
            video.classList.add('show');
        }, 50);

        video.currentTime = 0;
        video.play();

    }, 1500); // 1.5 сек
}
