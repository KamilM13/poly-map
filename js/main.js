import * as THREE from "https://unpkg.com/three@0.166.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.166.1/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "https://unpkg.com/three@0.166.1/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://unpkg.com/three@0.166.1/examples/jsm/geometries/TextGeometry.js";

document.addEventListener('DOMContentLoaded', () => {
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("./image/earth.png");

    let textLabels = [];  // Initialize textLabels array

    class Planet {
        constructor(radius, positionX, positionY, positionZ, textureFile) {
            this.radius = radius;
            this.positionX = positionX;
            this.positionY = positionY;
            this.positionZ = positionZ;
            this.textureFile = textureFile;
        }

        getMesh() {
            if (this.mesh === undefined || this.mesh === null) {
                const geometry = new THREE.SphereGeometry(this.radius);
                const texture = new THREE.TextureLoader().load(this.textureFile);
                const material = new THREE.MeshBasicMaterial({ map: texture });
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.x += this.positionX;
                this.mesh.position.y += this.positionY;
                this.mesh.position.z += this.positionZ;
            }
            return this.mesh;
        }
    }

    class SceneInit {
        constructor(fov = 36, camera, scene, controls, renderer) {
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
            this.camera.position.x = 100;
            this.camera.position.y = 300;
            this.camera.position.z = 100;

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

        const polyMap = new THREE.Group();
        test.scene.add(polyMap);

        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const config = {
          planets: [
            // layer 0
            { name: 'Earth', size: 2, x: 0, y: 0, z: 0, texture: './image/earth.png', layer: 0 },
            // layer 1
            { name: 'Alpha Centauri', size: 2, x: 0, y: 20, z: 0, texture: 'image/alpha_centauri.png', layer: 1 },
            { name: 'Dionyza\'s Tear', size: 2, x: 0, y: 20, z: 20, texture: 'image/alpha_centauri.png', layer: 1 },
            { name: 'Marus', size: 2, x: 0, y: 20, z: 40, texture: 'image/alpha_centauri.png', layer: 1 },
            { name: 'Valeria', size: 2, x: 20, y: 20, z: 40, texture: 'image/alpha_centauri.png', layer: 1 },
            { name: 'Cassio', size: 2, x: -20, y: 20, z: 0, texture: 'image/alpha_centauri.png', layer: 1 },
            { name: 'Belarius', size: 2, x: -20, y: 20, z: -20, texture: 'image/alpha_centauri.png', layer: 1 },
            { name: 'Odin Major', size: 2, x: -40, y: 20, z: 0, texture: 'image/valhalla_corp.png', layer: 1 },
            { name: 'Odin Minor', size: 2, x: -40, y: 20, z: 20, texture: 'image/valhalla_corp.png', layer: 1 },
            // layer 2
            { name: 'Grumio', size: 2, x: 0, y: 40, z: 20, texture: 'image/alpha_centauri.png', layer: 2 },
            { name: 'Alastor', size: 2, x: 20, y: 40, z: 20, texture: 'image/alpha_centauri.png', layer: 2 },
            { name: 'Macedon', size: 2, x: 20, y: 40, z: 40, texture: 'image/alpha_centauri.png', layer: 2 },
            { name: 'Cymbeline', size: 2, x: 20, y: 40, z: 0, texture: 'image/alpha_centauri.png', layer: 2 },
            { name: 'Scylla', size: 2, x: 0, y: 40, z: 0, texture: 'image/alpha_centauri.png', layer: 2 },
            { name: 'Ulysses', size: 2, x: 20, y: 40, z: -20, texture: 'image/epsilon_coal.png', layer: 2 },
            { name: 'Vor Alpha', size: 2, x: 0, y: 40, z: -20, texture: 'image/alpha_centauri.png', layer: 2 },
            { name: 'Cardamom', size: 2, x: -40, y: 40, z: -20, texture: 'image/tau_ceti.png', layer: 2 },
            { name: 'Lilith', size: 2, x: -20, y: 40, z: -20, texture: 'image/tau_ceti.png', layer: 2 },
            { name: 'Thor', size: 2, x: -40, y: 40, z: 0, texture: 'image/valhalla_corp.png', layer: 2 },
            // layer 3
            { name: 'Archimedes', size: 2, x: 0, y: 60, z: 20, texture: 'image/alpha_centauri.png', layer: 3 },
            { name: 'Zephon', size: 2, x: 0, y: 60, z: 0, texture: 'image/alpha_centauri.png', layer: 3 },
            { name: 'Szarik', size: 2, x: 20, y: 60, z: 40, texture: 'image/alpha_centauri.png', layer: 3 },
            { name: 'Zisa', size: 2, x: 0, y: 60, z: 40, texture: 'image/alpha_centauri.png', layer: 3 },
            { name: 'Vor Beta', size: 2, x: 0, y: 60, z: -20, texture: 'image/alpha_centauri.png', layer: 3 },
            { name: 'Anderson', size: 2, x: 20, y: 60, z: 0, texture: 'image/epsilon_coal.png', layer: 3 },
            { name: 'Kirby', size: 2, x: 20, y: 60, z: -20, texture: 'image/epsilon_coal.png', layer: 3 },
            { name: 'Blanchard', size: 2, x: 20, y: 60, z: -40, texture: 'image/epsilon_coal.png', layer: 3 },
            { name: 'Tau Ceti', size: 2, x: -20, y: 60, z: -20, texture: 'image/tau_ceti.png', layer: 3 },
            { name: 'Hinn', size: 2, x: -40, y: 60, z: 0, texture: 'image/tau_ceti.png', layer: 3 },
            { name: 'Gorgon', size: 2, x: -40, y: 60, z: -20, texture: 'image/tau_ceti.png', layer: 3 },
            { name: 'Forlorn', size: 2, x: -20, y: 60, z: 0, texture: 'image/tau_ceti.png', layer: 3 },
            // layer 4
            { name: 'Macroposopus', size: 2, x: -40, y: 80, z: 0, texture: 'image/tau_ceti.png', layer: 4 },
            { name: 'Voltemand', size: 2, x: -40, y: 80, z: -20, texture: 'image/tau_ceti.png', layer: 4 },
            { name: 'Camel', size: 2, x: -40, y: 80, z: -40, texture: 'image/tau_ceti.png', layer: 4 },
            { name: 'Shylock', size: 2, x: -20, y: 80, z: -20, texture: 'image/tau_ceti.png', layer: 4 },
            { name: 'Paxton', size: 2, x: 0, y: 80, z: -20, texture: 'image/epsilon_coal.png', layer: 4 },
            { name: 'Stark', size: 2, x: 20, y: 80, z: -20, texture: 'image/epsilon_coal.png', layer: 4 },
            { name: 'Terill', size: 2, x: 20, y: 80, z: -40, texture: 'image/epsilon_coal.png', layer: 4 },
            { name: 'Willcox', size: 2, x: 0, y: 80, z: -40, texture: 'image/epsilon_coal.png', layer: 4 },
            { name: 'Enobarus', size: 2, x: 0, y: 80, z: 20, texture: 'image/alpha_centauri.png', layer: 4 },
            { name: 'Szalik', size: 2, x: 20, y: 80, z: 40, texture: 'image/alpha_centauri.png', layer: 4 },
            { name: 'Pajmon', size: 2, x: 20, y: 80, z: 20, texture: 'image/alpha_centauri.png', layer: 4 },
            // layer 5
            { name: 'Lailah', size: 2, x: -40, y: 100, z: -40, texture: 'image/tau_ceti.png', layer: 5 },
            { name: 'Saleos', size: 2, x: -40, y: 100, z: -20, texture: 'image/tau_ceti.png', layer: 5 },
            { name: 'Rind', size: 2, x: -20, y: 100, z: -20, texture: 'image/neutral.png', layer: 5 },
            { name: 'Fester', size: 2, x: -20, y: 100, z: 0, texture: 'image/neutral.png', layer: 5 },
            { name: 'Hoxxes', size: 2, x: -20, y: 100, z: 20, texture: 'image/neutral.png', layer: 5 },
            { name: 'Destitution', size: 2, x: 0, y: 100, z: 0, texture: 'image/neutral.png', layer: 5 },
            { name: 'York', size: 2, x: 20, y: 100, z: -20, texture: 'image/alpha_centauri.png', layer: 5 },
            { name: 'Martyr\'s End', size: 2, x: 20, y: 100, z: 0, texture: 'image/alpha_centauri.png', layer: 5 },
            { name: 'Legatus', size: 2, x: 20, y: 100, z: 20, texture: 'image/alpha_centauri.png', layer: 5 },
            { name: 'Fantom', size: 2, x: 20, y: 100, z: 40, texture: 'image/alpha_centauri.png', layer: 5 },
            // layer 6
            { name: 'Visage', size: 2, x: -40, y: 120, z: -20, texture: 'image/tau_ceti.png', layer: 6 },
            { name: 'Big Bertha', size: 2, x: -20, y: 120, z: 0, texture: 'image/neutral.png', layer: 6 },
            { name: 'Little Bertha', size: 2, x: 0, y: 120, z: 0, texture: 'image/neutral.png', layer: 6 },
            { name: 'Benthica', size: 2, x: -20, y: 120, z: 20, texture: 'image/neutral.png', layer: 6 },
            { name: 'Ljubi', size: 2, x: -40, y: 120, z: 20, texture: 'image/neutral.png', layer: 6 },
            { name: 'Maybelline\'s Cove', size: 2, x: -20, y: 120, z: -20, texture: 'image/neutral.png', layer: 6 },
            { name: 'Zero', size: 2, x: 20, y: 120, z: 0, texture: 'image/alpha_centauri.png', layer: 6 },
            { name: 'Andronicus', size: 2, x: 20, y: 120, z: 20, texture: 'image/alpha_centauri.png', layer: 6 },
            // layer 7
            { name: 'Jikinki', size: 2, x: -40, y: 140, z: 20, texture: 'image/neutral.png', layer: 7 },
            { name: 'Ziyou', size: 2, x: -40, y: 140, z: 40, texture: 'image/neutral.png', layer: 7 },
            { name: 'Constitution', size: 2, x: -20, y: 140, z: 40, texture: 'image/neutral.png', layer: 7 },
            { name: 'Soothsayer', size: 2, x: -20, y: 140, z: 20, texture: 'image/neutral.png', layer: 7 },
            { name: 'Freedom', size: 2, x: 0, y: 140, z: 20, texture: 'image/neutral.png', layer: 7 },
            { name: 'UNKNOWN1', size: 2, x: 20, y: 140, z: 20, texture: 'image/neutral.png', layer: 7 },
            { name: 'Flaruos', size: 2, x: -20, y: 140, z: -20, texture: 'image/neutral.png', layer: 7 },
            { name: 'Mara\'s Holler', size: 2, x: 20, y: 140, z: -40, texture: 'image/neutral.png', layer: 7 },
            // layer 8
            { name: 'Echoes of Mara', size: 2, x: 20, y: 160, z: -40, texture: 'image/neutral.png', layer: 8 },
            { name: 'Strato\'s Rest', size: 2, x: 20, y: 160, z: -20, texture: 'image/neutral.png', layer: 8 },
            { name: 'Freeport', size: 2, x: -20, y: 160, z: -20, texture: 'image/neutral.png', layer: 8 },
            { name: 'Calpurnia', size: 2, x: 0, y: 160, z: -20, texture: 'image/neutral.png', layer: 8 },
            { name: 'Tribunal', size: 2, x: -40, y: 160, z: 20, texture: 'image/neutral.png', layer: 8 },
            { name: 'Heimdall', size: 2, x: -40, y: 160, z: -20, texture: 'image/neutral.png', layer: 8 },
            { name: 'Inshallah', size: 2, x: -20, y: 160, z: 40, texture: 'image/neutral.png', layer: 8 },
            { name: 'Jotunn', size: 2, x: -20, y: 160, z: 20, texture: 'image/neutral.png', layer: 8 },
            { name: 'Omphalos', size: 2, x: 0, y: 160, z: 20, texture: 'image/neutral.png', layer: 8 },
            { name: 'UNKNOWN2', size: 2, x: 0, y: 160, z: 40, texture: 'image/neutral.png', layer: 8 },
            { name: 'UNKNOWN3', size: 2, x: 20, y: 160, z: 20, texture: 'image/neutral.png', layer: 8 },
            // layer 9
            { name: 'Beadle', size: 2, x: -20, y: 180, z: 20, texture: 'image/neutral.png', layer: 9 },
            { name: 'UNKNOWN4', size: 2, x: -20, y: 180, z: 40, texture: 'image/neutral.png', layer: 9 },
            { name: 'UNKNOWN5', size: 2, x: -40, y: 180, z: 20, texture: 'image/neutral.png', layer: 9 },
            { name: 'Ra', size: 2, x: 0, y: 180, z: -20, texture: 'image/neutral.png', layer: 9 },
            { name: 'UNKNOWN6', size: 2, x: 0, y: 180, z: 0, texture: 'image/neutral.png', layer: 9 },
            { name: 'Hannibal', size: 2, x: 20, y: 180, z: -20, texture: 'image/neutral.png', layer: 9 },
            { name: 'UNKNOWN7', size: 2, x: 20, y: 180, z: -40, texture: 'image/neutral.png', layer: 9 },
            { name: 'Margarelon\'s Heaven', size: 2, x: -40, y: 180, z: -20, texture: 'image/neutral.png', layer: 9 },
            { name: 'UNKNOWN8', size: 2, x: -40, y: 180, z: 0, texture: 'image/neutral.png', layer: 9 },
            { name: 'UNKNOWN9', size: 2, x: -20, y: 180, z: -20, texture: 'image/neutral.png', layer: 9 },
          ],
          connections: [
            // layer 0 to 1
            { from: 'Earth', to: 'Alpha Centauri' },
            // layer 1
            { from: 'Alpha Centauri', to: 'Dionyza\'s Tear' },
            { from: 'Alpha Centauri', to: 'Cassio' },
            { from: 'Cassio', to: 'Belarius' },
            { from: 'Cassio', to: 'Odin Major' },
            { from: 'Odin Major', to: 'Odin Minor' },
            { from: 'Dionyza\'s Tear', to: 'Marus' },
            { from: 'Marus', to: 'Valeria' },
            // layer 1 to 2
            { from: 'Odin Major', to: 'Thor' },
            { from: 'Odin Minor', to: 'Thor' },
            { from: 'Alpha Centauri', to: 'Scylla' },
            { from: 'Dionyza\'s Tear', to: 'Grumio' },
            { from: 'Valeria', to: 'Macedon' },
            // layer 2
            { from: 'Thor', to: 'Cardamom' },
            { from: 'Cardamom', to: 'Lilith' },
            { from: 'Lilith', to: 'Vor Alpha' },
            { from: 'Vor Alpha', to: 'Scylla' },
            { from: 'Grumio', to: 'Alastor' },
            { from: 'Alastor', to: 'Macedon' },
            { from: 'Alastor', to: 'Cymbeline' },
            { from: 'Cymbeline', to: 'Ulysses' },
            // layer 2 to 3
            { from: 'Grumio', to: 'Archimedes' },
            { from: 'Cymbeline', to: 'Anderson' },
            { from: 'Ulysses', to: 'Kirby' },
            { from: 'Lilith', to: 'Tau Ceti' },
            { from: 'Thor', to: 'Hinn' },
            { from: 'Vor Alpha', to: 'Vor Beta' },
            // layer 3
            { from: 'Kirby', to: 'Anderson' },
            { from: 'Hinn', to: 'Forlorn' },
            { from: 'Forlorn', to: 'Tau Ceti' },
            { from: 'Archimedes', to: 'Zisa' },
            { from: 'Archimedes', to: 'Zephon' },
            { from: 'Zephon', to: 'Anderson' },
            { from: 'Zisa', to: 'Szarik' },
            { from: 'Kirby', to: 'Blanchard' },
            // layer 3 to 4
            { from: 'Hinn', to: 'Macroposopus' },
            { from: 'Tau Ceti', to: 'Shylock' },
            { from: 'Vor Beta', to: 'Paxton' },
            { from: 'Kirby', to: 'Stark' },
            { from: 'Blanchard', to: 'Terill' },
            { from: 'Archimedes', to: 'Enobarus' },
            { from: 'Szarik', to: 'Szalik' },
            // layer 4
            { from: 'Macroposopus', to: 'Voltemand' },
            { from: 'Camel', to: 'Voltemand' },
            { from: 'Shylock', to: 'Voltemand' },
            { from: 'Paxton', to: 'Willcox' },
            { from: 'Paxton', to: 'Stark' },
            { from: 'Terill', to: 'Willcox' },
            { from: 'Terill', to: 'Stark' },
            { from: 'Pajmon', to: 'Enobarus' },
            { from: 'Pajmon', to: 'Szalik' },
            // layer 4 to 5
            { from: 'Camel', to: 'Lailah' },
            { from: 'Voltemand', to: 'Saleos' },
            { from: 'Shylock', to: 'Rind' },
            { from: 'Stark', to: 'York' },
            { from: 'Pajmon', to: 'Legatus' },
            { from: 'Szalik', to: 'Fantom' },
            // layer 5
            { from: 'Saleos', to: 'Rind' },
            { from: 'Rind', to: 'Fester' },
            { from: 'Fester', to: 'Hoxxes' },
            { from: 'Fester', to: 'Destitution' },
            { from: 'Destitution', to: 'Martyr\'s End' },
            { from: 'Legatus', to: 'Martyr\'s End' },
            { from: 'York', to: 'Martyr\'s End' },
            // layer 5 to 6
            { from: 'Saleos', to: 'Visage' },
            { from: 'Rind', to: 'Maybelline\'s Cove' },
            { from: 'Fester', to: 'Big Bertha' },
            { from: 'Destitution', to: 'Little Bertha' },
            { from: 'Martyr\'s End', to: 'Zero' },
            { from: 'Legatus', to: 'Andronicus' },
            // layer 6
            { from: 'Visage', to: 'Maybelline\'s Cove' },
            { from: 'Maybelline\'s Cove' , to: 'Big Bertha' },
            { from: 'Big Bertha', to: 'Benthica' },
            { from: 'Benthica', to: 'Ljubi' },
            { from: 'Big Bertha', to: 'Little Bertha' },
            { from: 'Little Bertha', to: 'Zero' },
            // layer 6 to 7
            { from: 'Maybelline\'s Cove' , to: 'Flaruos' },
            { from: 'Benthica', to: 'Soothsayer' },
            { from: 'Ljubi', to: 'Jikinki' },
            // layer 7
            { from: 'Jikinki', to: 'Ziyou' },
            { from: 'Ziyou', to: 'Constitution' },
            { from: 'Flaruos', to: 'Soothsayer' },
            { from: 'Soothsayer', to: 'Freedom' },
            { from: 'Freedom', to: 'UNKNOWN1' },
            // layer 7 to 8
            { from: 'Jikinki', to: 'Tribunal' },
            { from: 'Constitution', to: 'Inshallah' },
            { from: 'Flaruos', to: 'Freeport' },
            { from: 'Mara\'s Holler', to: 'Echoes of Mara' },
            { from: 'Freedom', to: 'Omphalos' },
            // layer 8
            { from: 'Heimdall', to: 'Tribunal' },
            { from: 'Tribunal', to: 'Jotunn' },
            { from: 'Jotunn', to: 'Inshallah' },
            { from: 'Jotunn', to: 'Omphalos' },
            { from: 'Omphalos', to: 'UNKNOWN2' },
            { from: 'Omphalos', to: 'UNKNOWN3' },
            { from: 'Omphalos', to: 'Calpurnia' },
            { from: 'Heimdall', to: 'Freeport' },
            { from: 'Freeport', to: 'Calpurnia' },
            { from: 'Calpurnia', to: 'Strato\'s Rest' },
            { from: 'Strato\'s Rest', to: 'Echoes of Mara' },
            // layer 8 to 9
            { from: 'Heimdall', to: 'Margarelon\'s Heaven' },
            { from: 'Strato\'s Rest', to: 'Hannibal' },
            { from: 'Calpurnia', to: 'Ra' },
            { from: 'Jotunn', to: 'Beadle' },
            // layer 9
            { from: 'Hannbial', to: 'Ra'},
            { from: 'Beadle', to: 'UNKNOWN4' },
            { from: 'Beadle', to: 'UNKNOWN5' },
            { from: 'Ra', to: 'UNKNOWN6' },
            { from: 'Hannibal', to: 'UNKNOWN7' },
            { from: 'Margarelon\'s Heaven', to: 'UNKNOWN8' },
            { from: 'Margarelon\'s Heaven', to: 'UNKNOWN9' },
        
          ],
        };

        const createPlanet = (name, size, x, y, z, texture) => {
          const planet = new Planet(size, x, y, z, texture);
          const planetMesh = planet.getMesh();
          planetMesh.name = name;
          return planetMesh;
      };

      const createLabel = (text, parent) => {
          const loader = new FontLoader();
          loader.load('font.json', function (font) {
              const textGeometry = new TextGeometry(text, {
                  font: font,
                  size: 20,
              });
              const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
              const mesh = new THREE.Mesh(textGeometry, textMaterial);
              mesh.position.set(0, 3, 0);
              mesh.scale.set(0.05, 0.05, 0.05);
              mesh.name = `${text}_label`;
              parent.add(mesh);
              textLabels.push(mesh);
          });
      };

      const createPlanetsFromConfig = (config) => {
          const layers = {};

          config.planets.forEach(({ name, size, x, y, z, texture, layer }) => {
              if (!layers[layer]) layers[layer] = new THREE.Group();
              const planetMesh = createPlanet(name, size, x, y, z, texture);
              layers[layer].add(planetMesh);
              createLabel(name, planetMesh);
          });

          return layers;
      };

      const findPlanetMeshByName = (layers, name) => {
          for (const layer of Object.values(layers)) {
              const mesh = layer.getObjectByName(name);
              if (mesh) return mesh;
          }
          return null;
      };

      const createConnectionsFromConfig = (config, layers) => {
          config.connections.forEach(({ from, to }) => {
              const fromMesh = findPlanetMeshByName(layers, from);
              const toMesh = findPlanetMeshByName(layers, to);

              if (fromMesh && toMesh) {
                  const points = [
                      new THREE.Vector3(fromMesh.position.x, fromMesh.position.y, fromMesh.position.z),
                      new THREE.Vector3(toMesh.position.x, toMesh.position.y, toMesh.position.z),
                  ];
                  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                  const line = new THREE.Line(lineGeometry, material);
                  fromMesh.parent.add(line);
              }
          });
      };

      const layers = createPlanetsFromConfig(config);
      createConnectionsFromConfig(config, layers);

      for (const layer of Object.values(layers)) {
          polyMap.add(layer);
      }

      const animate = () => {
          requestAnimationFrame(animate);
          textLabels.forEach((label) => {
              label.lookAt(test.camera.position);
          });
          test.renderer.render(test.scene, test.camera);
      };
      animate();
  };
  initScene();
});
