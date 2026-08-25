import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SCENES_METADATA = [
  { id: 'building', color: '#10b981' },
  { id: 'road', color: '#06b6d4' },
  { id: 'pothole', color: '#ef4444' },
  { id: 'bridge', color: '#38bdf8' },
  { id: 'electric', color: '#f59e0b' },
  { id: 'damaged_building', color: '#f43f5e' },
];

const SCENE_DURATION = 10.0; // 10 seconds per scene
const TRANSITION_DURATION = 1.6; // 1.6s smooth slide right transition window
const TOTAL_CYCLE = SCENES_METADATA.length * SCENE_DURATION; // 60 seconds total loop

export const Building3DBackground = ({ initialScene = null, isDamaged = false }) => {
  const containerRef = useRef(null);
  
  // Determine starting index
  const getStartingIndex = () => {
    if (initialScene === 'road') return 1;
    if (initialScene === 'pothole') return 2;
    if (initialScene === 'bridge') return 3;
    if (initialScene === 'electric') return 4;
    if (initialScene === 'damaged_building' || isDamaged) return 5;
    return 0;
  };

  const manualOverrideRef = useRef(getStartingIndex());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 14, 46);
    camera.lookAt(0, 7, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(25, 45, 35);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight2.position.set(-30, 20, -25);
    scene.add(dirLight2);

    const dynamicPointLight = new THREE.PointLight(0x10b981, 2.5, 60);
    dynamicPointLight.position.set(0, 18, 10);
    scene.add(dynamicPointLight);

    // Shared Materials
    const darkGlassMaterial = new THREE.MeshStandardMaterial({
      color: 0x121418,
      roughness: 0.25,
      metalness: 0.85,
      transparent: true,
      opacity: 0.9,
    });

    const towerGlassMaterial = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      roughness: 0.2,
      metalness: 0.92,
      transparent: true,
      opacity: 0.92,
    });

    const asphaltMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c1e24,
      roughness: 0.8,
      metalness: 0.2,
    });

    const roadMarkingMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });

    const roadYellowMaterial = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.9,
    });

    const metalPoleMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b4252,
      roughness: 0.35,
      metalness: 0.75,
    });

    const edgeLineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    });

    const addEdges = (mesh, mat = edgeLineMaterial) => {
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const line = new THREE.LineSegments(edges, mat);
      mesh.add(line);
      return line;
    };

    // Master Scale
    const baseScale = container.clientWidth < 768 ? 0.6 : 0.75;

    // Helper: Create 3D Bounding Box with Corner Brackets
    const createAIBoundingBox = (w, h, d, color = 0xef4444) => {
      const group = new THREE.Group();
      const boxGeo = new THREE.BoxGeometry(w, h, d);
      const boxEdges = new THREE.EdgesGeometry(boxGeo);
      const boxLine = new THREE.LineSegments(
        boxEdges,
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.75 })
      );
      group.add(boxLine);

      // Add a small pulsing core indicator
      const dotGeo = new THREE.SphereGeometry(0.3, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(0, h / 2 + 0.4, 0);
      group.add(dot);
      group.userData = { dot, color };
      return group;
    };

    // =========================================================================
    // SCENE 1: 🏛️ MODERN SKYSCRAPER & ARCHITECTURAL CITY COMPLEX
    // =========================================================================
    const scene1Group = new THREE.Group();
    scene1Group.scale.set(baseScale, baseScale, baseScale);
    scene1Group.position.set(0, -3.5, 0);
    scene.add(scene1Group);

    // Central Primary Skyscraper
    const s1Base = new THREE.Mesh(new THREE.BoxGeometry(9, 14, 9), darkGlassMaterial);
    s1Base.position.set(0, 7, 0);
    addEdges(s1Base);
    scene1Group.add(s1Base);

    const s1Mid = new THREE.Mesh(new THREE.BoxGeometry(7, 12, 7), towerGlassMaterial);
    s1Mid.position.set(0, 20, 0);
    addEdges(s1Mid);
    scene1Group.add(s1Mid);

    const s1Top = new THREE.Mesh(new THREE.BoxGeometry(5, 10, 5), darkGlassMaterial);
    s1Top.position.set(0, 31, 0);
    addEdges(s1Top, new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.8 }));
    scene1Group.add(s1Top);

    const s1Spire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.4, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    s1Spire.position.set(0, 39, 0);
    scene1Group.add(s1Spire);

    const s1Beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    s1Beacon.position.set(0, 43, 0);
    scene1Group.add(s1Beacon);

    // Surrounding Skyscrapers
    const s1Towers = [
      { x: 11, z: 6, w: 5.5, h: 22, d: 5.5, mat: darkGlassMaterial },
      { x: 11, z: 6, w: 4, h: 6, d: 4, yOffset: 25, mat: towerGlassMaterial },
      { x: -11, z: 5, w: 6, h: 26, d: 6, mat: towerGlassMaterial },
      { x: -11, z: 5, w: 4.5, h: 5, d: 4.5, yOffset: 28.5, mat: darkGlassMaterial },
      { x: 0, z: -10, w: 7, h: 28, d: 6, mat: darkGlassMaterial },
      { x: 0, z: -10, w: 4.5, h: 6, d: 4.5, yOffset: 31, mat: towerGlassMaterial },
      { x: -9, z: -6, w: 5, h: 15, d: 5, mat: darkGlassMaterial },
      { x: 10, z: -7, w: 5.5, h: 17, d: 5.5, mat: towerGlassMaterial },
      { x: -17, z: 0, w: 4.5, h: 18, d: 4.5, mat: darkGlassMaterial },
      { x: 17, z: -1, w: 4.5, h: 19, d: 4.5, mat: darkGlassMaterial },
    ];
    s1Towers.forEach((cfg) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d), cfg.mat);
      m.position.set(cfg.x, cfg.yOffset || cfg.h / 2, cfg.z);
      addEdges(m);
      scene1Group.add(m);
    });

    // Skybridges
    const sb1 = new THREE.Mesh(new THREE.BoxGeometry(7, 1.2, 1.8), towerGlassMaterial);
    sb1.position.set(6, 17, 3);
    sb1.rotation.y = 0.5;
    addEdges(sb1);
    scene1Group.add(sb1);

    const sb2 = new THREE.Mesh(new THREE.BoxGeometry(7, 1.2, 1.8), towerGlassMaterial);
    sb2.position.set(-6, 21, 2.5);
    sb2.rotation.y = -0.45;
    addEdges(sb2);
    scene1Group.add(sb2);

    // Radar Rings & LiDAR Plane for Scene 1
    const s1Radar = new THREE.Mesh(
      new THREE.RingGeometry(16, 16.3, 64),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
    );
    s1Radar.rotation.x = Math.PI / 2;
    s1Radar.position.y = 0.1;
    scene1Group.add(s1Radar);

    const s1ScanPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 36),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
    );
    s1ScanPlane.rotation.x = Math.PI / 2;
    scene1Group.add(s1ScanPlane);

    const s1Grid = new THREE.GridHelper(60, 30, 0xffffff, 0x333740);
    s1Grid.position.y = -0.1;
    scene1Group.add(s1Grid);

    // =========================================================================
    // SCENE 2: 🛣️ DUAL-LANE ARTERIAL ROAD & HIGHWAY CORRIDOR
    // =========================================================================
    const scene2Group = new THREE.Group();
    scene2Group.scale.set(baseScale, baseScale, baseScale);
    scene2Group.position.set(50, -3.5, 0); // initial offset
    scene.add(scene2Group);

    // Road Deck (Width: 16, Length: 70, Depth: 0.8)
    const roadDeck = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 70), asphaltMaterial);
    roadDeck.position.set(0, 0.4, 0);
    addEdges(roadDeck, new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.4 }));
    scene2Group.add(roadDeck);

    // Sidewalks / Curbs Left & Right
    const curbLeft = new THREE.Mesh(
      new THREE.BoxGeometry(3, 1.2, 70),
      new THREE.MeshStandardMaterial({ color: 0x2e3440, roughness: 0.6 })
    );
    curbLeft.position.set(-9.5, 0.6, 0);
    addEdges(curbLeft);
    scene2Group.add(curbLeft);

    const curbRight = curbLeft.clone();
    curbRight.position.set(9.5, 0.6, 0);
    scene2Group.add(curbRight);

    // Painted Center Dashed Line (Stripe segments)
    for (let z = -32; z <= 32; z += 4) {
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 2.2), roadYellowMaterial);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(0, 0.82, z);
      scene2Group.add(stripe);
    }

    // Side Solid White Lane Lines
    const leftLine = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 68), roadMarkingMaterial);
    leftLine.rotation.x = -Math.PI / 2;
    leftLine.position.set(-6, 0.82, 0);
    scene2Group.add(leftLine);

    const rightLine = leftLine.clone();
    rightLine.position.set(6, 0.82, 0);
    scene2Group.add(rightLine);

    // Street Light Poles along Sidewalks
    const s2LightBulbs = [];
    for (let z = -28; z <= 28; z += 14) {
      // Left Pole
      const poleGeo = new THREE.CylinderGeometry(0.18, 0.22, 10, 8);
      const poleLeft = new THREE.Mesh(poleGeo, metalPoleMaterial);
      poleLeft.position.set(-9.5, 5.6, z);
      scene2Group.add(poleLeft);

      // Arm
      const armGeo = new THREE.BoxGeometry(2.4, 0.15, 0.15);
      const arm = new THREE.Mesh(armGeo, metalPoleMaterial);
      arm.position.set(-8.3, 10.4, z);
      scene2Group.add(arm);

      // Lamp Luminaire Head
      const lampGeo = new THREE.BoxGeometry(0.8, 0.25, 0.4);
      const lamp = new THREE.Mesh(lampGeo, new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
      lamp.position.set(-7.2, 10.3, z);
      scene2Group.add(lamp);
      s2LightBulbs.push(lamp);

      // Right Pole
      const poleRight = poleLeft.clone();
      poleRight.position.set(9.5, 5.6, z);
      scene2Group.add(poleRight);

      const armRight = arm.clone();
      armRight.position.set(8.3, 10.4, z);
      scene2Group.add(armRight);

      const lampRight = lamp.clone();
      lampRight.position.set(7.2, 10.3, z);
      scene2Group.add(lampRight);
      s2LightBulbs.push(lampRight);
    }

    // Roadside Guardrails
    const railLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.8, 68),
      new THREE.MeshStandardMaterial({ color: 0x4c566a, metalness: 0.8 })
    );
    railLeft.position.set(-10.8, 1.4, 0);
    scene2Group.add(railLeft);

    const railRight = railLeft.clone();
    railRight.position.set(10.8, 1.4, 0);
    scene2Group.add(railRight);

    // Sweeping Road LiDAR Corridor Scanner (Moving along Z-axis)
    const s2LiDARScan = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.05, 3.5),
      new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.45,
      })
    );
    s2LiDARScan.position.set(0, 0.88, 0);
    scene2Group.add(s2LiDARScan);

    // AI Road Lane Bounding Boxes
    const s2Box1 = createAIBoundingBox(5.5, 2.5, 12, 0x06b6d4);
    s2Box1.position.set(-3, 2, -6);
    scene2Group.add(s2Box1);

    const s2Box2 = createAIBoundingBox(5.5, 2.5, 12, 0x10b981);
    s2Box2.position.set(3, 2, 8);
    scene2Group.add(s2Box2);

    const s2Grid = new THREE.GridHelper(70, 35, 0x06b6d4, 0x223040);
    s2Grid.position.y = -0.1;
    scene2Group.add(s2Grid);

    // =========================================================================
    // SCENE 3: 🕳️ ULTRA-REALISTIC 3D ORGANIC POTHOLE & SUB-BASE CAVITY SCAN
    // =========================================================================
    const scene3Group = new THREE.Group();
    scene3Group.scale.set(baseScale, baseScale, baseScale);
    scene3Group.position.set(50, -3.5, 0);
    scene.add(scene3Group);

    // 1. Procedural 3D Deformed Road Pavement Mesh (Vertex-Level Realism)
    const s3RoadGeo = new THREE.PlaneGeometry(24, 34, 150, 150);
    const posAttr = s3RoadGeo.attributes.position;
    const cx1 = -2.2, cz1 = 2.0; // Primary Critical Pothole
    const r1 = 3.6;
    const depth1 = 2.4;
    const cx2 = 4.6, cz2 = -6.0; // Secondary Fatigue Spall Pothole
    const r2 = 2.0;
    const depth2 = 1.3;

    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getY(i); // Initial 2D plane coordinates

      // Natural asphalt micro-texture (pavement aggregate roughness)
      let h = (Math.sin(vx * 3.8) * Math.cos(vz * 3.8) + Math.sin(vx * 8.5 + vz * 6.5) * 0.4) * 0.04;

      // Pothole 1 Displacement (Realistic jagged, organic crater profile)
      const dx1 = vx - cx1;
      const dz1 = vz - cz1;
      const dist1 = Math.hypot(dx1, dz1);
      const angle1 = Math.atan2(dz1, dx1);
      const irregR1 = r1 * (1 + 0.22 * Math.sin(angle1 * 3 + 1.2) + 0.15 * Math.cos(angle1 * 5 - 0.7) + 0.08 * Math.sin(angle1 * 7));

      if (dist1 < irregR1) {
        const normDist1 = dist1 / irregR1;
        // Steep shearing at the broken asphalt edge, sunken hollow base
        const cavityDrop = Math.pow(1 - normDist1, 0.75) * depth1;
        // Jagged stone roughness on the broken crater bed
        const floorRocks = (Math.sin(vx * 12.0) * Math.cos(vz * 12.0) + Math.sin(vx * 24.0 + vz * 20.0) * 0.5) * 0.22 * (1 - normDist1);
        h -= (cavityDrop - floorRocks);
      } else if (dist1 < irregR1 * 1.32) {
        // Pavement heave lip around crater edge
        const lip = Math.sin(((dist1 - irregR1) / (irregR1 * 0.32)) * Math.PI) * 0.15;
        h += lip;
      }

      // Pothole 2 Displacement (Secondary developing pothole)
      const dx2 = vx - cx2;
      const dz2 = vz - cz2;
      const dist2 = Math.hypot(dx2, dz2);
      const angle2 = Math.atan2(dz2, dx2);
      const irregR2 = r2 * (1 + 0.24 * Math.sin(angle2 * 4) + 0.12 * Math.cos(angle2 * 6));

      if (dist2 < irregR2) {
        const normDist2 = dist2 / irregR2;
        const cavityDrop2 = Math.pow(1 - normDist2, 0.8) * depth2;
        const floorRocks2 = (Math.sin(vx * 14.0) * Math.cos(vz * 14.0)) * 0.14 * (1 - normDist2);
        h -= (cavityDrop2 - floorRocks2);
      } else if (dist2 < irregR2 * 1.28) {
        const lip2 = Math.sin(((dist2 - irregR2) / (irregR2 * 0.28)) * Math.PI) * 0.1;
        h += lip2;
      }

      posAttr.setZ(i, h);
    }
    s3RoadGeo.computeVertexNormals();
    s3RoadGeo.rotateX(-Math.PI / 2);

    // Realistic Asphalt Pavement Material
    const s3RealisticAsphaltMat = new THREE.MeshStandardMaterial({
      color: 0x181a22,
      roughness: 0.92,
      metalness: 0.18,
    });
    const s3RoadMesh = new THREE.Mesh(s3RoadGeo, s3RealisticAsphaltMat);
    s3RoadMesh.position.set(0, 1.2, 0);
    scene3Group.add(s3RoadMesh);

    // 2. Sub-Base Bed Foundation (Exposed cross section of road sub-grade)
    const s3SubBase = new THREE.Mesh(
      new THREE.BoxGeometry(24, 1.2, 34),
      new THREE.MeshStandardMaterial({ color: 0x1f1b16, roughness: 0.98 })
    );
    s3SubBase.position.set(0, 0.6, 0);
    addEdges(s3SubBase, new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.35 }));
    scene3Group.add(s3SubBase);

    // 3. Realistic 3D Organic Water Puddle in the Cavity
    const puddleShape = new THREE.Shape();
    const pPoints = 28;
    for (let j = 0; j <= pPoints; j++) {
      const theta = (j / pPoints) * Math.PI * 2;
      const pr = 1.95 * (1 + 0.18 * Math.sin(theta * 3 + 0.5) + 0.12 * Math.cos(theta * 5));
      const px = cx1 + Math.cos(theta) * pr;
      const pz = cz1 + Math.sin(theta) * pr;
      if (j === 0) puddleShape.moveTo(px, pz);
      else puddleShape.lineTo(px, pz);
    }
    const puddleGeo = new THREE.ShapeGeometry(puddleShape);
    puddleGeo.rotateX(-Math.PI / 2);
    const s3PuddleMat = new THREE.MeshStandardMaterial({
      color: 0x0c1424,
      roughness: 0.04,
      metalness: 0.92,
      transparent: true,
      opacity: 0.88,
    });
    const s3Puddle = new THREE.Mesh(puddleGeo, s3PuddleMat);
    s3Puddle.position.set(0, 0.28, 0); // Sunken inside pothole basin
    scene3Group.add(s3Puddle);

    // 4. 3D Aggregate Stones & Broken Asphalt Chunks Scattered Inside Cavity
    const s3DebrisGroup = new THREE.Group();
    const debrisConfigs = [
      // Chunks inside crater 1
      { x: -2.8, z: 2.8, s: 0.38, r: [0.4, 0.2, 0.8], col: 0x16181f },
      { x: -1.6, z: 1.4, s: 0.32, r: [0.1, 0.9, 0.3], col: 0x3d352b },
      { x: -3.2, z: 1.2, s: 0.28, r: [0.8, 0.3, 0.2], col: 0x181a20 },
      { x: -2.0, z: 3.4, s: 0.35, r: [0.2, 0.6, 0.5], col: 0x483e32 },
      { x: -1.2, z: 2.6, s: 0.24, r: [0.5, 0.2, 0.9], col: 0x1a1c24 },
      { x: -3.6, z: 2.4, s: 0.42, r: [0.3, 0.4, 0.1], col: 0x383025 },
      { x: -1.8, z: 0.6, s: 0.30, r: [0.7, 0.1, 0.6], col: 0x14161d },
      { x: -0.8, z: 1.8, s: 0.22, r: [0.9, 0.5, 0.2], col: 0x453b2e },
      // Chunks around rim 1
      { x: -4.4, z: 2.2, s: 0.36, r: [0.2, 0.3, 0.7], col: 0x181a22 },
      { x: -2.4, z: 4.8, s: 0.28, r: [0.5, 0.8, 0.2], col: 0x3a3328 },
      { x: 0.2, z: 2.5, s: 0.32, r: [0.1, 0.4, 0.8], col: 0x15171e },
      { x: -2.1, z: -0.6, s: 0.26, r: [0.6, 0.2, 0.4], col: 0x42382c },
      // Chunks inside crater 2
      { x: 4.2, z: -5.6, s: 0.28, r: [0.3, 0.6, 0.2], col: 0x16181f },
      { x: 5.2, z: -6.4, s: 0.24, r: [0.7, 0.1, 0.5], col: 0x3c342a },
      { x: 4.6, z: -6.8, s: 0.32, r: [0.4, 0.8, 0.3], col: 0x181a22 },
      { x: 3.6, z: -6.0, s: 0.22, r: [0.2, 0.5, 0.9], col: 0x40362b },
    ];

    debrisConfigs.forEach((d) => {
      // Create irregular jagged rock geometry using perturbed dodecahedron
      const rockGeo = new THREE.DodecahedronGeometry(d.s, 0);
      const rPos = rockGeo.attributes.position;
      for (let k = 0; k < rPos.count; k++) {
        rPos.setXYZ(
          k,
          rPos.getX(k) * (0.85 + Math.sin(k * 2.3) * 0.3),
          rPos.getY(k) * (0.85 + Math.cos(k * 3.1) * 0.3),
          rPos.getZ(k) * (0.85 + Math.sin(k * 1.7) * 0.3)
        );
      }
      rockGeo.computeVertexNormals();

      const rockMat = new THREE.MeshStandardMaterial({
        color: d.col,
        roughness: 0.95,
        metalness: 0.1,
      });
      const rockMesh = new THREE.Mesh(rockGeo, rockMat);
      rockMesh.position.set(d.x, 0.7 + d.s * 0.5, d.z);
      rockMesh.rotation.set(...d.r);
      s3DebrisGroup.add(rockMesh);
    });
    scene3Group.add(s3DebrisGroup);

    // 5. Authentic 3D Multi-Branching Alligator Fissure Network (IRC:82 Severity III)
    const s3CracksGroup = new THREE.Group();
    const realisticCrackBranches = [
      // Major radial fissure 1 (North-West)
      [
        new THREE.Vector3(-2.2, 1.25, 2.0),
        new THREE.Vector3(-3.8, 1.26, 3.6),
        new THREE.Vector3(-5.2, 1.25, 4.4),
        new THREE.Vector3(-7.0, 1.24, 6.2),
        new THREE.Vector3(-8.8, 1.23, 7.1),
      ],
      // Major radial fissure 2 (North-East)
      [
        new THREE.Vector3(-2.2, 1.25, 2.0),
        new THREE.Vector3(-0.6, 1.26, 4.2),
        new THREE.Vector3(1.2, 1.25, 5.8),
        new THREE.Vector3(2.8, 1.24, 7.6),
      ],
      // Major radial fissure 3 (East)
      [
        new THREE.Vector3(-2.2, 1.25, 2.0),
        new THREE.Vector3(0.8, 1.26, 1.4),
        new THREE.Vector3(3.2, 1.25, 0.8),
        new THREE.Vector3(5.6, 1.24, -0.4),
      ],
      // Major radial fissure 4 (South toward Pothole 2)
      [
        new THREE.Vector3(-2.2, 1.25, 2.0),
        new THREE.Vector3(-1.4, 1.25, -0.8),
        new THREE.Vector3(0.4, 1.25, -2.6),
        new THREE.Vector3(2.2, 1.25, -4.2),
        new THREE.Vector3(4.6, 1.25, -6.0),
      ],
      // Major radial fissure 5 (West)
      [
        new THREE.Vector3(-2.2, 1.25, 2.0),
        new THREE.Vector3(-4.8, 1.26, 1.2),
        new THREE.Vector3(-7.2, 1.25, 0.4),
        new THREE.Vector3(-9.6, 1.24, -0.8),
      ],
      // Transverse Alligator Interconnects
      [
        new THREE.Vector3(-3.8, 1.26, 3.6),
        new THREE.Vector3(-2.4, 1.26, 4.8),
        new THREE.Vector3(-0.6, 1.26, 4.2),
      ],
      [
        new THREE.Vector3(-5.2, 1.25, 4.4),
        new THREE.Vector3(-4.0, 1.25, 6.0),
        new THREE.Vector3(-2.0, 1.25, 6.8),
        new THREE.Vector3(1.2, 1.25, 5.8),
      ],
      [
        new THREE.Vector3(-4.8, 1.26, 1.2),
        new THREE.Vector3(-3.8, 1.25, -0.6),
        new THREE.Vector3(-1.4, 1.25, -0.8),
      ],
      [
        new THREE.Vector3(0.8, 1.26, 1.4),
        new THREE.Vector3(1.8, 1.25, 3.2),
        new THREE.Vector3(1.2, 1.25, 5.8),
      ],
      [
        new THREE.Vector3(0.4, 1.25, -2.6),
        new THREE.Vector3(2.4, 1.25, -1.8),
        new THREE.Vector3(3.2, 1.25, 0.8),
      ],
    ];

    realisticCrackBranches.forEach((pts) => {
      const cGeo = new THREE.BufferGeometry().setFromPoints(pts);
      // Dark asphalt fissure core
      const cDark = new THREE.Line(
        cGeo,
        new THREE.LineBasicMaterial({ color: 0x050508, linewidth: 3, transparent: true, opacity: 0.95 })
      );
      cDark.position.y += 0.01;
      s3CracksGroup.add(cDark);

      // Glowing AI defect highlight line
      const cGlow = new THREE.Line(
        cGeo,
        new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2, transparent: true, opacity: 0.8 })
      );
      cGlow.position.y += 0.02;
      s3CracksGroup.add(cGlow);
    });
    scene3Group.add(s3CracksGroup);

    // 6. Topographic 3D LiDAR Contour Mapping (Engineering Elevation Rings)
    const s3ContourGroup = new THREE.Group();
    const contourLevels = [
      { y: 1.15, rScale: 1.0, col: 0xf59e0b, op: 0.7 }, // Level 1 (Lip)
      { y: 0.75, rScale: 0.78, col: 0xef4444, op: 0.8 }, // Level 2 (Base Course)
      { y: 0.45, rScale: 0.55, col: 0xef4444, op: 0.85 }, // Level 3 (Cavity)
      { y: 0.20, rScale: 0.32, col: 0xf43f5e, op: 0.9 }, // Level 4 (Bedrock Void)
    ];

    contourLevels.forEach((lvl) => {
      const ringPts = [];
      const numPts = 36;
      for (let k = 0; k <= numPts; k++) {
        const th = (k / numPts) * Math.PI * 2;
        const curR = (r1 * lvl.rScale) * (1 + 0.22 * Math.sin(th * 3 + 1.2) + 0.15 * Math.cos(th * 5 - 0.7));
        ringPts.push(new THREE.Vector3(cx1 + Math.cos(th) * curR, lvl.y, cz1 + Math.sin(th) * curR));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
      const ringLine = new THREE.Line(
        ringGeo,
        new THREE.LineBasicMaterial({ color: lvl.col, transparent: true, opacity: lvl.op, linewidth: 2 })
      );
      s3ContourGroup.add(ringLine);
    });
    scene3Group.add(s3ContourGroup);

    // 7. Holographic 3D Depth Gauge Ruler Standing in the Pothole
    const s3RulerGroup = new THREE.Group();
    s3RulerGroup.position.set(cx1 + 2.4, 0.2, cz1 + 1.2);
    // Vertical laser ruler rod
    const rulerRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    rulerRod.position.set(0, 1.1, 0);
    s3RulerGroup.add(rulerRod);

    // Ruler measurement cross-ticks (0cm, 5cm, 10cm, 14.5cm)
    for (let t = 0; t <= 4; t++) {
      const tick = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.03, 0.03),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      tick.position.set(0.18, 0.25 + t * 0.45, 0);
      s3RulerGroup.add(tick);
    }
    scene3Group.add(s3RulerGroup);

    // 8. 3D Precision AI Target Corner Brackets & Holographic Callouts
    const createTargetBrackets = (w, h, d, color = 0xef4444) => {
      const grp = new THREE.Group();
      const hw = w / 2, hh = h / 2, hd = d / 2;
      const cornerLen = 1.0;
      // 8 Corner brackets
      const corners = [
        [hw, hh, hd], [-hw, hh, hd], [hw, -hh, hd], [-hw, -hh, hd],
        [hw, hh, -hd], [-hw, hh, -hd], [hw, -hh, -hd], [-hw, -hh, -hd],
      ];
      corners.forEach(([x, y, z]) => {
        const sx = Math.sign(x), sy = Math.sign(y), sz = Math.sign(z);
        const pts = [
          new THREE.Vector3(x, y, z),
          new THREE.Vector3(x - sx * cornerLen, y, z),
          new THREE.Vector3(x, y, z),
          new THREE.Vector3(x, y - sy * cornerLen, z),
          new THREE.Vector3(x, y, z),
          new THREE.Vector3(x, y, z - sz * cornerLen),
        ];
        const cGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const cLine = new THREE.Line(cGeo, new THREE.LineBasicMaterial({ color, linewidth: 2 }));
        grp.add(cLine);
      });
      return grp;
    };

    const s3Target1 = createTargetBrackets(7.6, 3.6, 7.6, 0xef4444);
    s3Target1.position.set(cx1, 1.8, cz1);
    scene3Group.add(s3Target1);

    const s3Target2 = createTargetBrackets(4.6, 2.2, 4.6, 0xf59e0b);
    s3Target2.position.set(cx2, 1.4, cz2);
    scene3Group.add(s3Target2);

    // 9. Floating 3D AI Inspection Drone / LiDAR Scanner Node
    const s3DroneGroup = new THREE.Group();
    s3DroneGroup.position.set(cx1, 11.0, cz1);

    const s3DroneBody = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.75),
      new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true })
    );
    s3DroneGroup.add(s3DroneBody);

    const s3GimbalRing = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.2, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    s3DroneGroup.add(s3GimbalRing);
    scene3Group.add(s3DroneGroup);

    // 10. Conical 3D LiDAR Depth Scanning Laser Beam & Floor Reticle
    const s3LaserConeGeo = new THREE.CylinderGeometry(0.1, 2.8, 10.5, 24, 1, true);
    const s3LaserConeMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
    });
    const s3LaserCone = new THREE.Mesh(s3LaserConeGeo, s3LaserConeMat);
    s3LaserCone.position.set(cx1, 5.8, cz1);
    scene3Group.add(s3LaserCone);

    // Dynamic Reticle Rings on Cavity Floor
    const s3Reticle = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 1.8, 32),
      new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    s3Reticle.rotation.x = Math.PI / 2;
    s3Reticle.position.set(cx1, 0.35, cz1);
    scene3Group.add(s3Reticle);

    const s3InnerReticle = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 0.75, 24),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    s3InnerReticle.rotation.x = Math.PI / 2;
    s3InnerReticle.position.set(cx1, 0.36, cz1);
    scene3Group.add(s3InnerReticle);

    const s3Grid = new THREE.GridHelper(50, 25, 0xef4444, 0x3d1216);
    s3Grid.position.y = -0.1;
    scene3Group.add(s3Grid);

    // =========================================================================
    // SCENE BRIDGE: 🌉 CABLE-STAYED BRIDGE & RIVER VIADUCT INSPECTION
    // =========================================================================
    const sceneBridgeGroup = new THREE.Group();
    sceneBridgeGroup.scale.set(baseScale, baseScale, baseScale);
    sceneBridgeGroup.position.set(50, -3.5, 0);
    scene.add(sceneBridgeGroup);

    // 1. Reflective River Water Channel Base
    const bridgeWaterGeo = new THREE.PlaneGeometry(64, 48, 32, 32);
    const bridgeWaterMat = new THREE.MeshStandardMaterial({
      color: 0x071e33,
      roughness: 0.08,
      metalness: 0.92,
      transparent: true,
      opacity: 0.88,
    });
    const bridgeWater = new THREE.Mesh(bridgeWaterGeo, bridgeWaterMat);
    bridgeWater.rotation.x = -Math.PI / 2;
    bridgeWater.position.set(0, 0.2, 0);
    sceneBridgeGroup.add(bridgeWater);

    // 2. Suspended Bridge Roadway Deck (Length: 64, Width: 12, Height: 1.2 at y = 6.0)
    const bridgeDeckGeo = new THREE.BoxGeometry(64, 1.2, 12);
    const bridgeDeckMat = new THREE.MeshStandardMaterial({
      color: 0x1a1d24,
      roughness: 0.85,
      metalness: 0.25,
    });
    const bridgeDeck = new THREE.Mesh(bridgeDeckGeo, bridgeDeckMat);
    bridgeDeck.position.set(0, 6.0, 0);
    addEdges(bridgeDeck, new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 }));
    sceneBridgeGroup.add(bridgeDeck);

    // Painted Center Road Stripes on Bridge Deck
    for (let x = -30; x <= 30; x += 4) {
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.35), roadYellowMaterial);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(x, 6.62, 0);
      sceneBridgeGroup.add(stripe);
    }

    // Side Solid White Lane Markings
    const northLane = new THREE.Mesh(new THREE.PlaneGeometry(62, 0.25), roadMarkingMaterial);
    northLane.rotation.x = -Math.PI / 2;
    northLane.position.set(0, 6.62, -4.5);
    sceneBridgeGroup.add(northLane);

    const southLane = northLane.clone();
    southLane.position.set(0, 6.62, 4.5);
    sceneBridgeGroup.add(southLane);

    // Bridge Safety Guardrails & Steel Truss Edge Barriers
    const guardrailGeo = new THREE.BoxGeometry(64, 1.4, 0.3);
    const guardrailMat = new THREE.MeshStandardMaterial({ color: 0x3b4252, metalness: 0.85, roughness: 0.3 });
    const guardrailNorth = new THREE.Mesh(guardrailGeo, guardrailMat);
    guardrailNorth.position.set(0, 7.3, -5.85);
    addEdges(guardrailNorth);
    sceneBridgeGroup.add(guardrailNorth);

    const guardrailSouth = guardrailNorth.clone();
    guardrailSouth.position.set(0, 7.3, 5.85);
    addEdges(guardrailSouth);
    sceneBridgeGroup.add(guardrailSouth);

    // 3. Massive Concrete Bridge Pylons / H-Frame Towers (Tower 1 at x = -14, Tower 2 at x = 14)
    const towerPylonPositions = [-14, 14];
    const bridgeBeacons = [];

    towerPylonPositions.forEach((tx) => {
      // Left (North) Pylon Leg
      const legGeo = new THREE.BoxGeometry(2.2, 28, 1.8);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x2e3440, roughness: 0.4, metalness: 0.7 });
      
      const legNorth = new THREE.Mesh(legGeo, legMat);
      legNorth.position.set(tx, 14.0, -6.0);
      legNorth.rotation.z = tx < 0 ? -0.05 : 0.05; // Sleek angled architectural stance
      addEdges(legNorth, new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 }));
      sceneBridgeGroup.add(legNorth);

      // Right (South) Pylon Leg
      const legSouth = legNorth.clone();
      legSouth.position.set(tx, 14.0, 6.0);
      legSouth.rotation.z = tx < 0 ? -0.05 : 0.05;
      addEdges(legSouth, new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 }));
      sceneBridgeGroup.add(legSouth);

      // Upper Crossbeam Strut
      const upperCross = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 14), legMat);
      upperCross.position.set(tx, 24.5, 0);
      addEdges(upperCross);
      sceneBridgeGroup.add(upperCross);

      // Mid Crossbeam (Under deck support)
      const midCross = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 14.5), legMat);
      midCross.position.set(tx, 5.0, 0);
      addEdges(midCross);
      sceneBridgeGroup.add(midCross);

      // Massive Underwater Foundation Pier
      const pierBase = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 3.2, 7, 16),
        new THREE.MeshStandardMaterial({ color: 0x1f232b, roughness: 0.9 })
      );
      pierBase.position.set(tx, 1.5, 0);
      addEdges(pierBase);
      sceneBridgeGroup.add(pierBase);

      // Pylon Top Spire Beacons
      const bGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const bMeshNorth = new THREE.Mesh(bGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      bMeshNorth.position.set(tx, 28.5, -6.0);
      sceneBridgeGroup.add(bMeshNorth);
      bridgeBeacons.push(bMeshNorth);

      const bMeshSouth = bMeshNorth.clone();
      bMeshSouth.position.set(tx, 28.5, 6.0);
      sceneBridgeGroup.add(bMeshSouth);
      bridgeBeacons.push(bMeshSouth);
    });

    // 4. High-Tension Stay Cables (Cable-Stayed Symmetrical Fan Array)
    const bridgeStayCables = [];
    const cableAnchorPoints = [-28, -24, -20, -16, -8, -4, 0, 4, 8, 16, 20, 24, 28];

    cableAnchorPoints.forEach((dx) => {
      // Connect to nearest Tower (Tower 1 at -14, Tower 2 at +14)
      const targetTowerX = dx < 0 ? -14 : 14;
      if (Math.abs(dx - targetTowerX) < 2) return; // skip center pillar pass

      const cableTopNorth = new THREE.Vector3(targetTowerX, 24.5, -5.8);
      const cableTopSouth = new THREE.Vector3(targetTowerX, 24.5, 5.8);
      const cableBottomNorth = new THREE.Vector3(dx, 6.6, -5.6);
      const cableBottomSouth = new THREE.Vector3(dx, 6.6, 5.6);

      // North Stay Cable
      const cGeoN = new THREE.BufferGeometry().setFromPoints([cableTopNorth, cableBottomNorth]);
      const cMatN = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85, linewidth: 2 });
      const lineN = new THREE.Line(cGeoN, cMatN);
      sceneBridgeGroup.add(lineN);
      bridgeStayCables.push(lineN);

      // South Stay Cable
      const cGeoS = new THREE.BufferGeometry().setFromPoints([cableTopSouth, cableBottomSouth]);
      const lineS = new THREE.Line(cGeoS, cMatN);
      sceneBridgeGroup.add(lineS);
      bridgeStayCables.push(lineS);
    });

    // 5. Sweeping LiDAR Bridge Deck Laser Scanning Plane
    const bridgeLiDARGeo = new THREE.BoxGeometry(2.5, 12, 14);
    const bridgeLiDARMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
    });
    const bridgeLiDAR = new THREE.Mesh(bridgeLiDARGeo, bridgeLiDARMat);
    bridgeLiDAR.position.set(0, 9.0, 0);
    sceneBridgeGroup.add(bridgeLiDAR);

    // AI Bridge Structural Health Monitoring (SHM) Bounding Boxes
    const bridgeBox1 = createAIBoundingBox(5.5, 26, 14, 0x38bdf8);
    bridgeBox1.position.set(-14, 14, 0);
    sceneBridgeGroup.add(bridgeBox1);

    const bridgeBox2 = createAIBoundingBox(5.5, 26, 14, 0x38bdf8);
    bridgeBox2.position.set(14, 14, 0);
    sceneBridgeGroup.add(bridgeBox2);

    const bridgeGrid = new THREE.GridHelper(70, 35, 0x38bdf8, 0x16344d);
    bridgeGrid.position.y = -0.1;
    sceneBridgeGroup.add(bridgeGrid);

    // =========================================================================
    // SCENE 4: ⚡ UTILITY POLES & SAGGING HIGH-VOLTAGE 440V POWER LINES
    // =========================================================================
    const scene4Group = new THREE.Group();
    scene4Group.scale.set(baseScale, baseScale, baseScale);
    scene4Group.position.set(50, -3.5, 0);
    scene.add(scene4Group);

    // Road Foundation Base for Utility Corridor
    const s4Ground = new THREE.Mesh(new THREE.BoxGeometry(28, 0.8, 36), asphaltMaterial);
    s4Ground.position.set(0, 0.4, 0);
    addEdges(s4Ground);
    scene4Group.add(s4Ground);

    // Utility Concrete Poles (Left & Right)
    const pole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.55, 22, 12), metalPoleMaterial);
    pole1.position.set(-10, 11.4, 0);
    addEdges(pole1);
    scene4Group.add(pole1);

    const pole2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.55, 22, 12), metalPoleMaterial);
    pole2.position.set(10, 11.4, 0);
    addEdges(pole2);
    scene4Group.add(pole2);

    // Crossarm Beams at Pole Tops
    const crossarmGeo = new THREE.BoxGeometry(0.3, 0.4, 5.5);
    const crossarm1 = new THREE.Mesh(crossarmGeo, metalPoleMaterial);
    crossarm1.position.set(-10, 21, 0);
    scene4Group.add(crossarm1);

    const crossarm2 = new THREE.Mesh(crossarmGeo, metalPoleMaterial);
    crossarm2.position.set(10, 21, 0);
    scene4Group.add(crossarm2);

    // Ceramic Insulator Bells
    const insulatorGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.9, 8);
    const insulatorMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.1 });
    const wireOffsetsZ = [-2.2, 0, 2.2];

    wireOffsetsZ.forEach((zOff) => {
      const ins1 = new THREE.Mesh(insulatorGeo, insulatorMat);
      ins1.position.set(-10, 20.4, zOff);
      scene4Group.add(ins1);

      const ins2 = new THREE.Mesh(insulatorGeo, insulatorMat);
      ins2.position.set(10, 20.4, zOff);
      scene4Group.add(ins2);
    });

    // Transformer Drum on Pole 1
    const transGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.2, 16);
    const transMesh = new THREE.Mesh(
      transGeo,
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.4 })
    );
    transMesh.position.set(-8.5, 14.5, 0);
    addEdges(transMesh, new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 }));
    scene4Group.add(transMesh);

    // Catenary Sagging Power Wires (3 Parallel Lines, Center Line with SEVERE SAG)
    const s4Wires = [];
    const wireConfigs = [
      { z: -2.2, sag: 2.8, color: 0xffffff, hazard: false },
      { z: 0, sag: 8.8, color: 0xf59e0b, hazard: true }, // Severe Sagging 440V Cable
      { z: 2.2, sag: 3.2, color: 0xffffff, hazard: false },
    ];

    wireConfigs.forEach((wCfg) => {
      const points = [];
      const numSegments = 32;
      for (let i = 0; i <= numSegments; i++) {
        const t = i / numSegments;
        const x = -10 + t * 20;
        // Parabolic catenary sag: y = 20 - 4 * sag * t * (1 - t)
        const y = 20.2 - 4 * wCfg.sag * t * (1 - t);
        points.push(new THREE.Vector3(x, y, wCfg.z));
      }
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const wireMat = new THREE.LineBasicMaterial({
        color: wCfg.color,
        linewidth: wCfg.hazard ? 3 : 1.5,
      });
      const wireLine = new THREE.Line(curveGeo, wireMat);
      scene4Group.add(wireLine);
      s4Wires.push({ mesh: wireLine, cfg: wCfg, points });
    });

    // AI Sag Clearance Measurement Laser Line (Vertical laser measuring clearance gap to ground)
    const s4SagLaserGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 11.4, 0), // Mid-point of sagging wire
      new THREE.Vector3(0, 0.8, 0), // Ground impact point
    ]);
    const s4SagLaser = new THREE.Line(
      s4SagLaserGeo,
      new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 })
    );
    scene4Group.add(s4SagLaser);

    // Ground Clearance Violation Bounding Box
    const s4Box = createAIBoundingBox(8.5, 8.5, 4.5, 0xf59e0b);
    s4Box.position.set(0, 8.5, 0);
    scene4Group.add(s4Box);

    // Electrical Spark Particles / Glow Orbs along the wire
    const s4Sparks = [];
    for (let i = 0; i < 4; i++) {
      const spark = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
      );
      spark.position.set(-4 + i * 2.8, 13.5 - Math.sin(i) * 1.5, 0);
      scene4Group.add(spark);
      s4Sparks.push(spark);
    }

    const s4Grid = new THREE.GridHelper(50, 25, 0xf59e0b, 0x3d2b0f);
    s4Grid.position.y = -0.1;
    scene4Group.add(s4Grid);

    // =========================================================================
    // SCENE 5: 🏚️ BROKEN BUILDING & CRITICAL STRUCTURAL FRACTURE
    // =========================================================================
    const scene5Group = new THREE.Group();
    scene5Group.scale.set(baseScale, baseScale, baseScale);
    scene5Group.position.set(50, -3.5, 0);
    scene.add(scene5Group);

    // Concrete Damaged Building Block
    const brokenConcreteMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      roughness: 0.85,
      metalness: 0.3,
    });

    const s5MainBuilding = new THREE.Mesh(new THREE.BoxGeometry(14, 24, 12), brokenConcreteMat);
    s5MainBuilding.position.set(0, 12, 0);
    addEdges(s5MainBuilding, new THREE.LineBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.6 }));
    scene5Group.add(s5MainBuilding);

    // Collapsed / Fractured Upper Wing
    const s5CollapsedWing = new THREE.Mesh(new THREE.BoxGeometry(8, 10, 8), brokenConcreteMat);
    s5CollapsedWing.position.set(7.5, 8, 2);
    s5CollapsedWing.rotation.set(0.18, -0.22, -0.28); // Tilted collapsed angle
    addEdges(s5CollapsedWing, new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 }));
    scene5Group.add(s5CollapsedWing);

    // Exposed Steel I-Beams / Rebar Mesh protruding from fracture
    for (let i = 0; i < 5; i++) {
      const rebar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 5.5, 6),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 })
      );
      rebar.position.set(4.5 + i * 0.8, 16 - i * 1.2, 5.8);
      rebar.rotation.set(0.4, 0.2 + i * 0.1, -0.6);
      scene5Group.add(rebar);
    }

    // Displaced Concrete Rubble Blocks on ground
    const rubblePositions = [
      { x: 5, y: 1.2, z: 7, s: 1.6, r: [0.3, 0.4, 0.1] },
      { x: 8, y: 0.9, z: 5, s: 1.2, r: [-0.2, 0.5, 0.4] },
      { x: 3, y: 0.6, z: 9, s: 1.0, r: [0.5, -0.3, 0.2] },
      { x: -5, y: 1.0, z: 6, s: 1.4, r: [0.1, -0.2, 0.3] },
    ];
    rubblePositions.forEach((r) => {
      const rb = new THREE.Mesh(new THREE.BoxGeometry(r.s, r.s, r.s), brokenConcreteMat);
      rb.position.set(r.x, r.y, r.z);
      rb.rotation.set(...r.r);
      addEdges(rb, new THREE.LineBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.5 }));
      scene5Group.add(rb);
    });

    // Deep Structural Shear Fissure / Crack System
    const s5CrackGroup = new THREE.Group();
    const primaryShearCrack = [
      new THREE.Vector3(-4.5, 3.5, 6.05),
      new THREE.Vector3(-3.2, 7.8, 6.05),
      new THREE.Vector3(-3.8, 10.2, 6.05),
      new THREE.Vector3(-1.8, 14.5, 6.05),
      new THREE.Vector3(-0.6, 17.0, 6.05),
      new THREE.Vector3(1.2, 19.8, 6.05),
      new THREE.Vector3(2.8, 22.5, 6.05),
      new THREE.Vector3(4.2, 25.0, 6.05),
    ];
    const s5CrackGeo = new THREE.BufferGeometry().setFromPoints(primaryShearCrack);
    const s5CrackLine = new THREE.Line(
      s5CrackGeo,
      new THREE.LineBasicMaterial({ color: 0xf43f5e, linewidth: 3 })
    );
    s5CrackGroup.add(s5CrackLine);

    // Glowing Amber Sub-Crack Aura
    const s5GlowLine = new THREE.Line(
      s5CrackGeo,
      new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.85 })
    );
    s5GlowLine.position.z += 0.06;
    s5CrackGroup.add(s5GlowLine);
    scene5Group.add(s5CrackGroup);

    // AI Structural Bounding Box encompassing defect
    const s5Box = createAIBoundingBox(16, 26, 14, 0xf43f5e);
    s5Box.position.set(2, 13, 1);
    scene5Group.add(s5Box);

    // Blinking Warning Beacon
    const s5Beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e })
    );
    s5Beacon.position.set(-0.6, 17.0, 6.4);
    scene5Group.add(s5Beacon);

    const s5Grid = new THREE.GridHelper(60, 30, 0xf43f5e, 0x40121a);
    s5Grid.position.y = -0.1;
    scene5Group.add(s5Grid);

    // Group Array (6 Total Infrastructure Inspection Scenes)
    const sceneGroups = [
      scene1Group,
      scene2Group,
      scene3Group,
      sceneBridgeGroup,
      scene4Group,
      scene5Group,
    ];

    // =========================================================================
    // 5. INTERACTION: MOUSE PARALLAX
    // =========================================================================
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.00025;
      mouseY = (e.clientY - windowHalfY) * 0.00025;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // =========================================================================
    // 6. RESIZE HANDLER
    // =========================================================================
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      const responsiveScale = width < 768 ? 0.6 : 0.75;
      sceneGroups.forEach((g) => g.scale.set(responsiveScale, responsiveScale, responsiveScale));
    };
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // 7. MASTER ANIMATION & SLIDE-RIGHT TRANSITION ENGINE
    // =========================================================================
    let animationFrameId;
    let clock = new THREE.Clock();
    let virtualTime = 0;

    // Smoothstep interpolation helper
    const smoothstep = (min, max, value) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      virtualTime += delta;

      // Handle manual scene jump if requested
      if (manualOverrideRef.current !== null) {
        virtualTime = manualOverrideRef.current * SCENE_DURATION + 0.1;
        manualOverrideRef.current = null;
      }

      const totalLoopTime = virtualTime % TOTAL_CYCLE;
      const currentIdx = Math.floor(totalLoopTime / SCENE_DURATION);
      const nextIdx = (currentIdx + 1) % SCENES_METADATA.length;
      const timeInCurrentScene = totalLoopTime % SCENE_DURATION;

      // Transition Window Calculation (Last 1.6s of the 10s block)
      const transitionStartTime = SCENE_DURATION - TRANSITION_DURATION;
      const isTransitioning = timeInCurrentScene >= transitionStartTime;

      const SLIDE_DISTANCE = 52; // Units to translate on X axis

      sceneGroups.forEach((group, idx) => {
        if (idx === currentIdx) {
          group.visible = true;
          if (isTransitioning) {
            // Outgoing scene smoothly slides off to the RIGHT (+X)
            const progress = smoothstep(transitionStartTime, SCENE_DURATION, timeInCurrentScene);
            group.position.x = progress * SLIDE_DISTANCE;
            group.position.z = -progress * 6;
            group.rotation.y = (virtualTime * 0.08) * (1 - progress);
          } else {
            // Active stationary scene
            group.position.x = 0;
            group.position.z = 0;
            group.rotation.y += 0.003; // Gentle inspection rotation
          }
        } else if (idx === nextIdx && isTransitioning) {
          // Incoming scene smoothly slides in from the LEFT (-X) to 0
          group.visible = true;
          const progress = smoothstep(transitionStartTime, SCENE_DURATION, timeInCurrentScene);
          group.position.x = -SLIDE_DISTANCE * (1 - progress);
          group.position.z = -(1 - progress) * 6;
          group.rotation.y = 0;
        } else {
          // Inactive scene hidden for performance
          group.visible = false;
          group.position.x = -SLIDE_DISTANCE * 2;
        }
      });

      // Update Dynamic Lighting according to active scene
      const activeColor = new THREE.Color(SCENES_METADATA[currentIdx].color);
      dynamicPointLight.color.lerp(activeColor, 0.08);

      // Mouse Parallax
      targetRotationY += (mouseX - targetRotationY) * 0.04;
      targetRotationX += (mouseY - targetRotationX) * 0.04;
      camera.position.x = Math.sin(targetRotationY * 4) * 3.5;
      camera.position.y = 14 + targetRotationX * 5;
      camera.lookAt(0, 7, 0);

      // -------------------------------------------------------------
      // Dynamic In-Scene Animations:
      // -------------------------------------------------------------
      // Scene 1: LiDAR Plane & Spire Pulse
      s1ScanPlane.position.y = 14 + Math.sin(virtualTime * 1.8) * 14;
      s1Radar.rotation.z += 0.01;
      const pulse1 = 1 + Math.sin(virtualTime * 5) * 0.35;
      s1Beacon.scale.set(pulse1, pulse1, pulse1);

      // Scene 2: Road Longitudinal LiDAR Sweep & Lights
      s2LiDARScan.position.z = Math.sin(virtualTime * 1.5) * 26;
      s2LightBulbs.forEach((bulb, i) => {
        const bPulse = 0.85 + Math.sin(virtualTime * 4 + i) * 0.15;
        bulb.scale.set(bPulse, bPulse, bPulse);
      });

      // Scene 3: Realistic 3D Pothole Depth Laser Probing & Drone Scanner
      const depthOsc = Math.sin(virtualTime * 3);
      s3DroneGroup.rotation.y += 0.018;
      s3GimbalRing.rotation.x += 0.025;
      s3LaserCone.material.opacity = 0.12 + Math.sin(virtualTime * 5) * 0.05;
      s3Reticle.scale.set(1 + depthOsc * 0.18, 1 + depthOsc * 0.18, 1);
      s3Reticle.rotation.z += 0.015;
      s3InnerReticle.rotation.z -= 0.025;

      // Scene Bridge: Pylon Beacons & Sweeping LiDAR Scan
      bridgeLiDAR.position.x = Math.sin(virtualTime * 1.6) * 24;
      bridgeBeacons.forEach((beacon, i) => {
        const bScale = 1 + Math.sin(virtualTime * 5 + i * 1.5) * 0.35;
        beacon.scale.set(bScale, bScale, bScale);
      });

      // Scene 4: Sagging Wires Vibration & Sparks
      s4Sparks.forEach((sp, i) => {
        const sPulse = 0.8 + Math.sin(virtualTime * 8 + i * 2) * 0.5;
        sp.scale.set(sPulse, sPulse, sPulse);
      });

      // Scene 5: Broken Building Warning Beacon
      const s5Pulse = 1 + Math.sin(virtualTime * 6) * 0.45;
      s5Beacon.scale.set(s5Pulse, s5Pulse, s5Pulse);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 select-none pointer-events-none">
      {/* Pure 3D WebGL Canvas Background */}
      <div
        ref={containerRef}
        className="w-full h-full pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
};

export default Building3DBackground;
