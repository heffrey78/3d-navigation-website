// pathManager.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';
import { colors } from './constants.js';

export class PathManager {
    constructor(scene) {
        this.scene = scene;
        this.path = null;
        this.curve = null;
        this.pathTube = null;
    }

    async createPath(pathData) {
        try {
            if (!this.scene) {
                throw new Error("Scene is not initialized");
            }
            this.path = pathData;
            this.curve = new THREE.CatmullRomCurve3(this.path.points.map(point => new THREE.Vector3(point.x, point.y, point.z)));
            await this.drawPath();
            await this.createNodes();
            console.log("Path created successfully");
        } catch (error) {
            console.error("Error creating path:", error);
            throw error;
        }
    }

    async drawPath() {
        try {
            if (this.pathTube) {
                this.scene.remove(this.pathTube);
            }

            const tubeGeometry = new THREE.TubeGeometry(this.curve, 100, 0.2, 8, false);
            const tubeMaterial = new THREE.MeshPhongMaterial({
                color: colors.neonBlue,
                emissive: colors.neonBlue,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.7
            });

            this.pathTube = new THREE.Mesh(tubeGeometry, tubeMaterial);
            this.scene.add(this.pathTube);
        } catch (error) {
            console.error("Error drawing path:", error);
            throw error;
        }
    }

    async createNodes() {
        try {
            const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
            const blueMaterial = new THREE.MeshBasicMaterial({ color: colors.neonBlue });
            const cyanMaterial = new THREE.MeshBasicMaterial({ color: colors.cyan });

            this.path.nodes.forEach((node, index) => {
                const sphereMaterial = index === 0 ? blueMaterial : cyanMaterial;
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphere.position.copy(new THREE.Vector3(node.position.x, node.position.y, node.position.z));
                this.scene.add(sphere);
                node.object = sphere;

                this.addGlowEffect(node);
            });
        } catch (error) {
            console.error("Error creating nodes:", error);
            throw error;
        }
    }

    addGlowEffect(node) {
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: { type: "f", value: 0.1 },
                p: { type: "f", value: 1.2 },
                glowColor: { type: "c", value: new THREE.Color(colors.neonBlue) },
                viewVector: { type: "v3", value: new THREE.Vector3() }
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

        const glowSphere = new THREE.Mesh(node.object.geometry.clone().scale(1.2, 1.2, 1.2), glowMaterial);
        glowSphere.position.copy(node.object.position);
        this.scene.add(glowSphere);
        node.glowObject = glowSphere;
    }

    updateNodeColors(currentNodeIndex) {
        const blueMaterial = new THREE.MeshBasicMaterial({ color: colors.neonBlue });
        const cyanMaterial = new THREE.MeshBasicMaterial({ color: colors.cyan });

        this.path.nodes.forEach((node, index) => {
            if (index === currentNodeIndex) {
                node.object.material = blueMaterial;
                node.glowObject.material.uniforms.glowColor.value = new THREE.Color(colors.neonBlue);
            } else {
                node.object.material = cyanMaterial;
                node.glowObject.material.uniforms.glowColor.value = new THREE.Color(colors.cyan);
            }
        });
    }

    updatePathColor(currentNodeIndex) {
        if (!this.pathTube) {
            console.warn("pathTube is not defined. Cannot update path color.");
            return;
        }

        const geometry = this.pathTube.geometry;
        const positionAttribute = geometry.getAttribute('position');
        const colors = [];

        const pinkColor = new THREE.Color(colors.neonPink);
        const blueColor = new THREE.Color(colors.neonBlue);

        for (let i = 0; i < positionAttribute.count; i++) {
            const t = i / (positionAttribute.count - 1);
            if (t <= currentNodeIndex / (this.path.nodes.length - 1)) {
                colors.push(pinkColor.r, pinkColor.g, pinkColor.b);
            } else {
                colors.push(blueColor.r, blueColor.g, blueColor.b);
            }
        }

        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        this.pathTube.material.vertexColors = true;
        this.pathTube.material.needsUpdate = true;
    }

    updateGlowEffects(cameraPosition) {
        this.path.nodes.forEach(node => {
            if (node.glowObject && node.glowObject.material.uniforms) {
                node.glowObject.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(cameraPosition, node.glowObject.position);
            }
        });
    }
}