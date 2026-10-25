import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDevotionalCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true, 
        powerPreference: 'high-performance' 
      });
    } catch (e) {
      console.warn("WebGL not available, using CSS fallback");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 70;

    // Limit pixel ratio on mobile for 60fps performance
    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '0';
    container.appendChild(renderer.domElement);

    // 1. Golden Cosmic Sparks
    const sparkCount = isMobile ? 250 : 600;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkColors = new Float32Array(sparkCount * 3);
    const sparkVelocities: { x: number; y: number; z: number }[] = [];

    const goldPalette = [
      new THREE.Color('#FFD700'),
      new THREE.Color('#FFA500'),
      new THREE.Color('#FFF8DC'),
      new THREE.Color('#F3C74C'),
      new THREE.Color('#FF8C00')
    ];

    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = (Math.random() - 0.5) * 160;
      sparkPos[i * 3 + 1] = (Math.random() - 0.5) * 160;
      sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const col = goldPalette[Math.floor(Math.random() * goldPalette.length)];
      sparkColors[i * 3] = col.r;
      sparkColors[i * 3 + 1] = col.g;
      sparkColors[i * 3 + 2] = col.b;

      sparkVelocities.push({
        x: (Math.random() - 0.5) * 0.05,
        y: Math.random() * 0.08 + 0.02,
        z: (Math.random() - 0.5) * 0.03
      });
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

    // Particle Glow Texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(255, 215, 0, 0.8)');
      grad.addColorStop(0.7, 'rgba(255, 140, 0, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const sparkTex = new THREE.CanvasTexture(canvas);

    const sparkMat = new THREE.PointsMaterial({
      size: isMobile ? 2.5 : 3.0,
      map: sparkTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      opacity: 0.8
    });

    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);

    // 2. 3D Floating Pink Lotus Petals
    const petalCanvas = document.createElement('canvas');
    petalCanvas.width = 64;
    petalCanvas.height = 64;
    const pCtx = petalCanvas.getContext('2d');
    if (pCtx) {
      // Draw a gentle curved lotus petal shape
      pCtx.beginPath();
      pCtx.moveTo(32, 4);
      pCtx.bezierCurveTo(56, 16, 56, 48, 32, 60);
      pCtx.bezierCurveTo(8, 48, 8, 16, 32, 4);
      pCtx.closePath();
      const pGrad = pCtx.createLinearGradient(32, 4, 32, 60);
      pGrad.addColorStop(0, '#FFF0F5');
      pGrad.addColorStop(0.4, '#FFB6C1');
      pGrad.addColorStop(0.8, '#FF69B4');
      pGrad.addColorStop(1, '#DB2777');
      pCtx.fillStyle = pGrad;
      pCtx.fill();
    }
    const petalTex = new THREE.CanvasTexture(petalCanvas);

    const petalCount = isMobile ? 18 : 36;
    const petalGroup = new THREE.Group();
    const petalData: {
      mesh: THREE.Mesh;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      floatSpeedY: number;
      driftSpeedX: number;
      initialX: number;
    }[] = [];

    const petalGeo = new THREE.PlaneGeometry(3.5, 4.5);
    const petalMat = new THREE.MeshBasicMaterial({
      map: petalTex,
      transparent: true,
      side: THREE.DoubleSide,
      opacity: 0.85,
      depthWrite: false
    });

    for (let i = 0; i < petalCount; i++) {
      const mesh = new THREE.Mesh(petalGeo, petalMat);
      const x = (Math.random() - 0.5) * 140;
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 60;
      mesh.position.set(x, y, z);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      petalGroup.add(mesh);

      petalData.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.015,
        floatSpeedY: -(Math.random() * 0.04 + 0.02),
        driftSpeedX: (Math.random() - 0.5) * 0.02,
        initialX: x
      });
    }

    scene.add(petalGroup);

    // 3. Subtle Golden Sacred Geometry Ring (Torus)
    const ringGeo = new THREE.TorusGeometry(26, 0.15, 12, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xD4AF37,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3.5;
    ring.position.set(0, 10, -20);
    scene.add(ring);

    // Touch & Pointer Interaction (Passive, non-blocking)
    let pointerX = 0;
    let pointerY = 0;
    let targetCamX = 0;
    let targetCamY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      pointerX = (clientX - window.innerWidth / 2) * 0.04;
      pointerY = (clientY - window.innerHeight / 2) * 0.04;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation toward pointer
      targetCamX += (pointerX - targetCamX) * 0.04;
      targetCamY += (pointerY - targetCamY) * 0.04;
      camera.position.x = targetCamX * 0.25;
      camera.position.y = -targetCamY * 0.25;
      camera.lookAt(0, 0, 0);

      // Rotate and drift sparks
      const posAttr = sparkGeo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < sparkCount; i++) {
        const vel = sparkVelocities[i];
        positions[i * 3 + 1] += vel.y;
        positions[i * 3] += Math.sin(elapsed + i) * 0.02;

        // Reset if float out of top bound
        if (positions[i * 3 + 1] > 80) {
          positions[i * 3 + 1] = -80;
          positions[i * 3] = (Math.random() - 0.5) * 160;
        }
      }
      posAttr.needsUpdate = true;
      sparkPoints.rotation.y = elapsed * 0.015;

      // Animate floating lotus petals (falling and tumbling gently)
      petalData.forEach((p) => {
        p.mesh.rotation.x += p.rotSpeedX;
        p.mesh.rotation.y += p.rotSpeedY;
        p.mesh.rotation.z += p.rotSpeedZ;

        p.mesh.position.y += p.floatSpeedY;
        p.mesh.position.x += Math.sin(elapsed * 0.8 + p.initialX) * 0.04;

        // Reset to top when petal falls below screen
        if (p.mesh.position.y < -70) {
          p.mesh.position.y = 70;
          p.mesh.position.x = (Math.random() - 0.5) * 140;
        }
      });

      // Slowly rotate sacred torus
      ring.rotation.z = elapsed * 0.04;
      ring.rotation.y = Math.sin(elapsed * 0.2) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sparkGeo.dispose();
      sparkMat.dispose();
      sparkTex.dispose();
      petalGeo.dispose();
      petalMat.dispose();
      petalTex.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
};
