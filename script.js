
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Menu para celular
const menuToggle = $("#menuToggle");
const navMenu = $("#navMenu");

menuToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "✕" : "☰";
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Ano automático
$("#year").textContent = new Date().getFullYear();

// Animações ao aparecer na tela
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$(".reveal").forEach((element) => revealObserver.observe(element));

// Playground: alterar a cor principal
$$(".color-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.documentElement.style.setProperty(
      "--accent",
      button.dataset.color
    );
  });
});

// Modo festa
$("#partyMode").addEventListener("click", () => {
  document.body.classList.toggle("party-mode");
});

// Contador interativo
let clicks = 0;

$("#clickCounter").addEventListener("click", () => {
  clicks++;
  $("#clickCount").textContent = clicks;
});

// Movimento do planeta principal
const planet = $(".planet");

window.addEventListener("pointermove", (event) => {
  if (window.innerWidth < 700) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 14;
  const y = (event.clientY / window.innerHeight - 0.5) * 14;

  planet.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
});

// Three.js: objeto tridimensional interativo
const canvasContainer = $("#threeCanvas");
let scene, camera, renderer, mesh, geometryIndex = 0;
let animationFrame = 0;

if (window.THREE && canvasContainer) {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    canvasContainer.clientWidth / canvasContainer.clientHeight,
    0.1,
    100
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(
    canvasContainer.clientWidth,
    canvasContainer.clientHeight
  );

  canvasContainer.appendChild(renderer.domElement);

  const material = new THREE.MeshStandardMaterial({
    color: 0xb5ff4a,
    metalness: 0.65,
    roughness: 0.22,
    wireframe: false
  });

  const geometries = [
    () => new THREE.IcosahedronGeometry(1.15, 1),
    () => new THREE.TorusKnotGeometry(0.8, 0.27, 120, 16),
    () => new THREE.OctahedronGeometry(1.3, 0),
    () => new THREE.TorusGeometry(0.9, 0.3, 20, 80)
  ];

  mesh = new THREE.Mesh(geometries[0](), material);
  scene.add(mesh);

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });

  const wireMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.3, 1),
    wireMaterial
  );

  scene.add(wireMesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambientLight);

  const light = new THREE.PointLight(0xb5ff4a, 35);
  light.position.set(3, 3, 4);
  scene.add(light);

  const purpleLight = new THREE.PointLight(0xa855f7, 25);
  purpleLight.position.set(-3, -2, 2);
  scene.add(purpleLight);

  const starsGeometry = new THREE.BufferGeometry();
  const starPositions = [];

  for (let i = 0; i < 500; i++) {
    starPositions.push(
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8
    );
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3)
  );

  const stars = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.7
    })
  );

  scene.add(stars);

  let mouseX = 0;
  let mouseY = 0;

  canvasContainer.addEventListener("pointermove", (event) => {
    const rect = canvasContainer.getBoundingClientRect();

    mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 1.2;
    mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 1.2;
  });

  function animate() {
    animationFrame = requestAnimationFrame(animate);

    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.006;

    wireMesh.rotation.x -= 0.002;
    wireMesh.rotation.y -= 0.003;

    stars.rotation.y += 0.0004;

    mesh.rotation.x += (mouseY * 0.25) * 0.015;
    mesh.rotation.y += (mouseX * 0.25) * 0.015;

    renderer.render(scene, camera);
  }

  animate();

  function resizeScene() {
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener("resize", resizeScene);

  // Troca entre diferentes geometrias
  $("#changeObject").addEventListener("click", () => {
    geometryIndex = (geometryIndex + 1) % geometries.length;

    mesh.geometry.dispose();
    mesh.geometry = geometries[geometryIndex]();

    mesh.rotation.set(0, 0, 0);
  });
} else {
  canvasContainer.innerHTML =
    '<p style="padding:30px;color:#fff">O Three.js não carregou. Verifique sua conexão com a internet.</p>';
}
