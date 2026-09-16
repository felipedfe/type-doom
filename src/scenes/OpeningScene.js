import Phaser from 'phaser'
import { keyframeTween } from '../anim/keyframeTween'
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

// Intro: TYPE drops in from above as one row, DOOM rises in from below as one
// row, both arriving at the same instant — then a flash, and only after that
// does the fire reveal, along with the prompt.
const TITLE_ENTRY_OFFSET = 360 // px above/below the row's resting Y each letter starts from
const TITLE_SNAP_DURATION = 360
const TITLE_SNAP_EASE = 'Cubic.easeOut'

const SNAP_FLASH_COLOR = COLORS.white
const SNAP_FLASH_DURATION = 220
const SNAP_FLASH_PEAK_ALPHA = 0.45

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
    this.fireVideo.setVisible(false)
    this.fireVideo.play(true)

    const typeLetters = this.buildTitleRow(
      ['title-t', 'title-y', 'title-p', 'title-e'],
      TITLE_ROW_TYPE_GAPS,
      TITLE_ROW_TYPE_Y,
      -TITLE_ENTRY_OFFSET,
    )
    const doomLetters = this.buildTitleRow(
      ['title-d', 'title-o1', 'title-o2', 'title-m'],
      TITLE_ROW_DOOM_GAPS,
      TITLE_ROW_DOOM_Y,
      TITLE_ENTRY_OFFSET,
    )

    this.promptText = this.add
      .text(GAME_WIDTH / 2, (TITLE_ROW_TYPE_Y + TITLE_ROW_DOOM_Y) / 2, 'PRESS ENTER TO START', {
        fontFamily: ARCADE_FONT,
        fontSize: '30px',
        color: '#ffffff',
        // backgroundColor: '#000000',
        // padding: { x: 10, y: 10 },
        letterSpacing: 8,
      })
      .setOrigin(0.5)
      .setVisible(false)

    this.playTitleIntro(typeLetters, doomLetters)

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.stop()
      this.scene.start('Background')
    })
  }

  // Lays out `keys` left-to-right at a shared height, using `gaps[i]` as the
  // space between letter i and i+1, then centers the whole row on rowY.
  // `entryOffset` is signed: negative starts the row above rowY (falling
  // down into place), positive starts it below (rising up into place).
  // Returns each letter's image + its resting Y, for playTitleIntro.
  buildTitleRow(keys, gaps, rowY, entryOffset) {
    const widths = keys.map((key) => {
      const src = this.textures.get(key).getSourceImage()
      return (src.width / src.height) * TITLE_LETTER_HEIGHT
    })
    const totalWidth = widths.reduce((sum, w) => sum + w, 0) + gaps.reduce((sum, g) => sum + g, 0)

    let cursor = GAME_WIDTH / 2 - totalWidth / 2
    return keys.map((key, i) => {
      const img = this.add
        .image(cursor + widths[i] / 2, rowY + entryOffset, key)
        .setDisplaySize(widths[i], TITLE_LETTER_HEIGHT)
      cursor += widths[i] + (gaps[i] ?? 0)
      return { img, restY: rowY }
    })
  }

  // TYPE (from above) and DOOM (from below) each move in as a single row —
  // every letter in a row shares the same timing, so the whole word arrives
  // at once. Once both rows land, flash, then reveal the fire and the prompt.
  playTitleIntro(typeLetters, doomLetters) {
    for (const letter of typeLetters) this.slideLetterIn(letter)
    for (const letter of doomLetters) this.slideLetterIn(letter)

    this.time.delayedCall(TITLE_SNAP_DURATION, () => {
      this.playSnapFlash()
      this.revealFire()
      this.revealPrompt()
    })
  }

  slideLetterIn({ img, restY }) {
    this.tweens.add({
      targets: img,
      y: restY,
      duration: TITLE_SNAP_DURATION,
      ease: TITLE_SNAP_EASE,
    })
  }

  playSnapFlash() {
    const flash = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, SNAP_FLASH_COLOR)
    flash.setBlendMode(Phaser.BlendModes.ADD)
    flash.setAlpha(0)

    keyframeTween(this, {
      targets: flash,
      props: { alpha: [0, SNAP_FLASH_PEAK_ALPHA, 0] },
      times: [0, 0.2, 1],
      duration: SNAP_FLASH_DURATION,
      ease: 'easeOut',
      repeat: 0,
      onComplete: () => flash.destroy(),
    })
  }

  revealFire() {
    this.fireVideo.setVisible(true)
  }

  revealPrompt() {
    this.promptText.setVisible(true)
    this.time.addEvent({
      delay: BLINK_MS,
      loop: true,
      callback: () => this.promptText.setVisible(!this.promptText.visible),
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
