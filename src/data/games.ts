export type ScraplingsGame = {
  id: string;
  title: string;
  tagline: string;
  blurb: string;
  status: string;
  genre: string;
  platform: string;
  release: string;
  features: string[];
  bestiary: { id: string; name: string }[];
};

export type SpectralSabreGame = {
  id: string;
  title: string;
  tagline: string;
  blurb: string;
  status: string;
  genre: string;
  platform: string;
  release: string;
  features: string[];
  operators: {
    id: string;
    img: string;
    codename: string;
    role: string;
    speciality: string;
    bio: string;
  }[];
  pillars: { num: string; title: string; body: string }[];
  systems: { tag: string; title: string; body: string }[];
  kipLines: string[];
};

export const SCRAPLINGS: ScraplingsGame = {
  id: "scraplings",
  title: "Scraplings",
  tagline: "A cosy collector. Salvage the forgotten — give it a soul.",
  blurb:
    "Scraplings is a vertical mobile game about scavenging discarded objects from a quiet, abandoned world and recycling them into Scraplings: tiny creatures stitched together from junk and small kindnesses. Build a sanctuary. Memorize their songs. Watch them remember you.",
  status: "Pre-production",
  genre: "Cosy / Collector",
  platform: "iOS · Android",
  release: "Pre-production",
  features: [
    "100+ unique Scraplings to discover, name and bond with",
    "Hand-painted vertical worlds you peel back layer by layer",
    "Adaptive ambient soundtrack that responds to your play",
    "Offline-first — your sanctuary lives on your device",
    "No timers, no energy bars, no dark patterns. Ever.",
    "Ghostline ID support planned for future profile and save features",
  ],
  bestiary: [
    { id: "001", name: "Tinhart" },
    { id: "002", name: "Rustpaw" },
    { id: "003", name: "Bulb" },
    { id: "004", name: "Gearling" },
    { id: "005", name: "Spool" },
    { id: "006", name: "Flicker" },
    { id: "007", name: "Knotter" },
    { id: "008", name: "Ribbon" },
    { id: "009", name: "Seam" },
  ],
};

