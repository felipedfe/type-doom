import Phaser from 'phaser'
import { Monster, MONSTER_COUNT } from '../entities/Monster'
import { WizardHands } from '../entities/WizardHands'
import { SpellWord } from '../entities/SpellWord'
import { Hud } from '../entities/Hud'
import { SpellFlash } from '../entities/SpellFlash'
import { WordFlash } from '../entities/WordFlash'
import { ComboOverlay } from '../entities/ComboOverlay'
import { words } from '../config/words'
import {
  APPROACH_SCALE_FROM, APPROACH_SCALE_TO, APPROACH_Y_FROM, APPROACH_Y_TO,
  CASTING_MS, COMBO_SIZE, GAME_HEIGHT, GAME_WIDTH, MISTAKE_FLASH_MS,
  SCORE_COMBO_WORD, SCORE_WORD, SPEED_COMBO_DECREMENT, SPEED_INCREMENT,
  SPEED_INITIAL, SPEED_MAX, WORD_FLASH_IMAGE_KEYS,
} from '../config/constants'

export class PlayScene extends Phaser.Scene {
  constructor() {
    super('Play')
  }

  create() {
    this.state = 'playing'
    this.round = 1
    this.score = 0
    this.speed = SPEED_INITIAL
    this.typedCount = 0
    this.mistakeIndex = -1
    this.comboCount = 0
    this.hadMistakeThisWord = false
    this.monsterIndex = 0
    this.approachTween = null

    this.hud = new Hud(this)
    this.hud.setRound(this.round)
    this.hud.setScore(this.score)

    this.spellFlash = new SpellFlash(this)
    this.wordFlash = new WordFlash(this)
    this.comboOverlay = new ComboOverlay(this)

    this.monsterColumn = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT * 0.05)
    this.spellWord = new SpellWord(this)
    this.spellWord.container.setPosition(0, -20)
    this.monsterColumn.add(this.spellWord.container)

    this.wizard = new WizardHands(this)

    this.monster = null
    this.spawnMonster()
    this.setWord(Phaser.Math.Between(0, words.length - 1))

    this.input.keyboard.on('keydown', this.onKeyDown, this)

    this.background = this.scene.get('Background')
    this.background.setVideoVisible(true)

    this.startApproach()
  }

  spawnMonster() {
    this.monster = new Monster(this, this.monsterIndex)
    this.monster.container.setPosition(-this.monster.def.baseSize / 2, 20)
    this.monsterColumn.add(this.monster.container)
  }

  setWord(index) {
    this.wordIndex = index
    this.currentWord = words[index]
    this.typedCount = 0
    this.mistakeIndex = -1
    this.hadMistakeThisWord = false
    this.spellWord.setWord(this.currentWord)
    this.spellWord.setTypedCount(0, -1)
  }

  onKeyDown(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return
    if (this.state !== 'playing') return

    const key = event.key
    if (key.length !== 1) return

    const nextChar = this.currentWord[this.typedCount]
    if (!nextChar) return

    if (key.toLowerCase() === nextChar.toLowerCase()) {
      this.typedCount += 1
      this.mistakeIndex = -1
      this.spellWord.setTypedCount(this.typedCount, -1)
      this.spellWord.bounceChar(this.typedCount - 1)
      if (this.typedCount === this.currentWord.length) this.onWordComplete()
    } else {
      this.mistakeIndex = this.typedCount
      this.hadMistakeThisWord = true
      this.spellWord.setTypedCount(this.typedCount, this.mistakeIndex)
      const mistakeAt = this.typedCount
      this.time.delayedCall(MISTAKE_FLASH_MS, () => {
        if (this.mistakeIndex === mistakeAt) {
          this.mistakeIndex = -1
          this.spellWord.setTypedCount(this.typedCount, -1)
        }
      })
    }
  }

  onWordComplete() {
    this.state = 'casting'
    if (this.approachTween) this.approachTween.stop()

    const clean = !this.hadMistakeThisWord
    const newCombo = clean ? this.comboCount + 1 : 0
    this.comboCount = newCombo
    const isCombo = newCombo === COMBO_SIZE

    if (isCombo) {
      this.comboCount = 0
      this.comboOverlay.play()
      this.speed = Math.max(this.speed - SPEED_COMBO_DECREMENT, SPEED_INITIAL)
    }

    this.score += isCombo ? SCORE_COMBO_WORD : SCORE_WORD
    this.hud.setScore(this.score)

    this.spellFlash.play()
    this.wizard.playCast()
    this.monster.playDeath()

    const flashKey = WORD_FLASH_IMAGE_KEYS[this.currentWord]
    if (flashKey) this.wordFlash.play(flashKey)

    this.time.delayedCall(CASTING_MS, () => this.nextRound())
  }

  nextRound() {
    this.monster.destroy()
    this.round += 1
    this.hud.setRound(this.round)
    this.speed = Math.min(this.speed + SPEED_INCREMENT, SPEED_MAX)
    this.monsterIndex = (this.monsterIndex + 1) % MONSTER_COUNT
    this.spawnMonster()

    const candidate = Phaser.Math.Between(0, words.length - 2)
    const nextIndex = candidate >= this.wordIndex ? candidate + 1 : candidate
    this.setWord(nextIndex)

    this.state = 'playing'
    this.startApproach()
  }

  startApproach() {
    this.approachTween = this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 1000 / this.speed,
      onUpdate: (tween) => this.applyApproach(tween.getValue()),
      onComplete: () => this.triggerGameOver(),
    })
  }

  applyApproach(v) {
    const y = Phaser.Math.Linear(APPROACH_Y_FROM, APPROACH_Y_TO, v)
    const scale = Phaser.Math.Linear(APPROACH_SCALE_FROM, APPROACH_SCALE_TO, v)
    this.monsterColumn.y = GAME_HEIGHT * 0.05 + y
    this.monsterColumn.setScale(scale)
    this.hud.setApproach(v)
  }

  triggerGameOver() {
    this.state = 'gameover'
    this.background.setVideoVisible(false)
    this.monsterColumn.setVisible(false)
    this.wizard.container.setVisible(false)
    this.scene.launch('GameOver', { round: this.round, score: this.score })
  }
}
