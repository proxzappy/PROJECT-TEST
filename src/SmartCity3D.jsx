import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createCitySimulation } from "./useCitySimulation.js";

/* ═══════════════════════════════════════════
   LOCATIONS CONFIG
   ═══════════════════════════════════════════ */
export const LOCATIONS = {
  school: {
    key: "school", label: "American High School", icon: "🏫", type: "EDUCATION",
    position: [-600, 5, -600], camHeight: 380, camDistance: 330,
    info: "Modern high school.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  hospital: {
    key: "hospital", label: "Smart Hospital", icon: "🏥", type: "HEALTHCARE",
    position: [600, 5, -600], camHeight: 380, camDistance: 330,
    info: "Smart healthcare.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  society: {
    key: "society", label: "BSS Smart Society", icon: "🏘", type: "RESIDENTIAL",
    position: [-600, 5, 600], camHeight: 380, camDistance: 330,
    info: "Residential community.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  bank: {
    key: "bank", label: "Smart City State Bank", icon: "🏦", type: "FINANCIAL",
    position: [600, 5, 600], camHeight: 380, camDistance: 330,
    info: "Smart banking.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  farm: {
    key: "farm", label: "Smart Eco Farm", icon: "🌾", type: "AGRICULTURE",
    position: [1800, 5, -600], camHeight: 420, camDistance: 420,
    info: "Sustainable farming.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  marriageHall: {
    key: "marriageHall", label: "Marriage Hall", icon: "💒", type: "EVENT VENUE",
    position: [600, 5, 1800], camHeight: 380, camDistance: 380,
    info: "Grand marriage hall.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  carWash: {
    key: "carWash", label: "Car Wash · Gas Station", icon: "🚗", type: "AUTOMOTIVE",
    position: [1800, 5, 1750], camHeight: 420, camDistance: 420,
    info: "Big gas station + car wash.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  powerSupply: {
    key: "powerSupply", label: "Power Supply Zone", icon: "⚡", type: "RENEWABLE",
    position: [-3600, 5, 3600], camHeight: 800, camDistance: 900,
    info: "16 turbines, 10 solar arrays, 10 batteries.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  filtration: {
    key: "filtration", label: "Filtration System", icon: "💧", type: "WATER TREATMENT",
    position: [3600, 5, -3600], camHeight: 420, camDistance: 380,
    info: "Filtration machine inside glass box.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
      { name: "Inside Machine", inside: true },
    ],
  },
  fertilizer: {
    key: "fertilizer", label: "AI Fertilizer System", icon: "🌱", type: "FERTILIZER MANAGEMENT",
    position: [-3600, 5, -3600], camHeight: 450, camDistance: 480,
    info: "AI fertilizer management.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  wasteManagement: {
    key: "wasteManagement", label: "Waste Management", icon: "♻", type: "MUNICIPAL",
    position: [3600, 5, 3600], camHeight: 450, camDistance: 480,
    info: "Waste management facility with containers, trucks & recycling machine.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  sewageCompany: {
    key: "sewageCompany", label: "Sewage & Filtration Co.", icon: "🏭", type: "INDUSTRIAL",
    position: [1800, 5, 600], camHeight: 400, camDistance: 400,
    info: "Water treatment plant.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  trafficController: {
    key: "trafficController", label: "AI Traffic Controller", icon: "🤖", type: "TRANSPORTATION",
    position: [0, 5, 0], camHeight: 320, camDistance: 280,
    info: "Monitors 4 city entry routes.",
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
};

/* ═══════════════════════════════════════════
   MAIN 3D COMPONENT
   ═══════════════════════════════════════════ */
