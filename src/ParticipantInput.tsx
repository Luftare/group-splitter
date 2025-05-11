import { theme } from "./theme";

export const ParticipantInput = ({
  onChange,
  value,
}: {
  onChange: (v: string) => void;
  value: string;
}) => (
  <div>
    <textarea
      style={{ width: "100%", minHeight: 100, fontSize: theme.sizes.font }}
      placeholder="Paste participant names, one per line..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
