// app.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';
import TWEEN from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.esm.min.js';
import { SceneManager } from './sceneManager.js';
import { PathManager } from './pathManager.js';
import { NavigationManager } from './navigationManager.js';
import { UIManager } from './uiManager.js';
import { TetrisManager } from './tetrisManager.js';
import { pathData } from './pathData.js';

class App {
    constructor() {
        this.sceneManager = new SceneManager();
        this.pathManager = null;
        this.navigationManager = null;
        this.uiManager = new UIManager();
        this.tetrisManager = null;
        this.animationFrameId = null;
    }

    async init() {
        try {
            console.log("Starting application initialization...");
            this.uiManager.showLoadingIndicator();
            this.uiManager.logToTerminal("Initializing...");

            await this.initializeScene();
            
            if (this.sceneManager.isWebGLAvailable) {
                await this.initializePath();
                await this.initializeNavigation();
                await this.initializeUI();
                await this.initializeTetris();
                this.setupEventListeners();

                console.log("Initialization complete. Starting animation...");
                this.uiManager.logToTerminal("Starting animation in 1 second...");
                setTimeout(() => {
                    this.uiManager.hideLoadingIndicator();
                    this.uiManager.logToTerminal("Animation started.");
                    this.animate();
                }, 1000);
            } else {
                this.handleWebGLNotAvailable();
            }
        } catch (error) {
            console.error("Error during initialization:", error);
            this.uiManager.logToTerminal(`An error occurred during initialization: ${error.message}`);
            this.handleError(error);
        }
    }

    async initializeScene() {
        console.log("Initializing scene...");
        this.uiManager.logToTerminal("Initializing scene...");
        await this.sceneManager.initScene();
    }

    async initializePath() {
        console.log("Initializing path...");
        this.uiManager.logToTerminal("Creating path...");
        this.pathManager = new PathManager(this.sceneManager.scene);
        await this.pathManager.createPath(pathData);
        console.log("Updating camera position...");
        this.sceneManager.updateCameraPosition(this.pathManager.curve);
    }

    async initializeNavigation() {
        console.log("Initializing navigation...");
        this.uiManager.logToTerminal("Initializing navigation...");
        this.navigationManager = new NavigationManager(this.pathManager.curve, this.sceneManager.camera, this.pathManager);
    }

    async initializeUI() {
        console.log("Initializing UI...");
        this.uiManager.logToTerminal("Creating UI...");
        await this.uiManager.createUI(this.pathManager, this.navigationManager);
    }

    async initializeTetris() {
        console.log("Initializing Tetris...");
        this.uiManager.logToTerminal("Initializing Tetris Manager...");
        this.tetrisManager = new TetrisManager(this.uiManager);
    }

    setupEventListeners() {
        console.log("Setting up event listeners...");
        this.uiManager.logToTerminal("Setting up event listeners...");
        window.addEventListener('keydown', this.handleInput.bind(this));
        window.addEventListener('resize', () => {
            this.sceneManager.onWindowResize();
            this.uiManager.updatePlacardPosition(this.sceneManager.camera);
        });
    }

