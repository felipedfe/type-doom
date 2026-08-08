import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../config/constants'

// Lives for the whole session and is never restarted, so the background
// video only ever gets created once — PlayScene.restart() (on game-over ->
// Enter) no longer tears down and recreates the video element every round.
export class BackgroundScene extends Phaser.Scene {
  constructor() {
    super('Background')
  }

  create() {
    this.bgVideo = this.add.video(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg-video')
    this.bgVideo.setMute(true)
    this.bgVideo.play(true)
    this.bgVideoFitted = false

    this.horizon = this.add.graphics()
    this.horizon.lineStyle(2, 0xffffff, 1)
    this.horizon.strokeRect(1, 1, GAME_WIDTH - 2, GAME_HEIGHT - 2)

    this.scene.launch('Play')
  }

  setVideoVisible(visible) {
    this.bgVideo.setVisible(visible)
  }

  // The Video GameObject's own width/height settle asynchronously (and get
  // rewritten again once by Phaser's internal metadata handler), so a
  // one-shot setDisplaySize() right after creation ends up scaled against a
  // stale base size. Recomputing every frame off the raw <video> element's
  // own dimensions is cheap and self-correcting regardless of that timing.
  fitBackgroundVideo() {
    const el = this.bgVideo?.video
    if (!el || !el.videoWidth || !el.videoHeight) return
    const scale = Math.max(GAME_WIDTH / el.videoWidth, GAME_HEIGHT / el.videoHeight)
    this.bgVideo.setDisplaySize(el.videoWidth * scale, el.videoHeight * scale)
  }

  update() {
    if (!this.bgVideoFitted) {
      this.fitBackgroundVideo()
      if (this.bgVideo?.video?.videoWidth) this.bgVideoFitted = true
    }
  }
}
