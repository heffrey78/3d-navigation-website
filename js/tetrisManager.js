// tetrisManager.js
import { createTetrisGame, stopTetrisGame, handleTetrisKeyPress } from '../tetris.js';

export class TetrisManager {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.tetrisGame = null;
        this.isTetrisActive = false;
    }

    startTetrisGame() {
        try {
            if (this.tetrisGame) {
                this.stopTetrisGame();
            }
            this.tetrisGame = document.createElement('div');
            this.tetrisGame.id = 'tetris-container';
            if (this.uiManager.placardElement) {
                this.uiManager.placardElement.appendChild(this.tetrisGame);
                createTetrisGame('tetris-container');
                this.isTetrisActive = true;
                this.uiManager.logToTerminal('Tetris game started');
            } else {
                throw new Error('Placard element not found');
            }
        } catch (error) {
            console.error('Error starting Tetris game:', error);
            this.uiManager.logToTerminal(`Failed to start Tetris game: ${error.message}`);
        }
    }

    stopTetrisGame() {
        try {
            if (this.tetrisGame) {
                stopTetrisGame();
                this.uiManager.logToTerminal('Tetris game stopped');
                if (this.tetrisGame.parentNode) {
                    this.tetrisGame.parentNode.removeChild(this.tetrisGame);
                }
                this.tetrisGame = null;
                this.isTetrisActive = false;
            }
        } catch (error) {
            console.error('Error stopping Tetris game:', error);
            this.uiManager.logToTerminal(`Failed to stop Tetris game: ${error.message}`);
        }
    }

    handleTetrisInput(event) {
        try {
            if (this.isTetrisActive) {
                handleTetrisKeyPress(event);
            }
        } catch (error) {
            console.error('Error handling Tetris input:', error);
            this.uiManager.logToTerminal(`Failed to handle Tetris input: ${error.message}`);
        }
    }
}