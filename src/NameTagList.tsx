import { useState } from "react";
import { NameTagType } from "./groupSplitter";
import { theme } from "./theme";

export const NameTagList = ({
  tags,
  isPrintMode,
  onPrintModeChange,
}: {
  tags: NameTagType[];
  isPrintMode: boolean;
  onPrintModeChange: (newValue: boolean) => void;
}) => {
  const [widthCm, setWidthCm] = useState(8);
  const [heightCm, setHeightCm] = useState(4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.sizes.spacing * 2,
      }}
    >
      <div style={{ display: "flex", gap: theme.sizes.spacing * 4 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.sizes.spacing,
          }}
        >
          <label>Width:</label>
          <input
            type="number"
            style={{ width: theme.sizes.spacing * 8 }}
            value={widthCm}
            onChange={(e) => setWidthCm(parseFloat(e.target.value))}
          />
          <label>cm</label>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.sizes.spacing,
          }}
        >
          <label>Height:</label>
          <input
            type="number"
            style={{ width: theme.sizes.spacing * 8 }}
            value={heightCm}
            onChange={(e) => setHeightCm(parseFloat(e.target.value))}
          />
          <label>cm</label>
        </div>

        <button onClick={() => onPrintModeChange(!isPrintMode)}>
          {isPrintMode ? "Show all controls" : "Print labels"}
        </button>
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: theme.sizes.spacing }}
      >
        {tags.map((tag) => (
          <div
            key={tag.name}
            style={{
              border: "1px solid #ccc",
              boxSizing: "border-box",
              width: `${widthCm}cm`,
              height: `${heightCm}cm`,
              padding: theme.sizes.spacing,
              background: theme.colors.shapeBg,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontWeight: "bold" }}>{tag.name}</div>
            <div>
              {tag.number} | {tag.color} | {tag.shape} | {tag.letter}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
