export const theme = {
  colors: {
    red: "#FF4B4B",
    green: "#4BFF7B",
    orange: "#FFB84B",
    blue: "#4B7BFF",
    yellow: "#FFF44B",
    teal: "#4BFFF4",
    pink: "#FF4BCE",
    background: "#F7F7F7",
    text: "#222",
    shapeBg: "#fff",
  },
  shapes: ["circle", "square", "triangle", "hexagon"],
  sizes: {
    tag: 64,
    font: 18,
    borderRadius: 12,
    spacing: 8,
  },
};

// Types
export const colorKeys = Object.keys(theme.colors).filter(
  (k) => !["background", "text", "shapeBg"].includes(k)
);
export const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
];

export const sampleParticipants = `Alice
Bob
Charlie
David
Eve
Frank
Grace
Heidi
Ivan
Jack
Kelly
Liam`;
