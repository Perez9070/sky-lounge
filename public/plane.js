const aircraftImages = {
  "boeing-737": "images/boeing-737.jpg",
  "cessna-172": "images/cessna-172.jpg",
  "citation-cj4": "https://commons.wikimedia.org/wiki/Special:FilePath/M-FLYI_Cessna_Citation_CJ4_(23595286172).jpg",
  "phenom-300": "https://commons.wikimedia.org/wiki/Special:FilePath/Embraer_Phenom_300.jpg",
  "challenger-350": "https://commons.wikimedia.org/wiki/Special:FilePath/9H-VCB_AIRCRAFT_Bombardier_Challenger_350.jpg",
  "gulfstream-g650": "https://commons.wikimedia.org/wiki/Special:FilePath/Gulfstream_G650.JPG"
};

const planes = {
  "boeing-737": {
    name: "Boeing 737",
    description: "A popular narrow-body passenger aircraft used by airlines and VIP operators around the world.",
    category: "VIP Airliner",
    image: aircraftImages["boeing-737"],
    type: "Commercial passenger jet",
    condition: "Operational, regularly maintained",
    signature: "High-capacity movement",
    specs: "Typical capacity: 149-189 passengers, range: about 3,500 nautical miles, engines: twin turbofan."
  },
  "cessna-172": {
    name: "Cessna 172",
    description: "A small single-engine aircraft often used for pilot training and private flying.",
    category: "Training Aircraft",
    image: aircraftImages["cessna-172"],
    type: "Light utility and training aircraft",
    condition: "Training-ready, good mechanical condition",
    signature: "Calm fundamentals",
    specs: "Seats: 4, range: about 640 nautical miles, engine: single piston engine."
  },
  "citation-cj4": {
    name: "Cessna Citation CJ4",
    description: "A light business jet designed for efficient executive travel with strong speed and runway flexibility.",
    category: "Light Jet",
    image: aircraftImages["citation-cj4"],
    type: "Light business jet",
    condition: "Charter-ready, executive cabin standard",
    signature: "Regional luxury with speed",
    specs: "Typical seats: 8-10, range: about 2,165 nautical miles, cruise speed: around 451 knots."
  },
  "phenom-300": {
    name: "Embraer Phenom 300",
    description: "A stylish premium light jet known for speed, comfort, and short-to-medium route efficiency.",
    category: "Premium Light Jet",
    image: aircraftImages["phenom-300"],
    type: "Light business jet",
    condition: "Charter-ready, modern cabin",
    signature: "Sleek short-route comfort",
    specs: "Typical seats: 6-9, range: about 2,010 nautical miles, cruise speed: around 453 knots."
  },
  "challenger-350": {
    name: "Bombardier Challenger 350",
    description: "A super-midsize private jet with a refined cabin and strong range for regional and transcontinental missions.",
    category: "Super-Midsize Jet",
    image: aircraftImages["challenger-350"],
    type: "Super-midsize business jet",
    condition: "Charter-ready, long-cabin comfort",
    signature: "Executive range and calm",
    specs: "Typical seats: 8-10, range: about 3,200 nautical miles, cruise speed: around 459 knots."
  },
  "gulfstream-g650": {
    name: "Gulfstream G650",
    description: "An ultra-long-range private jet built for intercontinental luxury, speed, and cabin quiet.",
    category: "Ultra-Long-Range Jet",
    image: aircraftImages["gulfstream-g650"],
    type: "Ultra-long-range business jet",
    condition: "Flagship charter standard",
    signature: "Intercontinental prestige",
    specs: "Typical seats: 11-18, range: about 7,000 nautical miles, high-speed cruise capability for long global routes."
  }
};

const params = new URLSearchParams(window.location.search);
const selectedPlane = planes[params.get("plane")] || planes["boeing-737"];

document.getElementById("planeName").textContent = selectedPlane.name;
document.getElementById("planeDescription").textContent = selectedPlane.description;
document.getElementById("planeCategory").textContent = selectedPlane.category;
document.getElementById("planeType").textContent = selectedPlane.type;
document.getElementById("planeCondition").textContent = selectedPlane.condition;
document.getElementById("planeSignature").textContent = selectedPlane.signature;
document.getElementById("planeSpecs").textContent = selectedPlane.specs;

const planeImage = document.getElementById("planeImage");
planeImage.src = selectedPlane.image;
planeImage.alt = selectedPlane.name;