const SmartCity3D = forwardRef((props, ref) => {
  const { onPanel, onTrafficUpdate, onSimTime, onCycleUpdate, onAiMessage, onAiReason } = props;
  const mountRef = useRef(null);
  const sceneRef = useRef({
    camera: null, controls: null, renderer: null, scene: null,
    isLocked: false, lockedLocation: null, followTarget: null,
    savedCamPos: null, savedCamTarget: null, camTransition: null,
    trucks: {}, people: [], cityCars: [], trafficLights: [],
    turbines: [], streetBulbMats: [], batteryRings: [],
    waterParticles: [], cameras: [], clickable: [],
    controller: null, radar: null, controllerRing: null, controllerRing2: null,
    controllerSig: null, garbageWarn: null, fertWarn1: null, fertWarn2: null,
    grassMaterial: null, roadMaterial: null, roadLaneMaterial: null,
    curbMaterial: null, sidewalkMat: null, ambient: null, sun: null,
    scene_: null,
  });

  useImperativeHandle(ref, () => ({
    getLocations: () => Object.values(LOCATIONS),
    goToLocation: (key, onLabel) => goToLocation(key, onLabel),
    goToLocationCamera: (key, camName, onLabel) => goToLocationCamera(key, camName, onLabel),
    exitCameraView: () => exitCameraView(),
    followVehicle: (key, onText) => followVehicle(key, onText),
    goToOverview: () => goToOverview(),
    goToTopDown: () => goToTopDown(),
    setDayNight: (night) => setDayNight(night),
  }));

  /* ───── Camera helpers ───── */
  function smoothCameraTo(targetPos, targetLook, duration = 1400) {
    const s = sceneRef.current;
    s.camTransition = {
      startPos: s.camera.position.clone(),
      targetPos,
      startLook: s.controls.target.clone(),
      targetLook,
      startTime: performance.now(),
      duration,
    };
  }

  function goToLocation(key, onLabel) {
    const loc = LOCATIONS[key];
    if (!loc) return;
    const s = sceneRef.current;
    s.isLocked = true;
    s.lockedLocation = key;
    s.followTarget = null;
    s.savedCamPos = s.camera.position.clone();
    s.savedCamTarget = s.controls.target.clone();
    const [x, y, z] = loc.position;
    smoothCameraTo(
      new THREE.Vector3(x + loc.camDistance * 0.7, loc.camHeight, z + loc.camDistance * 0.7),
      new THREE.Vector3(x, y, z)
    );
    s.controls.enableRotate = false;
    onLabel?.(loc.label);
  }

  function goToLocationCamera(key, camName, onLabel) {
    const loc = LOCATIONS[key];
    if (!loc) return;
    const cam = loc.cameras.find((c) => c.name === camName);
    if (!cam) return;
    const s = sceneRef.current;
    s.isLocked = true;
    s.lockedLocation = key;
    s.followTarget = null;
    s.savedCamPos = s.camera.position.clone();
    s.savedCamTarget = s.controls.target.clone();
    const [x, y, z] = loc.position;
    let camPos, lookAt;
    if (cam.inside) {
      camPos = new THREE.Vector3(x - 80, y + 60, z - 80);
      lookAt = new THREE.Vector3(x, y + 25, z);
    } else if (cam.top) {
      camPos = new THREE.Vector3(x, y + loc.camHeight * 1.8, z + 10);
      lookAt = new THREE.Vector3(x, y, z);
    } else {
      camPos = new THREE.Vector3(
        x + Math.sin(cam.angle) * loc.camDistance,
        y + loc.camHeight * 0.5,
        z + Math.cos(cam.angle) * loc.camDistance
      );
      lookAt = new THREE.Vector3(x, y, z);
    }
    smoothCameraTo(camPos, lookAt);
    s.controls.enableRotate = false;
    onLabel?.(loc.label);
  }

  function exitCameraView() {
    const s = sceneRef.current;
    s.isLocked = false;
    s.lockedLocation = null;
    s.followTarget = null;
    if (s.savedCamPos && s.savedCamTarget) {
      smoothCameraTo(s.savedCamPos, s.savedCamTarget);
    }
    s.controls.enableRotate = true;
  }

  function followVehicle(key, onText) {
    const s = sceneRef.current;
    s.isLocked = false;
    s.lockedLocation = null;
    if (key === "garbageTruck") s.followTarget = s.trucks.garbage;
    else if (key === "fertTruck1") s.followTarget = s.trucks.fert1;
    else if (key === "fertTruck2") s.followTarget = s.trucks.fert2;
    else s.followTarget = null;

    if (s.followTarget) {
      smoothCameraTo(
        s.followTarget.position.clone().add(new THREE.Vector3(120, 90, 120)),
        s.followTarget.position.clone(),
        1200
      );
      onText?.("🎥 FOLLOWING — " + key.toUpperCase());
    } else {
      smoothCameraTo(new THREE.Vector3(0, 2000, 2000), new THREE.Vector3(0, 0, 0), 1500);
      onText?.("🌐 WATCHING CITY CARS");
    }
    s.controls.enableRotate = true;
  }

  function goToOverview() {
    const s = sceneRef.current;
    s.isLocked = false;
    s.lockedLocation = null;
    s.followTarget = null;
    s.controls.enableRotate = true;
    smoothCameraTo(new THREE.Vector3(1400, 950, 1400), new THREE.Vector3(0, 5, 0), 1500);
  }

  function goToTopDown() {
    const s = sceneRef.current;
    s.isLocked = false;
    s.lockedLocation = null;
    s.followTarget = null;
    s.controls.enableRotate = true;
    smoothCameraTo(new THREE.Vector3(0, 2800, 500), new THREE.Vector3(0, 0, 0), 1500);
  }

  function setDayNight(night) {
    const s = sceneRef.current;
    const DAY_BG = new THREE.Color(0xa9dcf4);
    const NIGHT_BG = new THREE.Color(0x050810);
    if (night) {
      s.scene.background = NIGHT_BG.clone();
      s.scene.fog = new THREE.Fog(0x050810, 3500, 10000);
      s.ambient.intensity = 0.35;
      s.sun.intensity = 0.1;
    } else {
      s.scene.background = DAY_BG.clone();
      s.scene.fog = new THREE.Fog(0xa9dcf4, 3500, 10000);
      s.ambient.intensity = 3.7;
      s.sun.intensity = 3.5;
    }
    s.grassMaterial.color.setHex(night ? 0x14241a : 0x4d8f50);
    s.roadMaterial.color.setHex(night ? 0x080a0c : 0x20272a);
    s.roadLaneMaterial.color.setHex(night ? 0x060809 : 0x1a2023);
    s.curbMaterial.color.setHex(night ? 0x1e262a : 0x697578);
    s.sidewalkMat.color.setHex(night ? 0x30363a : 0x8a8f94);
    s.streetBulbMats.forEach((m) => { m.emissiveIntensity = night ? 6.0 : 0.9; });
    s.batteryRings.forEach((m) => { m.emissiveIntensity = night ? 5.0 : 1.5; });
  }

  /* ═══════════════════════════════════════════
     MAIN EFFECT — SCENE SETUP
     ═══════════════════════════════════════════ */
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const s = sceneRef.current;

    /* ───── SCENE ───── */
    const scene = new THREE.Scene();
    s.scene = scene;
    s.scene_ = scene;
    scene.background = new THREE.Color(0xa9dcf4);
    scene.fog = new THREE.Fog(0xa9dcf4, 3500, 10000);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 5, 15000);
    camera.position.set(1400, 950, 1400);
    s.camera = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    s.renderer = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.minDistance = 200;
    controls.maxDistance = 6000;
    controls.target.set(0, 5, 0);
    s.controls = controls;

    /* ───── LIGHTS ───── */
    const ambient = new THREE.HemisphereLight(0xf8fcff, 0x315c38, 3.7);
    scene.add(ambient);
    s.ambient = ambient;
    const sun = new THREE.DirectionalLight(0xffffff, 3.5);
    sun.position.set(-800, 1400, 500);
    scene.add(sun);
    s.sun = sun;

    /* ───── MATERIALS ───── */
    const mat = (c, r = 0.8, m = 0) =>
      new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
    const grassMaterial = mat(0x4d8f50, 0.98);
    const roadMaterial = mat(0x20272a, 0.96);
    const roadLaneMaterial = mat(0x1a2023, 0.96);
    const yellowLineMaterial = mat(0xf5c84b, 0.65);
    const whiteLineMaterial = mat(0xffffff, 0.65);
    const curbMaterial = mat(0x697578, 0.88);
    const darkMaterial = mat(0x182327, 0.65, 0.15);
    const blueMaterial = mat(0x087fa8, 0.35, 0.25);
    const sidewalkMat = mat(0x8a8f94, 0.9);
    s.grassMaterial = grassMaterial;
    s.roadMaterial = roadMaterial;
    s.roadLaneMaterial = roadLaneMaterial;
    s.curbMaterial = curbMaterial;
    s.sidewalkMat = sidewalkMat;

    /* ───── GROUND ───── */
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), grassMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    /* ───── ROADS ───── */
    const ROAD_W = 90;
    const ROAD_HALF = ROAD_W / 2;
    const ROAD_LEN = 9600;
    const roadZs = [-2400, -1200, 0, 1200, 2400];
    const roadXs = [-2400, -1200, 0, 1200, 2400];

    function makeRoadE(x, z, length) {
      const shoulder = new THREE.Mesh(new THREE.BoxGeometry(length, 0.25, ROAD_W + 10), roadLaneMaterial);
      shoulder.position.set(x, 4.55, z);
      scene.add(shoulder);
      const r = new THREE.Mesh(new THREE.BoxGeometry(length, 0.45, ROAD_W), roadMaterial);
      r.position.set(x, 4.7, z);
      scene.add(r);
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(length, 0.1, 1.6), yellowLineMaterial);
      c1.position.set(x, 5, z - 2);
      scene.add(c1);
      const c2 = c1.clone(); c2.position.z = z + 2; scene.add(c2);
      const topLine = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 1.2), whiteLineMaterial);
      topLine.position.set(x, 5.05, z + ROAD_HALF - 5);
      scene.add(topLine);
      const botLine = topLine.clone();
      botLine.position.z = z - ROAD_HALF + 5;
      scene.add(botLine);
      for (let lx = x - length / 2 + 20; lx < x + length / 2 - 10; lx += 55) {
        const d1 = new THREE.Mesh(new THREE.BoxGeometry(25, 0.09, 0.6), whiteLineMaterial);
        d1.position.set(lx, 5.06, z + ROAD_HALF / 2);
        scene.add(d1);
        const d2 = d1.clone(); d2.position.z = z - ROAD_HALF / 2; scene.add(d2);
      }
    }

    function makeRoadN(x, z, length) {
      const shoulder = new THREE.Mesh(new THREE.BoxGeometry(ROAD_W + 10, 0.25, length), roadLaneMaterial);
      shoulder.position.set(x, 4.55, z);
      scene.add(shoulder);
      const r = new THREE.Mesh(new THREE.BoxGeometry(ROAD_W, 0.45, length), roadMaterial);
      r.position.set(x, 4.7, z);
      scene.add(r);
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, length), yellowLineMaterial);
      c1.position.set(x - 2, 5, z);
      scene.add(c1);
      const c2 = c1.clone(); c2.position.x = x + 2; scene.add(c2);
      const leftLine = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, length), whiteLineMaterial);
      leftLine.position.set(x - ROAD_HALF + 5, 5.05, z);
      scene.add(leftLine);
      const rightLine = leftLine.clone();
      rightLine.position.x = x + ROAD_HALF - 5;
      scene.add(rightLine);
      for (let lz = z - length / 2 + 20; lz < z + length / 2 - 10; lz += 55) {
        const d1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.09, 25), whiteLineMaterial);
        d1.position.set(x + ROAD_HALF / 2, 5.06, lz);
        scene.add(d1);
        const d2 = d1.clone(); d2.position.x = x - ROAD_HALF / 2; scene.add(d2);
      }
    }

    roadZs.forEach((z) => makeRoadE(0, z, ROAD_LEN));
    roadXs.forEach((x) => makeRoadN(x, 0, ROAD_LEN));

    /* Sidewalks */
    roadZs.forEach((z) => {
      const s1 = new THREE.Mesh(new THREE.BoxGeometry(ROAD_LEN, 0.3, 8), sidewalkMat);
      s1.position.set(0, 5.05, z + ROAD_HALF + 8); scene.add(s1);
      const s2 = s1.clone(); s2.position.z = z - ROAD_HALF - 8; scene.add(s2);
    });
    roadXs.forEach((x) => {
      const s1 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.3, ROAD_LEN), sidewalkMat);
      s1.position.set(x + ROAD_HALF + 8, 5.05, 0); scene.add(s1);
      const s2 = s1.clone(); s2.position.x = x - ROAD_HALF - 8; scene.add(s2);
    });

    /* ───── BORDER ───── */
    function buildingBorder(x, z, w, d, color = 0x22cfff) {
      const bMat = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 1.8, metalness: 0.6, roughness: 0.25,
      });
      const front = new THREE.Mesh(new THREE.BoxGeometry(w + 12, 1.6, 4), bMat);
      front.position.set(x, 6, z + d / 2 + 6); scene.add(front);
      const back = front.clone(); back.position.z = z - d / 2 - 6; scene.add(back);
      const left = new THREE.Mesh(new THREE.BoxGeometry(4, 1.6, d + 12), bMat);
      left.position.set(x - w / 2 - 6, 6, z); scene.add(left);
      const right = left.clone(); right.position.x = x + w / 2 + 6; scene.add(right);
      for (const cx of [-1, 1]) for (const cz of [-1, 1]) {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3, 12, 8), bMat);
        p.position.set(x + cx * (w / 2 + 6), 11, z + cz * (d / 2 + 6)); scene.add(p);
        const cap = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: color, emissiveIntensity: 3 }));
        cap.position.set(x + cx * (w / 2 + 6), 18, z + cz * (d / 2 + 6)); scene.add(cap);
      }
    }

    /* ───── BOARD ───── */
    function board(text, x, y, z, w = 80, h = 12, color) {
      const g = new THREE.Group();
      g.position.set(x, y, z);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 14, 6), darkMaterial);
      pole.position.y = 7; g.add(pole);
      const bMat = color ? mat(color, 0.35, 0.25) : blueMaterial;
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.9), bMat);
      b.position.y = 12; g.add(b);
      const c = document.createElement("canvas");
      c.width = 1400; c.height = 350;
      const ctx = c.getContext("2d");
      ctx.fillStyle = color ? "#" + color.toString(16).padStart(6, "0") : "#075c7b";
      ctx.fillRect(0, 0, 1400, 350);
      ctx.strokeStyle = "#78e9ff"; ctx.lineWidth = 12;
      ctx.strokeRect(10, 10, 1380, 330);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 82px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, 700, 175);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(w - 1, h - 0.8),
        new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
      sMesh.position.set(0, 12, 0.5); g.add(sMesh);
      scene.add(g);
    }

    /* ───── STREET LIGHTS ───── */
    const streetBulbMats = [];
    s.streetBulbMats = streetBulbMats;
    function sl(x, z) {
      const g = new THREE.Group();
      g.position.set(x, 5, z);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 11, 5), darkMaterial);
      pole.position.y = 5.5; g.add(pole);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.22, 0.22), darkMaterial);
      arm.position.set(1.5, 10, 0); g.add(arm);
      const bMat = new THREE.MeshStandardMaterial({ color: 0xfff2b0, emissive: 0xffd36a, emissiveIntensity: 0.9 });
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), bMat);
      b.position.set(3, 9.8, 0); g.add(b);
      scene.add(g);
      streetBulbMats.push(bMat);
    }
    roadZs.forEach((z) => {
      for (let x = -4500; x <= 4500; x += 350) { sl(x, z + ROAD_HALF + 16); sl(x, z - ROAD_HALF - 16); }
    });

    /* ───── TRAFFIC LIGHTS ───── */
    const trafficLights = [];
    s.trafficLights = trafficLights;
    function tl(x, z) {
      const g = new THREE.Group();
      g.position.set(x, 5, z);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 9, 5), darkMaterial);
      pole.position.y = 4.5; g.add(pole);
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5, 1.4), darkMaterial);
      box.position.y = 7.5; g.add(box);
      const light = (color, y) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8),
          new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0 }));
        m.position.set(0, y, 0.75); g.add(m); return m;
      };
      const r = light(0xff2222, 8.8);
      const yL = light(0xffcc22, 7.5);
      const gr = light(0x22ff66, 6.2);
      scene.add(g);
      trafficLights.push({ r, y: yL, gr, phase: Math.random() * 10 });
    }
    roadXs.forEach((x) => roadZs.forEach((z) => tl(x, z)));

    /* ───── CONTROLLER ───── */
    const controller = new THREE.Group();
    s.controller = controller;
    controller.position.set(0, 5, 0);
    const controllerBase = new THREE.Mesh(new THREE.CylinderGeometry(55, 62, 3, 24), mat(0x142f3b, 0.28, 0.4));
    controllerBase.position.y = 1.5; controller.add(controllerBase);
    const controllerRing = new THREE.Mesh(new THREE.TorusGeometry(53, 1.2, 8, 36),
      new THREE.MeshStandardMaterial({ color: 0x32dfff, emissive: 0x18cfff, emissiveIntensity: 2.2 }));
    controllerRing.rotation.x = Math.PI / 2; controllerRing.position.y = 3.2; controller.add(controllerRing);
    s.controllerRing = controllerRing;
    const controllerRing2 = new THREE.Mesh(new THREE.TorusGeometry(44, 0.8, 8, 36),
      new THREE.MeshStandardMaterial({ color: 0x22bfff, emissive: 0x0a9fdf, emissiveIntensity: 1.8 }));
    controllerRing2.rotation.x = Math.PI / 2; controllerRing2.position.y = 5; controller.add(controllerRing2);
    s.controllerRing2 = controllerRing2;
    const controllerTower = new THREE.Mesh(new THREE.BoxGeometry(22, 40, 22), mat(0x185a72, 0.25, 0.35));
    controllerTower.position.y = 22; controller.add(controllerTower);
    const controllerUpper = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 18),
      new THREE.MeshStandardMaterial({ color: 0x0a3345, emissive: 0x1a7a9a, emissiveIntensity: 1.8 }));
    controllerUpper.position.y = 44; controller.add(controllerUpper);
    [
      { x: 0, y: 22, z: 12, ry: 0 },
      { x: 0, y: 22, z: -12, ry: Math.PI },
      { x: 12, y: 22, z: 0, ry: Math.PI / 2 },
      { x: -12, y: 22, z: 0, ry: -Math.PI / 2 },
    ].forEach((sp) => {
      const m = new THREE.MeshStandardMaterial({ color: 0x03141b, emissive: 0x21cfff, emissiveIntensity: 2.6 });
      const sMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 7.5, 0.4), m);
      sMesh.position.set(sp.x, sp.y, sp.z); sMesh.rotation.y = sp.ry;
      controller.add(sMesh);
    });
    const radar = new THREE.Mesh(new THREE.TorusGeometry(8, 0.5, 8, 32),
      new THREE.MeshStandardMaterial({ color: 0x61e7ff, emissive: 0x23dfff, emissiveIntensity: 2.5 }));
    radar.rotation.x = Math.PI / 2; radar.position.y = 53; controller.add(radar);
    s.radar = radar;
    const controllerSig = new THREE.Mesh(new THREE.SphereGeometry(2.2, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x66e5ff, emissive: 0x33dfff, emissiveIntensity: 3.5 }));
    controllerSig.position.y = 68; controller.add(controllerSig);
    s.controllerSig = controllerSig;
    scene.add(controller);

    /* ───── GLB LOADER ───── */
    const loader = new GLTFLoader();
    const clickable = [];
    s.clickable = clickable;

    function prep(obj, size) {
      const box = new THREE.Box3().setFromObject(obj);
      const sz = new THREE.Vector3(); box.getSize(sz);
      const maxD = Math.max(sz.x, sz.y, sz.z);
      obj.scale.setScalar(size / Math.max(maxD, 0.001));
      const b2 = new THREE.Box3().setFromObject(obj);
      const c = new THREE.Vector3(); b2.getCenter(c);
      obj.position.x -= c.x; obj.position.z -= c.z; obj.position.y -= b2.min.y;
    }

    function bld(file, size, pos, type, name, borderColor) {
      /* GLB files root se `/filename.glb` par load hongi */
      const url = file.startsWith("/") ? file : "/" + file;
      loader.load(
        url,
        (g) => {
          const b = g.scene;
          prep(b, size);
          b.position.set(pos[0], 5, pos[1]);
          scene.add(b);
          clickable.push({ object: b, type, name: name || type });
          buildingBorder(pos[0], pos[1], size * 1.4, size * 1.4, borderColor || 0x22cfff);
        },
        undefined,
        (err) => console.warn("Missing GLB:", url, err)
      );
    }

    /* ───── NATURE ───── */
    const treeTrunkMat = mat(0x6b4a2f, 0.95, 0.05);
    const treeLeafMat = mat(0x2d6e3d, 0.9);
    const treeLeafMat2 = mat(0x3a8a4c, 0.9);
    const treeLeafMat3 = mat(0x1f5a2e, 0.9);
    const treeGeo1 = new THREE.CylinderGeometry(1.2, 1.8, 14, 5);
    const treeGeo2 = new THREE.ConeGeometry(11, 22, 6);
    const treeGeo3 = new THREE.SphereGeometry(9, 7, 6);

    function tree(x, z, sc = 1) {
      const g = new THREE.Group();
      g.position.set(x, 5, z); g.scale.setScalar(sc);
      const t = new THREE.Mesh(treeGeo1, treeTrunkMat); t.position.y = 7; g.add(t);
      const roll = Math.random();
      if (roll < 0.45) {
        const l = new THREE.Mesh(treeGeo2, Math.random() > 0.5 ? treeLeafMat : treeLeafMat2);
        l.position.y = 22; g.add(l);
      } else if (roll < 0.75) {
        const l = new THREE.Mesh(treeGeo3, Math.random() > 0.5 ? treeLeafMat : treeLeafMat3);
        l.position.y = 22; l.scale.set(1, 1.1, 1); g.add(l);
      } else {
        const l1 = new THREE.Mesh(treeGeo2, treeLeafMat); l1.position.y = 20; l1.scale.setScalar(0.85); g.add(l1);
        const l2 = new THREE.Mesh(treeGeo2, treeLeafMat2); l2.position.y = 28; l2.scale.setScalar(0.7); g.add(l2);
      }
      scene.add(g);
    }

    const flowerColors = [0xff6b6b, 0xffdd57, 0xff8fab, 0xa29bfe, 0x74b9ff, 0xfd79a8];
    function flower(x, z) {
      const g = new THREE.Group();
      g.position.set(x, 5, z);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.5, 4), mat(0x2d6e3d, 0.9));
      stem.position.y = 1.25; g.add(stem);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.6, 6, 6),
        new THREE.MeshStandardMaterial({
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
          emissive: 0x222222, emissiveIntensity: 0.3, roughness: 0.7,
        }));
      head.position.y = 2.8; g.add(head);
      scene.add(g);
    }

    function bush(x, z, sc = 1) {
      const g = new THREE.Group();
      g.position.set(x, 5, z); g.scale.setScalar(sc);
      const colors = [0x2d6e3d, 0x3a8a4c, 0x1f5a2e, 0x4a9d5a];
      for (let i = 0; i < 4; i++) {
        const b = new THREE.Mesh(new THREE.SphereGeometry(3 + Math.random() * 2, 6, 5),
          mat(colors[Math.floor(Math.random() * colors.length)], 0.95));
        b.position.set((Math.random() - 0.5) * 5, 3 + Math.random() * 2, (Math.random() - 0.5) * 5);
        g.add(b);
      }
      scene.add(g);
    }

    function rock(x, z, sc = 1) {
      const g = new THREE.Group();
      g.position.set(x, 5, z); g.scale.setScalar(sc);
      const colors = [0x8a8a8a, 0x6b6b6b, 0x9a9a95, 0x7a7a72];
      for (let i = 0; i < 3; i++) {
        const r = new THREE.Mesh(new THREE.DodecahedronGeometry(2 + Math.random() * 2, 0),
          mat(colors[Math.floor(Math.random() * colors.length)], 0.95));
        r.position.set((Math.random() - 0.5) * 5, 2 + Math.random() * 1.5, (Math.random() - 0.5) * 5);
        r.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        g.add(r);
      }
      scene.add(g);
    }

    function grassTuft(x, z) {
      const g = new THREE.Group();
      g.position.set(x, 5, z);
      const gm = mat(0x3a8a4c, 0.95);
      for (let i = 0; i < 6; i++) {
        const blade = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2 + Math.random() * 1.5, 3), gm);
        blade.position.set((Math.random() - 0.5) * 2.5, 1, (Math.random() - 0.5) * 2.5);
        blade.rotation.z = (Math.random() - 0.5) * 0.4;
        g.add(blade);
      }
      scene.add(g);
    }

    /* Nature placement */
    function isOnRoad(x, z) {
      const clear = 80;
      for (const rz of roadZs) if (Math.abs(z - rz) < clear) return true;
      for (const rx of roadXs) if (Math.abs(x - rx) < clear) return true;
      return false;
    }

    const occupiedSpots = [
      { x: -600, z: -600, r: 260 }, { x: 600, z: -600, r: 250 },
      { x: -600, z: 600, r: 330 }, { x: 600, z: 600, r: 300 },
      { x: 1800, z: -600, r: 400 }, { x: 600, z: 1800, r: 290 },
      { x: 1800, z: 1750, r: 320 }, { x: 1800, z: 600, r: 290 },
      { x: 0, z: 0, r: 130 },
      { x: -3600, z: 3600, r: 900 }, { x: 3600, z: -3600, r: 600 },
      { x: -3600, z: -3600, r: 600 }, { x: 3600, z: 3600, r: 600 },
    ];
    function isOnBuilding(x, z) {
      for (const o of occupiedSpots) {
        const dx = x - o.x, dz = z - o.z;
        if (dx * dx + dz * dz < o.r * o.r) return true;
      }
      return false;
    }
    function isFree(x, z) {
      return !isOnRoad(x, z) && !isOnBuilding(x, z);
    }

    /* ───── CITY BUILDINGS (tall) ───── */
    const buildingWindowsMat = new THREE.MeshStandardMaterial({
      color: 0x223344, emissive: 0x88ccff, emissiveIntensity: 0.6, metalness: 0.5, roughness: 0.3,
    });
    const buildingWindowsMat2 = new THREE.MeshStandardMaterial({
      color: 0x334455, emissive: 0x66aaff, emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.35,
    });

    function cityBuilding(x, z, w, h, d, color) {
      const g = new THREE.Group();
      g.position.set(x, 5, z);
      const bMat = mat(color, 0.55, 0.35);
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bMat);
      body.position.y = h / 2; g.add(body);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 4, 3, d + 4), mat(0x3a4448, 0.6, 0.3));
      roof.position.y = h + 1.5; g.add(roof);
      const winMat = Math.random() > 0.5 ? buildingWindowsMat : buildingWindowsMat2;
      const floors = Math.max(3, Math.floor(h / 20));
      const colsF = Math.max(3, Math.floor(w / 14));
      const colsS = Math.max(3, Math.floor(d / 14));
      for (let f = 0; f < floors; f++) {
        const wy = 8 + f * (h - 12) / floors;
        for (let c = 0; c < colsF; c++) {
          const wx = (c - (colsF - 1) / 2) * (w / colsF) * 0.85;
          const wf = new THREE.Mesh(new THREE.BoxGeometry(4.5, 6, 0.5), winMat);
          wf.position.set(wx, wy, d / 2 + 0.3); g.add(wf);
          const wb = new THREE.Mesh(new THREE.BoxGeometry(4.5, 6, 0.5), winMat);
          wb.position.set(wx, wy, -d / 2 - 0.3); g.add(wb);
        }
        for (let c = 0; c < colsS; c++) {
          const wz = (c - (colsS - 1) / 2) * (d / colsS) * 0.85;
          const wl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 4.5), winMat);
          wl.position.set(-w / 2 - 0.3, wy, wz); g.add(wl);
          const wr = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 4.5), winMat);
          wr.position.set(w / 2 + 0.3, wy, wz); g.add(wr);
        }
      }
      if (Math.random() > 0.5) {
        const antH = 20 + Math.random() * 30;
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, antH, 6), mat(0x555a5e, 0.5, 0.7));
        ant.position.y = h + 3 + antH / 2; g.add(ant);
        const redLight = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xff2222, emissiveIntensity: 3 }));
        redLight.position.y = h + 3 + antH; g.add(redLight);
      }
      scene.add(g);
    }

    const cityBuildingData = [
      { x: 900, z: 900, w: 90, h: 220, d: 90, c: 0x7a8288 },
      { x: 300, z: 900, w: 80, h: 180, d: 80, c: 0x6b7278 },
      { x: 900, z: 300, w: 85, h: 240, d: 85, c: 0x808890 },
      { x: 1400, z: 900, w: 95, h: 200, d: 95, c: 0x6e767c },
      { x: 900, z: 1400, w: 80, h: 190, d: 80, c: 0x7e878d },
      { x: -900, z: 900, w: 90, h: 190, d: 90, c: 0x767e84 },
      { x: -300, z: 900, w: 85, h: 210, d: 85, c: 0x727a80 },
      { x: -900, z: 300, w: 80, h: 170, d: 80, c: 0x7a8288 },
      { x: -1400, z: 900, w: 95, h: 230, d: 95, c: 0x6b7278 },
      { x: -900, z: 1400, w: 85, h: 200, d: 85, c: 0x808890 },
      { x: -900, z: -900, w: 80, h: 150, d: 80, c: 0x7a8288 },
      { x: -300, z: -900, w: 75, h: 170, d: 75, c: 0x6e767c },
      { x: -900, z: -300, w: 85, h: 190, d: 85, c: 0x767e84 },
      { x: -1400, z: -900, w: 90, h: 210, d: 90, c: 0x727a80 },
      { x: -900, z: -1400, w: 80, h: 180, d: 80, c: 0x7e878d },
      { x: 900, z: -900, w: 80, h: 160, d: 80, c: 0x808890 },
      { x: 300, z: -900, w: 75, h: 180, d: 75, c: 0x7a8288 },
      { x: 900, z: -300, w: 85, h: 200, d: 85, c: 0x6b7278 },
      { x: 1400, z: -900, w: 90, h: 220, d: 90, c: 0x767e84 },
      { x: 900, z: -1400, w: 80, h: 190, d: 80, c: 0x727a80 },
      { x: 2100, z: -900, w: 90, h: 200, d: 90, c: 0x6e767c },
      { x: 2100, z: -300, w: 85, h: 220, d: 85, c: 0x7a8288 },
      { x: 2500, z: -900, w: 95, h: 240, d: 95, c: 0x808890 },
      { x: 2100, z: 300, w: 80, h: 180, d: 80, c: 0x727a80 },
      { x: 900, z: 2100, w: 90, h: 210, d: 90, c: 0x767e84 },
      { x: 300, z: 2100, w: 85, h: 190, d: 85, c: 0x7a8288 },
      { x: 1500, z: 2100, w: 95, h: 230, d: 95, c: 0x6b7278 },
      { x: 900, z: 2700, w: 80, h: 200, d: 80, c: 0x6e767c },
      { x: 2500, z: 1500, w: 90, h: 220, d: 90, c: 0x808890 },
      { x: 2500, z: 2100, w: 85, h: 200, d: 85, c: 0x727a80 },
      { x: 2100, z: 2500, w: 90, h: 240, d: 90, c: 0x7a8288 },
      { x: 2500, z: 900, w: 85, h: 180, d: 85, c: 0x767e84 },
      { x: 2500, z: 300, w: 80, h: 210, d: 80, c: 0x6e767c },
      { x: 2500, z: -300, w: 90, h: 230, d: 90, c: 0x7e878d },
      { x: -3300, z: 0, w: 110, h: 260, d: 110, c: 0x6a7278 },
      { x: 3300, z: 0, w: 115, h: 280, d: 115, c: 0x767e84 },
      { x: 0, z: -3300, w: 120, h: 270, d: 120, c: 0x727a80 },
      { x: 0, z: 3300, w: 118, h: 250, d: 118, c: 0x7a8288 },
      { x: -3300, z: -1500, w: 100, h: 220, d: 100, c: 0x808890 },
      { x: 3300, z: -1500, w: 105, h: 240, d: 105, c: 0x6e767c },
      { x: -3300, z: 1500, w: 100, h: 230, d: 100, c: 0x767e84 },
      { x: 3300, z: 1500, w: 105, h: 260, d: 105, c: 0x6a7278 },
      { x: -1500, z: -3300, w: 100, h: 210, d: 100, c: 0x727a80 },
      { x: 1500, z: -3300, w: 105, h: 250, d: 105, c: 0x7a8288 },
      { x: -1500, z: 3300, w: 100, h: 240, d: 100, c: 0x808890 },
      { x: 1500, z: 3300, w: 105, h: 220, d: 105, c: 0x6e767c },
      { x: -1800, z: -1800, w: 90, h: 200, d: 90, c: 0x767e84 },
      { x: 1800, z: -1800, w: 95, h: 230, d: 95, c: 0x727a80 },
      { x: -1800, z: 1800, w: 90, h: 210, d: 90, c: 0x7a8288 },
      { x: 1800, z: 1800, w: 95, h: 240, d: 95, c: 0x6b7278 },
      { x: -2100, z: 0, w: 85, h: 190, d: 85, c: 0x808890 },
      { x: 2100, z: 0, w: 85, h: 200, d: 85, c: 0x767e84 },
      { x: 0, z: -2100, w: 90, h: 220, d: 90, c: 0x727a80 },
      { x: 0, z: 2100, w: 90, h: 210, d: 90, c: 0x7e878d },
    ];
    cityBuildingData.forEach((b) => {
      if (!isOnRoad(b.x, b.z) && isFree(b.x, b.z)) {
        cityBuilding(b.x, b.z, b.w, b.h, b.d, b.c);
        occupiedSpots.push({ x: b.x, z: b.z, r: Math.max(b.w, b.d) / 2 + 20 });
      }
    });

    /* Nature scatter */
    for (let i = 0; i < 900; i++) {
      const x = (Math.random() - 0.5) * 9000;
      const z = (Math.random() - 0.5) * 9000;
      if (isFree(x, z)) tree(x, z, 0.7 + Math.random() * 0.7);
    }
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 9000;
      const z = (Math.random() - 0.5) * 9000;
      if (isFree(x, z)) bush(x, z, 0.7 + Math.random() * 0.6);
    }
    for (let i = 0; i < 250; i++) {
      const x = (Math.random() - 0.5) * 9000;
      const z = (Math.random() - 0.5) * 9000;
      if (isFree(x, z)) rock(x, z, 0.6 + Math.random() * 0.8);
    }
    for (let i = 0; i < 800; i++) {
      const x = (Math.random() - 0.5) * 9000;
      const z = (Math.random() - 0.5) * 9000;
      if (isFree(x, z)) grassTuft(x, z);
    }

    /* ───── GLB BUILDINGS LOAD ───── */
    bld("/american_high_school.glb", 300, [-600, -600], "school", "American High School", 0x1a5490);
    bld("/low_poly_hospital.glb", 280, [600, -600], "hospital", "Smart Hospital", 0xc0392b);
    bld("/low_poly_night_city_building_skyline.glb", 400, [-600, 600], "society", "Smart Society", 0x16a085);
    bld("/us_bank_tower.glb", 360, [600, 600], "bank", "State Bank", 0x8e44ad);
    bld("/simple_farm_free.glb", 520, [1800, -600], "farm", "Smart Eco Farm", 0x27ae60);
    bld("/great_hall.glb", 360, [600, 1800], "marriageHall", "Marriage Hall", 0xd4a017);
    bld("/gas_station.glb", 380, [1800, 1750], "gasStation", "Gas Station · Car Wash", 0xc0392b);
    buildingBorder(1800, 1750, 520, 520, 0xc0392b);
    bld("/brutalist_building.glb", 360, [1800, 600], "sewageCompany", "Sewage & Filtration Co.", 0x34495e);

    /* Boards */
    board("AMERICAN HIGH SCHOOL", -600, 5, -950, 200, 14, 0x1a5490);
    board("BSS SMART HOSPITAL", 600, 5, -950, 200, 14, 0xc0392b);
    board("BSS SMART SOCIETY", -600, 5, 950, 200, 14, 0x16a085);
    board("SMART CITY STATE BANK", 600, 5, 950, 200, 14, 0x8e44ad);
    board("SMART ECO FARM", 1800, 5, -950, 200, 14, 0x27ae60);
    board("MARRIAGE HALL", 600, 5, 2250, 220, 16, 0xd4a017);
    board("CAR WASH · GAS STATION", 1800, 5, 2200, 220, 16, 0xc0392b);
    board("SEWAGE & FILTRATION CO.", 1800, 5, 300, 240, 16, 0x34495e);
    board("AI TRAFFIC CONTROLLER", 0, 5, 300, 190, 14);

    /* Shops */
    function shop(x, z, scale = 1.4, name) {
      loader.load(
        "/dagashiya_shop_japanese_old_snack_shop.glb",
        (g) => {
          const sm = g.scene;
          prep(sm, 50 * scale);
          sm.position.set(x, 5, z);
          scene.add(sm);
          clickable.push({ object: sm, type: "shop", name: name || "Dagashiya Snack Shop" });
        },
        undefined,
        (err) => console.warn("Shop GLB missing", err)
      );
    }
    shop(-1000, -600, 1.4, "School Canteen");
    shop(1000, -600, 1.4, "Hospital Canteen");
    shop(-1000, 600, 1.4, "Society Shop");
    shop(1000, 600, 1.4, "Bank Shop");

    /* ───── POWER SUPPLY ───── */
    const powerZone = new THREE.Group();
    powerZone.position.set(-3600, 0, 3600);
    scene.add(powerZone);
    board("POWER SUPPLY (SMART-CITY)", -3600, 5, 4500, 420, 20, 0x0a4d5c);

    const powerPad = new THREE.Mesh(new THREE.BoxGeometry(1600, 1, 1300), mat(0x1d3a2e, 0.92));
    powerPad.position.y = 4.2;
    powerZone.add(powerPad);

    const powerBorderMat = new THREE.MeshStandardMaterial({
      color: 0x00e0ff, emissive: 0x00cfff, emissiveIntensity: 2.2, metalness: 0.7, roughness: 0.2,
    });
    const pbF = new THREE.Mesh(new THREE.BoxGeometry(1600, 1.6, 5), powerBorderMat);
    pbF.position.set(0, 6.5, -650); powerZone.add(pbF);
    const pbB = pbF.clone(); pbB.position.z = 650; powerZone.add(pbB);
    const pbL = new THREE.Mesh(new THREE.BoxGeometry(5, 1.6, 1300), powerBorderMat);
    pbL.position.set(-800, 6.5, 0); powerZone.add(pbL);
    const pbR = pbL.clone(); pbR.position.x = 800; powerZone.add(pbR);

    loader.load("/old_antenna.glb", (g) => {
      const a = g.scene; prep(a, 360); a.position.set(-550, 5, 0); powerZone.add(a);
      clickable.push({ object: a, type: "antenna", name: "Old Antenna" });
    }, undefined, () => {});
    loader.load("/antena.glb", (g) => {
      const a = g.scene; prep(a, 270); a.position.set(-280, 5, -100); powerZone.add(a);
      clickable.push({ object: a, type: "antenna", name: "Antenna 1" });
    }, undefined, () => {});
    loader.load("/antena.glb", (g) => {
      const a = g.scene; prep(a, 230); a.position.set(-720, 5, 100); powerZone.add(a);
      clickable.push({ object: a, type: "antenna", name: "Antenna 2" });
    }, undefined, () => {});

    const turbines = [];
    s.turbines = turbines;
    const turbTowerMat = mat(0xeeeeee, 0.4, 0.3);
    const turbTowerGeo = new THREE.CylinderGeometry(0.85, 1.4, 68, 6);
    const turbBladeGeo = new THREE.BoxGeometry(2, 27, 0.85);
    function turbine(x, z, sc = 1) {
      const g = new THREE.Group();
      g.position.set(x, 5, z); g.scale.setScalar(sc);
      const t = new THREE.Mesh(turbTowerGeo, turbTowerMat);
      t.position.y = 34; g.add(t);
      const blades = new THREE.Group();
      blades.position.y = 68;
      for (let i = 0; i < 3; i++) {
        const b = new THREE.Mesh(turbBladeGeo, turbTowerMat);
        b.position.y = 12.5; b.rotation.z = i * Math.PI * 2 / 3;
        blades.add(b);
      }
      g.add(blades);
      powerZone.add(g);
      turbines.push(blades);
    }
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 4; col++)
        turbine(-650 + col * 200, -600 + row * 220, 1 + (row % 3) * 0.08);

    const solarPark = new THREE.Group();
    solarPark.position.set(500, 0, 0);
    powerZone.add(solarPark);
    const solarGround = new THREE.Mesh(new THREE.BoxGeometry(650, 0.8, 1250), mat(0x2a4536, 0.92));
    solarGround.position.y = 5;
    solarPark.add(solarGround);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x082c4b, roughness: 0.18, metalness: 0.7, emissive: 0x063b62, emissiveIntensity: 0.7,
    });
    const solarPanelGeo = new THREE.BoxGeometry(1, 1, 1);
    function solarArray(x, z, w, d, rows, cols) {
      const g = new THREE.Group();
      g.position.set(x, 8, z); g.rotation.x = -0.22;
      const pw = w / cols - 3;
      const pd = d / rows - 3;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const p = new THREE.Mesh(solarPanelGeo, solarMat);
          p.scale.set(pw, 0.5, pd);
          p.position.set((c - (cols - 1) / 2) * (w / cols), 0, (r - (rows - 1) / 2) * (d / rows));
          g.add(p);
        }
      solarPark.add(g);
    }
    for (let i = 0; i < 5; i++) {
      solarArray(-160, -480 + i * 220, 280, 180, 2, 4);
      solarArray(160, -480 + i * 220, 280, 180, 2, 4);
    }
    const solarControl = new THREE.Mesh(new THREE.BoxGeometry(36, 58, 28), mat(0x15536a, 0.25, 0.35));
    solarControl.position.set(0, 38, 0);
    solarPark.add(solarControl);
    const solarScreen = new THREE.Mesh(new THREE.BoxGeometry(22, 13, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x04151d, emissive: 0x20d9ff, emissiveIntensity: 2.6 }));
    solarScreen.position.set(0, 42, -14.4);
    solarPark.add(solarScreen);

    const batteryRings = [];
    s.batteryRings = batteryRings;
    const batteryPositions = [
      [-500, 850], [-370, 850], [-240, 850], [-110, 850], [20, 850],
      [-500, 980], [-370, 980], [-240, 980], [-110, 980], [20, 980],
    ];
    batteryPositions.forEach((pos, i) => {
      loader.load("/battery.glb", (g) => {
        const b = g.scene;
        prep(b, 60);
        b.position.set(pos[0], 6, pos[1]);
        b.rotation.y = Math.PI / 2;
        powerZone.add(b);
        const rMat = new THREE.MeshStandardMaterial({ color: 0x22ff9d, emissive: 0x22ff9d, emissiveIntensity: 1.5 });
        const r = new THREE.Mesh(new THREE.TorusGeometry(28, 0.8, 6, 16), rMat);
        r.rotation.x = Math.PI / 2;
        r.position.set(pos[0], 7, pos[1]);
        powerZone.add(r);
        batteryRings.push(rMat);
        clickable.push({ object: b, type: "battery", name: "Battery " + (i + 1) });
      }, undefined, () => {});
    });

    /* ───── FILTRATION ZONE ───── */
    const filtZone = new THREE.Group();
    filtZone.position.set(3600, 0, -3600);
    scene.add(filtZone);
    board("FILTRATION SYSTEM", 3600, 5, -2700, 380, 18, 0x22cfff);

    const filtPad = new THREE.Mesh(new THREE.BoxGeometry(950, 1, 950), mat(0x1a2836, 0.95));
    filtPad.position.y = 4.2;
    filtZone.add(filtPad);

    const filtBorderMat = new THREE.MeshStandardMaterial({
      color: 0x22cfff, emissive: 0x22cfff, emissiveIntensity: 2.5, metalness: 0.6, roughness: 0.2,
    });
    const fzF = new THREE.Mesh(new THREE.BoxGeometry(950, 1.8, 6), filtBorderMat);
    fzF.position.set(0, 6.5, -475); filtZone.add(fzF);
    const fzB = fzF.clone(); fzB.position.z = 475; filtZone.add(fzB);
    const fzL = new THREE.Mesh(new THREE.BoxGeometry(6, 1.8, 950), filtBorderMat);
    fzL.position.set(-475, 6.5, 0); filtZone.add(fzL);
    const fzR = fzL.clone(); fzR.position.x = 475; filtZone.add(fzR);

    const filtBoxGroup = new THREE.Group();
    filtBoxGroup.position.set(0, 5, 0);
    filtZone.add(filtBoxGroup);

    const filtBase = new THREE.Mesh(new THREE.BoxGeometry(220, 4, 220), mat(0x2c3e50, 0.7, 0.3));
    filtBase.position.y = 2; filtBoxGroup.add(filtBase);

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x22cfff, emissive: 0x22cfff, emissiveIntensity: 0.5,
      metalness: 0.3, roughness: 0.15, transparent: true, opacity: 0.35, side: THREE.DoubleSide,
    });
    const wallFront = new THREE.Mesh(new THREE.BoxGeometry(220, 110, 3), glassMat);
    wallFront.position.set(0, 57, 110); filtBoxGroup.add(wallFront);
    const wallBack = wallFront.clone(); wallBack.position.z = -110; filtBoxGroup.add(wallBack);
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(3, 110, 220), glassMat);
    wallLeft.position.set(-110, 57, 0); filtBoxGroup.add(wallLeft);
    const wallRight = wallLeft.clone(); wallRight.position.x = 110; filtBoxGroup.add(wallRight);

    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x2c3e50, emissive: 0x22cfff, emissiveIntensity: 0.3,
      metalness: 0.6, roughness: 0.25, transparent: true, opacity: 0.75,
    });
    const roof = new THREE.Mesh(new THREE.BoxGeometry(230, 3, 230), roofMat);
    roof.position.y = 114; filtBoxGroup.add(roof);

    loader.load("/skid_filtration_system.glb", (g) => {
      const m = g.scene;
      prep(m, 160);
      m.position.set(0, 6, 0);
      filtBoxGroup.add(m);
      clickable.push({ object: m, type: "filtrationMachine", name: "Filtration Machine" });
    }, undefined, () => console.warn("skid_filtration_system.glb missing"));

    /* Water particles */
    const waterParticles = [];
    s.waterParticles = waterParticles;
    for (let i = 0; i < 30; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(1.2, 6, 6),
        new THREE.MeshStandardMaterial({ color: 0x22cfff, emissive: 0x22cfff, emissiveIntensity: 2.5 }));
      p.position.set((Math.random() - 0.5) * 190, 20 + Math.random() * 80, (Math.random() - 0.5) * 190);
      filtBoxGroup.add(p);
      waterParticles.push({ mesh: p, speed: 0.4 + Math.random() * 0.6 });
    }

    /* ───── AI FERTILIZER ZONE ───── */
    const fertZone = new THREE.Group();
    fertZone.position.set(-3600, 0, -3600);
    scene.add(fertZone);
    board("AI FERTILIZER SYSTEM", -3600, 5, -2700, 420, 22, 0x8e44ad);

    const fertPad = new THREE.Mesh(new THREE.BoxGeometry(950, 1, 950), mat(0x2a1e3a, 0.95));
    fertPad.position.y = 4.2;
    fertZone.add(fertPad);
    const fertBorderMat = new THREE.MeshStandardMaterial({
      color: 0xb266ff, emissive: 0xb266ff, emissiveIntensity: 2.2, metalness: 0.6, roughness: 0.2,
    });
    const ftF = new THREE.Mesh(new THREE.BoxGeometry(950, 1.8, 6), fertBorderMat);
    ftF.position.set(0, 6.5, -475); fertZone.add(ftF);
    const ftB = ftF.clone(); ftB.position.z = 475; fertZone.add(ftB);
    const ftL = new THREE.Mesh(new THREE.BoxGeometry(6, 1.8, 950), fertBorderMat);
    ftL.position.set(-475, 6.5, 0); fertZone.add(ftL);
    const ftR = ftL.clone(); ftR.position.x = 475; fertZone.add(ftR);

    const fertOffice = new THREE.Mesh(new THREE.BoxGeometry(60, 80, 60), mat(0x4a2c6b, 0.3, 0.4));
    fertOffice.position.set(0, 45, 0); fertZone.add(fertOffice);
    const fertOfficeUpper = new THREE.Mesh(new THREE.BoxGeometry(50, 24, 50),
      new THREE.MeshStandardMaterial({ color: 0x2a1e3a, emissive: 0x8e44ad, emissiveIntensity: 1.5, metalness: 0.5, roughness: 0.15 }));
    fertOfficeUpper.position.set(0, 97, 0); fertZone.add(fertOfficeUpper);
    const fertBeacon = new THREE.Mesh(new THREE.SphereGeometry(5, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xb266ff, emissive: 0xb266ff, emissiveIntensity: 3.5 }));
    fertBeacon.position.set(0, 118, 0); fertZone.add(fertBeacon);

    for (const cx of [-200, -100, 100, 200]) {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(22, 26, 60, 16), mat(0x5a3e7d, 0.4, 0.35));
      tank.position.set(cx, 30, -350); fertZone.add(tank);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(22, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x7a5a9d, 0.3, 0.5));
      cap.position.set(cx, 60, -350); fertZone.add(cap);
      const light = new THREE.Mesh(new THREE.SphereGeometry(2.5, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xb266ff, emissive: 0xb266ff, emissiveIntensity: 3 }));
      light.position.set(cx, 72, -350); fertZone.add(light);
    }

    /* ───── WASTE MANAGEMENT ZONE (Code-built) ───── */
    const wasteZone = new THREE.Group();
    wasteZone.position.set(3600, 0, 3600);
    scene.add(wasteZone);
    board("WASTE MANAGEMENT", 3600, 5, 4500, 380, 18, 0x2ecc71);

    const wastePad = new THREE.Mesh(new THREE.BoxGeometry(950, 1, 950), mat(0x2a3a2e, 0.95));
    wastePad.position.y = 4.2;
    wasteZone.add(wastePad);
    const wasteBorderMat = new THREE.MeshStandardMaterial({
      color: 0x2ecc71, emissive: 0x2ecc71, emissiveIntensity: 2.2, metalness: 0.6, roughness: 0.2,
    });
    const wbF = new THREE.Mesh(new THREE.BoxGeometry(950, 1.4, 5), wasteBorderMat);
    wbF.position.set(0, 6.5, -475); wasteZone.add(wbF);
    const wbB = wbF.clone(); wbB.position.z = 475; wasteZone.add(wbB);
    const wbL = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 950), wasteBorderMat);
    wbL.position.set(-475, 6.5, 0); wasteZone.add(wbL);
    const wbR = wbL.clone(); wbR.position.x = 475; wasteZone.add(wbR);

    for (const cx of [-475, 475]) for (const cz of [-475, 475]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 30, 10), wasteBorderMat);
      p.position.set(cx, 20, cz); wasteZone.add(p);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(3.5, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0x8affb3, emissive: 0x2ecc71, emissiveIntensity: 3 }));
      cap.position.set(cx, 37, cz); wasteZone.add(cap);
    }

    /* Waste dumpsters */
    function wasteDumpster(x, z) {
      const g = new THREE.Group();
      g.position.set(x, 5, z);
      const body = new THREE.Mesh(new THREE.BoxGeometry(38, 22, 26), mat(0x2ecc71, 0.5, 0.5));
      body.position.y = 11; g.add(body);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(40, 2, 28), mat(0x1a1a1a, 0.6, 0.3));
      lid.position.set(0, 23, -3); lid.rotation.x = -0.15; g.add(lid);
      const glowMat = new THREE.MeshStandardMaterial({ color: 0x2ecc71, emissive: 0x2ecc71, emissiveIntensity: 2.5 });
      const glow = new THREE.Mesh(new THREE.BoxGeometry(38, 1.5, 26.5), glowMat);
      glow.position.y = 22; g.add(glow);
      const wm = mat(0x0c1012, 0.6, 0.1);
      const wg = new THREE.CylinderGeometry(3, 3, 2, 10);
      for (const wx of [-12, 12]) for (const wz of [-8, 8]) {
        const w = new THREE.Mesh(wg, wm);
        w.rotation.z = Math.PI / 2; w.position.set(wx, 3, wz); g.add(w);
      }
      wasteZone.add(g);
      clickable.push({ object: g, type: "wasteBin", name: "Waste Container" });
    }
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 4; col++)
        wasteDumpster(-280 + col * 190, -300 + row * 220);

    const recycleMachine = new THREE.Mesh(new THREE.BoxGeometry(120, 100, 120), mat(0x1a8a4e, 0.4, 0.5));
    recycleMachine.position.set(0, 55, 0); wasteZone.add(recycleMachine);
    const recycleTop = new THREE.Mesh(new THREE.BoxGeometry(100, 20, 100),
      new THREE.MeshStandardMaterial({ color: 0x0a5a2e, emissive: 0x2ecc71, emissiveIntensity: 1.5, metalness: 0.5, roughness: 0.2 }));
    recycleTop.position.set(0, 115, 0); wasteZone.add(recycleTop);
    const recycleRing = new THREE.Mesh(new THREE.TorusGeometry(80, 2, 8, 32),
      new THREE.MeshStandardMaterial({ color: 0x2ecc71, emissive: 0x2ecc71, emissiveIntensity: 2.5 }));
    recycleRing.rotation.x = Math.PI / 2; recycleRing.position.set(0, 10, 0); wasteZone.add(recycleRing);

    /* ───── TRUCKS ───── */
    function buildTruck(c1, c2, label, txtColor) {
      const truck = new THREE.Group();
      const box = new THREE.Mesh(new THREE.BoxGeometry(100, 68, 44), mat(c1, 0.4, 0.3));
      box.position.y = 45; truck.add(box);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(38, 44, 44), mat(c2, 0.4, 0.4));
      cabin.position.set(65, 35, 0); truck.add(cabin);
      const win = new THREE.Mesh(new THREE.BoxGeometry(2, 20, 34),
        new THREE.MeshStandardMaterial({ color: 0x8be8ff, transparent: true, opacity: 0.7, roughness: 0.1, metalness: 0.3 }));
      win.position.set(84, 42, 0); truck.add(win);
      const wm = mat(0x0c1012, 0.6, 0.1);
      const wg = new THREE.CylinderGeometry(12, 12, 8, 12);
      for (const wx of [-36, 36, 60]) for (const wz of [-20, 20]) {
        const w = new THREE.Mesh(wg, wm);
        w.rotation.x = Math.PI / 2; w.position.set(wx, 12, wz); truck.add(w);
      }
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(135, 8, 42), darkMaterial);
      chassis.position.set(16, 18, 0); truck.add(chassis);
      const canvas = document.createElement("canvas");
      canvas.width = 1400; canvas.height = 280;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = txtColor; ctx.fillRect(0, 0, 1400, 280);
      ctx.fillStyle = "#fff"; ctx.font = "bold 115px Arial";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const lines = label.split("|");
      if (lines.length === 2) { ctx.fillText(lines[0], 700, 80); ctx.fillText(lines[1], 700, 200); }
      else ctx.fillText(label, 700, 140);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const tMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
      const t1 = new THREE.Mesh(new THREE.PlaneGeometry(95, 48), tMat);
      t1.position.set(0, 45, 22.5); truck.add(t1);
      const t2 = new THREE.Mesh(new THREE.PlaneGeometry(95, 48), tMat);
      t2.position.set(0, 45, -22.5); t2.rotation.y = Math.PI; truck.add(t2);
      const warn = new THREE.Mesh(new THREE.SphereGeometry(3, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xff8a00, emissive: 0xff8a00, emissiveIntensity: 3 }));
      warn.position.set(0, 82, 0); truck.add(warn);
      return { truck, warn };
    }

    const g1 = buildTruck(0x3498db, 0x2980b9, "WASTE|MANAGEMENT", "#3498db");
    const garbageTruck = g1.truck; scene.add(garbageTruck);
    s.trucks.garbage = garbageTruck;
    s.garbageWarn = g1.warn;
    clickable.push({ object: garbageTruck, type: "garbageTruck", name: "Garbage Truck" });

    const g2 = buildTruck(0xb266ff, 0x7a3b9d, "AI FERTILIZER", "#8e44ad");
    const fertTruck1 = g2.truck; scene.add(fertTruck1);
    s.trucks.fert1 = fertTruck1;
    s.fertWarn1 = g2.warn;
    clickable.push({ object: fertTruck1, type: "fertTruck", name: "Fertilizer Truck 1" });

    const g3 = buildTruck(0xd8b3ff, 0x8e44ad, "AI FERTILIZER", "#8e44ad");
    const fertTruck2 = g3.truck; scene.add(fertTruck2);
    s.trucks.fert2 = fertTruck2;
    s.fertWarn2 = g3.warn;
    clickable.push({ object: fertTruck2, type: "fertTruck", name: "Fertilizer Truck 2" });

    /* ───── CARS ───── */
    const cityCars = [];
    s.cityCars = cityCars;
    const carColors = [0x287ca3, 0xc83f49, 0xe1a72e, 0x5b72c9, 0x2f9d65, 0xd8d8d8, 0xd97b2a, 0x8b3ad9, 0x16a085, 0x8e44ad];
    const V_LEN = 26, V_WID = 10, V_HGT = 5.5;
    const carBodyGeo = new THREE.BoxGeometry(V_LEN, V_HGT, V_WID);
    const carHoodGeo = new THREE.BoxGeometry(V_LEN * 0.25, V_HGT * 0.55, V_WID * 0.95);
    const carCabinGeo = new THREE.BoxGeometry(V_LEN * 0.42, V_HGT * 0.85, V_WID * 0.88);
    const carWindshieldGeo = new THREE.BoxGeometry(1.8, V_HGT * 0.75, V_WID * 0.82);
    const carWheelGeo = new THREE.CylinderGeometry(2.4, 2.4, 1.6, 12);
    const carWheelHubGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.7, 10);
    const carLightGeo = new THREE.BoxGeometry(1.5, 1.6, 1.9);
    const carGlassMat = new THREE.MeshStandardMaterial({
      color: 0x1a3a4a, emissive: 0x0a2535, emissiveIntensity: 0.4, roughness: 0.12, metalness: 0.5,
    });
    const wheelMat = mat(0x0c1012, 0.6, 0.1);
    const hubMat = mat(0xa0a8ac, 0.3, 0.7);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff8e0, emissiveIntensity: 2.5 });
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xff1e1e, emissive: 0xff1010, emissiveIntensity: 2.5 });

    function makeCar(colorHex) {
      const g = new THREE.Group();
      const bMat = mat(colorHex, 0.35, 0.5);
      const body = new THREE.Mesh(carBodyGeo, bMat); body.position.y = 4.2; g.add(body);
      const hood = new THREE.Mesh(carHoodGeo, bMat); hood.position.set(V_LEN * 0.36, 4, 0); g.add(hood);
      const trunk = new THREE.Mesh(carHoodGeo, bMat); trunk.position.set(-V_LEN * 0.36, 4, 0); g.add(trunk);
      const cabin = new THREE.Mesh(carCabinGeo, carGlassMat); cabin.position.set(-1, 8.8, 0); g.add(cabin);
      const ws = new THREE.Mesh(carWindshieldGeo, carGlassMat); ws.position.set(V_LEN * 0.18, 8.5, 0); g.add(ws);
      const rw = new THREE.Mesh(carWindshieldGeo, carGlassMat); rw.position.set(-V_LEN * 0.22, 8.5, 0); g.add(rw);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(V_LEN * 0.35, 0.4, V_WID * 0.6), mat(0x222222, 0.5, 0.3));
      roof.position.set(-1, 12, 0); g.add(roof);
      for (const wp of [
        [V_LEN * 0.32, V_WID * 0.48], [V_LEN * 0.32, -V_WID * 0.48],
        [-V_LEN * 0.32, V_WID * 0.48], [-V_LEN * 0.32, -V_WID * 0.48],
      ]) {
        const w = new THREE.Mesh(carWheelGeo, wheelMat); w.rotation.x = Math.PI / 2; w.position.set(wp[0], 2.8, wp[1]); g.add(w);
        const h = new THREE.Mesh(carWheelHubGeo, hubMat); h.rotation.x = Math.PI / 2; h.position.set(wp[0], 2.8, wp[1]); g.add(h);
      }
      for (const z of [-3.2, 3.2]) {
        const l = new THREE.Mesh(carLightGeo, headMat); l.position.set(V_LEN * 0.49, 4.5, z); g.add(l);
        const t = new THREE.Mesh(carLightGeo, tailMat); t.position.set(-V_LEN * 0.49, 4.5, z); g.add(t);
      }
      return g;
    }

    const outerRoute = [[-3600, -2400], [3600, -2400], [3600, 2400], [-3600, 2400]];
    const innerRoute = [[-1200, -1200], [1200, -1200], [1200, 1200], [-1200, 1200]];
    const midRoute = [[-2400, -1200], [2400, -1200], [2400, 1200], [-2400, 1200]];

    function routePoint(route, progress) {
      const scaled = progress * route.length;
      const i = Math.floor(scaled) % route.length;
      const n = (i + 1) % route.length;
      const t = scaled - Math.floor(scaled);
      const a = route[i], b = route[n];
      return {
        x: a[0] + (b[0] - a[0]) * t,
        z: a[1] + (b[1] - a[1]) * t,
        ax: a[0], az: a[1], bx: b[0], bz: b[1],
      };
    }

    function spawnCar(route, progress, dir, speed, laneOffset) {
      const c = makeCar(carColors[Math.floor(Math.random() * carColors.length)]);
      scene.add(c);
      const p = routePoint(route, progress);
      const dx = p.bx - p.ax, dz = p.bz - p.az;
      const len = Math.sqrt(dx * dx + dz * dz);
      const nx = dx / len, nz = dz / len;
      const perpX = -nz, perpZ = nx;
      c.position.set(p.x + perpX * laneOffset, 5.2, p.z + perpZ * laneOffset);
      let angle = -Math.atan2(dz, dx);
      if (dir < 0) angle += Math.PI;
      c.rotation.y = angle;
      cityCars.push({ car: c, route, progress, direction: dir, speed, baseSpeed: speed, laneOffset });
    }

    for (let i = 0; i < 8; i++) spawnCar(outerRoute, i / 8, 1, 0.38, -25);
    for (let i = 0; i < 8; i++) spawnCar(outerRoute, i / 8 + 0.5, -1, 0.38, 25);
    for (let i = 0; i < 6; i++) spawnCar(midRoute, i / 6, 1, 0.35, -22);
    for (let i = 0; i < 6; i++) spawnCar(midRoute, i / 6 + 0.5, -1, 0.35, 22);
    for (let i = 0; i < 5; i++) spawnCar(innerRoute, i / 5, 1, 0.32, -20);
    for (let i = 0; i < 5; i++) spawnCar(innerRoute, i / 5 + 0.5, -1, 0.32, 20);

    /* ───── PEOPLE ───── */
    const people = [];
    s.people = people;
    const skinColors = [0xf2c9a0, 0xd9a373, 0xa06a3c, 0x6b4a2f, 0xffd8b8];
    const shirtColors = [
      0xe74c3c, 0x3498db, 0x2ecc71, 0xf1c40f, 0x9b59b6,
      0x1abc9c, 0xe67e22, 0x34495e, 0xc0392b, 0x16a085,
      0xd35400, 0x8e44ad, 0x27ae60, 0x2980b9, 0xd81b60,
    ];
    const pantsColors = [0x2c3e50, 0x34495e, 0x1a252f, 0x4a4a4a, 0x3d3d3d];

    function makePerson() {
      const g = new THREE.Group();
      const skin = skinColors[Math.floor(Math.random() * skinColors.length)];
      const shirt = shirtColors[Math.floor(Math.random() * shirtColors.length)];
      const pants = pantsColors[Math.floor(Math.random() * pantsColors.length)];
      const skinMat = mat(skin, 0.9);
      const shirtMat = mat(shirt, 0.85);
      const pantsMat = mat(pants, 0.85);
      const head = new THREE.Mesh(new THREE.SphereGeometry(1.8, 6, 5), skinMat); head.position.y = 9; g.add(head);
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 5, 1.8), shirtMat); body.position.y = 5.5; g.add(body);
      const legL = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 1), pantsMat); legL.position.set(-0.7, 2, 0); g.add(legL);
      const legR = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 1), pantsMat); legR.position.set(0.7, 2, 0); g.add(legR);
      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.6, 0.8), shirtMat); armL.position.set(-2.1, 5.5, 0); g.add(armL);
      const armR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.6, 0.8), shirtMat); armR.position.set(2.1, 5.5, 0); g.add(armR);
      return { g, legL, legR, armL, armR };
    }

    function spawnPeople(cx, cz, count, radius) {
      for (let i = 0; i < count; i++) {
        const p = makePerson();
        const angle = Math.random() * Math.PI * 2;
        const r = radius * (0.5 + Math.random() * 0.5);
        p.g.position.set(cx + Math.cos(angle) * r, 5, cz + Math.sin(angle) * r);
        p.g.rotation.y = angle;
        scene.add(p.g);
        people.push({
          obj: p.g, legL: p.legL, legR: p.legR, armL: p.armL, armR: p.armR,
          cx, cz, r, angle,
          dir: Math.random() > 0.5 ? 1 : -1,
          speed: 0.005 + Math.random() * 0.008,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    spawnPeople(-600, -600, 12, 180);
    spawnPeople(600, -600, 12, 180);
    spawnPeople(-600, 600, 14, 200);
    spawnPeople(600, 600, 10, 180);
    spawnPeople(1800, -600, 8, 240);
    spawnPeople(600, 1800, 12, 220);
    spawnPeople(1800, 1750, 6, 160);
    spawnPeople(0, 0, 6, 130);

    /* ═══════════════════════════════════════════
       SIMULATION (AI + trucks + cars)
       ═══════════════════════════════════════════ */
    const sim = createCitySimulation({
      onTrafficUpdate, onSimTime, onCycleUpdate, onAiMessage, onAiReason,
    });
    s.sim = sim;

    /* Truck routes */
    const garbageRoute = [
      [-1200, -1200], [0, -1200], [1200, -1200], [1200, 0], [1200, 1200],
      [0, 1200], [-1200, 1200], [-1200, 0], [-1200, -1200],
      [-2400, -1200], [-2400, 0], [-2400, 1200], [-2400, 2400],
      [0, 2400], [1200, 2400], [2400, 2400], [2400, 1200],
      [2400, 0], [2400, -1200], [1200, -1200], [0, -1200], [-1200, -1200],
      [-2400, -1200], [-2400, -2400], [-1200, -2400], [0, -2400],
      [1200, -2400], [2400, -2400], [3600, -3600], [3600, -2400],
      [3600, -1200], [3600, 0], [3600, 1200], [3600, 2400], [3600, 3600],
      [2400, 3600], [1200, 2400], [0, 1200], [-1200, 0], [-1200, -1200],
    ];
    const fertRoute1 = [
      [1800, -1200], [1200, -1200], [1200, 0], [1200, 1200], [0, 1200],
      [-1200, 1200], [-2400, 1200], [-2400, 0], [-2400, -1200], [-2400, -2400],
      [-3600, -2400], [-3600, -3600], [-2400, -3600], [-1200, -3600], [0, -3600],
      [1200, -3600], [1200, -2400], [1200, -1200], [1800, -1200],
    ];
    const fertRoute2 = [
      [-3600, -3600], [-3600, -2400], [-3600, -1200], [-2400, -1200], [-1200, -1200],
      [-1200, 0], [-1200, 1200], [-1200, 2400], [-2400, 2400], [-3600, 2400],
      [-3600, 3600], [-2400, 3600], [-1200, 3600], [0, 3600], [1200, 3600],
      [1200, 2400], [1200, 1200], [1200, 0], [1200, -1200], [0, -1200],
      [-1200, -1200], [-2400, -1200], [-3600, -1200], [-3600, -2400], [-3600, -3600],
    ];
    const garbageState = { idx: 0, prog: 0 };
    const fert1State = { idx: 0, prog: 0 };
    const fert2State = { idx: 0, prog: 0 };

    function moveTruck(truck, route, state, delta, speed) {
      const from = route[state.idx];
      const to = route[(state.idx + 1) % route.length];
      state.prog += delta * speed;
      if (state.prog >= 1) { state.prog = 0; state.idx = (state.idx + 1) % route.length; }
      const x = from[0] + (to[0] - from[0]) * state.prog;
      const z = from[1] + (to[1] - from[1]) * state.prog;
      truck.position.set(x, 5.2, z);
      const dx = to[0] - from[0], dz = to[1] - from[1];
      if (Math.abs(dx) + Math.abs(dz) > 0.1) truck.rotation.y = -Math.atan2(dz, dx);
    }

    /* ───── RAYCASTER / CLICK ───── */
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onClick = (e) => {
      if (s.isLocked) return;
      if (e.target !== renderer.domElement) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      for (const item of clickable) {
        const hit = raycaster.intersectObject(item.object, true);
        if (hit.length) {
          let title = item.name || "Location";
          let type = "INFO";
          let text = "Details available.";
          switch (item.type) {
            case "school": type = "EDUCATION"; text = "Modern high school."; break;
            case "hospital": type = "HEALTHCARE"; text = "Smart hospital."; break;
            case "society": type = "RESIDENTIAL"; text = "Residential community."; break;
            case "bank": type = "FINANCIAL"; text = "Smart banking."; break;
            case "farm": type = "AGRICULTURE"; text = "Sustainable farming."; break;
            case "antenna": type = "ANTENNA"; text = "Communication antenna."; break;
            case "battery": type = "BATTERY"; text = "Energy storage."; break;
            case "shop": type = "SHOP"; text = "Snack shop."; break;
            case "marriageHall": type = "EVENT VENUE"; text = "Marriage hall."; break;
            case "gasStation": type = "AUTOMOTIVE"; text = "Gas station + car wash."; break;
            case "sewageCompany": type = "INDUSTRIAL"; text = "Water treatment."; break;
            case "garbageTruck": type = "MUNICIPAL"; text = "Truck collecting waste."; break;
            case "fertTruck": type = "FERTILIZER TRUCK"; text = "AI-managed truck."; break;
            case "filtrationMachine": type = "FILTRATION MACHINE"; text = "Skid filtration system."; break;
            case "wasteBin": type = "WASTE"; text = "Waste container for recycling."; break;
          }
          onPanel({ title, type, text });
          return;
        }
      }
      const ctrlHit = raycaster.intersectObject(controller, true);
      if (ctrlHit.length) {
        onPanel({ title: "AI Traffic Management Center", type: "INTELLIGENT TRANSPORTATION", text: "Monitors all 4 city entry routes." });
      }
    };
    renderer.domElement.addEventListener("click", onClick);

    /* ───── ANIMATION LOOP ───── */
    const clock = new THREE.Clock();
    let fc = 0;
    let rafId;

    const camT = camStateRef.current;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t = clock.elapsedTime;
      fc++;

      sim.tick(delta);

      /* City cars */
      for (const d of cityCars) {
        let speed = d.baseSpeed;
        if (sim.getState() === 1 && d.route === outerRoute) {
          const p = routePoint(d.route, d.progress);
          const dist = Math.sqrt(p.x * p.x + p.z * p.z);
          speed *= dist < 1100 ? 0.3 : 0.6;
        }
        d.progress += speed / 3200;
        if (d.progress > 1) d.progress -= 1;
        if (d.progress < 0) d.progress += 1;
        const p = routePoint(d.route, d.progress);
        const dx = p.bx - p.ax, dz = p.bz - p.az;
        const len = Math.sqrt(dx * dx + dz * dz);
        const nx = dx / len, nz = dz / len;
        d.car.position.set(p.x + -nz * d.laneOffset, 5.2, p.z + nx * d.laneOffset);
        let angle = -Math.atan2(dz, dx);
        if (d.direction < 0) angle += Math.PI;
        d.car.rotation.y = angle;
      }

      /* People */
      for (const p of people) {
        p.angle += p.speed * p.dir;
        if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;
        if (p.angle < 0) p.angle += Math.PI * 2;
        p.obj.position.x = p.cx + Math.cos(p.angle) * p.r;
        p.obj.position.z = p.cz + Math.sin(p.angle) * p.r;
        p.obj.rotation.y = p.angle + (p.dir > 0 ? Math.PI / 2 : -Math.PI / 2);
        const swing = Math.sin(t * 6 + p.phase) * 0.4;
        p.legL.rotation.x = swing;
        p.legR.rotation.x = -swing;
        p.armL.rotation.x = -swing * 0.7;
        p.armR.rotation.x = swing * 0.7;
      }

      /* Water */
      for (const wp of waterParticles) {
        wp.mesh.position.y += wp.speed * 0.4;
        if (wp.mesh.position.y > 105) {
          wp.mesh.position.y = 18;
          wp.mesh.position.x = (Math.random() - 0.5) * 180;
          wp.mesh.position.z = (Math.random() - 0.5) * 180;
        }
        wp.mesh.material.emissiveIntensity = 1.5 + Math.sin(t * 4) * 0.6;
      }

      /* Traffic lights */
      for (const l of trafficLights) {
        const cyc = (t + l.phase) % 12;
        l.r.material.emissiveIntensity = 0;
        l.y.material.emissiveIntensity = 0;
        l.gr.material.emissiveIntensity = 0;
        if (sim.getState() === 1) {
          if (cyc < 7) l.r.material.emissiveIntensity = 4;
          else if (cyc < 8.5) l.y.material.emissiveIntensity = 4;
          else l.gr.material.emissiveIntensity = 4;
        } else {
          if (cyc < 5) l.r.material.emissiveIntensity = 4;
          else if (cyc < 7) l.y.material.emissiveIntensity = 4;
          else l.gr.material.emissiveIntensity = 4;
        }
      }

      /* Trucks */
      moveTruck(garbageTruck, garbageRoute, garbageState, delta, 0.22);
      moveTruck(fertTruck1, fertRoute1, fert1State, delta, 0.20);
      moveTruck(fertTruck2, fertRoute2, fert2State, delta, 0.18);
      const blink = Math.floor(t * 2) % 2 === 0 ? 3 : 0.5;
      if (s.garbageWarn) s.garbageWarn.material.emissiveIntensity = blink;
      if (s.fertWarn1) s.fertWarn1.material.emissiveIntensity = blink;
      if (s.fertWarn2) s.fertWarn2.material.emissiveIntensity = blink;

      /* Turbines */
      if (fc % 2 === 0) for (const bl of turbines) bl.rotation.z = t * 2.4;

      radar.rotation.z = t * 1.7;
      controllerRing.rotation.z = t * 0.5;
      controllerRing2.rotation.z = -t * 0.4;
      controllerSig.scale.setScalar(1 + Math.sin(t * 4) * 0.15);

      /* Camera transitions */
      if (camT.camTransition) {
        const now = performance.now();
        const elapsed = now - camT.camTransition.startTime;
        const tt = Math.min(elapsed / camT.camTransition.duration, 1);
        const ease = tt < 0.5 ? 2 * tt * tt : 1 - Math.pow(-2 * tt + 2, 2) / 2;
        camera.position.lerpVectors(camT.camTransition.startPos, camT.camTransition.targetPos, ease);
        controls.target.lerpVectors(camT.camTransition.startLook, camT.camTransition.targetLook, ease);
        if (tt >= 1) camT.camTransition = null;
      }

      /* Follow target */
      if (camT.followTarget) {
        const target = camT.followTarget.position.clone();
        camera.position.lerp(target.clone().add(new THREE.Vector3(120, 90, 120)), 0.05);
        controls.target.lerp(target, 0.08);
      }

      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    /* ───── RESIZE / KEYBOARD ───── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("click", onClick);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onPanel, onTrafficUpdate, onSimTime, onCycleUpdate, onAiMessage, onAiReason]);

  /* Ref for camera state (bridges useImperativeHandle to scene internals) */
  const camStateRef = useRef({
    isLocked: false,
    lockedLocation: null,
    savedCamPos: null,
    savedCamTarget: null,
    camTransition: null,
    followTarget: null,
  });

  return <div ref={mountRef} style={{ position: "fixed", inset: 0 }} />;
});

export default SmartCity3D;