export const SPECTRAL_SABRE: SpectralSabreGame = {
  id: "spectral-sabre",
  title: "Spectral Sabre",
  tagline: "Lead Sabre Unit. Bend light. Vanish before the alarm.",
  blurb:
    "Spectral Sabre is a mobile-first third-person tactical stealth shooter. Command a four-person black-ops squad equipped with hyperspectral camouflage — an experimental refraction system that distorts the operator's signature across visible light, thermal, infrared and drone optics. Plan with KIP, your digital infiltration companion. Tag with the recon drone. Sync four shots into one. Move like a rumour.",
  status: "Pre-production",
  genre: "Tactical Stealth · Squad Shooter",
  platform: "Android · iOS",
  release: "Pre-production",
  features: [
    "Hyperspectral camouflage with real rules — heat, battery, scanner fields, weather",
    "Four operators commanded with a single thumb — Mark, Sync, Breach, Hold",
    "KIP, a digital infiltration companion — hacks cameras, doors, drones, alarms",
    "Sync shot system: queue up to four targets, fire as one",
    "3 to 8 minute missions designed for mobile — replayable tactical sandboxes",
    "No bullet sponges. No dark patterns. Stealth failures stay recoverable.",
  ],
  operators: [
    {
      id: "OP-01",
      img: "/assets/op-wraith.png",
      codename: "Wraith",
      role: "Adaptive Commander",
      speciality: "Player-selected loadout",
      bio: "Player avatar and squad leader. Flexible all-round operator best suited to commanding squad flow. Uses an FPV recon drone to scout and tag. Strong link to camo stability and command pacing.",
    },
    {
      id: "OP-02",
      img: "/assets/op-vantage.png",
      codename: "Vantage",
      role: "Long-Range Overwatch",
      speciality: "Precision shots · recon-assisted targeting · thermal optics",
      bio: "Holds sightlines, covers the squad, eliminates marked threats. Excels at sync shots and silent guard removals. Reinforces patient, tactical mission pacing — strongest when holding a protected sightline.",
    },
    {
      id: "OP-03",
      img: "/assets/op-rook.png",
      codename: "Rook",
      role: "Close-Quarters Assault",
      speciality: "Door breaching · shield module · flash charges · breach-rated armour",
      bio: "The squad's frontline protector. Lead high-risk entries and absorb pressure when stealth breaks. Less subtle, but still built for stealth-team pacing. KIP hides behind Rook when explosions happen.",
    },
    {
      id: "OP-04",
      img: "/assets/op-echo.png",
      codename: "Echo",
      role: "Electronic Warfare",
      speciality: "EMP pulses · camera loops · turret hijacking · sensor spoofing",
      bio: "The squad's digital partner. Disables alarms, jams drones, marks enemies through walls for a limited duration. Reduces anti-camo pressure. Treats KIP like a colleague — translates its rapid technical chatter for the rest of the team.",
    },
    {
      id: "OP-05",
      img: "/assets/op-kip.png",
      codename: "KIP",
      role: "Digital Infiltration Companion",
      speciality: "Hacking · scouting · spoofing · device manipulation",
      bio: "Kinetic Intelligence Platform. Compact four-legged field crawler that exploits anything digital — cameras, doors, drones, alarms, turrets, anti-camo towers. Loyal to Sabre Unit and quietly attached to 'my humans.' Mildly offended when treated as equipment.",
    },
  ],
  pillars: [
    {
      num: "01",
      title: "Tactical first, shooter second",
      body: "Power comes from observation, positioning and timing. Shooting is satisfying, but the best outcomes are planned.",
    },
    {
      num: "02",
      title: "Stealth tech with rules",
      body: "Hyperspectral camo is the signature fantasy — but heat, water, sprinting, muzzle flash, scanner fields all break it. Tense, not magical.",
    },
    {
      num: "03",
      title: "Mobile missions, console mood",
      body: "Three to eight minutes per infil. Cinematic, deliberate, tactical — but designed around thumbs and short sessions.",
    },
    {
      num: "04",
      title: "Four operators, one mind",
      body: "Squad commands stay quick and readable. Mark, sync, breach, flank, hold — radial menus over micromanagement.",
    },
    {
      num: "05",
      title: "KIP gives the game its heart",
      body: "The squad is professional and lethal. KIP is the spark of weirdness that makes them feel alive.",
    },
  ],
  systems: [
    {
      tag: "01 · Camo",
      title: "Hyperspectral Adaptive Refraction",
      body: "Layered refraction panels, thermal masking gel and AI spectral prediction distort your signature across visible, thermal, infrared and drone bands. Battery-limited. States: Passive · Active · Overburn · Disrupted.",
    },
    {
      tag: "02 · Squad",
      title: "Touch Squad Command",
      body: "One thumb commands four operators. Tap an enemy → Mark / Sync / Suppress / Flank. Tap a door → Breach / Stack / KIP Unlock. Squadmates take cover, suppress on order, revive when safe.",
    },
    {
      tag: "03 · Sync Shot",
      title: "Four Shots, One Trigger",
      body: "Mark up to four targets. Each operator lines up their shot. When all sights are green, tap Execute. Four kills, one sound. The cleanest possible breach.",
    },
    {
      tag: "04 · KIP",
      title: "The Digital Infiltration Loop",
      body: "Camera Loop. Door Whisper. Drone Hijack. Alarm Suppression. Sensor Spoof. Ghost Route. Panic Patch. KIP turns the enemy's own surveillance into your toolkit.",
    },
    {
      tag: "05 · Recon",
      title: "Drone-First Awareness",
      body: "Tag enemies, identify patrols, mark loot, emit short EMP pulses. Scout · Orbit · Perch · Pulse modes. Your eyes long before your trigger.",
    },
    {
      tag: "06 · Detection",
      title: "Stealth Is A Curve, Not A Switch",
      body: "Unaware → Suspicious → Searching → Alerted → Combat → Lockdown. Being spotted is recoverable: silence the spotter, jam the alarm, smoke the line of sight, re-enter stealth.",
    },
  ],
  kipLines: [
    "Door is locked. Door is now embarrassed.",
    "Camera loop active. It is watching yesterday.",
    "Enemy drone sees heat. I made your heat boring.",
    "Stealth rating excellent. I feel proud in my circuits.",
    "This plan has many bullets in it. I suggest fewer bullets.",
    "Gate is open enough for heroic crouching.",
  ],
};
