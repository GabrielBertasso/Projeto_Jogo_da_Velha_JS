// Classe que representa um jogador
class Player {
    constructor(name) {
        this.name = name; // Nome do jogador (X ou O)
        this.score = 0;   // Pontuação do jogador
    }

    // Método para incrementar a pontuação do jogador
    incrementScore() {
        this.score++;
    }
}

// Classe que representa o tabuleiro do jogo
class Board {
    constructor() {
        this.cells = Array(9).fill(''); // Inicializa as células do tabuleiro como vazias
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
            [0, 4, 8], [2, 4, 6]             // diagonais
        ];
    }

    // Método para resetar o tabuleiro
    reset() {
        this.cells.fill(''); // Preenche todas as células com vazio
    }

    // Método para verificar se há um vencedor
    checkWinner(symbol) {
        return this.winningConditions.some(condition => {
            const [a, b, c] = condition; // Desestrutura as condições de vitória
            return this.cells[a] === symbol && this.cells[b] === symbol && this.cells[c] === symbol; // Verifica se as células correspondem ao símbolo
        });
    }

    // Método para verificar se o tabuleiro está cheio
    isFull() {
        return this.cells.every(cell => cell !== ''); // Retorna verdadeiro se todas as células estiverem preenchidas
    }
}

// Classe que controla a lógica do jogo
class Game {
    constructor(playerX, playerO) {
        this.players = [playerX, playerO]; // Array de jogadores
        this.currentPlayerIndex = 0; // Índice do jogador atual
        this.board = new Board(); // Instância do tabuleiro
        this.gameActive = true; // Estado do jogo
        this.isPlayingWithBot = true; // Modo de jogo (se está jogando contra um bot)
    }

    // Método para alternar entre os jogadores
    switchPlayer() {
        this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0; // Troca o índice do jogador atual
    }

    // Método para lidar com o clique em uma célula
    handleCellClick(clickedCellIndex) {
        if (!this.gameActive || this.board.cells[clickedCellIndex]) {
            return; // Se o jogo não está ativo ou a célula já está preenchida, não faz nada
        }

        const symbol = this.players[this.currentPlayerIndex].name; // Obtém o símbolo do jogador atual
        this.makeMove(clickedCellIndex, symbol); // Faz a jogada

        // Se o jogo está ativo e o jogador atual é o bot, faz a jogada do bot após um pequeno atraso
        if (this.gameActive && this.isPlayingWithBot && this.currentPlayerIndex === 1) {
            setTimeout(() => this.computerMove(), 500);
        }
    }

    // Método para fazer uma jogada
    makeMove(index, symbol) {
        this.board.cells[index] = symbol; // Atualiza o estado do tabuleiro
        const cell = document.querySelector(`[data-index="${index}"]`); // Seleciona a célula correspondente
        cell.textContent = symbol; // Atualiza o texto da célula
        cell.style.pointerEvents = 'none'; // Desabilita o clique na célula

        // Verifica se há um vencedor ou se o tabuleiro está cheio
        if (this.board.checkWinner(symbol)) {
            this.endGame(false, symbol); // Se houver vencedor, finaliza o jogo
        } else if (this.board.isFull()) {
            this.endGame(true); // Se o tabuleiro estiver cheio, finaliza o jogo com empate
        } else {
            this.switchPlayer(); // Alterna para o próximo jogador
            this.updateStatus(); // Atualiza o status do jogo
        }
    }

    // Método para a jogada do computador (bot)
    computerMove() {
        if (!this.gameActive || this.currentPlayerIndex !== 1) return; // Se o jogo não está ativo ou não é a vez do bot, não faz nada

        // Obtém as células vazias e escolhe uma aleatoriamente
        const emptyCells = this.board.cells.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.makeMove(randomIndex, this.players[1].name); // Faz a jogada do bot
    }

    // Método para finalizar o jogo
    endGame(isDraw, winner = null) {
        this.gameActive = false; // Define o jogo como não ativo
        const resultMessage = document.getElementById('result-message'); // Seleciona o elemento de mensagem de resultado
        const resultPopup = document.getElementById('result-popup'); // Seleciona o popup de resultado

        // Verifica se o jogo terminou em empate ou se há um vencedor
        if (isDraw) {
            resultMessage.textContent = 'Empate!'; // Mensagem de empate
        } else {
            if (winner === this.players[0].name) {
                this.players[0].incrementScore(); // Incrementa a pontuação do jogador X
                resultMessage.textContent = 'Jogador X venceu!'; // Mensagem de vitória do jogador X
            } else {
                this.players[1].incrementScore(); // Incrementa a pontuação do jogador O
                resultMessage.textContent = 'Jogador O venceu!'; // Mensagem de vitória do jogador O
            }
        }

        this.updateScoreboard(); // Atualiza o placar
        resultPopup.style.display = 'flex'; // Exibe o popup de resultado
    }

    // Método para atualizar o placar
    updateScoreboard() {
        document.getElementById('score-x').textContent = this.players[0].score; // Atualiza o placar do jogador X
        document.getElementById('score-o').textContent = this.players[1].score; // Atualiza o placar do jogador O
    }

    // Método para atualizar o status do jogo
    updateStatus() {
        const statusElement = document.getElementById('current-turn'); // Seleciona o elemento de status
        statusElement.textContent = `É a vez do jogador ${this.players[this.currentPlayerIndex].name}`; // Atualiza o texto de status
    }

    // Método para resetar o jogo
    resetGame() {
        this.board.reset(); // Reseta o tabuleiro
        this.gameActive = true; // Define o jogo como ativo
        this.currentPlayerIndex = 0; // Reseta o índice do jogador atual

        const cells = document.querySelectorAll('.cell'); // Seleciona todas as células
        cells.forEach(cell => {
            cell.textContent = ''; // Limpa o texto das células
            cell.style.pointerEvents = 'auto'; // Habilita o clique nas células
        });

        this.updateStatus(); // Atualiza o status do jogo
        document.getElementById('result-popup').style.display = 'none'; // Esconde o popup de resultado
    }

    // Método para resetar a pontuação
    resetScores() {
        this.players.forEach(player => player.score = 0); // Reseta a pontuação de todos os jogadores
        this.updateScoreboard(); // Atualiza o placar
    }

    // Método para alternar entre jogar contra o bot ou contra outra pessoa
    toggleMode() {
        this.isPlayingWithBot = !this.isPlayingWithBot; // Alterna o modo de jogo
        this.resetGame(); // Reseta o jogo
    }
}

// Inicializa o jogo
const playerX = new Player('X'); // Cria o jogador X
const playerO = new Player('O'); // Cria o jogador O
const game = new Game(playerX, playerO); // Cria uma nova instância do jogo

// Cria as células do tabuleiro e adiciona eventos de clique
const boardElement = document.getElementById('board');
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', () => game.handleCellClick(i)); // Adiciona o evento de clique
    boardElement.appendChild(cell); // Adiciona a célula ao tabuleiro
}

// Adiciona eventos aos botões de controle
document.getElementById('play-again').addEventListener('click', () => game.resetGame());
document.getElementById('reset-game').addEventListener('click', () => game.resetGame());
document.getElementById('reset-scores').addEventListener('click', () => game.resetScores());
document.getElementById('toggle-mode').addEventListener('click', () => game.toggleMode());

// Atualiza o placar e o status do jogo ao iniciar
game.updateScoreboard();
game.updateStatus();