import Phaser from 'phaser'
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/constants'

const ARCADE_FONT = "'Press Start 2P', monospace"
const BLINK_MS = 500
// Video's own aspect ratio matches the canvas exactly, so cover-fit fills
// it with zero slack — this offset shifts the video down, leaving a gap
// at the top (blends into the scene's black background) and cropping the
// overflow off the bottom.
const FIRE_Y_OFFSET = 0

// Hand-drawn letter art is baseline-uniform (~355-395px tall in source),
// so every letter is scaled to this same target height and laid out
// left-to-right — no per-letter y tweaking needed.
const TITLE_LETTER_HEIGHT = 300
const TITLE_ROW_TYPE_Y = 190
const TITLE_ROW_DOOM_Y = 530
// Per-pair horizontal gaps (px, at TITLE_LETTER_HEIGHT scale) tuned to match
// type-doom-mock.png: TYPE's strokes crowd/overlap, DOOM's are spaced out.
const TITLE_ROW_TYPE_GAPS = [-10, 0, 2]
const TITLE_ROW_DOOM_GAPS = [22, 35, 22]

export class OpeningScene extends Phaser.Scene {
  constructor() {
    super('Opening')
  }

  create() {
    this.fireVideo = this.add.video(GAME_WIDTH / 2, GAME_HEIGHT / 2 + FIRE_Y_OFFSET, 'fire-video')
    this.fireVideo.setLoop(true)
    this.fireVideo.setMute(true)
    // Source is a grayscale flame mask (black background, white flames) —
    // tint colorizes the white flames, ADD makes the black areas disappear
    // instead of painting a flat rectangle.

    this.fireVideo.setTint(COLORS.green)
    this.fireVideo.setBlendMode(Phaser.BlendModes.ADD)
    this.fireVideo.play(true)

    this.buildTitleRow(['title-t', 'title-y', 'title-p', 'title-e'], TITLE_ROW_TYPE_GAPS, TITLE_ROW_TYPE_Y)
    this.buildTitleRow(['title-d', 'title-o1', 'title-o2', 'title-m'], TITLE_ROW_DOOM_GAPS, TITLE_ROW_DOOM_Y)

    this.promptText = this.add
      .text(GAME_WIDTH / 2, (TITLE_ROW_TYPE_Y + TITLE_ROW_DOOM_Y) / 2, 'PRESS ENTER TO START', {
        fontFamily: ARCADE_FONT,
        fontSize: '30px',
        color: '#ffffff',
        letterSpacing: 8,
      })
      .setOrigin(0.5)

    this.time.addEvent({
      delay: BLINK_MS,
      loop: true,
      callback: () => this.promptText.setVisible(!this.promptText.visible),
    })

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.stop()
      this.scene.start('Background')
    })
  }

  // Lays out `keys` left-to-right at a shared height, using `gaps[i]` as the
  // space between letter i and i+1, then centers the whole row on rowY.
  buildTitleRow(keys, gaps, rowY) {
    const widths = keys.map((key) => {
      const src = this.textures.get(key).getSourceImage()
      return (src.width / src.height) * TITLE_LETTER_HEIGHT
    })
    const totalWidth = widths.reduce((sum, w) => sum + w, 0) + gaps.reduce((sum, g) => sum + g, 0)

    let cursor = GAME_WIDTH / 2 - totalWidth / 2
    keys.forEach((key, i) => {
      this.add
        .image(cursor + widths[i] / 2, rowY, key)
        .setDisplaySize(widths[i], TITLE_LETTER_HEIGHT)
      cursor += widths[i] + (gaps[i] ?? 0)
    })
  }

  // Video GameObject dimensions settle asynchronously, so recompute the
  // cover-fit scale every frame off the raw <video> element (see
  // BackgroundScene.fitBackgroundVideo for the same pattern).
  fitFireVideo() {
    const el = this.fireVideo?.video
    if (!el || !el.videoWidth || !el.videoHeight) return
    const scale = Math.max(GAME_WIDTH / el.videoWidth, GAME_HEIGHT / el.videoHeight)
    this.fireVideo.setDisplaySize(el.videoWidth * scale, el.videoHeight * scale)
  }

  update() {
    this.fitFireVideo()
  }
}
