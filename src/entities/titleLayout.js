// Hand-drawn letter art is baseline-uniform, so every letter is scaled to
// the same target height and laid out left-to-right — no per-letter y
// tweaking needed. Shared by OpeningScene (falling intro) and EndingScene
// (static reveal), which both just need the width/gap/centering math.
export const TITLE_LETTER_HEIGHT = 300

// Lays out `keys` left-to-right at a shared height, using `gaps[i]` as the
// space between letter i and i+1, then centers the whole row on rowY.
// `entryOffset` (optional, signed) starts the row above/below rowY instead
// of at rest — negative = above, positive = below — for callers that animate
// the row into place. `letterHeight` lets a caller with less vertical room
// (e.g. EndingScene, sharing the screen with other text) render smaller than
// OpeningScene's full-size intro. Returns each letter's image + its resting Y.
export function layoutTitleRow(scene, keys, gaps, rowY, entryOffset = 0, letterHeight = TITLE_LETTER_HEIGHT) {
  const widths = keys.map((key) => {
    const src = scene.textures.get(key).getSourceImage()
    return (src.width / src.height) * letterHeight
  })
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + gaps.reduce((sum, g) => sum + g, 0)

  let cursor = scene.scale.width / 2 - totalWidth / 2
  return keys.map((key, i) => {
    const img = scene.add
      .image(cursor + widths[i] / 2, rowY + entryOffset, key)
      .setDisplaySize(widths[i], letterHeight)
    cursor += widths[i] + (gaps[i] ?? 0)
    return { img, restY: rowY }
  })
}
