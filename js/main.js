import * as THREE from 'https://unpkg.com/three@0.156.1/build/three.module.js';


console.log('Three.js cargado correctamente 🎉');



// 🚀 Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
scene.fog = new THREE.Fog(0x111111, 5, 15);

// 🔦 Luz principal
const spotLight = new THREE.SpotLight(0xffffff, 3);
spotLight.position.set(0, 8, 0);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.4;
spotLight.decay = 2;
spotLight.distance = 20;
spotLight.castShadow = true;
scene.add(spotLight);

// 🔦 Rayo de luz visible (versión mejorada)
const coneGeometry = new THREE.CylinderGeometry(0.1, 2.5, 8, 64, 1, true); // más alto y ancho
const coneMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.05,
  side: THREE.DoubleSide,
  depthWrite: false
});
const lightCone = new THREE.Mesh(coneGeometry, coneMaterial);
lightCone.position.y = 4; // altura centrada con el spotlight
scene.add(lightCone);


// Cámara
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2.5, 6);
camera.lookAt(0, 1.2, 0);

// Render
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.style.margin = '0';
document.body.appendChild(renderer.domElement);



//fondo
const wallBack = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 5),
  new THREE.MeshStandardMaterial({ color: 0xffffff }) // blanco suave tipo galería
);
wallBack.position.set(0, 2.5, -5);
scene.add(wallBack);



// Luz ambiental
scene.add(new THREE.AmbientLight(0xffffff, 0.2));

// Urna de cristal
const glassGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.1,
  transmission: 1,
  thickness: 1,
  clearcoat: 1,
  reflectivity: 0.1,
  transparent: true,
  opacity: 0.35, // BAJA esto para que deje ver dentro
  depthWrite: false, // ESTO es CLAVE
  ior: 1.5,
  metalness: 0
});



const cubeTexture = new THREE.CubeTextureLoader()
  .setPath('https://threejs.org/examples/textures/cube/Bridge2/')
  .load([
    'posx.jpg', 'negx.jpg',
    'posy.jpg', 'negy.jpg',
    'posz.jpg', 'negz.jpg'
  ]);
scene.environment = cubeTexture;



const glassBox = new THREE.Mesh(glassGeometry, glassMaterial);
glassBox.position.y = 1.7;
scene.add(glassBox);


// 🖼️ Bordes visibles del cubo de cristal
const glassEdges = new THREE.EdgesGeometry(glassGeometry);
const glassLine = new THREE.LineSegments(glassEdges, new THREE.LineBasicMaterial({ color: 0xaaaaaa }));
glassBox.add(glassLine);


function crearPlacaConTexto(texto, posicion) {
  // Crear canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Fondo negro
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Texto blanco
  ctx.fillStyle = '#ffffff';
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(texto, canvas.width / 2, canvas.height / 2 + 10);

  // Crear textura
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const geometry = new THREE.PlaneGeometry(1.2, 0.25);
  const placa = new THREE.Mesh(geometry, material);

 placa.position.set(0, 1.205, 1.751);

  scene.add(placa);
}

// 💎 Geometría de diamante clásico (cono + pirámide)
const diamondGroup = new THREE.Group();
const diamondMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,
  ior: 2.417,
  thickness: 0.4,
  reflectivity: 1,
  clearcoat: 1,
  clearcoatRoughness: 0,
  side: THREE.FrontSide, // importante
  envMapIntensity: 2, // ¡para que brille más!
});
diamondMaterial.envMapIntensity = 2.5;



// Parte superior: cono invertido
const topGeometry = new THREE.ConeGeometry(0.2, 0.2, 8);
topGeometry.rotateX(Math.PI);
const topMesh = new THREE.Mesh(topGeometry, diamondMaterial);  // <-- cambia "top" por "topMesh"
topMesh.castShadow = true;
topMesh.position.y = 0.1;
diamondGroup.add(topMesh);


// Parte inferior: pirámide
const bottomGeometry = new THREE.ConeGeometry(0.2, 0.25, 8);
const bottom = new THREE.Mesh(bottomGeometry, diamondMaterial);
bottom.castShadow = true;

bottom.position.y = 0.34; // Lo mismo, pero abajo

diamondGroup.add(bottom);


// Posición del diamante
diamondGroup.position.y = 1.55;
diamondGroup.rotation.y = Math.PI / 4;
diamondGroup.castShadow = true;
scene.add(diamondGroup);

// Luz extra para que se note el brillo
const extraLight = new THREE.PointLight(0xffffff, 3, 10);
extraLight.position.set(1, 3, 2);
extraLight.castShadow = true;
scene.add(extraLight);

let t = 0;
function animate() {
  t += 0.01;
  diamondGroup.rotation.y += 0.01;
  diamondGroup.position.y = 1.55 + Math.sin(t) * 0.02; // Flotación sutil
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;






// Pedestal blanco tipo museo
const pedestalGeo = new THREE.BoxGeometry(1.5, 1.2, 1.5);
const pedestalMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
pedestal.position.y = 0.6;
pedestal.receiveShadow = true;
scene.add(pedestal);
crearPlacaConTexto("Diamante Místico – 2025", new THREE.Vector3(0, 1.21, 0.76));



// Piso tipo madera (solo textura, sin reflejo aún)
const loader = new THREE.TextureLoader();
const woodTexture = loader.load('https://threejs.org/examples/textures/floors/FloorsCheckerboard_S_Diffuse.jpg');
woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set(4, 4);

const floorGeo = new THREE.PlaneGeometry(10, 10);
const floorMat = new THREE.MeshStandardMaterial({
  map: woodTexture,
  roughness: 0.8,
  metalness: 0.1
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

// Material blanco para paredes
const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff });



// Izquierda
const wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMat.clone());
wallLeft.rotation.y = Math.PI / 2;
wallLeft.position.set(-5, 2.5, 0);
scene.add(wallLeft);

// Derecha
const wallRight = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMat.clone());
wallRight.rotation.y = -Math.PI / 2;
wallRight.position.set(5, 2.5, 0);
scene.add(wallRight);

// Techo
const roof = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), wallMat.clone());
roof.rotation.x = Math.PI / 2;
roof.position.set(0, 5, 0);
scene.add(roof);


const frameGeo = new THREE.PlaneGeometry(2, 2);


// Izquierda
const tex2 = loader.load('https://picsum.photos/401/401?grayscale');
function crearCuadroConMarco(textura, posicion, rotacionY = 0) {
  // 🎨 Imagen
  const imagen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.6),
    new THREE.MeshBasicMaterial({ map: textura })
  );
  imagen.position.z = 0.01;

  // 🖼️ Fondo blanco detrás
  const fondo = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 1.8),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );

  // 🪟 Marco negro (más grande que el fondo)
  const marco = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  );

  // 🧩 Grupo de cuadro completo
  const cuadro = new THREE.Group();
  cuadro.add(marco);
  cuadro.add(fondo);
  cuadro.add(imagen);

  cuadro.position.set(posicion.x, posicion.y, posicion.z);
  cuadro.rotation.y = rotacionY;

  scene.add(cuadro);
}


// Derecha
const tex3 = loader.load('https://picsum.photos/402/402?grayscale');
crearCuadroConMarco(tex2, new THREE.Vector3(-4.99, 2.5, 0), Math.PI / 2);  // Pared izquierda
crearCuadroConMarco(tex3, new THREE.Vector3(4.99, 2.5, 0), -Math.PI / 2); // Pared derecha


