import Phaser from 'phaser'
import { keyframeTween } from '../anim/keyframeTween'
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/constants'

export class SpellFlash {
  constructor(scene) {
    this.scene = scene
    this.rect = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.orange)
    this.rect.setBlendMode(Phaser.BlendModes.ADD)
    this.rect.setAlpha(0)
  }

  play() {
    keyframeTween(this.scene, {
      targets: this.rect,
      props: { alpha: [0, 0.55, 0, 0.2, 0] },
      times: [0, 0.08, 0.3, 0.45, 1],
      duration: 550,
      ease: 'easeOut',
      repeat: 0,
    })
  }
}
