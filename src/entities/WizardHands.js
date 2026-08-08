import { keyframeTween } from '../anim/keyframeTween'
import { GAME_HEIGHT, WIZARD_BASE_SIZE } from '../config/constants'

const WIZARD_REST_ANGLE = -5
const WIZARD_LEFT = 354

function place(scene, container, key, { xPct, yPct, widthPct, origin }) {
  const img = scene.add.image(0, 0, key)
  const [ox, oy] = origin
  img.setOrigin(ox, oy)
  const scale = (widthPct * WIZARD_BASE_SIZE) / img.width
  img.setScale(scale)
  const topLeftX = xPct * WIZARD_BASE_SIZE
  const topLeftY = yPct * WIZARD_BASE_SIZE
  img.setPosition(topLeftX + ox * img.displayWidth, topLeftY + oy * img.displayHeight)
  img.setAngle(WIZARD_REST_ANGLE)
  container.add(img)
  return img
}

export class WizardHands {
  constructor(scene) {
    this.scene = scene
    this.container = scene.add.container(WIZARD_LEFT, GAME_HEIGHT - 2 - WIZARD_BASE_SIZE)

    this.maoVarinha = place(scene, this.container, 'wizard-mao-varinha', {
      xPct: 0.72, yPct: 0.05, widthPct: 0.42, origin: [0, 1],
    })
    this.braco = place(scene, this.container, 'wizard-braco', {
      xPct: 0, yPct: 0.6, widthPct: 0.88, origin: [0.5, 0.5],
    })
  }

  playCast() {
    keyframeTween(this.scene, {
      targets: this.braco,
      props: { angle: [0, 2, 2, 0] },
      times: [0, 0.1, 0.55, 1],
      duration: 250,
      ease: 'easeOut',
      repeat: 0,
    })
    keyframeTween(this.scene, {
      targets: this.maoVarinha,
      props: { angle: [0, 8, 5, 0] },
      times: [0, 0.5, 0.55, 1],
      duration: 250,
      ease: 'easeOut',
      repeat: 0,
    })
  }
}
