// Global variables
let scene, camera, renderer, path, currentNodeIndex, curve;
let animationFrameId = null;
let loadingIndicator, terminal;
let pathTube;
let isMovingForward = true;
let placard; 
let placardElement;
let menuElement;
let tetrisGame; // New variable for Tetris game
let isTetrisActive = false; // New variable to track if Tetris is active

// Tron color palette
const colors = {
    neonBlue: 0x0984e3,
    deepBlue: 0x0a192f,
    cyan: 0x00b894,
    neonOrange: 0xe17055,
    electricYellow: 0xfdcb6e,
    darkGray: 0x2d3436,
    lightGray: 0xdfe6e9,
    neonPurple: 0x6c5ce7,
    neonPink: 0xe84393
};

const blueMaterial = new THREE.MeshBasicMaterial({ color: colors.neonBlue });
const cyanMaterial = new THREE.MeshBasicMaterial({ color: colors.cyan });
const cameraHeight = 1;

// Initialize the 3D scene
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.deepBlue);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    if (typeof curve === 'undefined') {
        console.error("Curve is not defined. Make sure createPath() is called before initScene()");
        return;
    }
    const initialPosition = getPositionAlongCurve(0);
    camera.position.copy(initialPosition);
    camera.lookAt(path.points[1].x, path.points[1].y, path.points[1].z);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(colors.lightGray, 0.2);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(colors.neonBlue, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add Tron-style effects
    addTronLights();
    addTronGrid();
    addTronMountainSilhouette();
    addTronBuildings();

    window.addEventListener('resize', onWindowResize, false);
}

// Add Tron-style point lights
function addTronLights() {
    if (!scene) {
        console.error("Scene is not initialized. Make sure initScene() is called before addTronLights()");
        return;
    }

    const lightColors = [colors.neonBlue, colors.cyan, colors.neonPink];
    lightColors.forEach((color, index) => {
        const light = new THREE.PointLight(color, 1, 50);
        light.position.set(Math.sin(index * Math.PI * 2 / 3) * 10, 5, Math.cos(index * Math.PI * 2 / 3) * 10);
        scene.add(light);
    });
}

// Add Tron-style grid
function addTronGrid() {
    const gridHelper = new THREE.GridHelper(100, 100, colors.neonBlue, colors.deepBlue);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);
}

// Add Tron-style mountain silhouette
function addTronMountainSilhouette() {
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
    scene.add(mountainLine);
}

