
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101b32);

// Camera
const camera = new THREE.PerspectiveCamera(
    45, 1, 0.1, 100
);
camera.position.set(3, 2, 4);

// Renderer
const container = document.getElementById('sphere');

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Rotation controls
const controls = new OrbitControls(
    camera, renderer.domElement
);
controls.enableDamping = true;

// Sphere
const geometry = new THREE.SphereGeometry(1, 32, 32);

const material = new THREE.MeshBasicMaterial({
    color: 0x38aaff,
    transparent: true,
    opacity: 0.12,
    wireframe: true
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Coordinate axes
const axes = new THREE.AxesHelper(1.5);
scene.add(axes);

// Equator
const circleGeometry = new THREE.BufferGeometry();
const points = [];

for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    points.push(new THREE.Vector3(
        Math.cos(angle), 0, Math.sin(angle)
    ));
}

circleGeometry.setFromPoints(points);

const equator = new THREE.Line(
    circleGeometry,
    new THREE.LineBasicMaterial({ color: 0xffffff })
);

scene.add(equator);

// State vector
const arrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 0),
    1,
    0xffcc33,
    0.15,
    0.09
);

scene.add(arrow);

// Input elements
const thetaInput = document.getElementById('theta');
const phiInput = document.getElementById('phi');

// Update quantum state
function updateSphere() {

    const theta = Number(thetaInput.value);
    const phi = Number(phiInput.value);

    const t = THREE.MathUtils.degToRad(theta);
    const p = THREE.MathUtils.degToRad(phi);

    // Bloch sphere coordinates
    const x = Math.sin(t) * Math.cos(p);
    const y = Math.cos(t);
    const z = Math.sin(t) * Math.sin(p);

    // Update vector
    const direction = new THREE.Vector3(x, y, z).normalize();

    arrow.setDirection(direction);

    // Display angles
    document.getElementById('thetaValue').textContent =
        theta + '°';

    document.getElementById('phiValue').textContent =
        phi + '°';

    // Quantum state amplitudes
    const a = Math.cos(t / 2);
    const b = Math.sin(t / 2);

    document.getElementById('state').textContent =
        `|ψ⟩ = ${a.toFixed(3)}|0⟩ + e^(i${phi}°) ${b.toFixed(3)}|1⟩`;

    // Measurement probabilities
    document.getElementById('prob0').textContent =
        `P(|0⟩) = ${(a * a * 100).toFixed(2)}%`;

    document.getElementById('prob1').textContent =
        `P(|1⟩) = ${(b * b * 100).toFixed(2)}%`;
}

// Slider events
thetaInput.addEventListener('input', updateSphere);
phiInput.addEventListener('input', updateSphere);

// Reset button
document.getElementById('reset').addEventListener('click', () => {
    thetaInput.value = 90;
    phiInput.value = 0;
    updateSphere();
});

// Responsive renderer
function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

window.addEventListener('resize', resize);

// Animation
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

resize();
updateSphere();
animate();
