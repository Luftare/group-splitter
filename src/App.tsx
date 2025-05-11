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
  // Create arrays of indices for each grouping type
  const numberIndices = Array.from(
    { length: names.length },
    (_, i) => i % config.numbers
  ).sort((a, b) => a - b);

  const colorIndices = Array.from(
    { length: names.length },
    (_, i) => i % config.colors
  ).sort((a, b) => a - b);

  // We "rotate" the array once to have different groups if splits are equal sized
  colorIndices.push(colorIndices.shift() as number);

  const shapeIndices = Array.from(
    { length: names.length },
    (_, i) => i % config.shapes
  ).sort((a, b) => a - b);

  // We "rotate" the array twice to have different groups if splits are equal sized
  shapeIndices.push(shapeIndices.shift() as number);
  shapeIndices.push(shapeIndices.shift() as number);

  return names.map((name, i) => ({
    name,
    number: numberIndices[i] + 1,
    color: colorKeys[colorIndices[i]],
    shape: theme.shapes[shapeIndices[i]],
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
