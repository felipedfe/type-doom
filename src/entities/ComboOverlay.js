import Phaser from 'phaser'
import { keyframeTween } from '../anim/keyframeTween'
import { COMBO_OVERLAY_MS, COMBO_SIZE, GAME_HEIGHT, GAME_WIDTH } from '../config/constants'

export class ComboOverlay {
  constructor(scene) {
    this.scene = scene

    this.flash = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xffc800)
    this.flash.setBlendMode(Phaser.BlendModes.ADD)
    this.flash.setAlpha(0)

    this.text = scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, `COMBO ×${COMBO_SIZE}`, {
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      fontSize: '100px',
      fontStyle: '900',
      color: '#ffd700',
      letterSpacing: -3,
    })
    this.text.setOrigin(0.5, 0.5)
    this.text.setShadow(0, 0, 'rgba(255, 215, 0, 0.9)', 30)
    this.text.setAlpha(0)
    this.text.setScale(0.55)
  }

  play() {
    keyframeTween(this.scene, {
      targets: this.flash,
      props: { alpha: [0, 0.28, 0] },
      times: [0, 0.15, 1],
      duration: 250,
      ease: 'easeOut',
      repeat: 0,
    })

    keyframeTween(this.scene, {
      targets: this.text,
      props: { scale: [0.55, 1.28, 1.08], alpha: [0, 1, 1], angle: [0, -2, 0] },
      times: [0, 0.35, 1],
      duration: 350,
      ease: 'easeOut',
      repeat: 0,
      onComplete: () => {
        this.scene.time.delayedCall(COMBO_OVERLAY_MS - 350, () => {
          this.scene.tweens.add({ targets: this.text, alpha: 0, duration: 500 })
        })
      },
    })
  }
}
