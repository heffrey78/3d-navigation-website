// uiManager.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';
import { colors } from './constants.js';

export class UIManager {
    constructor() {
        this.pathManager = null;
        this.navigationManager = null;
        this.placardElement = null;
        this.menuElement = null;
        this.terminal = null;
        this.loadingIndicator = null;
        this.gameMenuActive = false;
    }

    async createUI(pathManager, navigationManager) {
        try {
            this.pathManager = pathManager;
            this.navigationManager = navigationManager;
            await this.createTerminal();
            await this.createMenu();
            this.logToTerminal("UI created successfully");
        } catch (error) {
            console.error("Error creating UI:", error);
            this.logToTerminal(`Error creating UI: ${error.message}`);
        }
    }

    async createTerminal() {
        this.terminal = document.createElement('div');
        this.terminal.id = 'terminal';
        this.terminal.style.position = 'fixed';
        this.terminal.style.top = '20px';
        this.terminal.style.left = '20px';
        this.terminal.style.width = '300px';
        this.terminal.style.height = '200px';
        this.terminal.style.backgroundColor = `rgba(10, 25, 47, 0.8)`;
        this.terminal.style.color = `#0984e3`;
        this.terminal.style.fontFamily = 'monospace';
        this.terminal.style.fontSize = '12px';
        this.terminal.style.padding = '10px';
        this.terminal.style.overflowY = 'scroll';
        this.terminal.style.border = `1px solid #0984e3`;
        this.terminal.style.boxShadow = `0 0 10px #0984e3`;
        this.terminal.style.zIndex = '1000';
        this.terminal.style.borderRadius = '5px';
        document.body.appendChild(this.terminal);
    }

    async createMenu() {
        this.menuElement = document.createElement('div');
        this.menuElement.id = 'navigation-menu';
        this.menuElement.style.position = 'fixed';
        this.menuElement.style.bottom = '20px';
        this.menuElement.style.left = '50%';
        this.menuElement.style.transform = 'translateX(-50%)';
        this.menuElement.style.backgroundColor = `rgba(10, 25, 47, 0.8)`;
        this.menuElement.style.color = `#0984e3`;
        this.menuElement.style.fontFamily = 'monospace';
        this.menuElement.style.fontSize = '14px';
        this.menuElement.style.padding = '10px';
        this.menuElement.style.borderRadius = '5px';
        this.menuElement.style.border = `1px solid #0984e3`;
        this.menuElement.style.boxShadow = `0 0 10px #0984e3`;
        this.menuElement.style.zIndex = '1000';
        this.menuElement.style.display = 'none';
        document.body.appendChild(this.menuElement);
    }

    showPlacard() {
        if (!this.pathManager || !this.navigationManager) {
            console.error("PathManager or NavigationManager not initialized");
            return;
        }

        if (this.placardElement) {
            this.hidePlacard();
        }

        const currentNode = this.pathManager.path.nodes[this.navigationManager.currentNodeIndex];

        this.placardElement = document.createElement('div');
        this.placardElement.id = 'placard';

        if (currentNode.title === "Game Center") {
            this.showGameMenu();
        } else {
            this.placardElement.innerHTML = `
                <h2>${currentNode.title}</h2>
                <div class="placard-content">${currentNode.text}</div>
            `;
        }

        document.body.appendChild(this.placardElement);

        this.updatePlacardPosition();
        this.logToTerminal(`Showing placard for ${currentNode.title}`);
    }

    showGameMenu() {
        this.gameMenuActive = true;
        this.placardElement.innerHTML = `
            <h2>Game Center</h2>
            <div class="placard-content">
                Select a game to play:
                <ol>
                    <li>Tetris</li>
                    <li>[Future Game]</li>
                    <li>[Future Game]</li>
                </ol>
                Press the number key to select a game.
            </div>
        `;
        this.logToTerminal('Game menu displayed');
    }

