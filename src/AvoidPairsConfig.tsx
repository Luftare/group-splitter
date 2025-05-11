import { theme } from "./theme";

export const AvoidPairsConfig = ({
  pairs,
  names,
  onChange,
}: {
  pairs: string[][];
  names: string[];
  onChange: (updatedPairs: string[][]) => void;
}) => {
  const updatePair = (index: number, position: 0 | 1, value: string) => {
    const newPairs = pairs.map((pair, i) =>
      i === index
        ? [...pair.slice(0, position), value, ...pair.slice(position + 1)]
        : pair
    );
    onChange(newPairs);
  };

  const deletePair = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    onChange(newPairs);
  };

  const addPair = () => {
    if (names.length >= 2) {
      const newPairs = [...pairs, [names[0], names[1]]];
      onChange(newPairs);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.sizes.spacing * 2,
      }}
    >
      <p>
        Sometimes the chemistry just doesn't work out too well between two
        individuals.
        <button
          className="text-button"
          style={{ marginLeft: "8px" }}
          onClick={addPair}
        >
          + Avoid pair
        </button>
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: theme.sizes.spacing,
        }}
      >
        {pairs.map((pair, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.sizes.spacing,
            }}
          >
            <select
              value={pair[0]}
              onChange={(e) => updatePair(i, 0, e.target.value)}
            >
              {names.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <span>≠</span>
            <select
              value={pair[1]}
              onChange={(e) => updatePair(i, 1, e.target.value)}
            >
              {names.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <button onClick={() => deletePair(i)} className="naked-button">
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
