import { GroupConfigType, NameTagType } from "./groupSplitter";
import { colorKeys, letters, theme } from "./theme";

export const SubgroupVisualization = ({
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
      else if (key === "letter") groupKey = letters[i];
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
  const letterGroups = groupBy("letter", config.letters);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.sizes.spacing * 2,
      }}
    >
      <h2>Subgroup Visualisation</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
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

        <div>
          <h3>By Letter</h3>
          {Object.entries(letterGroups).map(([letter, members]) => (
            <div key={letter} style={{ marginBottom: theme.sizes.spacing }}>
              <strong>Letter {letter}:</strong>
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
