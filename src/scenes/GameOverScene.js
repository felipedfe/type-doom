import Phaser from 'phaser'
import { GAME_OVER_WHISPERS } from '../config/whispers'
import { GAME_HEIGHT, GAME_WIDTH } from '../config/constants'

const FONT = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver')
  }

  init(data) {
    this.round = data.round
    this.score = data.score
  }

  create() {
    const cx = GAME_WIDTH / 2
    const cy = GAME_HEIGHT / 2
    const whisper = GAME_OVER_WHISPERS[Phaser.Math.Between(0, GAME_OVER_WHISPERS.length - 1)]

    this.add.text(cx, cy - 140, 'Game Over', {
      fontFamily: FONT, fontSize: '96px', fontStyle: '800', color: '#f2f2f2',
    }).setOrigin(0.5)

    this.add.text(cx - 80, cy - 30, 'ROUND', {
      fontFamily: FONT, fontSize: '11px', color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0.5)
    this.add.text(cx - 80, cy - 6, String(this.round), {
      fontFamily: FONT, fontSize: '28px', fontStyle: '700', color: '#e6e6e6',
    }).setOrigin(0.5)

    this.add.text(cx + 80, cy - 30, 'SCORE', {
      fontFamily: FONT, fontSize: '11px', color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0.5)
    this.add.text(cx + 80, cy - 6, this.score.toLocaleString('pt-BR'), {
      fontFamily: FONT, fontSize: '28px', fontStyle: '700', color: '#e6e6e6',
    }).setOrigin(0.5)

    this.add.text(cx, cy + 40, 'Press Enter to restart', {
      fontFamily: FONT, fontSize: '13px', color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0.45)

    const whisperText = this.add.text(cx, cy + 68, whisper, {
      fontFamily: FONT, fontSize: '12px', fontStyle: 'italic', color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0)
    this.tweens.add({ targets: whisperText, alpha: 0.45, delay: 1200, duration: 1400, ease: 'Sine.easeIn' })

    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.stop()
      this.scene.get('Play').scene.restart()
    })
  }
}
