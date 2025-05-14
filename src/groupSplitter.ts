import { colorKeys, letters, theme } from "./theme";

export interface GroupConfigType {
  numbers: number;
  colors: number;
  shapes: number;
  letters: number;
}

export interface NameTagType {
  name: string;
  number: number;
  color: string;
  shape: string;
  letter: string;
}

export function assignGroups(
  names: string[],
  config: GroupConfigType,
  avoidPairs: string[][]
): NameTagType[] {
  const n = names.length;
  // If no participants, nothing to assign
  if (n === 0) return [];

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

  // --- 2) Map names to indices and build avoid-pair set ---
  const nameToIndex: { [key: string]: number } = Object.fromEntries(
    names.map((nm, i) => [nm, i])
  );
  function pairKey(i: number, j: number) {
    return i < j ? `${i}:${j}` : `${j}:${i}`;
  }
  const avoidSet = new Set<string>();
  avoidPairs.forEach(([a, b]) => {
    const i = nameToIndex[a];
    const j = nameToIndex[b];
    if (i != null && j != null) {
      avoidSet.add(pairKey(i, j));
    }
  });

  // --- 3) Initial seeded block-partition ---
  function getGroupIndices(seed: number, count: number): number[] {
    const idx = Array.from({ length: n }, (_, i) => i);
    const rand = mulberry32(seed);
    for (let k = n - 1; k > 0; k--) {
      const j = Math.floor(rand() * (k + 1));
      [idx[k], idx[j]] = [idx[j], idx[k]];
    }
    const base = Math.floor(n / count);
    const r = n % count;
    const groupOf = new Array<number>(n);
    let offset = 0;
    for (let g = 0; g < count; g++) {
      const size = base + (g < r ? 1 : 0);
      for (let m = 0; m < size; m++) {
        groupOf[idx[offset + m]] = g;
      }
      offset += size;
    }
    return groupOf;
  }

  // --- 4) Greedy + Local-Search for one dimension ---
  function localSearchGroupIndices(seed: number, count: number): number[] {
    const groupOf = getGroupIndices(seed, count);
    const groupMembers: number[][] = Array.from({ length: count }, () => []);
    for (let i = 0; i < n; i++) {
      groupMembers[groupOf[i]].push(i);
    }
    const rand = mulberry32(seed + 12345); // separate RNG for search
    let noImprove = 0;
    const maxNoImprove = 10000;

    function costMember(idx: number, grp: number, exclude?: number): number {
      let cost = 0;
      for (const other of groupMembers[grp]) {
        if (other === idx || other === exclude) continue;
        if (avoidSet.has(pairKey(idx, other))) cost++;
      }
      return cost;
    }

    while (noImprove < maxNoImprove) {
      const i = Math.floor(rand() * n);
      let j = i;
      while (j === i) {
        j = Math.floor(rand() * n);
      }
      const gi = groupOf[i];
      const gj = groupOf[j];
      if (gi === gj) {
        noImprove++;
        continue;
      }
      const costBefore = costMember(i, gi) + costMember(j, gj);
      const costAfter = costMember(i, gj, j) + costMember(j, gi, i);
      if (costAfter < costBefore) {
        // swap in groupMembers
        const idxI = groupMembers[gi].indexOf(i);
        const idxJ = groupMembers[gj].indexOf(j);
        groupMembers[gi][idxI] = j;
        groupMembers[gj][idxJ] = i;
        // swap groupOf
        groupOf[i] = gj;
        groupOf[j] = gi;
        noImprove = 0;
      } else {
        noImprove++;
      }
    }
    return groupOf;
  }

  // --- 5) Compute indices for all four partitions ---
  const numberIdx = localSearchGroupIndices(1, config.numbers);
  const colorIdx = localSearchGroupIndices(2, config.colors);
  const shapeIdx = localSearchGroupIndices(3, config.shapes);
  const letterIdx = localSearchGroupIndices(4, config.letters);

  // --- 6) Map back to NameTagType objects ---
  return names.map((name, i) => ({
    name,
    number: numberIdx[i] + 1,
    color: colorKeys[colorIdx[i]],
    shape: theme.shapes[shapeIdx[i]],
    letter: letters[letterIdx[i]],
  }));
}
