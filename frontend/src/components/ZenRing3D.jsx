import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ZenRing3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 10);
    camera.position.z = 5.5;

    // Renderer setup with alpha transparency and antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometry - Smooth Torus
    const geometry = new THREE.TorusGeometry(1.4, 0.18, 24, 120);

    // Material - Premium white metallic ring with a subtle golden glow
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xc9a84c, // Gold emissive tone
      emissiveIntensity: 0.25,
      flatShading: false
    });

    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Golden particles surrounding the ring like zen dust
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Scatter particles in a slightly larger ring radius
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.6 + Math.random() * 0.4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius + (Math.random() * 0.3 - 0.15);
      positions[i * 3 + 2] = Math.random() * 0.4 - 0.2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle texture (tiny soft circles)
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc9a84c,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lights
    // Ambient light - warm soft gold
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.2);
    scene.add(ambientLight);

    // Directional light 1 - cool white highlight
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 3, 5);
    scene.add(dirLight1);

    // Directional light 2 - gold reflection highlight
    const dirLight2 = new THREE.DirectionalLight(0xc9a84c, 2.0);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    // Very slow rotation
    let frameId;
    const animate = () => {
      torus.rotation.x += 0.002;
      torus.rotation.y += 0.0045;
      torus.rotation.z += 0.001;

      particles.rotation.z -= 0.0015;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="three-canvas-container"
      style={{ width: '160px', height: '160px' }}
    />
  );
};

export default ZenRing3D;