// Add Tron-style buildings
function addTronBuildings() {
    const buildingGeometry = new THREE.BoxGeometry(2, 6, 2);
    const buildingMaterial = new THREE.MeshPhongMaterial({ 
        color: colors.deepBlue,
        emissive: colors.neonBlue,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const buildingPositions = [
        {x: -8, z: -15}, {x: 8, z: -15},
        {x: -12, z: -25}, {x: 12, z: -25},
        {x: -7, z: -35}, {x: 7, z: -35}
    ];

    buildingPositions.forEach(pos => {
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(pos.x, 3, pos.z);
        scene.add(building);
    });
}

// Create the path and nodes
function createPath() {
path = {
    points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(5, 0, -20),
        new THREE.Vector3(-5, 0, -30),
        new THREE.Vector3(0, 0, -40),
        new THREE.Vector3(5, 0, -50)  // New point for Tetris node
    ],
    nodes: [
        { 
            position: new THREE.Vector3(0, 0, 0), 
            title: "Personal Statement",
            text: "Innovative and detail-oriented Software Engineer with 5+ years of experience in developing robust web applications and microservices. Passionate about creating efficient, scalable solutions that drive business growth and enhance user experiences. Committed to continuous learning and staying abreast of emerging technologies to deliver cutting-edge software solutions."
        },
        { 
            position: new THREE.Vector3(0, 0, -10), 
            title: "Professional Experience",
            text: `
SENIOR SOFTWARE ENGINEER | TechInnovate Solutions | 2020 - Present
• Led development of a high-performance e-commerce platform, improving load times by 40% and increasing conversions by 25%
• Implemented microservices architecture, enhancing system scalability and reducing deployment times by 60%
• Mentored junior developers, improving team productivity by 30%

SOFTWARE ENGINEER | DataDrive Systems | 2018 - 2020
• Developed RESTful APIs for a data analytics platform, processing over 1 million requests daily
• Optimized database queries, reducing response times by 50%
• Implemented automated testing, increasing code coverage from 60% to 95%

JUNIOR SOFTWARE DEVELOPER | WebCraft Innovations | 2016 - 2018
• Contributed to the development of a content management system used by over 100 clients
• Implemented responsive design, improving mobile user engagement by 35%
• Resolved 200+ bugs, enhancing overall system stability

SKILLS
Languages: Java, Python, JavaScript (Node.js, React)
Databases: MySQL, MongoDB, PostgreSQL
Tools: Git, Docker, Jenkins, AWS, Kubernetes
`
        },
        { 
            position: new THREE.Vector3(5, 0, -20), 
            title: "Education",
            text: `
MASTER OF SCIENCE IN COMPUTER SCIENCE | Tech University | 2016
• Thesis: "Optimizing Machine Learning Algorithms for Big Data Processing"
• GPA: 3.8/4.0

BACHELOR OF SCIENCE IN SOFTWARE ENGINEERING | Innovation College | 2014
• Senior Project: Developed a mobile app for campus navigation
• GPA: 3.7/4.0
`
        },
        { 
            position: new THREE.Vector3(-5, 0, -30), 
            title: "Hobbies & Interests",
            text: `
1. Open Source Contribution: Active contributor to various open-source projects, including a popular JavaScript framework and a Python data visualization library.

2. Competitive Programming: Regular participant in coding challenges on platforms like LeetCode and HackerRank, consistently ranking in the top 5% of participants.

3. Hiking & Nature Photography: Avid hiker who has completed trails in 10 national parks. Combine this passion with landscape photography, having had work featured in local nature magazines.

4. Game Development: Creating indie games using Unity in spare time. Latest project: a puzzle game that has garnered over 10,000 downloads on mobile platforms.

5. Tech Blogging: Maintain a personal blog discussing latest trends in software development, with a growing readership of over 5,000 monthly visitors.

6. Volunteering: Regular volunteer at local coding bootcamps, teaching programming basics to underprivileged youth and career changers.
`
        },
        { 
            position: new THREE.Vector3(0, 0, -40), 
            title: "Contact & Connect",
            text: `
Email: jane.doe@email.com
LinkedIn: linkedin.com/in/janedoe
GitHub: github.com/janedoe
Personal Website: janedoe.dev
Phone: (123) 456-7890

Let's connect and explore how we can innovate together!
`
        },
        {
            position: new THREE.Vector3(5, 0, -50),
            title: "Tetris Game",
            text: "Play a game of Tetris!"
        }
    ]
};

curve = new THREE.CatmullRomCurve3(path.points);
currentNodeIndex = 0;
console.log("Path created and curve defined");

// Only call drawPath if the scene has been initialized
if (scene) {
    drawPath();
} else {
    console.warn("Scene not initialized. drawPath will be called later.");
}
}

function drawPath() {
    console.log("Drawing path...");
    if (pathTube) {
        console.log("Removing existing path tube...");
        scene.remove(pathTube);
    }

    console.log("Creating new tube geometry...");
    const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.2, 8, false);
    console.log("Tube geometry created:", tubeGeometry);

    console.log("Creating tube material...");
    const tubeMaterial = new THREE.MeshPhongMaterial({
        color: colors.neonBlue,
        emissive: colors.neonBlue,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });

    console.log("Creating mesh...");
    pathTube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    console.log("Adding path tube to scene...");
    scene.add(pathTube);

    console.log("Updating path color...");
    updatePathColor();
}

