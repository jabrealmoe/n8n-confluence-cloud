import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DnaAnimation = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.z = 16;
        camera.position.y = 0;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setClearColor(0x000000, 0); // Transparent
        mountRef.current.appendChild(renderer.domElement);

        // Core Groups
        const worldGroup = new THREE.Group();
        const dnaGroup = new THREE.Group();
        const particleGroup = new THREE.Group();
        const proteinGroup = new THREE.Group();

        worldGroup.add(dnaGroup);
        worldGroup.add(particleGroup);
        worldGroup.add(proteinGroup);
        scene.add(worldGroup);

        // ==========================
        // 1. DNA Double Helix
        // ==========================
        const numPairs = 50;
        const radius = 2.5;
        const height = 24;
        const turns = 3;
        const heightStep = height / numPairs;
        const angleStep = (Math.PI * 2 * turns) / numPairs;

        const atomGeo = new THREE.SphereGeometry(0.35, 16, 16);
        const backboneGeo = new THREE.SphereGeometry(0.5, 16, 16);
        const bondMat = new THREE.MeshPhongMaterial({ color: 0xffffff, opacity: 0.3, transparent: true });

        // Colors: Adenine-Thymine (Neon Orange-Deep Blue), Guanine-Cytosine (Lime-Hot Pink)
        const colors = [
            { a: 0xff6d00, b: 0x2962ff }, // Orange-Blue
            { a: 0x64dd17, b: 0xd500f9 }  // Lime-Pink
        ];

        // Backbone Materials (Dev Mode: Darker/High Contrast)
        const bbMat1 = new THREE.MeshPhongMaterial({ color: 0xffab00, shininess: 120 }); // Amber
        const bbMat2 = new THREE.MeshPhongMaterial({ color: 0x00e5ff, shininess: 120 }); // Cyan

        for (let i = 0; i < numPairs; i++) {
            const y = (i * heightStep) - (height / 2);
            const angle = i * angleStep;

            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;

            const bb = new THREE.Mesh(backboneGeo, i % 2 === 0 ? bbMat1 : bbMat2);
            bb.position.set(x1, y, z1);
            dnaGroup.add(bb);

            const bbOpp = new THREE.Mesh(backboneGeo, i % 2 === 0 ? bbMat1 : bbMat2);
            bbOpp.position.set(x2, y, z2);
            dnaGroup.add(bbOpp);

            // Bases & Bond
            const col = colors[i % 2];
            const b1 = new THREE.Mesh(atomGeo, new THREE.MeshPhongMaterial({ color: col.a }));
            b1.position.set(x1 * 0.6, y, z1 * 0.6);
            dnaGroup.add(b1);

            const b2 = new THREE.Mesh(atomGeo, new THREE.MeshPhongMaterial({ color: col.b }));
            b2.position.set(x2 * 0.6, y, z2 * 0.6);
            dnaGroup.add(b2);

            const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, radius * 1.2, 8), bondMat);
            const mid = new THREE.Vector3((x1+x2)/2, y, (z1+z2)/2);
            bond.position.copy(mid);
            bond.lookAt(new THREE.Vector3(x1, y, z1));
            bond.rotateX(Math.PI/2);
            dnaGroup.add(bond);
        }

        // Rotate DNA for better angle
        dnaGroup.rotation.z = Math.PI / 6;

        // ==========================
        // 2. Cellular Particles
        // ==========================
        const particleCount = 200;
        const particles = [];
        const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });

        for(let i=0; i<particleCount; i++) {
            const p = new THREE.Mesh(particleGeo, particleMat);
            const spread = 20;
            p.position.set(
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread
            );
            // Random velocity
            p.userData = {
                vel: new THREE.Vector3(
                    (Math.random()-0.5) * 0.05,
                    (Math.random()-0.5) * 0.05,
                    (Math.random()-0.5) * 0.05
                )
            };
            particleGroup.add(p);
            particles.push(p);
        }

        // ==========================
        // 3. Dynamic Proteins
        // ==========================
        // Create larger, more visible blob-like proteins
        const proteinCount = 6;
        const proteins = [];
        
        for(let i=0; i<proteinCount; i++) {
            const protGroup = new THREE.Group();
            // Use distinct bright colors
            const hues = [0.1, 0.5, 0.8]; // Orange, Cyan, Magenta
            const color = new THREE.Color().setHSL(hues[i % 3], 0.9, 0.6);
            const mat = new THREE.MeshPhongMaterial({ 
                color: color, 
                shininess: 150,
                emissive: color,
                emissiveIntensity: 0.2
            });
            
            // Core - Larger & Smoother
            protGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), mat));
            
            // Sub-units - More complex/globular structure
            for(let j=0; j<8; j++) {
                const sub = new THREE.Mesh(new THREE.SphereGeometry(0.5 + Math.random() * 0.4, 32, 32), mat);
                sub.position.set(
                    (Math.random()-0.5), 
                    (Math.random()-0.5), 
                    (Math.random()-0.5)
                ).normalize().multiplyScalar(1.0 + Math.random() * 0.4);
                protGroup.add(sub);
            }

            // Orbit parameters - Slower, majestic movement
            protGroup.userData = {
                angle: (Math.PI * 2 * i) / proteinCount,
                speed: 0.002 + Math.random() * 0.003, // Much slower
                radius: 5 + Math.random() * 4, 
                yOffset: (Math.random() - 0.5) * 12,
                rotSpeedX: (Math.random() - 0.5) * 0.01, // Self-rotation
                rotSpeedY: (Math.random() - 0.5) * 0.01
            };
            
            proteinGroup.add(protGroup);
            proteins.push(protGroup);
        }

        // ==========================
        // Lighting
        // ==========================
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        
        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(10, 20, 20);
        scene.add(spotLight);

        const blueLight = new THREE.PointLight(0x0088ff, 0.8, 20);
        blueLight.position.set(-5, 0, 5);
        scene.add(blueLight);

        // ==========================
        // Animation Loop
        // ==========================
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // 1. Rotate DNA (Slow & Steady)
            dnaGroup.rotation.y += 0.004;

            // 2. Animate Particles (Gentle drift)
            particles.forEach(p => {
                p.position.add(p.userData.vel);
                if (p.position.length() > 15) {
                    p.position.multiplyScalar(-0.9); 
                }
            });

            // 3. Animate Proteins (Orbiting + Self Rotation)
            proteins.forEach(prot => {
                const ud = prot.userData;
                ud.angle += ud.speed;
                prot.position.x = Math.cos(ud.angle) * ud.radius;
                prot.position.z = Math.sin(ud.angle) * ud.radius;
                prot.position.y = Math.sin(ud.angle * 2) * 3 + ud.yOffset; 
                
                // Add self-rotation for more dynamic feel
                prot.rotation.x += ud.rotSpeedX;
                prot.rotation.y += ud.rotSpeedY;
            });

            // Gentle World Rotation
            worldGroup.rotation.y += 0.002;

            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        const handleResize = () => {
            if (mountRef.current) {
                const width = mountRef.current.clientWidth;
                const height = mountRef.current.clientHeight;
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                width: '100%',
                height: '350px', // Increased height for more impact
                marginBottom: '20px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', // Deep dark blue/navy gradient
                position: 'relative'
            }}
        >
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'sans-serif',
                fontSize: '12px',
                pointerEvents: 'none'
            }}>
                GENOME SEQUENCE // MONITORING ACTIVE
            </div>
        </div>
    );
};

export default DnaAnimation;
