import { keyframeTween } from '../anim/keyframeTween'
import { GAME_HEIGHT, GAME_WIDTH } from '../config/constants'

const MAX_SIZE = 600

export class WordFlash {
  constructor(scene) {
    this.scene = scene
    this.image = scene.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, '__DEFAULT')
    this.image.setAlpha(0)
    this.image.setVisible(false)
    this.image.setDepth(1000)
  }

  play(textureKey) {
    this.image.setTexture(textureKey)
    const scale = Math.min(1, MAX_SIZE / this.image.width)
    this.image.setScale(scale)
    this.image.setVisible(true)
    keyframeTween(this.scene, {
      targets: this.image,
      props: { alpha: [0, 1, 0] },
      times: [0, 0.2, 1],
      duration: 180,
      ease: 'easeOut',
      repeat: 0,
      onComplete: () => this.image.setVisible(false),
    })
  }
}
