import { keyframeTween } from '../anim/keyframeTween'
import { COLOR_STRINGS } from '../config/constants'

const FONT_FAMILY = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
const FONT_SIZE = 24
const LETTER_SPACING = FONT_SIZE * 0.08
const PAD_X = 12
const PAD_Y = 4

export class SpellWord {
  constructor(scene) {
    this.scene = scene
    this.container = scene.add.container(0, 0)
    this.box = scene.add.graphics()
    this.charTexts = []
    this.container.add(this.box)

    const probe = scene.add.text(0, 0, 'M', { fontFamily: FONT_FAMILY, fontSize: `${FONT_SIZE}px` })
    this.charAdvance = probe.width + LETTER_SPACING
    this.charHeight = probe.height
    probe.destroy()
  }

  setWord(word) {
    for (const t of this.charTexts) t.destroy()
    this.charTexts = []
    this.word = word

    const totalWidth = word.length * this.charAdvance
    const startX = -totalWidth / 2
    for (let i = 0; i < word.length; i++) {
      const text = this.scene.add.text(startX + i * this.charAdvance + this.charAdvance / 2, 0, word[i], {
        fontFamily: FONT_FAMILY,
        fontSize: `${FONT_SIZE}px`,
      })
      text.setOrigin(0.5, 0.5)
      text.setColor('#ffffff')
      text.setAlpha(0.9)
      this.container.add(text)
      this.charTexts.push(text)
    }

    this.box.clear()
    this.box.fillStyle(0x000000, 1)
    this.box.lineStyle(1, 0xffffff, 1)
    const boxW = totalWidth + PAD_X * 2
    const boxH = this.charHeight + PAD_Y * 2
    this.box.fillRoundedRect(-boxW / 2, -boxH / 2, boxW, boxH, 10)
    this.box.strokeRoundedRect(-boxW / 2, -boxH / 2, boxW, boxH, 10)
  }

  setTypedCount(typedCount, mistakeIndex) {
    this.charTexts.forEach((text, idx) => {
      if (idx < typedCount) {
        text.setColor(COLOR_STRINGS.green)
        text.setAlpha(1)
      } else if (idx === mistakeIndex) {
        text.setColor(COLOR_STRINGS.orange)
        text.setAlpha(1)
      } else {
        text.setColor('#ffffff')
        text.setAlpha(0.9)
      }
    })
  }

  bounceChar(index) {
    const text = this.charTexts[index]
    if (!text) return
    keyframeTween(this.scene, {
      targets: text,
      props: { y: [0, -1.25, 0] },
      times: [0, 0.42, 1],
      duration: 110,
      ease: 'easeOut',
      repeat: 0,
    })
  }

  destroy() {
    this.container.destroy()
  }
}
