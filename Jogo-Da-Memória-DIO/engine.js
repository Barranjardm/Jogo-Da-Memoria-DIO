const EMOJIS = ['🍎', '🍌', '🍇', '🍓', '🍍', '🥝', '🍒', '🍉'];
const MAX_MOVES = 20;
let moves = 0;
let pairs = 0;
let selectedCards = [];
let isBlocked = false;
let timer = 0;
let timerInterval;

const successSound = new Audio('./Audio/collect-points-190037.mp3'); // Som ao acertar
const errorSound = new Audio('./Audio/error-126627.mp3'); // Som ao errar
let isSoundEnabled = true; // Controle do som

document.getElementById('toggle-sound').addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    const soundButton = document.getElementById('toggle-sound');
    soundButton.textContent = isSoundEnabled ? '🔊 Som: Ativado' : '🔈 Som: Desativado';
});

function playSound(sound) {
    if (isSoundEnabled) {
        sound.currentTime = 0; // Reinicia o som
        sound.play();
    }
}

const gameGrid = document.getElementById('game-grid');
const movesDisplay = document.getElementById('moves');
const pairsDisplay = document.getElementById('pairs');
const timerDisplay = document.getElementById('timer');
const gameOverDiv = document.getElementById('game-over');

function createCard(emoji, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-face back">?</div>
        <div class="card-face front">${emoji}</div>
    `;
    card.dataset.index = index;
    return card;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkWin() {
    return pairs === EMOJIS.length;
}

function handleCardClick(e) {
    if (isBlocked || e.target.closest('.matched')) return;

    const card = e.target.closest('.card');
    if (!card || selectedCards.includes(card)) return;

    card.classList.add('flipped');
    selectedCards.push(card);

    if (selectedCards.length === 2) {
        isBlocked = true;
        moves++;
        movesDisplay.textContent = `Movimentos: ${moves}`;

        const [card1, card2] = selectedCards;
        const match = card1.querySelector('.front').textContent === card2.querySelector('.front').textContent;

        setTimeout(() => {
            if (match) {
                playSound(successSound); // Toca som de sucesso
                card1.classList.add('matched');
                card2.classList.add('matched');
                pairs++;
                pairsDisplay.textContent = `Pares encontrados: ${pairs}`;
                if (checkWin()) {
                    clearInterval(timerInterval);
                    gameOverDiv.textContent = `Você Venceu! 🎉 Tempo: ${timer}s`;
                    gameOverDiv.style.display = 'block';
                }
            } else {
                playSound(errorSound); // Toca som de erro
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                if (moves >= MAX_MOVES) {
                    clearInterval(timerInterval);
                    gameOverDiv.textContent = 'Game Over! 😢';
                    gameOverDiv.style.display = 'block';
                }
            }
            selectedCards = [];
            isBlocked = false;
        }, 600);
    }
}

function startTimer() {
    timer = 0;
    timerDisplay.textContent = `Tempo: ${timer}s`;
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Tempo: ${timer}s`;
    }, 1000);
}

function initGame() {
    gameGrid.innerHTML = '';
    moves = 0;
    pairs = 0;
    selectedCards = [];
    isBlocked = false;
    clearInterval(timerInterval);
    startTimer();

    movesDisplay.textContent = `Movimentos: ${moves}`;
    pairsDisplay.textContent = `Pares encontrados: ${pairs}`;
    gameOverDiv.style.display = 'none';

    const cards = [...EMOJIS, ...EMOJIS]
        .map((emoji, index) => ({ emoji, index }))
        .sort(() => Math.random() - 0.5);

    cards.forEach(({ emoji, index }) => {
        const card = createCard(emoji, index);
        card.addEventListener('click', handleCardClick);
        gameGrid.appendChild(card);
    });
}

document.getElementById('restart').addEventListener('click', initGame);
initGame();