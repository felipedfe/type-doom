import Phaser from 'phaser'
import { GAME_OVER_WHISPERS } from '../config/whispers'
import {
  ARCADE_FONT,
  GAME_HEIGHT,
  GAME_WIDTH,
  GAMEOVER_IDLE_MS,
  HIGHSCORE_LIST_SIZE,
  HIGHSCORE_NAME_MAX_LEN,
} from '../config/constants'
import { getTopScores, submitScore } from '../services/highscoreService'

const FONT = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
const NAME_CHAR_PATTERN = /^[a-zA-Z0-9]$/

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver')
  }

  init(data) {
    this.round = data.round
    this.score = data.score
  }

  async create() {
    this.cx = GAME_WIDTH / 2
    this.cy = GAME_HEIGHT / 2
    const whisper = GAME_OVER_WHISPERS[Phaser.Math.Between(0, GAME_OVER_WHISPERS.length - 1)]

    this.add.text(this.cx, this.cy - 140, 'Game Over', {
      fontFamily: FONT, fontSize: '96px', fontStyle: '800', color: '#f2f2f2',
    }).setOrigin(0.5)

    this.add.text(this.cx - 80, this.cy - 30, 'ROUND', {
      fontFamily: FONT, fontSize: '11px', color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0.5)
    this.add.text(this.cx - 80, this.cy - 6, String(this.round), {
      fontFamily: FONT, fontSize: '28px', fontStyle: '700', color: '#e6e6e6',
    }).setOrigin(0.5)

    this.add.text(this.cx + 80, this.cy - 30, 'SCORE', {
      fontFamily: FONT, fontSize: '11px', color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0.5)
    this.add.text(this.cx + 80, this.cy - 6, this.score.toLocaleString('pt-BR'), {
      fontFamily: FONT, fontSize: '28px', fontStyle: '700', color: '#e6e6e6',
    }).setOrigin(0.5)

    const topScores = await getTopScores(HIGHSCORE_LIST_SIZE)
    const qualifies =
      topScores.length < HIGHSCORE_LIST_SIZE || this.score > Math.min(...topScores.map((entry) => entry.score))

    if (qualifies) {
      this.startNameEntry()
    } else {
      this.drawRestartPrompt(whisper)
      this.bindRestartKey()
      this.armIdleReturn()
    }
  }

  // Background and Play are only ever restarted via Opening/Highscore's Enter,
  // so leaving the game means stopping both plus the looping game music.
  leaveGameTo(sceneKey) {
    this.sound.stopByKey('bg-music')
    this.scene.stop('Play')
    this.scene.stop('Background')
    this.scene.start(sceneKey)
  }

  armIdleReturn() {
    this.idleTimer = this.time.delayedCall(GAMEOVER_IDLE_MS, () => this.leaveGameTo('Opening'))
  }

  drawRestartPrompt(whisper) {
    this.add.text(this.cx, this.cy + 40, 'Press Enter to restart', {
      fontFamily: FONT, fontSize: '13px', color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0.45)

    const whisperText = this.add.text(this.cx, this.cy + 88, whisper, {
      fontFamily: FONT, fontSize: '16px', fontStyle: 'italic', color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0)
    this.tweens.add({ targets: whisperText, alpha: 0.45, delay: 1200, duration: 1400, ease: 'Sine.easeIn' })
  }

  bindRestartKey() {
    this.input.keyboard.once('keydown-ENTER', () => {
      this.idleTimer?.remove()
      this.scene.stop()
      this.scene.get('Play').scene.restart()
    })
  }

  startNameEntry() {
    this.enteredName = ''

    this.add.text(this.cx, this.cy + 40, 'NEW RECORD! ENTER YOUR NAME', {
      fontFamily: ARCADE_FONT, fontSize: '14px', color: '#ffffff', letterSpacing: 2,
    }).setOrigin(0.5)

    this.nameText = this.add.text(this.cx, this.cy + 76, this.renderName(), {
      fontFamily: ARCADE_FONT, fontSize: '24px', color: '#ffffff', letterSpacing: 4,
    }).setOrigin(0.5)

    this.nameEntryKeyHandler = (event) => this.handleNameEntryKey(event)
    this.input.keyboard.on('keydown', this.nameEntryKeyHandler)
  }

  renderName() {
    return this.enteredName.padEnd(HIGHSCORE_NAME_MAX_LEN, '_')
  }

  handleNameEntryKey(event) {
    if (event.key === 'Enter') {
      if (this.enteredName.length === 0) return
      this.submitNewRecord()
      return
    }

    if (event.key === 'Backspace') {
      this.enteredName = this.enteredName.slice(0, -1)
      this.nameText.setText(this.renderName())
      return
    }

    if (NAME_CHAR_PATTERN.test(event.key) && this.enteredName.length < HIGHSCORE_NAME_MAX_LEN) {
      this.enteredName += event.key.toUpperCase()
      this.nameText.setText(this.renderName())
    }
  }

  async submitNewRecord() {
    this.input.keyboard.off('keydown', this.nameEntryKeyHandler)
    await submitScore(this.enteredName, this.score)
    this.leaveGameTo('Highscore')
  }
}