// Create node representations
function createNodes() {
    if (!scene) {
        console.error("Scene is not initialized. Make sure initScene() is called before createNodes()");
        return;
    }

    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);

    path.nodes.forEach((node, index) => {
        const sphereMaterial = index === 0 ? blueMaterial : cyanMaterial;
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(node.position);
        scene.add(sphere);
        node.object = sphere;

        // Add glow effect
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: { type: "f", value: 0.1 },
                p: { type: "f", value: 1.2 },
                glowColor: { type: "c", value: new THREE.Color(colors.neonBlue) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    vec3 vNormel = normalize(normalMatrix * viewVector);
                    intensity = pow(0.5 - dot(vNormal, vNormel), 2.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        const glowSphere = new THREE.Mesh(sphereGeometry.clone().scale(1.2, 1.2, 1.2), glowMaterial);
        glowSphere.position.copy(node.position);
        scene.add(glowSphere);
        node.glowObject = glowSphere;
    });
}

function turnAround() {
    isMovingForward = !isMovingForward;
    const currentT = currentNodeIndex / (path.nodes.length - 1);
    const targetT = isMovingForward ? 
        Math.min(currentT + 0.1, 1) :
        Math.max(currentT - 0.1, 0);
    
    new TWEEN.Tween({ t: currentT })
        .to({ t: targetT }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function(object) {
            const t = Math.max(0, Math.min(object.t, 1)); // Ensure t is always between 0 and 1
            const position = getPositionAlongCurve(t);
            camera.position.copy(position);
            
            // Look in the opposite direction, but maintain camera height
            const lookAt = getPositionAlongCurve(isMovingForward ? Math.min(t + 0.05, 1) : Math.max(t - 0.05, 0));
            lookAt.y -= cameraHeight; // Adjust look-at point to be at path level
            camera.lookAt(lookAt);
        })
        .onComplete(function() {
            updateNodeColors();
            updatePathColor();
        })
        .start();

    logToTerminal(`Turned around. Now facing ${isMovingForward ? 'forward' : 'backward'}.`);
}

// Handle user input
function handleInput(event) {
    if (isTetrisActive) {
        // If Tetris is active, only handle Escape key to exit the game
        if (event.key === 'Escape') {
            stopTetrisGame();
            hidePlacard();
            isTetrisActive = false;
        }
        // Let all other keys be handled by the Tetris game
        return;
    }

    switch (event.key) {
        case 'ArrowUp':
            hidePlacard();
            moveForward();
            break;
        case 'ArrowDown':
            hidePlacard();
            turnAround();
            break;
        case 'Enter':
            showPlacard();
            break;
        case 'Escape':
            hidePlacard();
            break;
        case ' ':
            toggleMenu();
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
            if (nodeIndex < path.nodes.length) {
                hidePlacard();
                navigateToNode(nodeIndex);
            }
            break;
    }
}

function getPositionAlongCurve(t) {
    if (typeof curve === 'undefined') {
        console.error("Curve is not defined in getPositionAlongCurve");
        return new THREE.Vector3(0, cameraHeight, 0); // Return a default position
    }
    const basePosition = curve.getPointAt(t);
    return new THREE.Vector3(basePosition.x, basePosition.y + cameraHeight, basePosition.z);
}

// Move forward along the path
function moveForward() {
    if (isMovingForward && currentNodeIndex < path.nodes.length - 1) {
        currentNodeIndex++;
    } else if (!isMovingForward && currentNodeIndex > 0) {
        currentNodeIndex--;
    } else {
        logToTerminal("End of path reached. Cannot move further.");
        return;
    }
    
    const startT = (currentNodeIndex - 1) / (path.nodes.length - 1);
    const endT = currentNodeIndex / (path.nodes.length - 1);
    
    new TWEEN.Tween({ t: startT })
        .to({ t: endT }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function(object) {
            const position = getPositionAlongCurve(object.t);
            camera.position.copy(position);
            
            // Look ahead on the curve, but maintain camera height
            const lookAhead = getPositionAlongCurve(Math.min(object.t + 0.05, 1));
            lookAhead.y -= cameraHeight; // Adjust look-at point to be at path level
            camera.lookAt(lookAhead);
        })
        .onComplete(function() {
            updateNodeColors();
            updatePathColor();
        })
        .start();

    logToTerminal(`Moving to Node ${currentNodeIndex}: ${path.nodes[currentNodeIndex].title}`);
}

// Update turnAround function
function moveForward() {
    if (isMovingForward && currentNodeIndex < path.nodes.length - 1) {
        currentNodeIndex++;
    } else if (!isMovingForward && currentNodeIndex > 0) {
        currentNodeIndex--;
    } else {
        logToTerminal("End of path reached. Cannot move further.");
        return;
    }
    
    const startT = Math.max(0, Math.min((currentNodeIndex - 1) / (path.nodes.length - 1), 1));
    const endT = Math.max(0, Math.min(currentNodeIndex / (path.nodes.length - 1), 1));
    
    new TWEEN.Tween({ t: startT })
        .to({ t: endT }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function(object) {
            const t = Math.max(0, Math.min(object.t, 1)); // Ensure t is always between 0 and 1
            const position = getPositionAlongCurve(t);
            camera.position.copy(position);
            
            // Look ahead on the curve, but maintain camera height
            const lookAhead = getPositionAlongCurve(Math.min(t + 0.05, 1));
            lookAhead.y -= cameraHeight; // Adjust look-at point to be at path level
            camera.lookAt(lookAhead);
        })
        .onComplete(function() {
            updateNodeColors();
            updatePathColor();
        })
        .start();

    logToTerminal(`Moving to Node ${currentNodeIndex}: ${path.nodes[currentNodeIndex].title}`);
}

// Update navigateToNode function
function navigateToNode(targetIndex) {
    if (targetIndex < 0 || targetIndex >= path.nodes.length) {
        logToTerminal(`Invalid node index: ${targetIndex}`);
        return;
    }

    const startT = currentNodeIndex / (path.nodes.length - 1);
    const endT = targetIndex / (path.nodes.length - 1);
    const duration = 2000 * Math.abs(targetIndex - currentNodeIndex); // 2 seconds per node

    new TWEEN.Tween({ t: startT })
        .to({ t: endT }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function(object) {
            const position = getPositionAlongCurve(object.t);
            camera.position.copy(position);
            
            // Look ahead on the curve, but maintain camera height
            const lookAhead = getPositionAlongCurve(Math.min(object.t + 0.05, 1));
            lookAhead.y -= cameraHeight; // Adjust look-at point to be at path level
            camera.lookAt(lookAhead);
        })
        .onComplete(function() {
            currentNodeIndex = targetIndex;
            updateNodeColors();
            updatePathColor();
            logToTerminal(`Navigated to Node ${currentNodeIndex}: ${path.nodes[currentNodeIndex].title}`);
        })
        .start();

    hideMenu();
}

// Update camera position
function updateCameraPosition() {
    const currentNode = path.nodes[currentNodeIndex];
    const nextNode = isMovingForward ?
        path.nodes[Math.min(currentNodeIndex + 1, path.nodes.length - 1)] :
        path.nodes[Math.max(currentNodeIndex - 1, 0)];
    
    const direction = new THREE.Vector3().subVectors(nextNode.position, currentNode.position);
    const targetPosition = new THREE.Vector3().addVectors(currentNode.position, direction.normalize().multiplyScalar(8));
    
    new TWEEN.Tween(camera.position)
        .to(targetPosition, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    camera.lookAt(nextNode.position);
}

// Update node colors based on traversal
function updateNodeColors() {
    path.nodes.forEach((node, index) => {
        if (index === currentNodeIndex) {
            node.object.material = blueMaterial;
            node.glowObject.material.uniforms.glowColor.value = new THREE.Color(colors.neonBlue);
        } else {
            node.object.material = cyanMaterial;
            node.glowObject.material.uniforms.glowColor.value = new THREE.Color(colors.cyan);
        }
    });
}

// Update path color based on traversal
function updatePathColor() {
    console.log("Updating path color...");
    if (!pathTube) {
        console.warn("pathTube is not defined. Cannot update path color.");
        return;
    }

    const geometry = pathTube.geometry;
    const positionAttribute = geometry.getAttribute('position');
    const colors = [];

    const pinkColor = new THREE.Color(colors.neonPink);
    const blueColor = new THREE.Color(colors.neonBlue);

    for (let i = 0; i < positionAttribute.count; i++) {
        const t = i / (positionAttribute.count - 1);
        if (t <= currentNodeIndex / (path.nodes.length - 1)) {
            colors.push(pinkColor.r, pinkColor.g, pinkColor.b);
        } else {
            colors.push(blueColor.r, blueColor.g, blueColor.b);
        }
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    pathTube.material.vertexColors = true;
    pathTube.material.needsUpdate = true;
    console.log("Path color updated");
}

function showPlacard() {
    if (placardElement) {
        hidePlacard();
    }

    const currentNode = path.nodes[currentNodeIndex];

    placardElement = document.createElement('div');
    placardElement.id = 'placard';
    placardElement.innerHTML = `
        <h2>${currentNode.title}</h2>
        <div class="placard-content">${currentNode.text}</div>
    `;
    document.body.appendChild(placardElement);

    if (currentNode.title === "Tetris Game") {
        tetrisGame = document.createElement('div');
        tetrisGame.id = 'tetris-container';
        placardElement.appendChild(tetrisGame);
        createTetrisGame('tetris-container');
        isTetrisActive = true;
    }

    updatePlacardPosition();

    logToTerminal(`Showing placard for ${currentNode.title}`);
}

function hidePlacard() {
    if (placardElement && placardElement.parentNode) {
        if (tetrisGame) {
            // Stop the Tetris game if it's running
            if (typeof stopTetrisGame === 'function') {
                stopTetrisGame();
            }
            tetrisGame = null;
            isTetrisActive = false;
        }
        placardElement.parentNode.removeChild(placardElement);
        placardElement = null;
        logToTerminal('Hiding placard');
    }
}

function updatePlacardPosition() {
    if (placardElement) {
        const vector = new THREE.Vector3(0, 0, -2);
        vector.applyQuaternion(camera.quaternion);
        vector.add(camera.position);

        const widthHalf = window.innerWidth / 2;
        const heightHalf = window.innerHeight / 2;
        vector.project(camera);

        const x = (vector.x * widthHalf) + widthHalf - (placardElement.offsetWidth / 2);
        const y = -(vector.y * heightHalf) + heightHalf - (placardElement.offsetHeight / 2);

        placardElement.style.left = `${x}px`;
        placardElement.style.top = `${y}px`;
    }
}


function createMenu() {
    menuElement = document.createElement('div');
    menuElement.id = 'navigation-menu';
    menuElement.style.position = 'fixed';
    menuElement.style.bottom = '20px';
    menuElement.style.left = '50%';
    menuElement.style.transform = 'translateX(-50%)';
    menuElement.style.backgroundColor = `rgba(10, 25, 47, 0.8)`;
    menuElement.style.color = `#0984e3`;
    menuElement.style.fontFamily = 'monospace';
    menuElement.style.fontSize = '14px';
    menuElement.style.padding = '10px';
    menuElement.style.borderRadius = '5px';
    menuElement.style.border = `1px solid #0984e3`;
    menuElement.style.boxShadow = `0 0 10px #0984e3`;
    menuElement.style.zIndex = '1000';
    menuElement.style.display = 'none';
    document.body.appendChild(menuElement);
}

function toggleMenu() {
    if (menuElement.style.display === 'none') {
        showMenu();
    } else {
        hideMenu();
    }
}

function showMenu() {
    menuElement.style.display = 'block';
    menuElement.innerHTML = path.nodes.map((node, index) => 
        `<div>${index}: ${node.title}</div>`
    ).join('');
    logToTerminal('Navigation menu opened');
}

function hideMenu() {
    menuElement.style.display = 'none';
    logToTerminal('Navigation menu closed');
}

// Handle window resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate(time) {
    try {
        animationFrameId = requestAnimationFrame(animate);
        TWEEN.update(time);

        // Update glow effect
        path.nodes.forEach(node => {
            if (node.glowObject && node.glowObject.material.uniforms) {
                node.glowObject.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, node.glowObject.position);
            }
        });

        // Ensure pathTube is visible
        if (pathTube) {
            pathTube.visible = true;
        }

        updatePlacardPosition();
        renderer.render(scene, camera);
    } catch (error) {
        console.error("Error in animation loop:", error);
        cancelAnimationFrame(animationFrameId);
        showLoadingIndicator();
        logToTerminal("An error occurred. Please check the console and refresh the page.");
    }
}

// Create terminal window
function createTerminal() {
    terminal = document.createElement('div');
    terminal.id = 'terminal';
    terminal.style.position = 'fixed';
    terminal.style.top = '20px';
    terminal.style.left = '20px';
    terminal.style.width = '300px';
    terminal.style.height = '200px';
    terminal.style.backgroundColor = `rgba(10, 25, 47, 0.8)`;  // Adjusted to match deepBlue color
    terminal.style.color = `#0984e3`;  // Adjusted to match neonBlue color
    terminal.style.fontFamily = 'monospace';
    terminal.style.fontSize = '12px';
    terminal.style.padding = '10px';
    terminal.style.overflowY = 'scroll';
    terminal.style.border = `1px solid #0984e3`;  // Neon blue border
    terminal.style.boxShadow = `0 0 10px #0984e3`;  // Neon blue glow
    terminal.style.zIndex = '1000';
    terminal.style.borderRadius = '5px';  // Rounded corners
    document.body.appendChild(terminal);
}

// Log message to terminal
function logToTerminal(message) {
    const logEntry = document.createElement('div');
    logEntry.textContent = `> ${message}`;
    terminal.appendChild(logEntry);
    terminal.scrollTop = terminal.scrollHeight;
}

// Show loading indicator
function showLoadingIndicator() {
    loadingIndicator = document.getElementById('loading-indicator');
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.backgroundColor = `#${colors.deepBlue.toString(16)}`;
        loadingIndicator.style.color = `#${colors.neonBlue.toString(16)}`;
        loadingIndicator.style.padding = '20px';
        loadingIndicator.style.borderRadius = '5px';
        loadingIndicator.style.zIndex = '1000';
        loadingIndicator.style.fontFamily = 'Arial, sans-serif';
        loadingIndicator.style.border = `2px solid #${colors.neonBlue.toString(16)}`;
        loadingIndicator.style.boxShadow = `0 0 10px #${colors.neonBlue.toString(16)}`;
        loadingIndicator.textContent = 'Initializing Grid...';
        document.body.appendChild(loadingIndicator);
    }
    loadingIndicator.style.display = 'block';
}

// Hide loading indicator
function hideLoadingIndicator() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Initialize the application
function init() {
    console.log("Initializing...");
    showLoadingIndicator();
    
    console.log("Creating path...");
    createPath();
    
    console.log("Initializing scene...");
    initScene();
    
    console.log("Drawing path...");
    drawPath(); // Call drawPath here, after scene is initialized
    
    console.log("Creating nodes...");
    createNodes();
    
    console.log("Creating terminal...");
    createTerminal();
    console.log("Creating menu...");
    createMenu();
    
    window.addEventListener('keydown', handleInput);

    // Load the Tetris game script
    const tetrisScript = document.createElement('script');
    tetrisScript.src = 'tetris.js';
    tetrisScript.onload = () => {
        console.log("Tetris game script loaded");
    };
    document.head.appendChild(tetrisScript);

    console.log("Starting animation in 1 second...");
    setTimeout(() => {
        console.log("Hiding loading indicator...");
        hideLoadingIndicator();
        console.log("Starting animation...");
        animate();
    }, 1000);
}

// Start the application
window.onload = init;