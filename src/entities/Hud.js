import { COLORS, GAME_WIDTH } from '../config/constants'

const BAR_HEIGHT = 3
const MARGIN = 20
const STAT_FONT = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'

function makeStat(scene, x, align, label) {
  const container = scene.add.container(x, MARGIN)
  const labelText = scene.add.text(0, 0, label, {
    fontFamily: STAT_FONT, fontSize: '12px', color: '#ffffff',
  }).setAlpha(0.7)
  const valueText = scene.add.text(0, 18, '0', {
    fontFamily: STAT_FONT, fontSize: '20px', fontStyle: '650', color: '#ffffff',
  })
  labelText.setOrigin(align === 'right' ? 1 : 0, 0)
  valueText.setOrigin(align === 'right' ? 1 : 0, 0)
  container.add([labelText, valueText])
  return { container, valueText }
}

export class Hud {
  constructor(scene) {
    this.scene = scene

    this.barBg = scene.add.rectangle(GAME_WIDTH / 2, BAR_HEIGHT / 2, GAME_WIDTH, BAR_HEIGHT, COLORS.white)
    this.barFill = scene.add.rectangle(0, BAR_HEIGHT / 2, GAME_WIDTH, BAR_HEIGHT, COLORS.purple).setOrigin(0, 0.5)
    this.barFill.scaleX = 0

    this.round = makeStat(scene, MARGIN, 'left', 'Round')
    this.score = makeStat(scene, GAME_WIDTH - MARGIN, 'right', 'Score')
  }

  setApproach(v) {
    this.barFill.scaleX = v
  }

  setRound(round) {
    this.round.valueText.setText(String(round))
  }

  setScore(score) {
    this.score.valueText.setText(score.toLocaleString('pt-BR'))
  }
}
