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
    description: "A high-capacity narrow-body aircraft suited to airline service, executive groups, and premium shuttle missions.",
    category: "VIP Airliner",
    image: aircraftImages["boeing-737"],
    type: "Commercial passenger jet",
    condition: "Operational, regularly maintained",
    signature: "Large-group movement",
    specs: "Typical capacity: 149-189 passengers, range: about 3,500 nautical miles, engines: twin turbofan. VIP airliner pricing depends heavily on configuration, airports, routing, and availability, so it should be handled as a custom quote."
  },
  "cessna-172": {
    name: "Cessna 172",
    description: "A dependable single-engine aircraft for training, local private flying, and simple visual flight missions.",
    category: "Training Aircraft",
    image: aircraftImages["cessna-172"],
    type: "Light utility and training aircraft",
    condition: "Training-ready, good mechanical condition",
    signature: "Reliable fundamentals",
    specs: "Seats: 4, range: about 640 nautical miles, engine: single piston engine. Typical wet rental planning range: about $140-$260 per flight hour before instructor, airport, or local handling fees."
  },
  "citation-cj4": {
    name: "Cessna Citation CJ4",
    description: "A capable light business jet for efficient regional executive travel and smaller private groups.",
    category: "Light Jet",
    image: aircraftImages["citation-cj4"],
    type: "Light business jet",
    condition: "Charter-ready, executive cabin standard",
    signature: "Regional speed",
    specs: "Typical seats: 8-10, range: about 2,165 nautical miles, cruise speed: around 451 knots. Typical light jet charter benchmark: about $3,500-$6,000 per flight hour."
  },
  "phenom-300": {
    name: "Embraer Phenom 300",
    description: "A premium light jet known for speed, cabin polish, and short-to-medium route efficiency.",
    category: "Premium Light Jet",
    image: aircraftImages["phenom-300"],
    type: "Light business jet",
    condition: "Charter-ready, modern cabin",
    signature: "Polished light-jet comfort",
    specs: "Typical seats: 6-9, range: about 2,010 nautical miles, cruise speed: around 453 knots. Typical light jet charter benchmark: about $3,500-$6,000 per flight hour."
  },
  "challenger-350": {
    name: "Bombardier Challenger 350",
    description: "A refined super-midsize private jet with strong range for regional and transcontinental missions.",
    category: "Super-Midsize Jet",
    image: aircraftImages["challenger-350"],
    type: "Super-midsize business jet",
    condition: "Charter-ready, long-cabin comfort",
    signature: "Executive range",
    specs: "Typical seats: 8-10, range: about 3,200 nautical miles, cruise speed: around 459 knots. Typical super-midsize charter benchmark: about $6,500-$11,000 per flight hour."
  },
  "gulfstream-g650": {
    name: "Gulfstream G650",
    description: "An ultra-long-range private jet built for intercontinental speed, quiet cabins, and premium service.",
    category: "Ultra-Long-Range Jet",
    image: aircraftImages["gulfstream-g650"],
    type: "Ultra-long-range business jet",
    condition: "Flagship charter standard",
    signature: "Intercontinental reach",
    specs: "Typical seats: 11-18, range: about 7,000 nautical miles, high-speed cruise capability for long global routes. Typical ultra-long-range charter benchmark: about $12,000-$20,000 per flight hour."
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
