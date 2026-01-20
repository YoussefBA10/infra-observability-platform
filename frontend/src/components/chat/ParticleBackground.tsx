/**
 * ParticleBackground Component
 * Creates an immersive 3D animated particle field using Three.js.
 * Features floating particles that create a tech/space atmosphere.
 */

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ParticleBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Initialize scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Initialize camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 50;
        cameraRef.current = camera;

        // Initialize renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create particle geometry
        const particleCount = 1500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Color palette - blue, teal, purple for DevOps/tech feel
        const colorPalette = [
            new THREE.Color(0x3b82f6), // Blue
            new THREE.Color(0x14b8a6), // Teal
            new THREE.Color(0x8b5cf6), // Purple
            new THREE.Color(0x06b6d4), // Cyan
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Spread particles in a sphere
            const radius = 80;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi) - 30;

            // Random color from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Varied sizes
            sizes[i] = Math.random() * 2 + 0.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom shader material for better-looking particles
        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        particlesRef.current = particles;

        // Add some larger glowing orbs
        const orbGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const orbs: THREE.Mesh[] = [];

        for (let i = 0; i < 8; i++) {
            const orbMaterial = new THREE.MeshBasicMaterial({
                color: colorPalette[i % colorPalette.length],
                transparent: true,
                opacity: 0.6,
            });
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            orb.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 30 - 20
            );
            orb.userData.speed = Math.random() * 0.02 + 0.01;
            orb.userData.amplitude = Math.random() * 10 + 5;
            orb.userData.offset = Math.random() * Math.PI * 2;
            scene.add(orb);
            orbs.push(orb);
        }

        // Mouse move handler for interactivity
        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        let time = 0;
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            time += 0.001;

            // Rotate particles based on mouse position
            if (particlesRef.current) {
                particlesRef.current.rotation.x += 0.0003;
                particlesRef.current.rotation.y += 0.0005;
                particlesRef.current.rotation.x += mouseRef.current.y * 0.0002;
                particlesRef.current.rotation.y += mouseRef.current.x * 0.0002;
            }

            // Animate orbs
            orbs.forEach((orb) => {
                orb.position.y += Math.sin(time * 50 * orb.userData.speed + orb.userData.offset) * 0.02;
                orb.position.x += Math.cos(time * 30 * orb.userData.speed + orb.userData.offset) * 0.01;
            });

            // Subtle camera movement
            camera.position.x = mouseRef.current.x * 2;
            camera.position.y = mouseRef.current.y * 2;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
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
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 -z-10"
            aria-hidden="true"
        />
    );
};

export default ParticleBackground;
