import { keyframeTween } from '../anim/keyframeTween'
import { monster1Def } from './monsterDefs/monster1'
import { monster2Def } from './monsterDefs/monster2'
import { monster3Def } from './monsterDefs/monster3'

// "Def" = definition: visual assembly config for the monster (parts, baseSize, idle)
const DEFS = [monster1Def, monster2Def, monster3Def]
export const MONSTER_COUNT = DEFS.length

export class Monster {
  constructor(scene, monsterIndex) {
    this.scene = scene
    this.def = DEFS[monsterIndex % DEFS.length]
    this.container = scene.add.container(0, 0)
    this.refs = {}
    this.idleTweens = []

    for (const part of this.def.parts) {
      const img = scene.add.image(0, 0, part.key)
      const [ox, oy] = part.origin ?? [0, 0]
      img.setOrigin(ox, oy)
      const scale = (part.widthPct * this.def.baseSize) / img.width
      img.setScale(scale)
      const topLeftX = part.xPct * this.def.baseSize
      const topLeftY = part.yPct * this.def.baseSize
      img.setPosition(topLeftX + ox * img.displayWidth, topLeftY + oy * img.displayHeight)
      if (part.flipX) img.setFlipX(true)
      if (part.angle) img.setAngle(part.angle)
      this.container.add(img)
      this.refs[part.name] = img
    }

    this.idleTweens = this.def.idle ? this.def.idle(scene, this.refs) : []
  }

  playDeath(onComplete) {
    for (const tween of this.idleTweens) tween.stop()
    keyframeTween(this.scene, {
      targets: this.container,
      props: {
        x: [0, -10, 10, -7, 7, 0],
        scale: [1, 1.05, 1.1, 1.15, 1.25, 1.8],
        alpha: [1, 1, 1, 1, 1, 0],
      },
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      duration: 400,
      ease: 'linear',
      repeat: 0,
      onComplete,
    })
  }

  destroy() {
    for (const tween of this.idleTweens) tween.stop()
    this.container.destroy()
  }
}
