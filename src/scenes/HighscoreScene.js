import Phaser from 'phaser'
import { getTopScores } from '../services/highscoreService'
import { ARCADE_FONT, GAME_HEIGHT, GAME_WIDTH, HIGHSCORE_IDLE_MS } from '../config/constants'

const BLINK_MS = 500
const TITLE_Y = 60
const TITLE_UNDERLINE_GAP = 14
const LIST_START_Y = 260
const LIST_ROW_GAP = 56
const LIST_NAME_X = GAME_WIDTH / 2 - 220
const LIST_SCORE_X = GAME_WIDTH / 2 + 220

export class HighscoreScene extends Phaser.Scene {
  constructor() {
    super('Highscore')
  }

  async create() {
    this.drawTitle()
    this.drawPrompt()
    await this.drawScores()
    this.bindInput()
  }

  drawTitle() {
    const title = this.add
      .text(GAME_WIDTH / 2, TITLE_Y, 'HIGHSCORE', {
        fontFamily: ARCADE_FONT,
        fontSize: '48px',
        color: '#ffffff',
        letterSpacing: 8,
      })
      .setOrigin(0.5)

    this.add
      .rectangle(GAME_WIDTH / 2, TITLE_Y + title.height / 2 + TITLE_UNDERLINE_GAP, title.width + 20, 4, 0xffffff)
      .setOrigin(0.5)
  }

  async drawScores() {
    const scores = await getTopScores()

    if (scores.length === 0) {
      this.add
        .text(GAME_WIDTH / 2, LIST_START_Y + LIST_ROW_GAP * 2, 'NO SCORES YET', {
          fontFamily: ARCADE_FONT,
          fontSize: '20px',
          color: '#888888',
        })
        .setOrigin(0.5)
      return
    }

    scores.forEach((entry, index) => {
      const y = LIST_START_Y + index * LIST_ROW_GAP

      this.add
        .text(LIST_NAME_X, y, `${index + 1}. ${entry.name}`, {
          fontFamily: ARCADE_FONT,
          fontSize: '24px',
          color: '#ffffff',
        })
        .setOrigin(0, 0.5)

      this.add
        .text(LIST_SCORE_X, y, entry.score.toLocaleString('pt-BR'), {
          fontFamily: ARCADE_FONT,
          fontSize: '24px',
          color: '#ffffff',
        })
        .setOrigin(1, 0.5)
    })
  }

  drawPrompt() {
    this.promptText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 80, 'PRESS ENTER TO START', {
        fontFamily: ARCADE_FONT,
        fontSize: '20px',
        color: '#ffffff',
        letterSpacing: 6,
      })
      .setOrigin(0.5)

    this.time.addEvent({
      delay: BLINK_MS,
      loop: true,
      callback: () => this.promptText.setVisible(!this.promptText.visible),
    })
  }

  bindInput() {
    this.idleTimer = this.time.delayedCall(HIGHSCORE_IDLE_MS, () => {
      this.scene.stop()
      this.scene.start('Opening')
    })

    this.input.keyboard.once('keydown-ENTER', () => {
      this.idleTimer.remove()
      this.scene.stop()
      this.scene.start('Background')
    })
  }
}
