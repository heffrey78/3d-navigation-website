// navigationManager.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';
import TWEEN from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.esm.min.js';
import { cameraHeight } from './constants.js';

export class NavigationManager {
    constructor(curve, camera, pathManager) {
        this.curve = curve;
        this.camera = camera;
        this.pathManager = pathManager;
        this.currentNodeIndex = 0;
        this.isMovingForward = true;
    }

    getPositionAlongCurve(t) {
        try {
            const basePosition = this.curve.getPointAt(t);
            return new THREE.Vector3(basePosition.x, basePosition.y + cameraHeight, basePosition.z);
        } catch (error) {
            console.error("Error getting position along curve:", error);
            return new THREE.Vector3(0, cameraHeight, 0);
        }
    }

    moveForward() {
        try {
            if (this.isMovingForward && this.currentNodeIndex < this.pathManager.path.nodes.length - 1) {
                this.currentNodeIndex++;
            } else if (!this.isMovingForward && this.currentNodeIndex > 0) {
                this.currentNodeIndex--;
            } else {
                console.log("End of path reached. Cannot move further.");
                return;
            }

            this.animateMove();
        } catch (error) {
            console.error("Error moving forward:", error);
        }
    }

    turnAround() {
        try {
            this.isMovingForward = !this.isMovingForward;
            const currentT = this.currentNodeIndex / (this.pathManager.path.nodes.length - 1);
            const targetT = this.isMovingForward ?
                Math.min(currentT + 0.1, 1) :
                Math.max(currentT - 0.1, 0);

            this.animateTurn(currentT, targetT);
        } catch (error) {
            console.error("Error turning around:", error);
        }
    }

    navigateToNode(targetIndex) {
        try {
            if (targetIndex < 0 || targetIndex >= this.pathManager.path.nodes.length) {
                console.log(`Invalid node index: ${targetIndex}`);
                return;
            }

            const startT = this.currentNodeIndex / (this.pathManager.path.nodes.length - 1);
            const endT = targetIndex / (this.pathManager.path.nodes.length - 1);
            const duration = 2000 * Math.abs(targetIndex - this.currentNodeIndex); // 2 seconds per node

            this.animateNavigation(startT, endT, duration, targetIndex);
        } catch (error) {
            console.error("Error navigating to node:", error);
        }
    }

    animateMove() {
        try {
            const startT = (this.currentNodeIndex - 1) / (this.pathManager.path.nodes.length - 1);
            const endT = this.currentNodeIndex / (this.pathManager.path.nodes.length - 1);

            new TWEEN.Tween({ t: startT })
                .to({ t: endT }, 2000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate((object) => {
                    const position = this.getPositionAlongCurve(object.t);
                    this.camera.position.copy(position);

                    const lookAhead = this.getPositionAlongCurve(Math.min(object.t + 0.05, 1));
                    lookAhead.y -= cameraHeight;
                    this.camera.lookAt(lookAhead);
                })
                .onComplete(() => {
                    this.pathManager.updateNodeColors(this.currentNodeIndex);
                    this.pathManager.updatePathColor(this.currentNodeIndex);
                })
                .start();
        } catch (error) {
            console.error("Error animating move:", error);
        }
    }

    animateTurn(currentT, targetT) {
        try {
            new TWEEN.Tween({ t: currentT })
                .to({ t: targetT }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate((object) => {
                    const t = Math.max(0, Math.min(object.t, 1));
                    const position = this.getPositionAlongCurve(t);
                    this.camera.position.copy(position);

                    const lookAt = this.getPositionAlongCurve(this.isMovingForward ? Math.min(t + 0.05, 1) : Math.max(t - 0.05, 0));
                    lookAt.y -= cameraHeight;
                    this.camera.lookAt(lookAt);
                })
                .onComplete(() => {
                    this.pathManager.updateNodeColors(this.currentNodeIndex);
                    this.pathManager.updatePathColor(this.currentNodeIndex);
                })
                .start();
        } catch (error) {
            console.error("Error animating turn:", error);
        }
    }

    animateNavigation(startT, endT, duration, targetIndex) {
        try {
            new TWEEN.Tween({ t: startT })
                .to({ t: endT }, duration)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate((object) => {
                    const position = this.getPositionAlongCurve(object.t);
                    this.camera.position.copy(position);

                    const lookAhead = this.getPositionAlongCurve(Math.min(object.t + 0.05, 1));
                    lookAhead.y -= cameraHeight;
                    this.camera.lookAt(lookAhead);
                })
                .onComplete(() => {
                    this.currentNodeIndex = targetIndex;
                    this.pathManager.updateNodeColors(this.currentNodeIndex);
                    this.pathManager.updatePathColor(this.currentNodeIndex);
                })
                .start();
        } catch (error) {
            console.error("Error animating navigation:", error);
        }
    }
}