// sceneManager.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';
import { colors } from './constants.js';

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.isWebGLAvailable = true;
    }

    initScene() {
        console.log("Initializing scene...");
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(colors.deepBlue);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        this.initRenderer();

        if (this.isWebGLAvailable) {
            this.addLights();
            this.addTronEffects();
        }

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        console.log("Scene initialization complete.");
    }

    initRenderer() {
        console.log("Creating renderer...");
        try {
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);

            this.renderer.domElement.addEventListener('webglcontextlost', this.handleContextLost.bind(this), false);
            this.renderer.domElement.addEventListener('webglcontextrestored', this.handleContextRestored.bind(this), false);
        } catch (error) {
            console.warn("WebGL not supported, falling back to Canvas renderer", error);
            this.isWebGLAvailable = false;
            this.initCanvasRenderer();
        }
    }

    initCanvasRenderer() {
        this.renderer = new THREE.CanvasRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    handleContextLost(event) {
        event.preventDefault();
        console.warn("WebGL context lost. Attempting to recover...");
        this.isWebGLAvailable = false;
        this.showWebGLError();
    }

    handleContextRestored() {
        console.log("WebGL context restored. Reinitializing renderer...");
        this.isWebGLAvailable = true;
        this.initRenderer();
        this.addLights();
        this.addTronEffects();
        this.hideWebGLError();
    }

    showWebGLError() {
        const errorMessage = document.createElement('div');
        errorMessage.id = 'webgl-error-message';
        errorMessage.style.position = 'absolute';
        errorMessage.style.top = '50%';
        errorMessage.style.left = '50%';
        errorMessage.style.transform = 'translate(-50%, -50%)';
        errorMessage.style.backgroundColor = 'rgba(0,0,0,0.7)';
        errorMessage.style.color = 'white';
        errorMessage.style.padding = '20px';
        errorMessage.style.borderRadius = '10px';
        errorMessage.innerHTML = `
            <h2>WebGL Not Available</h2>
            <p>We're having trouble initializing WebGL. This could be due to your browser or hardware.</p>
            <p>Try the following:</p>
            <ul>
                <li>Update your browser to the latest version</li>
                <li>Try a different browser (Chrome, Firefox, or Edge)</li>
                <li>Update your graphics drivers</li>
                <li>Disable hardware acceleration in your browser settings</li>
            </ul>
        `;
        document.body.appendChild(errorMessage);
    }

    hideWebGLError() {
        const errorMessage = document.getElementById('webgl-error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    updateCameraPosition(curve) {
        if (curve) {
            console.log("Updating camera position based on curve...");
            const initialPosition = curve.getPointAt(0);
            this.camera.position.copy(initialPosition);
            this.camera.lookAt(curve.getPointAt(0.1));
        }
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(colors.lightGray, 0.2);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(colors.neonBlue, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    addTronEffects() {
        this.addTronLights();
        this.addTronGrid();
        this.addTronMountainSilhouette();
        this.addTronBuildings();
    }

    addTronLights() {
        const lightColors = [colors.neonBlue, colors.cyan, colors.neonPink];
        lightColors.forEach((color, index) => {
            const light = new THREE.PointLight(color, 1, 50);
            light.position.set(Math.sin(index * Math.PI * 2 / 3) * 10, 5, Math.cos(index * Math.PI * 2 / 3) * 10);
            this.scene.add(light);
        });
    }

    addTronGrid() {
        const gridHelper = new THREE.GridHelper(100, 100, colors.neonBlue, colors.deepBlue);
        gridHelper.position.y = -0.5;
        this.scene.add(gridHelper);
    }

    addTronMountainSilhouette() {
        const mountainGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -100, 0, -60,
            -60, 16, -60,
            -20, 6, -60,
            20, 20, -60,
            60, 10, -60,
            100, 24, -60
        ]);
        mountainGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const mountainMaterial = new THREE.LineBasicMaterial({ color: colors.neonPurple });
        const mountainLine = new THREE.Line(mountainGeometry, mountainMaterial);
        this.scene.add(mountainLine);
    }

    addTronBuildings() {
        const buildingGeometry = new THREE.BoxGeometry(2, 6, 2);
        const buildingMaterial = new THREE.MeshPhongMaterial({
            color: colors.deepBlue,
            emissive: colors.neonBlue,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });

        const buildingPositions = [
            { x: -8, z: -15 }, { x: 8, z: -15 },
            { x: -12, z: -25 }, { x: 12, z: -25 },
            { x: -7, z: -35 }, { x: 7, z: -35 }
        ];

        buildingPositions.forEach(pos => {
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            building.position.set(pos.x, 3, pos.z);
            this.scene.add(building);
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        } else {
            console.warn("Unable to render: renderer, scene, or camera is not initialized.");
        }
    }
}