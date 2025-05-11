import React, { useState } from "react";
import { theme } from "./theme";
import "./App.css";

// Types
const colorKeys = Object.keys(theme.colors).filter(
  (k) => !["background", "text", "shapeBg"].includes(k)
);

type GroupConfigType = { numbers: number; colors: number; shapes: number };
type NameTagType = {
  name: string;
  number: number;
  color: string;
  shape: string;
};

// Stubs for now
const ParticipantInput = ({
  onChange,
  value,
}: {
  onChange: (v: string) => void;
  value: string;
}) => (
  <textarea
    style={{ width: "100%", minHeight: 100, fontSize: theme.sizes.font }}
    placeholder="Paste participant names, one per line..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

const GroupConfig = ({
  config,
  setConfig,
}: {
  config: GroupConfigType;
  setConfig: (c: GroupConfigType) => void;
}) => (
  <div style={{ display: "flex", gap: theme.sizes.spacing * 2 }}>
    <label>
      Numbers:
      <input
        type="number"
        min={1}
        max={99}
        value={config.numbers}
        onChange={(e) => setConfig({ ...config, numbers: +e.target.value })}
      />
    </label>
    <label>
      Colors:
      <input
        type="number"
        min={1}
        max={colorKeys.length}
        value={config.colors}
        onChange={(e) => setConfig({ ...config, colors: +e.target.value })}
      />
    </label>
    <label>
      Shapes:
      <input
        type="number"
        min={1}
        max={theme.shapes.length}
        value={config.shapes}
        onChange={(e) => setConfig({ ...config, shapes: +e.target.value })}
      />
    </label>
  </div>
);

const NameTagList = ({ tags }: { tags: NameTagType[] }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: theme.sizes.spacing }}>
    {tags.map((tag) => (
      <div
        key={tag.name}
        style={{
          border: "1px solid #ccc",
          borderRadius: theme.sizes.borderRadius,
          padding: theme.sizes.spacing,
          background: theme.colors.shapeBg,
        }}
      >
        <div style={{ fontWeight: "bold" }}>{tag.name}</div>
        <div>
          {tag.number} | {tag.color} | {tag.shape}
        </div>
      </div>
    ))}
  </div>
);

function assignGroups(names: string[], config: GroupConfigType): NameTagType[] {
  const n = names.length;

  // --- 1) A tiny, deterministic PRNG (mulberry32) ---
  function mulberry32(seed: number) {
    let a = seed;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // --- 2) Shuffle + block‐partition for a given seed & subgroup count ---
  function getGroupIndices(seed: number, count: number): number[] {
    // 2a) build [0,1,2,...,n-1] and shuffle it
    const idx = Array.from({ length: n }, (_, i) => i);
    const rand = mulberry32(seed);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }

    // 2b) figure out block sizes
    const base = Math.floor(n / count);
    const r = n % count;
    const groupOf = new Array<number>(n);
    let offset = 0;

    for (let g = 0; g < count; g++) {
      const size = base + (g < r ? 1 : 0);
      for (let k = 0; k < size; k++) {
        groupOf[idx[offset + k]] = g;
      }
      offset += size;
    }

    return groupOf;
  }

  // --- 3) use three DIFFERENT seeds so the three layouts never align ---
  const numberIdx = getGroupIndices(1, config.numbers);
  const colorIdx = getGroupIndices(2, config.colors);
  const shapeIdx = getGroupIndices(3, config.shapes);

  return names.map((name, i) => ({
    name,
    number: numberIdx[i] + 1,
    color: colorKeys[colorIdx[i]],
    shape: theme.shapes[shapeIdx[i]],
  }));
}

const defaultConfig = { numbers: 4, colors: 4, shapes: 2 };

const sampleParticipants = `Alice
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

const SubgroupVisualization = ({
  tags,
  config,
}: {
  tags: NameTagType[];
  config: GroupConfigType;
}) => {
  // Helper to group by a key
  const groupBy = <K extends keyof NameTagType>(key: K, count: number) => {
    const groups: Record<string, string[]> = {};
    for (let i = 0; i < count; ++i) {
      let groupKey: string;
      if (key === "number") groupKey = String(i + 1);
      else if (key === "color") groupKey = colorKeys[i];
      else if (key === "shape") groupKey = theme.shapes[i];
      else groupKey = "";
      groups[groupKey] = [];
    }
    tags.forEach((tag) => {
      const groupKey = String(tag[key]);
      if (groups[groupKey]) groups[groupKey].push(tag.name);
    });
    return groups;
  };

  const numberGroups = groupBy("number", config.numbers);
  const colorGroups = groupBy("color", config.colors);
  const shapeGroups = groupBy("shape", config.shapes);

  return (
    <div style={{ marginTop: theme.sizes.spacing * 3 }}>
      <h2>Subgroup Visualisation</h2>
      <div
        style={{
          display: "flex",
          gap: theme.sizes.spacing * 4,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3>By Number</h3>
          {Object.entries(numberGroups).map(([num, members]) => (
            <div key={num} style={{ marginBottom: theme.sizes.spacing }}>
              <strong>Number {num}:</strong>
              <ul style={{ margin: 0 }}>
                {members.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h3>By Color</h3>
          {Object.entries(colorGroups).map(([color, members]) => (
            <div key={color} style={{ marginBottom: theme.sizes.spacing }}>
              <strong
                style={{
                  color: theme.colors[color as keyof typeof theme.colors],
                }}
              >
                Color {color}:
              </strong>
              <ul style={{ margin: 0 }}>
                {members.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h3>By Shape</h3>
          {Object.entries(shapeGroups).map(([shape, members]) => (
            <div key={shape} style={{ marginBottom: theme.sizes.spacing }}>
              <strong>Shape {shape}:</strong>
              <ul style={{ margin: 0 }}>
                {members.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [participants, setParticipants] = useState("");
  const [config, setConfig] = useState<GroupConfigType>(defaultConfig);

  const names = participants
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);
  const tags = assignGroups(names, config);

  return (
    <div
      style={{
        padding: theme.sizes.spacing * 2,
        background: theme.colors.background,
        minHeight: "100vh",
      }}
    >
      <h1>Group Splitter</h1>
      <div style={{ marginBottom: theme.sizes.spacing * 2 }}>
        <button
          onClick={() => setParticipants(sampleParticipants)}
          style={{ marginRight: theme.sizes.spacing }}
        >
          Load Sample Data
        </button>
        <button onClick={() => setParticipants("")}>Reset</button>
      </div>
      <ParticipantInput value={participants} onChange={setParticipants} />
      <GroupConfig config={config} setConfig={setConfig} />
      <hr />
      <SubgroupVisualization tags={tags} config={config} />
      <hr />
      <NameTagList tags={tags} />
    </div>
  );
};

export default App;
