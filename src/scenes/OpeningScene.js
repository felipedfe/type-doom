import Phaser from 'phaser'
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/constants'

const ARCADE_FONT = "'Press Start 2P', monospace"
const BLINK_MS = 500
// Video's own aspect ratio matches the canvas exactly, so cover-fit fills
// it with zero slack — this offset shifts the video down, leaving a gap
// at the top (blends into the scene's black background) and cropping the
// overflow off the bottom.
const FIRE_Y_OFFSET = 0

// V1 of the title screen: no logo yet (still being drawn), just the fire
// backdrop and an arcade-style blinking prompt. Swap in the logo image once
// it's ready.
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

    this.promptText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT * 0.85, 'PRESS ENTER TO START', {
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
