import * as THREE from "https://unpkg.com/three@0.166.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.166.1/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "https://unpkg.com/three@0.166.1/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://unpkg.com/three@0.166.1/examples/jsm/geometries/TextGeometry.js";

document.addEventListener('DOMContentLoaded', () => {

    let textLabels = [];  // Initialize textLabels array

    class Planet {
        constructor(radius, positionX, textureFile) {
            this.radius = radius;
            this.positionX = positionX;
            this.textureFile = textureFile;
        }

        getMesh() {
            if (this.mesh === undefined || this.mesh === null) {
                const geometry = new THREE.SphereGeometry(this.radius);
                const texture = new THREE.TextureLoader().load(this.textureFile);
                const material = new THREE.MeshBasicMaterial({ map: texture });
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.x += this.positionX;
            }
            return this.mesh;
        }
    }

    class Rotation {
        constructor(planetMesh, showRotation = false) {
            this.planetPositionX = planetMesh.position.x;
            this.y = 0.25;
            this.z = 0.25;
            this.showRotation = showRotation;
        }

        getMesh() {
            if (this.mesh === undefined || this.mesh === null) {
                const geometry = new THREE.BoxGeometry(this.planetPositionX, 0.25, 0.25);
                const material = new THREE.MeshNormalMaterial();
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.x = this.planetPositionX / 2;
                this.mesh.visible = this.showRotation;
            }
            return this.mesh;
        }
    }

    class SceneInit {
        constructor(fov = 75, camera, scene, controls, renderer) {
            this.fov = fov;
            this.scene = scene;
            this.camera = camera;
            this.controls = controls;
            this.renderer = renderer;
        }

        initScene() {
            this.camera = new THREE.PerspectiveCamera(
                this.fov,
                window.innerWidth / window.innerHeight,
                1,
                1000
            );
            this.camera.position.x = 75;
            this.camera.position.y = 300;
            this.camera.position.z = 75;

            this.scene = new THREE.Scene();

            this.renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById("myThreeJsCanvas"),
                antialias: true,
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);

            window.addEventListener("resize", () => this.onWindowResize(), false);
        }

        animate() {
            window.requestAnimationFrame(this.animate.bind(this));
            this.render();
        }

        render() {
            this.renderer.render(this.scene, this.camera);
        }

        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    const initScene = async () => {
        let test = new SceneInit();
        test.initScene();
        test.animate();

        const loader = new FontLoader();
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const visageStarGeometry = new THREE.SphereGeometry(10);
        const visageStarTexture = new THREE.TextureLoader().load("image/red_star.jpg");
        const visageStarMaterial = new THREE.MeshBasicMaterial({ map: visageStarTexture });
        const visageStarMesh = new THREE.Mesh(visageStarGeometry, visageStarMaterial);
        const visageSystem = new THREE.Group();
        visageSystem.add(visageStarMesh);
        loader.load('font.json', function (font) {
            const visageStarTextGeometry = new TextGeometry("Visage Star", {
                font: font,
                size: 120,
            });
            const visageStarLabelMesh = new THREE.Mesh(visageStarTextGeometry, textMaterial);
            visageStarLabelMesh.position.set(0, 15, 0);
            visageStarLabelMesh.scale.set(0.05, 0.05, 0.05);
            visageStarMesh.add(visageStarLabelMesh);
            textLabels.push(visageStarLabelMesh);
        });
        test.scene.add(visageSystem);

        const visage1 = new Planet(3, 20, "image/grey.jpeg");
        const visage1Mesh = visage1.getMesh();
        let visage1Planet = new THREE.Group();
        visage1Planet.add(visage1Mesh);
        loader.load('font.json', function (font) {
            const visage1TextGeometry = new TextGeometry("Visage I", {
                font: font,
                size: 80,
            });
            const visage1LabelMesh = new THREE.Mesh(visage1TextGeometry, textMaterial);
            visage1LabelMesh.position.set(0, 3, 0);
            visage1LabelMesh.scale.set(0.05, 0.05, 0.05);
            visage1Mesh.add(visage1LabelMesh);
            textLabels.push(visage1LabelMesh);
        });

        const draper = new Planet(1, 0, "image/grey.jpeg"); // Draper Station initial position at origin
        const draperMesh = draper.getMesh();
        let draperStation = new THREE.Group();
        draperStation.add(draperMesh);
        test.scene.add(draperStation); // Add Draper Station directly to the scene
        loader.load('font.json', function (font) {
            const draperTextGeometry = new TextGeometry("Draper Station", {
                font: font,
                size: 60,
            });
            const draperLabelMesh = new THREE.Mesh(draperTextGeometry, textMaterial);
            draperLabelMesh.position.set(0, 3, 0);
            draperLabelMesh.scale.set(0.05, 0.05, 0.05);
            draperMesh.add(draperLabelMesh);
            textLabels.push(draperLabelMesh);
        });

        const visage2 = new Planet(4, 60, "image/earth.jpeg");
        const visage2Mesh = visage2.getMesh();
        let visage2Planet = new THREE.Group();
        visage2Planet.add(visage2Mesh);
        loader.load('font.json', function (font) {
            const visage2TextGeometry = new TextGeometry("Visage II", {
                font: font,
                size: 80,
            });
            const visage2LabelMesh = new THREE.Mesh(visage2TextGeometry, textMaterial);
            visage2LabelMesh.position.set(0, 3, 0);
            visage2LabelMesh.scale.set(0.05, 0.05, 0.05);
            visage2Mesh.add(visage2LabelMesh);
            textLabels.push(visage2LabelMesh);
        });

        const dwarf = new Planet(1, 180, "image/mars.jpeg");
        const dwarfMesh = dwarf.getMesh();
        let dwarfPlanet = new THREE.Group();
        dwarfPlanet.add(dwarfMesh);
        loader.load('font.json', function (font) {
            const dwarfTextGeometry = new TextGeometry("Dwarf planet", {
                font: font,
                size: 80,
            });
            const dwarfLabelMesh = new THREE.Mesh(dwarfTextGeometry, textMaterial);
            dwarfLabelMesh.position.set(0, 3, 0);
            dwarfLabelMesh.scale.set(0.05, 0.05, 0.05);
            dwarfMesh.add(dwarfLabelMesh);
            textLabels.push(dwarfLabelMesh);
        });

        visageSystem.add(visage1Planet, visage2Planet, dwarfPlanet);

        const visage1Rotation = new Rotation(visage1Mesh);
        const visage1RotationMesh = visage1Rotation.getMesh();
        visage1Planet.add(visage1RotationMesh);
        const visage2Rotation = new Rotation(visage2Mesh);
        const visage2RotationMesh = visage2Rotation.getMesh();
        visage2Planet.add(visage2RotationMesh);
        const dwarfRotation = new Rotation(dwarfMesh);
        const dwarfRotationMesh = dwarfRotation.getMesh();
        dwarfPlanet.add(dwarfRotationMesh);

        // NOTE: Animate solar system at 60fps.
        const EARTH_YEAR = 2 * Math.PI * (1 / 60) * (1 / 60);
        const animate = () => {
            visageStarMesh.rotation.y += 0.001;
            visage1Planet.rotation.y += EARTH_YEAR * 8;
            visage2Planet.rotation.y += EARTH_YEAR * 1.5;
            dwarfPlanet.rotation.y += EARTH_YEAR * 1;

            // Rotate Draper Station around Visage I
            const angle = EARTH_YEAR * 32; // Adjust speed if needed
            const radius = 3; // Adjust distance from Visage I
            draperStation.position.set(
                visage1Mesh.position.x + radius * Math.cos(angle),
                visage1Mesh.position.y,
                visage1Mesh.position.z + radius * Math.sin(angle)
            );

            requestAnimationFrame(animate);
            textLabels.forEach((label) => {
                label.lookAt(test.camera.position);
            });
            test.renderer.render(test.scene, test.camera);
        };
        animate();
    }
    initScene();
});
