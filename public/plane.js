const planes = {
  "boeing-737": {
    name: "Boeing 737",
    description: "A popular narrow-body passenger aircraft used by airlines around the world.",
    category: "Commercial Jet",
    image: "images/boeing-737.jpg",
    type: "Commercial passenger jet",
    condition: "Operational, regularly maintained",
    signature: "Efficient passenger movement",
    specs: "Typical capacity: 149-189 passengers, range: about 3,500 nautical miles, engines: twin turbofan"
  },
  "cessna-172": {
    name: "Cessna 172",
    description: "A small single-engine aircraft often used for pilot training and private flying.",
    category: "Private Training",
    image: "images/cessna-172.jpg",
    type: "Light utility and training aircraft",
    condition: "Training-ready, good mechanical condition",
    signature: "Calm fundamentals",
    specs: "Seats: 4, range: about 640 nautical miles, engine: single piston engine"
  },
  "f-16": {
    name: "F-16 Fighting Falcon",
    description: "A fast, highly maneuverable fighter aircraft designed for air combat and tactical missions.",
    category: "Tactical Jet",
    image: "images/f-16.jpg",
    type: "Military multirole fighter jet",
    condition: "Mission-ready, requires specialist military maintenance",
    signature: "High-speed precision",
    specs: "Top speed: over Mach 2, range: about 2,200 nautical miles with external tanks, engine: single afterburning turbofan"
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
