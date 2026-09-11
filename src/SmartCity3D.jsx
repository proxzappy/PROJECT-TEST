import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/* ═══════════════════════════════════════════
   LOCATIONS CONFIG
   ═══════════════════════════════════════════ */
export const LOCATIONS = {
  school: {
    key: "school", label: "American High School", icon: "🏫", type: "EDUCATION",
    position: [-600, 5, -600], camHeight: 380, camDistance: 330,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  hospital: {
    key: "hospital", label: "Smart Hospital", icon: "🏥", type: "HEALTHCARE",
    position: [600, 5, -600], camHeight: 380, camDistance: 330,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  society: {
    key: "society", label: "BSS Smart Society", icon: "🏘", type: "RESIDENTIAL",
    position: [-600, 5, 600], camHeight: 500, camDistance: 500,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  bank: {
    key: "bank", label: "Smart City State Bank", icon: "🏦", type: "FINANCIAL",
    position: [600, 5, 600], camHeight: 380, camDistance: 330,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  farm: {
    key: "farm", label: "Smart Eco Farm", icon: "🌾", type: "AGRICULTURE",
    position: [1800, 5, -600], camHeight: 420, camDistance: 420,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  marriageHall: {
    key: "marriageHall", label: "Marriage Hall", icon: "💒", type: "EVENT VENUE",
    position: [600, 5, 1800], camHeight: 380, camDistance: 380,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  carWash: {
    key: "carWash", label: "Car Wash · Gas Station", icon: "🚗", type: "AUTOMOTIVE",
    position: [1800, 5, 1750], camHeight: 420, camDistance: 420,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  powerSupply: {
    key: "powerSupply", label: "Power Supply Zone", icon: "⚡", type: "RENEWABLE",
    position: [-3600, 5, 3600], camHeight: 800, camDistance: 900,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  filtration: {
    key: "filtration", label: "Filtration System", icon: "💧", type: "WATER TREATMENT",
    position: [3600, 5, -3600], camHeight: 420, camDistance: 380,
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
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  wasteManagement: {
    key: "wasteManagement", label: "Waste Management", icon: "♻", type: "MUNICIPAL",
    position: [3600, 5, 3600], camHeight: 450, camDistance: 480,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  cultureCenter: {
    key: "cultureCenter", label: "Culture Center", icon: "🏛", type: "CULTURAL",
    position: [-1800, 5, 1800], camHeight: 450, camDistance: 450,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  sewageCompany: {
    key: "sewageCompany", label: "Sewage & Gas Co.", icon: "🏭", type: "INDUSTRIAL",
    position: [1800, 5, 600], camHeight: 400, camDistance: 400,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
  trafficController: {
    key: "trafficController", label: "AI Traffic Controller", icon: "🤖", type: "TRANSPORTATION",
    position: [0, 5, 0], camHeight: 320, camDistance: 280,
    cameras: [
      { name: "Camera 1", angle: 0 }, { name: "Camera 2", angle: Math.PI },
      { name: "Camera 3", angle: Math.PI / 2 }, { name: "Camera 4", angle: -Math.PI / 2 },
      { name: "Top View", top: true },
    ],
  },
};

/* ═══════════════════════════════════════════
   AI TRAFFIC SIMULATION
   ═══════════════════════════════════════════ */
function createCitySimulation(callbacks) {
  const CYCLE_TIME = 60, NORMAL_DURATION = 25, JAM_DURATION = 20, REROUTE_DURATION = 15;
  let simSec = 0, tState = 0, cycleStart = 0, jamStart = 0, rerouteStart = 0;

  function tick(delta) {
    simSec += delta;
    const tt = Math.floor(simSec);
    callbacks.onSimTime?.(
      String(Math.floor(tt / 60)).padStart(2, "0") + ":" + String(tt % 60).padStart(2, "0")
    );

    const now = simSec - cycleStart;
    if (tState === 0) {
      if (now >= CYCLE_TIME) { jamStart = simSec; setState(1); callbacks.onAiMessage?.("⚠ CARS QUEUING AT INTERSECTION"); }
    } else if (tState === 1) {
      if (simSec - jamStart >= JAM_DURATION) { rerouteStart = simSec; setState(2); callbacks.onAiMessage?.("🤖 AI SPLITS TRAFFIC TO INNER ROADS"); }
    } else if (tState === 2) {
      if (simSec - rerouteStart >= REROUTE_DURATION) { setState(3); callbacks.onAiMessage?.("✅ JAM CLEARED BY AI"); }
    } else if (tState === 3) {
      if (simSec - rerouteStart >= REROUTE_DURATION + 10) { cycleStart = simSec; setState(0); }
    }

    const pct = Math.min(((simSec - cycleStart) / CYCLE_TIME) * 100, 100);
    let label = "", visible = true;
    if (tState === 0) label = "🚦 TRAFFIC EVENT IN " + Math.max(0, Math.ceil(CYCLE_TIME - now)) + "s";
    else if (tState === 1) label = "🔴 JAM ACTIVE — " + Math.max(0, Math.ceil(NORMAL_DURATION + JAM_DURATION - now)) + "s";
    else if (tState === 2) label = "🔵 AI REROUTING — " + Math.max(0, Math.ceil(NORMAL_DURATION + JAM_DURATION + REROUTE_DURATION - now)) + "s";
    else { label = "🟢 RESOLVED"; visible = false; }
    callbacks.onCycleUpdate?.(label, pct, visible);
  }

  function setState(s) {
    tState = s;
    const t = { state: "", stateColor: "", reason: "", level: "", flow: "", mode: "", incident: "" };
    let aiReason = null;
    if (s === 0) {
      t.state = "TRAFFIC NORMAL"; t.stateColor = "#63ddff";
      t.reason = "4-SITE NETWORK OPERATING NORMALLY";
      t.level = "NORMAL"; t.flow = "92%"; t.mode = "MONITORING";
      t.incident = "<span>LIVE:</span> Traffic flowing normally";
    } else if (s === 1) {
      t.state = "TRAFFIC JAM"; t.stateColor = "#ffd15a";
      t.reason = "QUEUE BUILDING AT CENTRAL INTERSECTION";
      t.level = "HEAVY"; t.flow = "28%"; t.mode = "ANALYZING";
      t.incident = "<span>INCIDENT:</span> Cars queuing";
      aiReason = { visible: true, title: "🔴 PROBLEM DETECTED",
        text: "<strong>REASON:</strong> Too many cars at central intersection.",
        result: "AI is <strong>reading the queue</strong> to figure out the best fix." };
    } else if (s === 2) {
      t.state = "AI REROUTING"; t.stateColor = "#67e4ff";
      t.reason = "AI SPLITTING TRAFFIC TO INNER ROADS";
      t.level = "RECOVERING"; t.flow = "68%"; t.mode = "OPTIMIZING";
      t.incident = "<span>AI ACTION:</span> Rerouting cars via inner roads";
      aiReason = { visible: true, title: "🔵 AI IS ACTING",
        text: "<strong>AI DID THIS:</strong> Flipped signals to green on inner roads and redirected half the cars.",
        result: "Result: <strong>less cars at intersection → jam clearing.</strong>" };
    } else if (s === 3) {
      t.state = "TRAFFIC CLEAR"; t.stateColor = "#6aff9d";
      t.reason = "ALL ROUTES FLOWING NORMALLY";
      t.level = "CLEAR"; t.flow = "96%"; t.mode = "OPTIMAL";
      t.incident = "<span>SYSTEM:</span> All routes flowing normally";
      aiReason = { visible: true, title: "🟢 RESOLVED BY AI",
        text: "<strong>AI RESOLVED IT</strong> by splitting traffic between outer and inner roads.",
        result: "Jam cleared in <strong>15 seconds</strong>." };
    }
    callbacks.onTrafficUpdate?.(t);
    if (s === 0) callbacks.onAiReason?.({ visible: false, title: "", text: "", result: "" });
    else if (aiReason) callbacks.onAiReason?.(aiReason);
  }

  return { tick, getState: () => tState };
}

/* ═══════════════════════════════════════════
   MAIN 3D COMPONENT
   ═══════════════════════════════════════════ */
const SmartCity3D = forwardRef((props, ref) => {
  const { onPanel, onTrafficUpdate, onSimTime, onCycleUpdate, onAiMessage, onAiReason } = props;
  const mountRef = useRef(null);

  const s = useRef({
    camera: null, controls: null, renderer: null, scene: null,
    isLocked: false, lockedLocation: null, followTarget: null,
    savedCamPos: null, savedCamTarget: null, camTransition: null,
    trucks: {}, people: [], cityCars: [], trafficLights: [],
    turbines: [], streetBulbMats: [], batteryRings: [],
    waterParticles: [], clickable: [],
    controller: null, radar: null, controllerRing: null, controllerRing2: null,
    controllerSig: null, garbageWarn: null, fertWarn1: null, fertWarn2: null,
    grassMaterial: null, roadMaterial: null, roadLaneMaterial: null,
    curbMaterial: null, sidewalkMat: null, ambient: null, sun: null,
    sim: null,
  }).current;

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

  function smoothCameraTo(targetPos, targetLook, duration = 1400) {
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
    if (!loc || !s.camera) return;
    s.isLocked = true; s.lockedLocation = key; s.followTarget = null;
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
    if (!loc || !s.camera) return;
    const cam = loc.cameras.find((c) => c.name === camName);
    if (!cam) return;
    s.isLocked = true; s.lockedLocation = key; s.followTarget = null;
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
    if (!s.camera) return;
    s.isLocked = false; s.lockedLocation = null; s.followTarget = null;
    if (s.savedCamPos && s.savedCamTarget) smoothCameraTo(s.savedCamPos, s.savedCamTarget);
    s.controls.enableRotate = true;
  }

  function followVehicle(key, onText) {
    if (!s.camera) return;
    s.isLocked = false; s.lockedLocation = null;
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
    if (!s.camera) return;
    s.isLocked = false; s.lockedLocation = null; s.followTarget = null;
    s.controls.enableRotate = true;
    smoothCameraTo(new THREE.Vector3(1400, 950, 1400), new THREE.Vector3(0, 5, 0), 1500);
  }

  function goToTopDown() {
    if (!s.camera) return;
    s.isLocked = false; s.lockedLocation = null; s.followTarget = null;
    s.controls.enableRotate = true;
    smoothCameraTo(new THREE.Vector3(0, 2800, 500), new THREE.Vector3(0, 0, 0), 1500);
  }

  function setDayNight(night) {
    if (!s.scene) return;
    const DAY_BG = new THREE.Color(0xa9dcf4);
    const NIGHT_BG = new THREE.Color(0x050810);
    if (night) {
      s.scene.background = NIGHT_BG.clone();
      s.scene.fog = new THREE.Fog(0x050810, 3500, 10000);
      s.ambient.intensity = 0.35; s.sun.intensity = 0.1;
    } else {
      s.scene.background = DAY_BG.clone();
      s.scene.fog = new THREE.Fog(0xa9dcf4, 3500, 10000);
      s.ambient.intensity = 3.7; s.sun.intensity = 3.5;
    }
    s.grassMaterial.color.setHex(night ? 0x14241a : 0x4d8f50);
    s.roadMaterial.color.setHex(night ? 0x080a0c : 0x20272a);
    s.roadLaneMaterial.color.setHex(night ? 0x060809 : 0x1a2023);
    s.curbMaterial.color.setHex(night ? 0x1e262a : 0x697578);
    s.sidewalkMat.color.setHex(night ? 0x30363a : 0x8a8f94);
    s.streetBulbMats.forEach((m) => { m.emissiveIntensity = night ? 6.0 : 0.9; });
    s.batteryRings.forEach((m) => { m.emissiveIntensity = night ? 5.0 : 1.5; });
  }

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    /* SCENE */
    const scene = new THREE.Scene();
    s.scene = scene;
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

    /* LIGHTS */
    const ambient = new THREE.HemisphereLight(0xf8fcff, 0x315c38, 3.7);
    scene.add(ambient); s.ambient = ambient;
    const sun = new THREE.DirectionalLight(0xffffff, 3.5);
    sun.position.set(-800, 1400, 500);
    scene.add(sun); s.sun = sun;

    /* MATERIALS */
    const mat = (c, r = 0.8, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
    const grassMaterial = mat(0x4d8f50, 0.98);
    const roadMaterial = mat(0x20272a, 0.96);
    const roadLaneMaterial = mat(0x1a2023, 0.96);
    const yellowLineMaterial = mat(0xf5c84b, 0.65);
    const whiteLineMaterial = mat(0xffffff, 0.65);
    const curbMaterial = mat(0x697578, 0.88);
    const darkMaterial = mat(0x182327, 0.65, 0.15);
    const blueMaterial = mat(0x087fa8, 0.35, 0.25);
    const sidewalkMat = mat(0x8a8f94, 0.9);
    s.grassMaterial = grassMaterial; s.roadMaterial = roadMaterial;
    s.roadLaneMaterial = roadLaneMaterial; s.curbMaterial = curbMaterial;
    s.sidewalkMat = sidewalkMat;

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), grassMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    /* ROADS */
    const ROAD_W = 90, ROAD_HALF = ROAD_W / 2, ROAD_LEN = 9600;
    const roadZs = [-2400, -1200, 0, 1200, 2400];
    const roadXs = [-2400, -1200, 0, 1200, 2400];

    function makeRoadE(x, z, length) {
      const shoulder = new THREE.Mesh(new THREE.BoxGeometry(length, 0.25, ROAD_W + 10), roadLaneMaterial);
      shoulder.position.set(x, 4.55, z); scene.add(shoulder);
      const r = new THREE.Mesh(new THREE.BoxGeometry(length, 0.45, ROAD_W), roadMaterial);
      r.position.set(x, 4.7, z); scene.add(r);
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(length, 0.1, 1.6), yellowLineMaterial);
      c1.position.set(x, 5, z - 2); scene.add(c1);
      const c2 = c1.clone(); c2.position.z = z + 2; scene.add(c2);
      const topLine = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 1.2), whiteLineMaterial);
      topLine.position.set(x, 5.05, z + ROAD_HALF - 5); scene.add(topLine);
      const botLine = topLine.clone(); botLine.position.z = z - ROAD_HALF + 5; scene.add(botLine);
      for (let lx = x - length / 2 + 20; lx < x + length / 2 - 10; lx += 55) {
        const d1 = new THREE.Mesh(new THREE.BoxGeometry(25, 0.09, 0.6), whiteLineMaterial);
        d1.position.set(lx, 5.06, z + ROAD_HALF / 2); scene.add(d1);
        const d2 = d1.clone(); d2.position.z = z - ROAD_HALF / 2; scene.add(d2);
      }
    }

    function makeRoadN(x, z, length) {
      const shoulder = new THREE.Mesh(new THREE.BoxGeometry(ROAD_W + 10, 0.25, length), roadLaneMaterial);
      shoulder.position.set(x, 4.55, z); scene.add(shoulder);
      const r = new THREE.Mesh(new THREE.BoxGeometry(ROAD_W, 0.45, length), roadMaterial);
      r.position.set(x, 4.7, z); scene.add(r);
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, length), yellowLineMaterial);
      c1.position.set(x - 2, 5, z); scene.add(c1);
      const c2 = c1.clone(); c2.position.x = x + 2; scene.add(c2);
      const leftLine = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, length), whiteLineMaterial);
      leftLine.position.set(x - ROAD_HALF + 5, 5.05, z); scene.add(leftLine);
      const rightLine = leftLine.clone(); rightLine.position.x = x + ROAD_HALF - 5; scene.add(rightLine);
      for (let lz = z - length / 2 + 20; lz < z + length / 2 - 10; lz += 55) {
        const d1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.09, 25), whiteLineMaterial);
        d1.position.set(x + ROAD_HALF / 2, 5.06, lz); scene.add(d1);
        const d2 = d1.clone(); d2.position.x = x - ROAD_HALF / 2; scene.add(d2);
      }
    }

    roadZs.forEach((z) => makeRoadE(0, z, ROAD_LEN));
    roadXs.forEach((x) => makeRoadN(x, 0, ROAD_LEN));

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

    /* BORDER */
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

    /* BOARD */
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

    /* STREET LIGHTS */
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

    /* TRAFFIC LIGHTS */
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

    /* AI CONTROLLER */
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

    /* GLB LOADER */
    const loader = new GLTFLoader();
    const clickable = [];
    s.clickable = clickable;

    function removeGroundFromGLB(model) {
      const toRemove = [];
      model.traverse((child) => {
        if (child.isMesh) {
          const name = (child.name || "").toLowerCase();
          if (name.includes("ground") || name.includes("floor") || name.includes("plane") ||
              name.includes("terrain") || name.includes("grass") || name === "base" || name.includes("_base")) {
            toRemove.push(child);
          }
        }
      });
      toRemove.forEach((m) => m.parent && m.parent.remove(m));
    }

    function prep(obj, size, stripGround = true) {
      if (stripGround) removeGroundFromGLB(obj);
      const box = new THREE.Box3().setFromObject(obj);
      const sz = new THREE.Vector3(); box.getSize(sz);
      const maxD = Math.max(sz.x, sz.y, sz.z);
      obj.scale.setScalar(size / Math.max(maxD, 0.001));
      const b2 = new THREE.Box3().setFromObject(obj);
      const c = new THREE.Vector3(); b2.getCenter(c);
      obj.position.x -= c.x; obj.position.z -= c.z; obj.position.y -= b2.min.y;
    }

    function bld(file, size, pos, type, name, borderColor, stripGround = true) {
      const url = file.startsWith("/") ? file : "/" + file;
      loader.load(
        url,
        (g) => {
          const b = g.scene;
          prep(b, size, stripGround);
          b.position.set(pos[0], 5, pos[1]);
          scene.add(b);
          clickable.push({ object: b, type, name: name || type });
          buildingBorder(pos[0], pos[1], size * 1.4, size * 1.4, borderColor || 0x22cfff);
        },
        undefined,
        (err) => console.warn("GLB load failed:", url, err)
      );
    }

    /* NATURE */
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

    function isOnRoad(x, z) {
      const clear = 120;
      for (const rz of roadZs) if (Math.abs(z - rz) < clear) return true;
      for (const rx of roadXs) if (Math.abs(x - rx) < clear) return true;
      return false;
    }

    const occupiedSpots = [
      { x: -600, z: -600, r: 260 }, { x: 600, z: -600, r: 250 },
      { x: 600, z: 600, r: 300 },
      { x: 1800, z: -600, r: 400 }, { x: 600, z: 1800, r: 290 },
      { x: 1800, z: 1750, r: 320 }, { x: 1800, z: 600, r: 290 },
      { x: 0, z: 0, r: 130 },
      { x: -3600, z: 3600, r: 900 }, { x: 3600, z: -3600, r: 600 },
      { x: -3600, z: -3600, r: 600 }, { x: 3600, z: 3600, r: 600 },
      { x: -1800, z: 1800, r: 400 },
    ];
    function isOnBuilding(x, z) {
      for (const o of occupiedSpots) {
        const dx = x - o.x, dz = z - o.z;
        if (dx * dx + dz * dz < o.r * o.r) return true;
      }
      return false;
    }
    function isFree(x, z) { return !isOnRoad(x, z) && !isOnBuilding(x, z); }

    /* ═══════════════════════════════════════════
       TOWER COLORS
       ═══════════════════════════════════════════ */
    const TOWER_COLORS = [
      0x5b9bd5, 0x4a90e2, 0x7bb3e0, 0x6ba3d9, 0x82c0e8, 0x5090d0,
      0xc0629b, 0xd475a8, 0xb84f8a, 0xe087b6,
      0xf5a623, 0xf7b955, 0xe89b3e, 0xffc866,
      0x6cd4a0, 0x4ec39a, 0x8adbb8, 0x5bc08a,
      0x9b7ad9, 0xaa8ae0, 0x8a66c9, 0xbaa0e8,
      0xe8635c, 0xd94f4a, 0xf0776b,
      0x4a4a5c, 0x5a5a6e, 0x3d3d4e, 0x6a6a7e,
      0xdde0e3, 0xc8ccd0, 0xb0b5bb,
      0x22a5b8, 0x2bb8c9, 0x40c9d9,
    ];

    function tallTower(x, z, w, h, d, color) {
      const g = new THREE.Group();
      g.position.set(x, 5, z);

      const bMat = mat(color, 0.4, 0.55);
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bMat);
      body.position.y = h / 2;
      g.add(body);

      const capMat = mat(0x2a2a35, 0.5, 0.6);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(w * 0.95, 6, d * 0.95), capMat);
      cap.position.y = h + 3;
      g.add(cap);

      if (Math.random() > 0.3) {
        const antH = 30 + Math.random() * 50;
        const antMat = mat(0x9a9a9a, 0.4, 0.8);
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, antH, 6), antMat);
        ant.position.y = h + 6 + antH / 2;
        g.add(ant);

        const beacon = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xff2222, emissiveIntensity: 4 }));
        beacon.position.y = h + 6 + antH;
        g.add(beacon);
      }

      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x1a2a3a,
        emissive: 0x66ccff,
        emissiveIntensity: 0.5,
        metalness: 0.6,
        roughness: 0.2,
      });

      const floors = Math.max(8, Math.floor(h / 12));
      for (let f = 1; f < floors; f++) {
        const fy = (h / floors) * f;
        const line = new THREE.Mesh(
          new THREE.BoxGeometry(w + 0.5, 0.5, d + 0.5),
          glassMat
        );
        line.position.y = fy;
        g.add(line);
      }

      const stripeMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.8,
        metalness: 0.7,
        roughness: 0.2,
      });
      const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, h * 0.95, 0.6), stripeMat);
      stripe1.position.set(-w / 2 - 0.2, h / 2, 0);
      g.add(stripe1);
      const stripe2 = stripe1.clone();
      stripe2.position.x = w / 2 + 0.2;
      g.add(stripe2);

      const lightColor = [0xff6666, 0x66ff99, 0x66aaff, 0xffdd66, 0xff66dd][Math.floor(Math.random() * 5)];
      const spot = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10),
        new THREE.MeshStandardMaterial({ color: lightColor, emissive: lightColor, emissiveIntensity: 3 }));
      spot.position.y = h + 8;
      g.add(spot);

      scene.add(g);
    }

    function buildTowerCluster(centerX, centerZ, count, spreadX, spreadZ, minH, maxH) {
      for (let i = 0; i < count; i++) {
        const tx = centerX + (Math.random() - 0.5) * spreadX;
        const tz = centerZ + (Math.random() - 0.5) * spreadZ;
        if (isOnRoad(tx, tz)) continue;

        const w = 20 + Math.random() * 20;
        const d = 20 + Math.random() * 20;
        const h = minH + Math.random() * (maxH - minH);
        const color = TOWER_COLORS[Math.floor(Math.random() * TOWER_COLORS.length)];

        tallTower(tx, tz, w, h, d, color);
      }
    }

    /* ═══════════════════════════════════════════
       SOLAR PANEL (small unit)
       ═══════════════════════════════════════════ */
    const solarPanelMat = new THREE.MeshStandardMaterial({
      color: 0x082c4b,
      roughness: 0.18,
      metalness: 0.7,
      emissive: 0x063b62,
      emissiveIntensity: 0.7,
    });
    const solarFrameMat = mat(0x2a2a35, 0.5, 0.6);

    function solarPanelUnit(x, z, rotY = 0) {
      const g = new THREE.Group();
      g.position.set(x, 5, z);
      g.rotation.y = rotY;

      /* Frame */
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(28, 2, 20),
        solarFrameMat
      );
      frame.position.y = 3;
      g.add(frame);

      /* Panel surface (tilted) */
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(26, 0.6, 18),
        solarPanelMat
      );
      panel.position.y = 4.2;
      panel.rotation.x = -0.2;
      g.add(panel);

      /* Support legs */
      const legMat = mat(0x555a5e, 0.5, 0.7);
      const legGeo = new THREE.CylinderGeometry(0.6, 0.6, 3, 6);
      for (const lx of [-10, 10]) {
        for (const lz of [-7, 7]) {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(lx, 1.5, lz);
          g.add(leg);
        }
      }

      scene.add(g);
    }

    /* ═══════════════════════════════════════════
       PROPER SOCIETY — with border, towers, solar panels
       ═══════════════════════════════════════════ */
    function buildSociety(centerX, centerZ) {
      const SOCIETY_W = 850;      /* Width along X */
      const SOCIETY_D = 850;      /* Depth along Z */
      const HALF_W = SOCIETY_W / 2;
      const HALF_D = SOCIETY_D / 2;

      const SOCIETY_GREEN = 0x2ecc71;   /* Green border */
      const societyBorderMat = new THREE.MeshStandardMaterial({
        color: SOCIETY_GREEN, emissive: SOCIETY_GREEN, emissiveIntensity: 2.4,
        metalness: 0.6, roughness: 0.25,
      });

      /* ───── Inner ground (light concrete) ───── */
      const innerGround = new THREE.Mesh(
        new THREE.BoxGeometry(SOCIETY_W - 30, 0.6, SOCIETY_D - 30),
        mat(0xb8bcc0, 0.92)
      );
      innerGround.position.set(centerX, 4.85, centerZ);
      scene.add(innerGround);

      /* Green grass pad (below, extends beyond society) */
      const grassPad = new THREE.Mesh(
        new THREE.BoxGeometry(SOCIETY_W + 50, 0.4, SOCIETY_D + 50),
        grassMaterial
      );
      grassPad.position.set(centerX, 4.6, centerZ);
      scene.add(grassPad);

      /* ───── Big boundary walls ───── */
      const WALL_H = 14;
      const WALL_T = 6;

      /* Front (Z+) */
      const wallF = new THREE.Mesh(new THREE.BoxGeometry(SOCIETY_W + 12, WALL_H, WALL_T), societyBorderMat);
      wallF.position.set(centerX, 5 + WALL_H / 2, centerZ + HALF_D + 6);
      scene.add(wallF);

      /* Back (Z-) */
      const wallB = wallF.clone();
      wallB.position.z = centerZ - HALF_D - 6;
      scene.add(wallB);

      /* Left (X-) */
      const wallL = new THREE.Mesh(new THREE.BoxGeometry(WALL_T, WALL_H, SOCIETY_D + 12), societyBorderMat);
      wallL.position.set(centerX - HALF_W - 6, 5 + WALL_H / 2, centerZ);
      scene.add(wallL);

      /* Right (X+) */
      const wallR = wallL.clone();
      wallR.position.x = centerX + HALF_W + 6;
      scene.add(wallR);

      /* ───── 4 corner towers (bigger) ───── */
      for (const dx of [-1, 1]) {
        for (const dz of [-1, 1]) {
          const cx = centerX + dx * (HALF_W + 6);
          const cz = centerZ + dz * (HALF_D + 6);

          /* Tower base */
          const p = new THREE.Mesh(
            new THREE.CylinderGeometry(8, 10, 40, 12),
            societyBorderMat
          );
          p.position.set(cx, 25, cz);
          scene.add(p);

          /* Glowing cap */
          const cap = new THREE.Mesh(
            new THREE.SphereGeometry(6, 12, 12),
            new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: SOCIETY_GREEN,
              emissiveIntensity: 3.5,
            })
          );
          cap.position.set(cx, 48, cz);
          scene.add(cap);
        }
      }

      /* ───── Gate entrance (front) ───── */
      const gateX = centerX;
      const gateZ = centerZ + HALF_D + 6;
      const gateLeft = new THREE.Mesh(
        new THREE.BoxGeometry(10, 30, 12),
        societyBorderMat
      );
      gateLeft.position.set(gateX - 50, 20, gateZ);
      scene.add(gateLeft);
      const gateRight = gateLeft.clone();
      gateRight.position.x = gateX + 50;
      scene.add(gateRight);
      const gateTop = new THREE.Mesh(
        new THREE.BoxGeometry(120, 8, 12),
        societyBorderMat
      );
      gateTop.position.set(gateX, 34, gateZ);
      scene.add(gateTop);

      /* ───── TALL TOWERS inside society ───── */
      /* Layout: 4 rows x 3 columns = 12 towers */
      const towerRows = 4;
      const towerCols = 3;
      const innerMargin = 100;
      const usableW = SOCIETY_W - innerMargin * 2;
      const usableD = SOCIETY_D - innerMargin * 2;

      for (let r = 0; r < towerRows; r++) {
        for (let c = 0; c < towerCols; c++) {
          const tx = centerX - usableW / 2 + (c + 0.5) * (usableW / towerCols);
          const tz = centerZ - usableD / 2 + (r + 0.5) * (usableD / towerRows);

          const w = 28 + Math.random() * 14;
          const d = 28 + Math.random() * 14;
          const h = 180 + Math.random() * 180;
          const color = TOWER_COLORS[Math.floor(Math.random() * TOWER_COLORS.length)];

          tallTower(tx, tz, w, h, d, color);
        }
      }

      /* ───── Solar panels row (front of society) ───── */
      const solarZ = centerZ + HALF_D - 60;
      for (let i = 0; i < 6; i++) {
        const sx = centerX - 250 + i * 100;
        solarPanelUnit(sx, solarZ, 0);
      }

      /* ───── Solar panels row (back of society) ───── */
      const solarZ2 = centerZ - HALF_D + 60;
      for (let i = 0; i < 6; i++) {
        const sx = centerX - 250 + i * 100;
        solarPanelUnit(sx, solarZ2, Math.PI);
      }

      /* ───── Society sign board ───── */
      board("BSS SMART SOCIETY", centerX, 5, centerZ + HALF_D + 100, 280, 18, SOCIETY_GREEN);

      /* ───── Trees inside society ───── */
      for (let i = 0; i < 20; i++) {
        const tx = centerX + (Math.random() - 0.5) * (SOCIETY_W - 200);
        const tz = centerZ + (Math.random() - 0.5) * (SOCIETY_D - 200);
        /* Skip if too close to a tower position */
        tree(tx, tz, 0.6 + Math.random() * 0.5);
      }
    }

    /* ═══════════════════════════════════════════
       BUILD SOCIETY at [-600, 600]
       ═══════════════════════════════════════════ */
    const SOCIETY_X = -600;
    const SOCIETY_Z = 600;
    buildSociety(SOCIETY_X, SOCIETY_Z);

    /* Society building info — for click */
    const societyGroup = new THREE.Group();
    societyGroup.position.set(SOCIETY_X, 0, SOCIETY_Z);
    clickable.push({ object: societyGroup, type: "society", name: "BSS Smart Society" });

    /* ═══════════════════════════════════════════
       NAYI TALL TOWERS — scattered around city
       ═══════════════════════════════════════════ */
    buildTowerCluster(-900, -900, 5, 300, 300, 200, 320);
    buildTowerCluster(900, -900, 5, 300, 300, 200, 320);
    buildTowerCluster(900, 900, 5, 300, 300, 220, 340);

    buildTowerCluster(-3300, -3300, 6, 500, 500, 240, 400);
    buildTowerCluster(3300, -3300, 6, 500, 500, 240, 400);
    buildTowerCluster(-3300, 3300, 6, 500, 500, 240, 400);
    buildTowerCluster(3300, 3300, 6, 500, 500, 240, 400);

    buildTowerCluster(-3300, 0, 4, 300, 400, 220, 380);
    buildTowerCluster(3300, 0, 4, 300, 400, 220, 380);
    buildTowerCluster(0, -3300, 4, 400, 300, 220, 380);
    buildTowerCluster(0, 3300, 4, 400, 300, 220, 380);

    buildTowerCluster(-1500, -1500, 4, 400, 400, 180, 300);
    buildTowerCluster(1500, -1500, 4, 400, 400, 180, 300);
    buildTowerCluster(1500, 1500, 4, 400, 400, 180, 300);

    buildTowerCluster(-4500, 0, 3, 300, 500, 300, 450);
    buildTowerCluster(4500, 0, 3, 300, 500, 300, 450);
    buildTowerCluster(0, -4500, 3, 500, 300, 300, 450);
    buildTowerCluster(0, 4500, 3, 500, 300, 300, 450);

    /* ═══════════════════════════════════════════
       GLB BUILDINGS
       ═══════════════════════════════════════════ */
    bld("/american_high_school.glb", 300, [-600, -600], "school", "American High School", 0x1a5490);
    bld("/low_poly_hospital.glb", 280, [600, -600], "hospital", "Smart Hospital", 0xc0392b);
    bld("/us_bank_tower.glb", 360, [600, 600], "bank", "State Bank", 0x8e44ad);
    bld("/simple_farm_free.glb", 520, [1800, -600], "farm", "Smart Eco Farm", 0x27ae60);
    bld("/great_hall.glb", 360, [600, 1800], "marriageHall", "Marriage Hall", 0xd4a017);
    bld("/gas_station.glb", 380, [1800, 1750], "gasStation", "Gas Station · Car Wash", 0xc0392b);
    buildingBorder(1800, 1750, 520, 520, 0xc0392b);

    bld("/office.glb", 380, [1800, 600], "sewageCompany", "Sewage & Gas Co.", 0x2ecc71);
    bld("/brutalist_building.glb", 300, [2200, 600], "sewageCompanyOld", "Old Office Building", 0x34495e);
    bld("/national_archives_research_center.glb", 480, [-1800, 1800], "cultureCenter", "Culture Center", 0xf39c12);

    /* Boards */
    board("AMERICAN HIGH SCHOOL", -600, 5, -950, 200, 14, 0x1a5490);
    board("BSS SMART HOSPITAL", 600, 5, -950, 200, 14, 0xc0392b);
    board("SMART CITY STATE BANK", 600, 5, 950, 200, 14, 0x8e44ad);
    board("SMART ECO FARM", 1800, 5, -950, 200, 14, 0x27ae60);
    board("MARRIAGE HALL", 600, 5, 2250, 220, 16, 0xd4a017);
    board("CAR WASH · GAS STATION", 1800, 5, 2200, 220, 16, 0xc0392b);
    board("SEWAGE & GAS CO.", 1800, 5, 300, 240, 16, 0x2ecc71);
    board("CULTURE CENTER", -1800, 5, 2400, 260, 18, 0xf39c12);
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
        (err) => console.warn("Shop GLB failed", err)
      );
    }
    shop(-1000, -600, 1.4, "School Canteen");
    shop(1000, -600, 1.4, "Hospital Canteen");
    shop(1000, 600, 1.4, "Bank Shop");

    /* POWER SUPPLY */
    const powerZone = new THREE.Group();
    powerZone.position.set(-3600, 0, 3600);
    scene.add(powerZone);
    board("POWER SUPPLY (SMART-CITY)", -3600, 5, 4500, 420, 20, 0x0a4d5c);
    const powerPad = new THREE.Mesh(new THREE.BoxGeometry(1600, 1, 1300), mat(0x1d3a2e, 0.92));
    powerPad.position.y = 4.2; powerZone.add(powerPad);
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
      const t = new THREE.Mesh(turbTowerGeo, turbTowerMat); t.position.y = 34; g.add(t);
      const blades = new THREE.Group(); blades.position.y = 68;
      for (let i = 0; i < 3; i++) {
        const b = new THREE.Mesh(turbBladeGeo, turbTowerMat);
        b.position.y = 12.5; b.rotation.z = i * Math.PI * 2 / 3;
        blades.add(b);
      }
      g.add(blades); powerZone.add(g); turbines.push(blades);
    }
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 4; col++)
        turbine(-650 + col * 200, -600 + row * 220, 1 + (row % 3) * 0.08);

    const solarPark = new THREE.Group();
    solarPark.position.set(500, 0, 0); powerZone.add(solarPark);
    const solarGround = new THREE.Mesh(new THREE.BoxGeometry(650, 0.8, 1250), mat(0x2a4536, 0.92));
    solarGround.position.y = 5; solarPark.add(solarGround);
    const solarPanelGeo = new THREE.BoxGeometry(1, 1, 1);
    function solarArray(x, z, w, d, rows, cols) {
      const g = new THREE.Group(); g.position.set(x, 8, z); g.rotation.x = -0.22;
      const pw = w / cols - 3, pd = d / rows - 3;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const p = new THREE.Mesh(solarPanelGeo, solarPanelMat);
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
    solarControl.position.set(0, 38, 0); solarPark.add(solarControl);
    const solarScreen = new THREE.Mesh(new THREE.BoxGeometry(22, 13, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x04151d, emissive: 0x20d9ff, emissiveIntensity: 2.6 }));
    solarScreen.position.set(0, 42, -14.4); solarPark.add(solarScreen);

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

    /* FILTRATION */
    const filtZone = new THREE.Group();
    filtZone.position.set(3600, 0, -3600); scene.add(filtZone);
    board("FILTRATION SYSTEM", 3600, 5, -2700, 380, 18, 0x22cfff);
    const filtPad = new THREE.Mesh(new THREE.BoxGeometry(950, 1, 950), mat(0x1a2836, 0.95));
    filtPad.position.y = 4.2; filtZone.add(filtPad);
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
    filtBoxGroup.position.set(0, 5, 0); filtZone.add(filtBoxGroup);
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
    }, undefined, () => console.warn("Filtration GLB missing"));

    const waterParticles = [];
    s.waterParticles = waterParticles;
    for (let i = 0; i < 30; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(1.2, 6, 6),
        new THREE.MeshStandardMaterial({ color: 0x22cfff, emissive: 0x22cfff, emissiveIntensity: 2.5 }));
      p.position.set((Math.random() - 0.5) * 190, 20 + Math.random() * 80, (Math.random() - 0.5) * 190);
      filtBoxGroup.add(p);
      waterParticles.push({ mesh: p, speed: 0.4 + Math.random() * 0.6 });
    }

    /* FERTILIZER */
    const fertZone = new THREE.Group();
    fertZone.position.set(-3600, 0, -3600); scene.add(fertZone);
    board("AI FERTILIZER SYSTEM", -3600, 5, -2700, 420, 22, 0x8e44ad);
    const fertPad = new THREE.Mesh(new THREE.BoxGeometry(950, 1, 950), mat(0x2a1e3a, 0.95));
    fertPad.position.y = 4.2; fertZone.add(fertPad);
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

    /* WASTE MANAGEMENT */
    const wasteZone = new THREE.Group();
    wasteZone.position.set(3600, 0, 3600); scene.add(wasteZone);
    board("WASTE MANAGEMENT", 3600, 5, 4500, 380, 18, 0x2ecc71);
    const wastePad = new THREE.Mesh(new THREE.BoxGeometry(950, 1, 950), mat(0x2a3a2e, 0.95));
    wastePad.position.y = 4.2; wasteZone.add(wastePad);
    const wasteBorderMat = new THREE.MeshStandardMaterial({
      color: 0x2ecc71, emissive: 0x2ecc71, emissiveIntensity: 2.2, metalness: 0.6, roughness: 0.2,
    });
    const wbF = new THREE.Mesh(new THREE.BoxGeometry(950, 1.4, 5), wasteBorderMat);
    wbF.position.set(0, 6.5, -475); wasteZone.add(wbF);
    const wbB = wbF.clone(); wbB.position.z = 475; wasteZone.add(wbB);
    const wbL = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 950), wasteBorderMat);
    wbL.position.set(-475, 6.5, 0); wasteZone.add(wbL);
    const wbR = wbL.clone(); wbR.position.x = 475; wasteZone.add(wbR);

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

    /* TRUCKS */
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
    s.trucks.garbage = garbageTruck; s.garbageWarn = g1.warn;

    const g2 = buildTruck(0xb266ff, 0x7a3b9d, "AI FERTILIZER", "#8e44ad");
    const fertTruck1 = g2.truck; scene.add(fertTruck1);
    s.trucks.fert1 = fertTruck1; s.fertWarn1 = g2.warn;

    const g3 = buildTruck(0xd8b3ff, 0x8e44ad, "AI FERTILIZER", "#8e44ad");
    const fertTruck2 = g3.truck; scene.add(fertTruck2);
    s.trucks.fert2 = fertTruck2; s.fertWarn2 = g3.warn;

    /* CARS */
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
      return { x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, ax: a[0], az: a[1], bx: b[0], bz: b[1] };
    }

    function spawnCar(route, progress, dir, speed, laneOffset) {
      const c = makeCar(carColors[Math.floor(Math.random() * carColors.length)]);
      scene.add(c);
      const p = routePoint(route, progress);
      const dx = p.bx - p.ax, dz = p.bz - p.az;
      const len = Math.sqrt(dx * dx + dz * dz);
      const nx = dx / len, nz = dz / len;
      c.position.set(p.x + -nz * laneOffset, 5.2, p.z + nx * laneOffset);
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

    /* PEOPLE */
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
    spawnPeople(-600, 600, 20, 350);   /* Society — zyada log */
    spawnPeople(600, 600, 10, 180);
    spawnPeople(1800, -600, 8, 240);
    spawnPeople(600, 1800, 12, 220);
    spawnPeople(1800, 1750, 6, 160);
    spawnPeople(0, 0, 6, 130);
    spawnPeople(-1800, 1800, 14, 200);

    /* NATURE FILL */
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

    /* SIMULATION */
    const sim = createCitySimulation({
      onTrafficUpdate, onSimTime, onCycleUpdate, onAiMessage, onAiReason,
    });
    s.sim = sim;

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
            case "society": type = "RESIDENTIAL"; text = "BSS Smart Society with 12 towers, solar panels & green border."; break;
            case "bank": type = "FINANCIAL"; text = "Smart banking."; break;
            case "farm": type = "AGRICULTURE"; text = "Sustainable farming."; break;
            case "antenna": type = "ANTENNA"; text = "Communication antenna."; break;
            case "battery": type = "BATTERY"; text = "Energy storage."; break;
            case "shop": type = "SHOP"; text = "Snack shop."; break;
            case "marriageHall": type = "EVENT VENUE"; text = "Marriage hall."; break;
            case "gasStation": type = "AUTOMOTIVE"; text = "Gas station + car wash."; break;
            case "sewageCompany": type = "INDUSTRIAL"; text = "Sewage & gas company."; break;
            case "sewageCompanyOld": type = "INDUSTRIAL"; text = "Old office building."; break;
            case "cultureCenter": type = "CULTURAL"; text = "Culture Center."; break;
            case "filtrationMachine": type = "FILTRATION MACHINE"; text = "Skid filtration system."; break;
            case "wasteBin": type = "WASTE"; text = "Waste container."; break;
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

    /* ANIMATION */
    const clock = new THREE.Clock();
    let fc = 0;
    let rafId;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t = clock.elapsedTime;
      fc++;

      sim.tick(delta);

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
        d.car.position.set(p.x + -(dz / len) * d.laneOffset, 5.2, p.z + (dx / len) * d.laneOffset);
        let angle = -Math.atan2(dz, dx);
        if (d.direction < 0) angle += Math.PI;
        d.car.rotation.y = angle;
      }

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

      for (const wp of waterParticles) {
        wp.mesh.position.y += wp.speed * 0.4;
        if (wp.mesh.position.y > 105) {
          wp.mesh.position.y = 18;
          wp.mesh.position.x = (Math.random() - 0.5) * 180;
          wp.mesh.position.z = (Math.random() - 0.5) * 180;
        }
        wp.mesh.material.emissiveIntensity = 1.5 + Math.sin(t * 4) * 0.6;
      }

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

      moveTruck(garbageTruck, garbageRoute, garbageState, delta, 0.22);
      moveTruck(fertTruck1, fertRoute1, fert1State, delta, 0.20);
      moveTruck(fertTruck2, fertRoute2, fert2State, delta, 0.18);
      const blink = Math.floor(t * 2) % 2 === 0 ? 3 : 0.5;
      if (s.garbageWarn) s.garbageWarn.material.emissiveIntensity = blink;
      if (s.fertWarn1) s.fertWarn1.material.emissiveIntensity = blink;
      if (s.fertWarn2) s.fertWarn2.material.emissiveIntensity = blink;

      if (fc % 2 === 0) for (const bl of turbines) bl.rotation.z = t * 2.4;

      radar.rotation.z = t * 1.7;
      controllerRing.rotation.z = t * 0.5;
      controllerRing2.rotation.z = -t * 0.4;
      controllerSig.scale.setScalar(1 + Math.sin(t * 4) * 0.15);

      if (s.camTransition) {
        const now = performance.now();
        const elapsed = now - s.camTransition.startTime;
        const tt = Math.min(elapsed / s.camTransition.duration, 1);
        const ease = tt < 0.5 ? 2 * tt * tt : 1 - Math.pow(-2 * tt + 2, 2) / 2;
        camera.position.lerpVectors(s.camTransition.startPos, s.camTransition.targetPos, ease);
        controls.target.lerpVectors(s.camTransition.startLook, s.camTransition.targetLook, ease);
        if (tt >= 1) s.camTransition = null;
      }

      if (s.followTarget) {
        const target = s.followTarget.position.clone();
        camera.position.lerp(target.clone().add(new THREE.Vector3(120, 90, 120)), 0.05);
        controls.target.lerp(target, 0.08);
      }

      controls.update();
      renderer.render(scene, camera);
    }
    animate();

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
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: "fixed", inset: 0 }} />;
});

export default SmartCity3D;