    handleGameSelection(key) {
        if (!this.gameMenuActive) return;

        switch (key) {
            case '1':
                this.startGame('Tetris');
                break;
            case '2':
            case '3':
                this.logToTerminal('This game is not yet implemented.');
                break;
            default:
                this.logToTerminal('Invalid selection. Please choose a number from the list.');
        }
    }

    startGame(gameName) {
        this.gameMenuActive = false;
        this.placardElement.innerHTML = `<h2>${gameName}</h2><div id="game-container"></div>`;
        this.logToTerminal(`Starting ${gameName}`);
        // Here you would call the appropriate game manager to start the game
        // For example: this.tetrisManager.startTetrisGame();
    }

    hidePlacard() {
        if (this.placardElement && this.placardElement.parentNode) {
            this.placardElement.parentNode.removeChild(this.placardElement);
            this.placardElement = null;
            this.gameMenuActive = false;
            this.logToTerminal('Hiding placard');
        }
    }

    updatePlacardPosition(camera) {
        if (this.placardElement && camera) {
            const vector = new THREE.Vector3(0, 0, -2);
            vector.applyQuaternion(camera.quaternion);
            vector.add(camera.position);

            const widthHalf = window.innerWidth / 2;
            const heightHalf = window.innerHeight / 2;
            vector.project(camera);

            const x = (vector.x * widthHalf) + widthHalf - (this.placardElement.offsetWidth / 2);
            const y = -(vector.y * heightHalf) + heightHalf - (this.placardElement.offsetHeight / 2);

            this.placardElement.style.left = `${x}px`;
            this.placardElement.style.top = `${y}px`;
        }
    }

    toggleMenu() {
        if (this.menuElement.style.display === 'none') {
            this.showMenu();
        } else {
            this.hideMenu();
        }
    }

    showMenu() {
        if (!this.pathManager) {
            console.error("PathManager not initialized");
            return;
        }

        this.menuElement.style.display = 'block';
        this.menuElement.innerHTML = this.pathManager.path.nodes.map((node, index) =>
            `<div>${index}: ${node.title}</div>`
        ).join('');
        this.logToTerminal('Navigation menu opened');
    }

    hideMenu() {
        this.menuElement.style.display = 'none';
        this.logToTerminal('Navigation menu closed');
    }

    logToTerminal(message) {
        if (this.terminal) {
            const logEntry = document.createElement('div');
            logEntry.textContent = `> ${message}`;
            this.terminal.appendChild(logEntry);
            this.terminal.scrollTop = this.terminal.scrollHeight;
        } else {
            console.log(message);
        }
    }

    showLoadingIndicator() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        if (!this.loadingIndicator) {
            this.loadingIndicator = document.createElement('div');
            this.loadingIndicator.id = 'loading-indicator';
            this.loadingIndicator.style.position = 'fixed';
            this.loadingIndicator.style.top = '50%';
            this.loadingIndicator.style.left = '50%';
            this.loadingIndicator.style.transform = 'translate(-50%, -50%)';
            this.loadingIndicator.style.backgroundColor = `#${colors.deepBlue.toString(16)}`;
            this.loadingIndicator.style.color = `#${colors.neonBlue.toString(16)}`;
            this.loadingIndicator.style.padding = '20px';
            this.loadingIndicator.style.borderRadius = '5px';
            this.loadingIndicator.style.zIndex = '1000';
            this.loadingIndicator.style.fontFamily = 'Arial, sans-serif';
            this.loadingIndicator.style.border = `2px solid #${colors.neonBlue.toString(16)}`;
            this.loadingIndicator.style.boxShadow = `0 0 10px #${colors.neonBlue.toString(16)}`;
            this.loadingIndicator.textContent = 'Initializing Grid...';
            document.body.appendChild(this.loadingIndicator);
        }
        this.loadingIndicator.style.display = 'block';
    }

    hideLoadingIndicator() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }
}