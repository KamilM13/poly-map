import * as THREE from "https://unpkg.com/three@0.166.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.166.1/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "https://unpkg.com/three@0.166.1/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://unpkg.com/three@0.166.1/examples/jsm/geometries/TextGeometry.js";

document.addEventListener('DOMContentLoaded', () => {

    let textLabels = [];  // Initialize textLabels array

    class SceneInit {
        constructor(fov = 60, camera, scene, controls, renderer) {
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
                0.1,
                8000
            );
            this.camera.position.set(0, 1250, 2000);

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

    class CelestialBody {
        constructor(name, size, texturePath, orbitRadius, orbitSpeed) {
            this.name = name;
            this.size = size;
            this.texturePath = texturePath;
            this.orbitRadius = orbitRadius;
            this.orbitSpeed = orbitSpeed;
        }

        createMesh() {
            const geometry = new THREE.SphereGeometry(this.size, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(this.texturePath),
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = this.name;
            return mesh;
        }

        createOrbitPath() {
            const curve = new THREE.EllipseCurve(
                0, 0,
                this.orbitRadius, this.orbitRadius,
                0, 2 * Math.PI,
                false,
                0
            );
            const points = curve.getPoints(100);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
            return new THREE.Line(geometry, material);
        }
    }

    class Planet extends CelestialBody {
        constructor(name, size, texturePath, orbitRadius, orbitSpeed, showOrbit = false) {
            super(name, size, texturePath, orbitRadius, orbitSpeed);
            this.moons = [];
            this.showOrbit = showOrbit;
        }

        addMoon(moon) {
            this.moons.push(moon);
        }
    }

    const createPlanets = (planetSpecs, showOrbitPaths) => {
        const planets = [];
        planetSpecs.forEach((spec) => {
            const { name, size, texturePath, orbitRadius, orbitSpeed, moons } = spec;
            const planet = new Planet(name, size, texturePath, orbitRadius, orbitSpeed, showOrbitPaths);

            moons.forEach((moonSpec) => {
                const { name: moonName, size: moonSize, texturePath: moonTexturePath, orbitRadius: moonOrbitRadius, orbitSpeed: moonOrbitSpeed } = moonSpec;
                const moon = new CelestialBody(moonName, moonSize, moonTexturePath, moonOrbitRadius, moonOrbitSpeed);
                planet.addMoon(moon);
            });

            planets.push(planet);
        });
        return planets;
    };

    const createLabel = (text, parent) => {
        const loader = new FontLoader();
        loader.load('font.json', function (font) {
            const textGeometry = new TextGeometry(text, {
                font: font,
                size: 100,
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const mesh = new THREE.Mesh(textGeometry, textMaterial);
            mesh.position.set(0, 50, 0);
            mesh.scale.set(0.15, 0.15, 0.15);
            mesh.name = `${text}_label`;
            parent.add(mesh);
            textLabels.push(mesh);
        });
    };

    const initScene = async () => {
        const sceneInit = new SceneInit();
        sceneInit.initScene();

        // Background
        const textureLoader = new THREE.TextureLoader();
        const bgGeometry = new THREE.SphereGeometry(4000, 100, 100);
        const bgMaterial = new THREE.MeshBasicMaterial({
            map: textureLoader.load("image/Stars Background.png"),
            side: THREE.DoubleSide,
        });
        const bg = new THREE.Mesh(bgGeometry, bgMaterial);
        sceneInit.scene.add(bg);

        // Star
        const starGeometry = new THREE.SphereGeometry(48, 400, 200);
        const starMaterial = new THREE.MeshBasicMaterial({
            map: textureLoader.load("image/Red Star.jpg"),
        });
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        sceneInit.scene.add(starMesh);

        // Create label for the star
        createLabel('Visage', starMesh);

        // Create planets with specific textures
        const planetSpecs = [
            {
                name: "Visage I",
                size: 18,
                texturePath: "image/Ceres.jpg",
                orbitRadius: 100,
                orbitSpeed: 0.0001,
                moons: [
                    {
                        name: "Draper Station",
                        size: 5,
                        texturePath: "image/Red Moon.jpg",
                        orbitRadius: 25,
                        orbitSpeed: 0.001
                    }
                ]
            },
            {
                name: "Visage II",
                size: 24,
                texturePath: "image/Earth.jpeg",
                orbitRadius: 300,
                orbitSpeed: 0.00002,
                moons: []
            },
            {
                name: "Dwarf Planet",
                size: 9,
                texturePath: "image/Red Moon.jpg",
                orbitRadius: 900,
                orbitSpeed: 0.00001,
                moons: []
            },
            // Add more planet specifications as needed
        ];

        const showOrbitPaths = true; // Toggle this to turn orbit paths on or off
        const planets = createPlanets(planetSpecs, showOrbitPaths);

        planets.forEach(planet => {
            const planetGroup = new THREE.Group();
            const planetMesh = planet.createMesh();
            planetGroup.add(planetMesh);

            // Create label for the planet
            createLabel(planet.name, planetMesh);

            if (planet.showOrbit) {
                const orbitPath = planet.createOrbitPath();
                orbitPath.rotateX(-Math.PI/2);
                sceneInit.scene.add(orbitPath);
            }

            planet.moons.forEach(moon => {
                const moonMesh = moon.createMesh();
                moonMesh.position.set(moon.orbitRadius, 0, 0);
                planetGroup.add(moonMesh);

                // Create label for the moon
                createLabel(moon.name, moonMesh);

                if (planet.showOrbit) {
                    const moonOrbitPath = moon.createOrbitPath();
                    moonOrbitPath.position.set(0, 0, 0);
                    moonOrbitPath.rotateX(-Math.PI/2);
                    planetGroup.add(moonOrbitPath);
                }
            });

            sceneInit.scene.add(planetGroup);

            planet.planetGroup = planetGroup;
            planet.planetMesh = planetMesh;
        });

        const animate = () => {
            const time = performance.now();

            planets.forEach(planet => {
                const t = (planet.orbitSpeed * time) % 1;
                const angle = t * 2 * Math.PI;
                planet.planetGroup.position.x = planet.orbitRadius * Math.cos(angle);
                planet.planetGroup.position.z = planet.orbitRadius * Math.sin(angle);

                planet.moons.forEach((moon, index) => {
                    const moonMesh = planet.planetGroup.children[index + 1]; // Skipping the first child which is the planet itself
                    const moonT = (moon.orbitSpeed * time) % 1;
                    const moonAngle = moonT * 2 * Math.PI;
                    moonMesh.position.x = moon.orbitRadius * Math.cos(moonAngle);
                    moonMesh.position.z = moon.orbitRadius * Math.sin(moonAngle);
                });

                planet.planetMesh.rotation.y += 0.001;
                planet.moons.forEach((moon, index) => {
                    planet.planetGroup.children[index + 1].rotation.y += 0.001;
                });
            });

            starMesh.rotation.y += 0.00008;

            textLabels.forEach((label) => {
                label.lookAt(sceneInit.camera.position);
            });

            requestAnimationFrame(animate);
            sceneInit.renderer.render(sceneInit.scene, sceneInit.camera);
        };
        animate();
    };

    initScene();
});
