/**
 * ParticleBackground Component - Deep Space Edition
 * Creates an immersive 3D animated deep space scene using Three.js.
 * Features:
 * - Multi-layered starfield (parallax)
 * - Procedural nebulae/dust clouds
 * - Slow-drifting planets/celestial objects
 * - Performance-optimized buffer geometries
 */

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ParticleBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 1. Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a1a);
        // Significantly reduced fog to ensure particles aren't "eaten" by background
        scene.fog = new THREE.FogExp2(0x0a0a1a, 0.0005);
        sceneRef.current = scene;

        // 2. Camera setup - wider field of view for "deep" feel
        const camera = new THREE.PerspectiveCamera(70, width / height, 1, 5000);
        camera.position.z = 1200;
        cameraRef.current = camera;

        // 3. Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // ==========================================
        // STARFIELD SYSTEMS (3 LAYERS)
        // ==========================================
        const createStarfield = (count: number, size: number, color: number, distance: number) => {
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const starColor = new THREE.Color(color);

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                // Random sphere distribution
                const r = distance;
                const theta = 2 * Math.PI * Math.random();
                const phi = Math.acos(2 * Math.random() - 1);

                positions[i3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = r * Math.cos(phi);

                // Slight color variations
                const mixedColor = starColor.clone().addScalar((Math.random() - 0.5) * 0.1);
                colors[i3] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: size,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending,
            });

            return new THREE.Points(geometry, material);
        };

        // Layer 1: Background distant stars (more of them, slightly brighter)
        const starLayer1 = createStarfield(12000, 1.2, 0xffffff, 2500);
        scene.add(starLayer1);

        // Layer 2: Midground stars (twinkling blue-ish)
        const starLayer2 = createStarfield(4000, 2.0, 0xccddee, 1800);
        scene.add(starLayer2);

        // Layer 3: Foreground stars (bright yellow/white)
        const starLayer3 = createStarfield(1000, 3.5, 0xfffcf5, 1200);
        scene.add(starLayer3);

        // ==========================================
        // GALACTIC CORE GLOW
        // ==========================================
        const createGalacticCore = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d')!;
            const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
            grad.addColorStop(0, 'rgba(80, 100, 255, 0.3)');
            grad.addColorStop(0.3, 'rgba(40, 60, 150, 0.1)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 256, 256);

            const tex = new THREE.CanvasTexture(canvas);
            const mat = new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, transparent: true });
            const sprite = new THREE.Sprite(mat);
            sprite.scale.set(3000, 3000, 1);
            sprite.position.z = -1500;
            return sprite;
        };
        scene.add(createGalacticCore());

        // ==========================================
        // NEBULAE / GAS CLOUDS (Sprites)
        // ==========================================
        // Using procedural textures to create "nebulae" look without external assets
        const createNebulaTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d')!;
            const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            gradient.addColorStop(0.2, 'rgba(100, 150, 255, 0.2)');
            gradient.addColorStop(0.5, 'rgba(50, 50, 150, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 128, 128);
            return new THREE.CanvasTexture(canvas);
        };

        const nebulaTexture = createNebulaTexture();
        const nebulaGeometry = new THREE.PlaneGeometry(800, 800);
        const nebulae: THREE.Mesh[] = [];

        // Distant nebulae for atmosphere
        const nebulaColors = [0x1a237e, 0x311b92, 0x01579b, 0x004d40];
        for (let i = 0; i < 6; i++) {
            const material = new THREE.MeshBasicMaterial({
                map: nebulaTexture,
                color: nebulaColors[i % nebulaColors.length],
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide,
            });
            const nebula = new THREE.Mesh(nebulaGeometry, material);
            nebula.position.set(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 400 - 800
            );
            nebula.rotation.z = Math.random() * Math.PI;
            scene.add(nebula);
            nebulae.push(nebula);
        }

        // ==========================================
        // CELESTIAL OBJECTS (Planets)
        // ==========================================
        interface Planet {
            mesh: THREE.Mesh;
            orbitSpeed: number;
            orbitOffset: number;
            floatSpeed: number;
        }
        const planets: Planet[] = [];

        const createPlanet = (radius: number, color: number, x: number, y: number, z: number) => {
            const geo = new THREE.SphereGeometry(radius, 32, 32);
            // Procedural crust look
            const mat = new THREE.MeshPhongMaterial({
                color: color,
                shininess: 5,
                emissive: 0x050505,
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, y, z);

            // Add a subtle rim light/atmosphere
            const glowGeo = new THREE.SphereGeometry(radius * 1.05, 32, 32);
            const glowMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.1,
                side: THREE.BackSide,
            });
            const glowMesh = new THREE.Mesh(glowGeo, glowMat);
            mesh.add(glowMesh);

            scene.add(mesh);
            return mesh;
        };

        // Distant Mars (Red Planet) - brighter color
        planets.push({
            mesh: createPlanet(45, 0xe27b58, -700, 400, -1200),
            orbitSpeed: 0.0001,
            orbitOffset: Math.random() * Math.PI,
            floatSpeed: 0.0004,
        });

        // Distant Gas Giant (Blue/Purple)
        planets.push({
            mesh: createPlanet(90, 0x4a5ed8, 1000, -500, -1800),
            orbitSpeed: 0.00005,
            orbitOffset: Math.random() * Math.PI,
            floatSpeed: 0.0002,
        });

        // Distant Ringed Planet or Moon
        planets.push({
            mesh: createPlanet(25, 0xd1d9e0, 500, 700, -1400),
            orbitSpeed: 0.0002,
            orbitOffset: Math.random() * Math.PI,
            floatSpeed: 0.0006,
        });

        // Add some lighting for planets
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(5, 3, 10);
        scene.add(mainLight);

        const ambientLight = new THREE.AmbientLight(0x222244, 1.2);
        scene.add(ambientLight);

        // ==========================================
        // INTERACTIVITY & ANIMATION
        // ==========================================
        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.targetX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        let time = 0;
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            time += 0.01;

            // Smooth mouse transition
            mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.02;
            mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.02;

            // 1. Slow cosmic rotation
            starLayer1.rotation.y += 0.0001;
            starLayer2.rotation.y += 0.0002;
            starLayer3.rotation.y += 0.0003;

            // 2. Parallax movement based on mouse
            scene.rotation.y = mouseRef.current.x * 0.05;
            scene.rotation.x = -mouseRef.current.y * 0.05;

            // 3. Animate planets
            planets.forEach((planet, i) => {
                planet.mesh.rotation.y += 0.001;
                // Subtle floating
                planet.mesh.position.y += Math.sin(time * planet.floatSpeed * 50 + i) * 0.1;
            });

            // 4. Animate nebulae (drifting)
            nebulae.forEach((nebula, i) => {
                nebula.rotation.z += 0.0001 * (i % 2 === 0 ? 1 : -1);
                nebula.position.x += Math.sin(time * 0.1 + i) * 0.05;
            });

            // 5. Camera slow drift
            camera.position.x += (mouseRef.current.x * 50 - camera.position.x) * 0.01;
            camera.position.y += (-mouseRef.current.y * 50 - camera.position.y) * 0.01;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        const handleResize = () => {
            if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;

            cameraRef.current.aspect = newWidth / newHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationRef.current);
            if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
                container.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }
            // Dispose geometries and materials
            starLayer1.geometry.dispose();
            (starLayer1.material as THREE.Material).dispose();
            starLayer2.geometry.dispose();
            (starLayer2.material as THREE.Material).dispose();
            starLayer3.geometry.dispose();
            (starLayer3.material as THREE.Material).dispose();
            nebulaGeometry.dispose();
            nebulae.forEach(n => (n.material as THREE.Material).dispose());
            planets.forEach(p => {
                p.mesh.geometry.dispose();
                (p.mesh.material as THREE.Material).dispose();
                p.mesh.children.forEach(c => {
                    if (c instanceof THREE.Mesh) {
                        c.geometry.dispose();
                        (c.material as THREE.Material).dispose();
                    }
                });
            });
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 bg-[#0a0a1a]"
            aria-hidden="true"
        />
    );
};

export default ParticleBackground;
