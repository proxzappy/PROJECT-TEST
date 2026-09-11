export function createCitySimulation(callbacks) {
  const CYCLE_TIME = 60;
  const NORMAL_DURATION = 25;
  const JAM_DURATION = 20;
  const REROUTE_DURATION = 15;

  let simSec = 0;
  let tState = 0;
  let cycleStart = 0;
  let jamStart = 0;
  let rerouteStart = 0;

  function tick(delta) {
    simSec += delta;

    const tt = Math.floor(simSec);
    callbacks.onSimTime?.(
      String(Math.floor(tt / 60)).padStart(2, "0") +
        ":" +
        String(tt % 60).padStart(2, "0")
    );

    const now = simSec - cycleStart;
    if (tState === 0) {
      if (now >= CYCLE_TIME) {
        jamStart = simSec;
        setState(1);
        callbacks.onAiMessage?.("⚠ CARS QUEUING AT INTERSECTION");
      }
    } else if (tState === 1) {
      if (simSec - jamStart >= JAM_DURATION) {
        rerouteStart = simSec;
        setState(2);
        callbacks.onAiMessage?.("🤖 AI SPLITS TRAFFIC TO INNER ROADS");
      }
    } else if (tState === 2) {
      if (simSec - rerouteStart >= REROUTE_DURATION) {
        setState(3);
        callbacks.onAiMessage?.("✅ JAM CLEARED BY AI");
      }
    } else if (tState === 3) {
      if (simSec - rerouteStart >= REROUTE_DURATION + 10) {
        cycleStart = simSec;
        setState(0);
      }
    }

    const pct = Math.min(((simSec - cycleStart) / CYCLE_TIME) * 100, 100);
    let label = "";
    let visible = true;
    if (tState === 0) {
      label = "🚦 TRAFFIC EVENT IN " + Math.max(0, Math.ceil(CYCLE_TIME - now)) + "s";
    } else if (tState === 1) {
      label = "🔴 JAM ACTIVE — " + Math.max(0, Math.ceil(NORMAL_DURATION + JAM_DURATION - now)) + "s";
    } else if (tState === 2) {
      label = "🔵 AI REROUTING — " + Math.max(0, Math.ceil(NORMAL_DURATION + JAM_DURATION + REROUTE_DURATION - now)) + "s";
    } else {
      label = "🟢 RESOLVED";
      visible = false;
    }
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
      aiReason = {
        visible: true, title: "🔴 PROBLEM DETECTED",
        text: "<strong>REASON:</strong> Too many cars at central intersection.",
        result: "AI is <strong>reading the queue</strong> to figure out the best fix.",
      };
    } else if (s === 2) {
      t.state = "AI REROUTING"; t.stateColor = "#67e4ff";
      t.reason = "AI SPLITTING TRAFFIC TO INNER ROADS";
      t.level = "RECOVERING"; t.flow = "68%"; t.mode = "OPTIMIZING";
      t.incident = "<span>AI ACTION:</span> Rerouting cars via inner roads";
      aiReason = {
        visible: true, title: "🔵 AI IS ACTING",
        text: "<strong>AI DID THIS:</strong> Flipped signals to green on inner roads and redirected half the cars.",
        result: "Result: <strong>less cars at intersection → jam clearing.</strong>",
      };
    } else if (s === 3) {
      t.state = "TRAFFIC CLEAR"; t.stateColor = "#6aff9d";
      t.reason = "ALL ROUTES FLOWING NORMALLY";
      t.level = "CLEAR"; t.flow = "96%"; t.mode = "OPTIMAL";
      t.incident = "<span>SYSTEM:</span> All routes flowing normally";
      aiReason = {
        visible: true, title: "🟢 RESOLVED BY AI",
        text: "<strong>AI RESOLVED IT</strong> by splitting traffic between outer and inner roads.",
        result: "Jam cleared in <strong>15 seconds</strong>.",
      };
    }

    callbacks.onTrafficUpdate?.(t);
    if (s === 0) {
      callbacks.onAiReason?.({ visible: false, title: "", text: "", result: "" });
    } else if (aiReason) {
      callbacks.onAiReason?.(aiReason);
    }
  }

  function getState() { return tState; }

  return { tick, getState };
}
