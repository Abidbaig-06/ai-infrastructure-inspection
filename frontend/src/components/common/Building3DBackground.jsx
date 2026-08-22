import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Building3DBackground = ({ isDamaged = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 14, 48);
    camera.lookAt(0, 7, 0);

    // 2. WebGL Renderer with Alpha Transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting (Monochrome White, Red Warning Accents if Damaged)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(20, 40, 30);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight2.position.set(-30, 20, -20);
    scene.add(dirLight2);

    // Point Light: Emerald for normal inspection, Amber/Red for damaged structural defect
    const pointLightColor = isDamaged ? 0xef4444 : 0x10b981;
    const pointLight = new THREE.PointLight(pointLightColor, isDamaged ? 3.5 : 2, 55);
    pointLight.position.set(0, 18, 8);
    scene.add(pointLight);

    // 4. Main 3D Architectural City Complex Group (Slightly more compact scale for clean screen framing)
    const cityGroup = new THREE.Group();
    const initialScale = container.clientWidth < 768 ? 0.58 : 0.72;
    cityGroup.scale.set(initialScale, initialScale, initialScale);
    cityGroup.position.set(0, -3.5, 0);
    scene.add(cityGroup);

    // Materials
    const darkGlassMaterial = new THREE.MeshStandardMaterial({
      color: 0x121418,
      roughness: 0.25,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88,
    });

    const towerGlassMaterial = new THREE.MeshStandardMaterial({
      color: 0x181b22,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.92,
    });

    const edgeLineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
    });

    const glowingEdgeMaterial = new THREE.LineBasicMaterial({
      color: isDamaged ? 0xf59e0b : 0x10b981,
      transparent: true,
      opacity: 0.85,
    });

    // Helper to add wireframe edges to a mesh
    const addEdges = (mesh, material = edgeLineMaterial) => {
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const line = new THREE.LineSegments(edges, material);
      mesh.add(line);
    };

    // --- BUILDING 1: Central Primary High-Rise Skyscraper ---
    // Lower tier
    const baseGeo = new THREE.BoxGeometry(9, 14, 9);
    const baseMesh = new THREE.Mesh(baseGeo, darkGlassMaterial);
    baseMesh.position.set(0, 7, 0);
    addEdges(baseMesh);
    cityGroup.add(baseMesh);

    // Mid tier
    const midGeo = new THREE.BoxGeometry(7, 12, 7);
    const midMesh = new THREE.Mesh(midGeo, towerGlassMaterial);
    midMesh.position.set(0, 20, 0);
    addEdges(midMesh);
    cityGroup.add(midMesh);

    // Upper crown tier
    const topGeo = new THREE.BoxGeometry(5, 10, 5);
    const topMesh = new THREE.Mesh(topGeo, darkGlassMaterial);
    topMesh.position.set(0, 31, 0);
    addEdges(topMesh, glowingEdgeMaterial);
    cityGroup.add(topMesh);

    // Spire / Antenna
    const spireGeo = new THREE.CylinderGeometry(0.15, 0.4, 8, 8);
    const spireMesh = new THREE.Mesh(spireGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    spireMesh.position.set(0, 39, 0);
    cityGroup.add(spireMesh);

    // Spire Beacon
    const beaconGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const beaconMesh = new THREE.Mesh(beaconGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    beaconMesh.position.set(0, 43, 0);
    cityGroup.add(beaconMesh);

    // --- STRUCTURAL CRACK & FRACTURE DEFECT SYSTEM (When isDamaged = true) ---
    let crackMeshGroup = new THREE.Group();
    let defectBoundingBox = null;
    let defectBeacon = null;

    if (isDamaged) {
      // 1. Primary Deep Shear Crack (Jagged 3D Fissure along Facade and Corner)
      const primaryCrackVertices = [
        new THREE.Vector3(-3.2, 10.5, 4.6),
        new THREE.Vector3(-2.4, 12.8, 4.62),
        new THREE.Vector3(-2.8, 14.2, 4.6),
        new THREE.Vector3(-1.6, 16.5, 4.62),
        new THREE.Vector3(-0.8, 18.0, 4.6),
        new THREE.Vector3(0.4, 20.2, 3.6),
        new THREE.Vector3(1.6, 22.5, 3.62),
        new THREE.Vector3(1.2, 24.1, 3.6),
        new THREE.Vector3(2.5, 26.8, 3.62),
        new THREE.Vector3(3.2, 28.5, 3.6),
        new THREE.Vector3(3.6, 30.2, 2.6),
      ];

      const primaryCrackGeo = new THREE.BufferGeometry().setFromPoints(primaryCrackVertices);
      const primaryCrackMat = new THREE.LineBasicMaterial({
        color: 0xef4444,
        linewidth: 3,
      });
      const primaryCrackLine = new THREE.Line(primaryCrackGeo, primaryCrackMat);
      crackMeshGroup.add(primaryCrackLine);

      // Glow halo line behind the main crack
      const crackGlowMat = new THREE.LineBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.8,
      });
      const crackGlowLine = new THREE.Line(primaryCrackGeo, crackGlowMat);
      crackGlowLine.position.z += 0.04;
      crackMeshGroup.add(crackGlowLine);

      // 2. Secondary Branching Hairline Fractures
      const branch1 = [
        new THREE.Vector3(-1.6, 16.5, 4.62),
        new THREE.Vector3(-0.4, 15.8, 4.62),
        new THREE.Vector3(0.6, 15.2, 4.6),
      ];
      const branch2 = [
        new THREE.Vector3(1.6, 22.5, 3.62),
        new THREE.Vector3(2.8, 21.8, 3.62),
        new THREE.Vector3(3.4, 20.5, 3.6),
      ];
      const branch3 = [
        new THREE.Vector3(2.5, 26.8, 3.62),
        new THREE.Vector3(1.5, 28.2, 2.62),
        new THREE.Vector3(0.5, 29.5, 2.6),
      ];

      [branch1, branch2, branch3].forEach((bPoints) => {
        const bGeo = new THREE.BufferGeometry().setFromPoints(bPoints);
        const bLine = new THREE.Line(bGeo, new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 }));
        crackMeshGroup.add(bLine);
      });

      // 3. Physical Fractured / Displaced Shard
      const shardGeo = new THREE.BoxGeometry(1.6, 3.2, 0.4);
      const shardMat = new THREE.MeshStandardMaterial({
        color: 0x1f232b,
        roughness: 0.4,
        metalness: 0.7,
      });
      const shardMesh = new THREE.Mesh(shardGeo, shardMat);
      shardMesh.position.set(-1.2, 17.5, 4.75);
      shardMesh.rotation.set(0.12, -0.15, 0.2);
      addEdges(shardMesh, new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 }));
      crackMeshGroup.add(shardMesh);

      // 4. AI Inspection Defect Bounding Box (Wireframe cube encompassing the crack)
      const boxGeo = new THREE.BoxGeometry(6.5, 14, 4.5);
      const boxEdges = new THREE.EdgesGeometry(boxGeo);
      defectBoundingBox = new THREE.LineSegments(
        boxEdges,
        new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.65 })
      );
      defectBoundingBox.position.set(0.2, 20.5, 3.8);
      crackMeshGroup.add(defectBoundingBox);

      // 5. Pulsing Defect Warning Beacon Core
      const beaconGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      defectBeacon = new THREE.Mesh(beaconGeo, beaconMat);
      defectBeacon.position.set(0.4, 20.2, 4.8);
      crackMeshGroup.add(defectBeacon);

      cityGroup.add(crackMeshGroup);
    }

    // --- SURROUNDING BUILDINGS / TOWERS ---
    const towerConfigs = [
      // Right Diagonal Tower
      { x: 11, z: 6, w: 5.5, h: 22, d: 5.5, mat: darkGlassMaterial },
      { x: 11, z: 6, w: 4, h: 6, d: 4, yOffset: 25, mat: towerGlassMaterial },
      // Left Diagonal Tower
      { x: -11, z: 5, w: 6, h: 26, d: 6, mat: towerGlassMaterial },
      { x: -11, z: 5, w: 4.5, h: 5, d: 4.5, yOffset: 28.5, mat: darkGlassMaterial },
      // Rear Central Tower
      { x: 0, z: -10, w: 7, h: 28, d: 6, mat: darkGlassMaterial },
      { x: 0, z: -10, w: 4.5, h: 6, d: 4.5, yOffset: 31, mat: towerGlassMaterial },
      // Front Left Pavilion
      { x: -9, z: -6, w: 5, h: 15, d: 5, mat: darkGlassMaterial },
      // Front Right Modern Angled Wing
      { x: 10, z: -7, w: 5.5, h: 17, d: 5.5, mat: towerGlassMaterial },
      // Additional Perimeter High-Rises
      { x: -17, z: 0, w: 4.5, h: 18, d: 4.5, mat: darkGlassMaterial },
      { x: 17, z: -1, w: 4.5, h: 19, d: 4.5, mat: darkGlassMaterial },
      { x: -8, z: 12, w: 4, h: 14, d: 4, mat: darkGlassMaterial },
      { x: 8, z: 12, w: 4, h: 13, d: 4, mat: darkGlassMaterial },
    ];

    towerConfigs.forEach((cfg) => {
      const geo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      const mesh = new THREE.Mesh(geo, cfg.mat);
      const y = cfg.yOffset ? cfg.yOffset : cfg.h / 2;
      mesh.position.set(cfg.x, y, cfg.z);
      addEdges(mesh);
      cityGroup.add(mesh);
    });

    // --- SKYBRIDGES ---
    const bridgeGeo1 = new THREE.BoxGeometry(7, 1.2, 1.8);
    const bridge1 = new THREE.Mesh(bridgeGeo1, towerGlassMaterial);
    bridge1.position.set(6, 17, 3);
    bridge1.rotation.y = 0.5;
    addEdges(bridge1);
    cityGroup.add(bridge1);

    const bridgeGeo2 = new THREE.BoxGeometry(7, 1.2, 1.8);
    const bridge2 = new THREE.Mesh(bridgeGeo2, towerGlassMaterial);
    bridge2.position.set(-6, 21, 2.5);
    bridge2.rotation.y = -0.45;
    addEdges(bridge2);
    cityGroup.add(bridge2);

    // --- CIRCULAR LIDAR SCANNER DISCS & RADAR SWEEP ---
    const radarColor = isDamaged ? 0xef4444 : 0x10b981;
    const radarDiscGeo = new THREE.RingGeometry(16, 16.3, 64);
    const radarDiscMat = new THREE.MeshBasicMaterial({
      color: radarColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const radarDisc = new THREE.Mesh(radarDiscGeo, radarDiscMat);
    radarDisc.rotation.x = Math.PI / 2;
    radarDisc.position.y = 0.1;
    cityGroup.add(radarDisc);

    const outerDiscGeo = new THREE.RingGeometry(25, 25.4, 64);
    const outerDisc = new THREE.Mesh(outerDiscGeo, new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    }));
    outerDisc.rotation.x = Math.PI / 2;
    outerDisc.position.y = 0.1;
    cityGroup.add(outerDisc);

    // Vertical LiDAR Scanning Plane sweeping the buildings
    const scanPlaneGeo = new THREE.PlaneGeometry(36, 36);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: radarColor,
      transparent: true,
      opacity: isDamaged ? 0.12 : 0.08,
      side: THREE.DoubleSide,
    });
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanPlane.rotation.x = Math.PI / 2;
    cityGroup.add(scanPlane);

    // Structural Base Foundation Grid
    const gridHelper = new THREE.GridHelper(60, 30, 0xffffff, 0x333740);
    gridHelper.position.y = -0.1;
    cityGroup.add(gridHelper);

    // 5. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) * 0.0003;
      mouseY = (event.clientY - windowHalfY) * 0.0003;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Responsive building scale
      const responsiveScale = width < 768 ? 0.58 : 0.72;
      cityGroup.scale.set(responsiveScale, responsiveScale, responsiveScale);
    };

    window.addEventListener('resize', handleResize);

    // 7. Animation Render Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous 3D Building Rotation
      cityGroup.rotation.y += 0.0035;

      // Mouse Parallax easing
      targetRotationY += (mouseX - targetRotationY) * 0.04;
      targetRotationX += (mouseY - targetRotationX) * 0.04;
      camera.position.x = Math.sin(targetRotationY * 4) * 4;
      camera.position.y = 14 + targetRotationX * 6;
      camera.lookAt(0, 7, 0);

      // LiDAR Scanner vertical oscillation
      scanPlane.position.y = 14 + Math.sin(elapsedTime * 1.5) * 14;

      // Spire beacon pulse
      const pulseScale = 1 + Math.sin(elapsedTime * 4) * 0.3;
      beaconMesh.scale.set(pulseScale, pulseScale, pulseScale);

      // Damaged defect beacon pulse
      if (defectBeacon) {
        const dScale = 1 + Math.sin(elapsedTime * 6) * 0.45;
        defectBeacon.scale.set(dScale, dScale, dScale);
      }

      // Radar Ring rotation
      radarDisc.rotation.z += 0.01;
      outerDisc.rotation.z -= 0.005;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup on Component Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDamaged]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
};
export default Building3DBackground;