    handleInput(event) {
        this.uiManager.logToTerminal(`Key pressed: ${event.key} (Key code: ${event.keyCode})`);
        
        if (this.tetrisManager.isActiveGame()) {
            console.log("Tetris game is active, handling Tetris input");
            if (event.key === 'Escape') {
                console.log("Exiting Tetris game");
                this.uiManager.logToTerminal('Exiting Tetris game');
                this.tetrisManager.stopTetrisGame();
                this.uiManager.showGameMenu();
            } else {
                this.tetrisManager.handleTetrisInput(event);
            }
            return;
        }

        if (this.uiManager.gameMenuActive) {
            console.log("Game menu is active, handling game menu input");
            this.handleGameMenuInput(event);
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
                console.log("Moving forward");
                this.uiManager.hidePlacard();
                this.navigationManager.moveForward();
                break;
            case 'ArrowDown':
                console.log("Turning around");
                this.uiManager.hidePlacard();
                this.navigationManager.turnAround();
                break;
            case 'Enter':
                console.log("Showing placard");
                this.uiManager.showPlacard();
                const currentNode = this.pathManager.path.nodes[this.navigationManager.currentNodeIndex];
                if (currentNode.title === "Game Center") {
                    console.log("Entered Game Center, showing game menu");
                    this.uiManager.showGameMenu();
                }
                break;
            case 'Escape':
                console.log("Hiding placard");
                this.uiManager.hidePlacard();
                break;
            case ' ':
                console.log("Toggling menu");
                this.uiManager.toggleMenu();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                const nodeIndex = parseInt(event.key);
                if (nodeIndex < this.pathManager.path.nodes.length) {
                    console.log(`Navigating to node ${nodeIndex}`);
                    this.uiManager.hidePlacard();
                    this.navigationManager.navigateToNode(nodeIndex);
                }
                break;
        }
    }

    handleGameMenuInput(event) {
        switch (event.key) {
            case '1':
                console.log("Starting Tetris game from game menu");
                this.uiManager.logToTerminal('Starting Tetris game');
                this.tetrisManager.startTetrisGame();
                break;
            case '2':
            case '3':
                console.log("Attempted to start unimplemented game");
                this.uiManager.logToTerminal('This game is not yet implemented.');
                break;
            case 'Escape':
                console.log("Exiting game menu");
                this.uiManager.hidePlacard();
                break;
            default:
                console.log("Invalid game menu selection");
                this.uiManager.logToTerminal('Invalid selection. Please choose a number from the list.');
        }
    }

    animate(time) {
        try {
            this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
            TWEEN.update(time);

            if (this.pathManager) {
                this.pathManager.updateGlowEffects(this.sceneManager.camera.position);

                if (this.pathManager.pathTube) {
                    this.pathManager.pathTube.visible = true;
                }
            }

            if (this.uiManager) {
                this.uiManager.updatePlacardPosition(this.sceneManager.camera);
            }

            this.sceneManager.render();
        } catch (error) {
            console.error("Error in animation loop:", error);
            this.handleError(error);
        }
    }

    handleError(error) {
        console.error("An error occurred:", error);
        this.uiManager.showLoadingIndicator();
        this.uiManager.logToTerminal(`An error occurred: ${error.message}`);
        
        // Stop the animation loop
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        // Attempt to recover
        this.attemptRecovery();
    }

    attemptRecovery() {
        console.log("Attempting to recover from error...");
        this.uiManager.logToTerminal("Attempting to recover...");

        // Reinitialize the scene
        this.sceneManager.initScene();

        if (this.sceneManager.isWebGLAvailable) {
            // Recreate the path
            if (this.pathManager) {
                this.pathManager.createPath(pathData);
                this.sceneManager.updateCameraPosition(this.pathManager.curve);
            }

            // Restart the animation loop
            this.animate();

            console.log("Recovery attempt complete.");
            this.uiManager.logToTerminal("Recovery attempt complete. If issues persist, please refresh the page.");
        } else {
            this.handleWebGLNotAvailable();
        }

        this.uiManager.hideLoadingIndicator();
    }

    handleWebGLNotAvailable() {
        console.warn("WebGL is not available. Displaying error message to user.");
        this.uiManager.logToTerminal("WebGL is not available. The 3D navigation experience cannot be loaded.");
        this.sceneManager.showWebGLError();
        this.uiManager.hideLoadingIndicator();
    }
}

// Initialize the application when the window loads
window.onload = () => {
    console.log("Window loaded. Initializing application...");
    const app = new App();
    app.init().catch(error => {
        console.error("Failed to initialize the app:", error);
        document.body.innerHTML = `<h1>Failed to load the application. Please check the console for details.</h1>`;
    });
};