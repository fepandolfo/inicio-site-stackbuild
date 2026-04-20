import * as THREE from 'three';

// ===========================
// MOBILE MENU TOGGLE
// ===========================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Close menu when link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.style.display = 'none';
    });
});

// ===========================
// 3D LOGO INTERACTION
// ===========================

const logo3DCanvas = document.querySelector('#logo-3d-canvas');
const logoResetButton = document.querySelector('#logo-reset');

if (logo3DCanvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        48,
        logo3DCanvas.clientWidth / logo3DCanvas.clientHeight,
        0.1,
        120
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(logo3DCanvas.clientWidth, logo3DCanvas.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    logo3DCanvas.appendChild(renderer.domElement);

    const hint = document.createElement('div');
    hint.className = 'logo-3d-hint';
    hint.textContent = 'Arraste para girar | Clique em um bloco para rotacao individual';
    logo3DCanvas.appendChild(hint);

    camera.position.set(0, 0.7, 8.2);

    const ambientLight = new THREE.AmbientLight(0x88d8ff, 0.55);
    const keyLight = new THREE.DirectionalLight(0x87d7ff, 1.15);
    const fillLight = new THREE.PointLight(0x2da6ff, 0.75, 45);
    const rimLight = new THREE.PointLight(0x68ceff, 0.65, 42);
    keyLight.position.set(4.5, 7, 6);
    fillLight.position.set(-6, 1.5, 2);
    rimLight.position.set(2, 2.5, -7);
    scene.add(ambientLight, keyLight, fillLight, rimLight);

    const logoRoot = new THREE.Group();
    scene.add(logoRoot);

    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const blocks = [];
    const particleMeta = [];
    let particles = null;
    let selectedBlock = null;
    let isPointerDown = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let baseAutoRotation = 0;

    const blockGeo = new THREE.BoxGeometry(1, 1, 1);

    const buildParticles = () => {
        const count = 900;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i += 1) {
            const i3 = i * 3;
            const radius = 4.4 + Math.random() * 3.2;
            const angle = Math.random() * Math.PI * 2;
            const vertical = -2.6 + Math.random() * 5.2;

            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = vertical;
            positions[i3 + 2] = Math.sin(angle) * radius;

            particleMeta.push({
                x: positions[i3],
                y: vertical,
                z: positions[i3 + 2],
                amp: 0.06 + Math.random() * 0.23,
                speed: 0.45 + Math.random() * 1.15,
                phase: Math.random() * Math.PI * 2,
            });
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x63d3ff,
            size: 0.07,
            transparent: true,
            opacity: 0.58,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        particles = new THREE.Points(geometry, material);
        particlesGroup.add(particles);
    };

    const materialFromColor = (baseColor, depthFactor) => {
        const tint = baseColor.clone();
        tint.offsetHSL(0, 0.08, 0.12 + (depthFactor * 0.06));
        return new THREE.MeshPhysicalMaterial({
            color: tint,
            metalness: 0.88,
            roughness: 0.18,
            clearcoat: 0.95,
            clearcoatRoughness: 0.08,
            emissive: tint.clone().multiplyScalar(0.16),
            emissiveIntensity: 0.34,
            envMapIntensity: 1.2,
        });
    };

    const loadImage = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

    const buildBlocksFromImage = async () => {
        const logoImageUrl = new URL('../logo sem fundo.png', import.meta.url).href;
        const image = await loadImage(logoImageUrl);

        const sampleCanvas = document.createElement('canvas');
        const maxWidth = 300;
        const scale = maxWidth / image.width;
        sampleCanvas.width = maxWidth;
        sampleCanvas.height = Math.max(20, Math.round(image.height * scale));

        const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
        sampleCtx.clearRect(0, 0, sampleCanvas.width, sampleCanvas.height);
        sampleCtx.drawImage(image, 0, 0, sampleCanvas.width, sampleCanvas.height);

        const data = sampleCtx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;

        const cols = 42;
        const rows = Math.max(10, Math.round((sampleCanvas.height / sampleCanvas.width) * cols));
        const cellW = sampleCanvas.width / cols;
        const cellH = sampleCanvas.height / rows;
        const occupied = Array.from({ length: rows }, () => Array(cols).fill(false));
        const brightnessGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
        const colorGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ r: 0, g: 0, b: 0 })));

        for (let gy = 0; gy < rows; gy += 1) {
            for (let gx = 0; gx < cols; gx += 1) {
                let alphaSum = 0;
                let brightSum = 0;
                let redSum = 0;
                let greenSum = 0;
                let blueSum = 0;
                let samples = 0;
                const x0 = Math.floor(gx * cellW);
                const y0 = Math.floor(gy * cellH);
                const x1 = Math.min(sampleCanvas.width, Math.floor((gx + 1) * cellW));
                const y1 = Math.min(sampleCanvas.height, Math.floor((gy + 1) * cellH));

                for (let y = y0; y < y1; y += 2) {
                    for (let x = x0; x < x1; x += 2) {
                        const i = (y * sampleCanvas.width + x) * 4;
                        alphaSum += data[i + 3];
                        brightSum += (data[i] + data[i + 1] + data[i + 2]) / 765;
                        redSum += data[i];
                        greenSum += data[i + 1];
                        blueSum += data[i + 2];
                        samples += 1;
                    }
                }

                const alphaAvg = samples > 0 ? alphaSum / (samples * 255) : 0;
                if (alphaAvg > 0.22) {
                    occupied[gy][gx] = true;
                    brightnessGrid[gy][gx] = samples > 0 ? brightSum / samples : 0.6;
                    colorGrid[gy][gx] = {
                        r: samples > 0 ? (redSum / samples) / 255 : 0.45,
                        g: samples > 0 ? (greenSum / samples) / 255 : 0.7,
                        b: samples > 0 ? (blueSum / samples) / 255 : 0.92,
                    };
                }
            }
        }

        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        const mergedRects = [];

        for (let y = 0; y < rows; y += 1) {
            for (let x = 0; x < cols; x += 1) {
                if (!occupied[y][x] || visited[y][x]) {
                    continue;
                }

                let width = 0;
                while (
                    (x + width) < cols &&
                    width < 4 &&
                    occupied[y][x + width] &&
                    !visited[y][x + width]
                ) {
                    width += 1;
                }

                let height = 1;
                let canGrow = true;
                while ((y + height) < rows && height < 4 && canGrow) {
                    for (let k = 0; k < width; k += 1) {
                        if (!occupied[y + height][x + k] || visited[y + height][x + k]) {
                            canGrow = false;
                            break;
                        }
                    }
                    if (canGrow) {
                        height += 1;
                    }
                }

                for (let yy = y; yy < (y + height); yy += 1) {
                    for (let xx = x; xx < (x + width); xx += 1) {
                        visited[yy][xx] = true;
                    }
                }

                mergedRects.push({ x, y, width, height });
            }
        }

        const unit = 0.19;
        const centerGridX = cols / 2;
        const centerGridY = rows / 2;

        mergedRects.forEach((rect, index) => {
            const centerX = rect.x + (rect.width / 2);
            const centerY = rect.y + (rect.height / 2);
            const probeX = Math.min(cols - 1, Math.max(0, Math.floor(centerX)));
            const probeY = Math.min(rows - 1, Math.max(0, Math.floor(centerY)));
            const bright = brightnessGrid[probeY][probeX] || 0.62;
            const depth = 0.36 + (bright * 0.34);

            let rr = 0;
            let gg = 0;
            let bb = 0;
            let cc = 0;
            for (let y = rect.y; y < (rect.y + rect.height); y += 1) {
                for (let x = rect.x; x < (rect.x + rect.width); x += 1) {
                    const sample = colorGrid[y][x];
                    if (!sample) continue;
                    rr += sample.r;
                    gg += sample.g;
                    bb += sample.b;
                    cc += 1;
                }
            }
            const avgColor = new THREE.Color(
                cc > 0 ? rr / cc : 0.42,
                cc > 0 ? gg / cc : 0.72,
                cc > 0 ? bb / cc : 0.94
            );

            const geometry = new THREE.BoxGeometry(
                Math.max(unit * 0.9, rect.width * unit),
                Math.max(unit * 0.9, rect.height * unit),
                depth
            );

            const block = new THREE.Mesh(geometry, materialFromColor(avgColor, bright));
            block.position.set(
                (centerX - centerGridX) * unit,
                (centerGridY - centerY) * unit,
                depth * 0.38
            );
            block.rotation.set(0.14, -0.34, 0.04);
            block.userData = {
                baseRotation: new THREE.Euler(0.14, -0.34, 0.04),
                baseEmissiveIntensity: 0.18,
                bobOffset: (index * 0.37) % (Math.PI * 2),
            };
            logoRoot.add(block);
            blocks.push(block);
        });

        logoRoot.scale.set(0.68, 0.68, 0.68);
        logoRoot.position.y = -0.18;

        const basePlate = new THREE.Mesh(
            new THREE.CylinderGeometry(4.2, 4.7, 0.26, 50),
            new THREE.MeshPhysicalMaterial({
                color: 0x081526,
                metalness: 0.78,
                roughness: 0.34,
                emissive: 0x0f3258,
                emissiveIntensity: 0.25,
                transparent: true,
                opacity: 0.92,
            })
        );
        basePlate.position.y = -2.65;
        logoRoot.add(basePlate);
    };

    const selectBlockAtPointer = (clientX, clientY) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersections = raycaster.intersectObjects(blocks, false);

        blocks.forEach((block) => {
            block.material.emissiveIntensity = block.userData.baseEmissiveIntensity;
        });

        if (intersections.length > 0) {
            selectedBlock = intersections[0].object;
            selectedBlock.material.emissiveIntensity = 0.65;
            hint.textContent = 'Bloco selecionado: arraste para rotacao individual';
        } else {
            selectedBlock = null;
            hint.textContent = 'Modo camera: arraste para explorar a logo em 3D';
        }
    };

    const onPointerDown = (event) => {
        isPointerDown = true;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        selectBlockAtPointer(event.clientX, event.clientY);
    };

    const onPointerMove = (event) => {
        if (!isPointerDown) {
            return;
        }

        const deltaX = event.clientX - lastPointerX;
        const deltaY = event.clientY - lastPointerY;

        if (selectedBlock) {
            selectedBlock.rotation.y += deltaX * 0.016;
            selectedBlock.rotation.x += deltaY * 0.014;
        } else {
            logoRoot.rotation.y += deltaX * 0.008;
            logoRoot.rotation.x += deltaY * 0.004;
            logoRoot.rotation.x = Math.max(-0.95, Math.min(0.95, logoRoot.rotation.x));
        }

        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
    };

    const onPointerUp = () => {
        isPointerDown = false;
    };

    logo3DCanvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    if (logoResetButton) {
        logoResetButton.addEventListener('click', () => {
            selectedBlock = null;
            logoRoot.rotation.set(0, 0, 0);
            blocks.forEach((block) => {
                block.rotation.copy(block.userData.baseRotation);
                block.material.emissiveIntensity = block.userData.baseEmissiveIntensity;
            });
            hint.textContent = 'Orientacao resetada: arraste para explorar os lados';
        });
    }

    const onResize = () => {
        const width = logo3DCanvas.clientWidth;
        const height = logo3DCanvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', onResize);

    buildParticles();

    buildBlocksFromImage()
        .then(() => {
            hint.textContent = 'Logo 3D carregada: arraste para ver todos os lados';
        })
        .catch(() => {
            hint.textContent = 'Nao foi possivel carregar a imagem da logo';
        });

    const clock = new THREE.Clock();
    const animate = () => {
        const elapsed = clock.getElapsedTime();
        baseAutoRotation += 0.003;

        if (!isPointerDown && !selectedBlock) {
            logoRoot.rotation.y += 0.0032;
            logoRoot.rotation.x = Math.sin(baseAutoRotation * 0.8) * 0.08;
        }

        if (blocks.length > 0) {
            blocks.forEach((block, index) => {
                block.position.y += Math.sin(elapsed * 0.7 + (index * 0.17) + block.userData.bobOffset) * 0.0009;
            });
        }

        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < particleMeta.length; i += 1) {
                const p = particleMeta[i];
                const i3 = i * 3;
                positions[i3] = p.x + Math.sin(elapsed * 0.16 + p.phase) * 0.11;
                positions[i3 + 1] = p.y + Math.sin(elapsed * p.speed + p.phase) * p.amp;
                positions[i3 + 2] = p.z + Math.cos(elapsed * 0.14 + p.phase) * 0.11;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            particlesGroup.rotation.y += 0.00075;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();
}

// ===========================
// SCROLL ANIMATIONS
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.group, .space-y-4 > p').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================

let lastScrollTop = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ===========================
// CTA BUTTONS FUNCTIONALITY
// ===========================

const ctaButtons = document.querySelectorAll('.bg-gradient-brand');
ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        createRipple(btn);
        setTimeout(() => {
            alert('Obrigado pelo interesse! Redirecionando para o formulário...');
        }, 300);
    });
});

// Ripple effect
function createRipple(btn) {
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'radial-gradient(circle, rgba(0, 212, 255, 0.8), transparent)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    ripple.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(ripple);
    
    let scale = 1;
    const interval = setInterval(() => {
        scale += 0.5;
        ripple.style.transform = `translate(-50%, -50%) scale(${scale})`;
        ripple.style.opacity = 1 - (scale / 3);
        
        if (scale > 3) {
            clearInterval(interval);
            ripple.remove();
        }
    }, 20);
}

// ===========================
// SMOOTH SCROLL
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

console.log('🚀 StackBuild - Transformando presença digital em geração real de clientes');
