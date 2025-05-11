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

    // 2b) break into as‐even blocks as possible
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

  // --- 3) Build all four partitions with distinct seeds ---
  const numberIdx = getGroupIndices(1, config.numbers);
  const colorIdx = getGroupIndices(2, config.colors);
  const shapeIdx = getGroupIndices(3, config.shapes);
  const letterIdx = getGroupIndices(4, config.letters);

  // --- 4) Prepare avoid‐pair data & “diplomatic” pool ---
  const avoidSet = new Set<string>();
  avoidPairs.forEach((pair) => {
    if (pair.length === 2) {
      avoidSet.add(pair[0]);
      avoidSet.add(pair[1]);
    }
  });
  // indices of names *not* in any avoid‐pair
  const diplomaticIndices = names
    .map((nm, i) => (avoidSet.has(nm) ? -1 : i))
    .filter((i) => i >= 0);

  // seeded PRNG for picking diplomats
  const pickDiplomat = mulberry32(5);

  // helper to swap a single‐dimension index
  function swapDim(arr: number[], i: number, j: number) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // --- 5) Naively break any conflicts ---
  // for each avoid‐pair, for *each* dimension, if they collide, swap the 2nd person
  // with a random diplomat
  const nameToIndex = Object.fromEntries(names.map((nm, i) => [nm, i]));

  avoidPairs.forEach((pair) => {
    const [a, b] = pair;
    const iA = nameToIndex[a],
      iB = nameToIndex[b];
    if (iA == null || iB == null) return; // skip invalid names

    // for each dimension, check & fix
    const dims = [
      { arr: numberIdx },
      { arr: colorIdx },
      { arr: shapeIdx },
      { arr: letterIdx },
    ];

    dims.forEach(({ arr }) => {
      if (arr[iA] === arr[iB] && diplomaticIndices.length > 0) {
        const pick =
          diplomaticIndices[
            Math.floor(pickDiplomat() * diplomaticIndices.length)
          ];
        swapDim(arr, iB, pick);
      }
    });
  });

  // --- 6) Map back to output objects ---
  return names.map((name, i) => ({
    name,
    number: numberIdx[i] + 1,
    color: colorKeys[colorIdx[i]],
    shape: theme.shapes[shapeIdx[i]],
    letter: letters[letterIdx[i]],
  }));
}
