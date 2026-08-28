import Phaser from 'phaser'
import { Monster, MONSTER_COUNT } from '../entities/Monster'
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants'

const FONT = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'

export class MonsterLabScene extends Phaser.Scene {
  constructor() {
    super('MonsterLab')
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1a1a')
    this.monster = null

    this.add.text(GAME_WIDTH / 2, 40, 'Monster Lab', {
      fontFamily: FONT, fontSize: '28px', fontStyle: '800', color: '#f2f2f2',
    }).setOrigin(0.5)

    this.label = this.add.text(GAME_WIDTH / 2, 78, '', {
      fontFamily: FONT, fontSize: '16px', color: '#cccccc',
    }).setOrigin(0.5)

    this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 30,
      '1 / 2 / 3 pick monster   ·   R restart animation   ·   Esc back to game',
      { fontFamily: FONT, fontSize: '13px', color: '#ffffff' },
    ).setOrigin(0.5).setAlpha(0.5)

    this.spawnMonster(0)

    this.input.keyboard.on('keydown', (event) => {
      const asIndex = Number(event.key) - 1
      if (asIndex >= 0 && asIndex < MONSTER_COUNT) {
        this.spawnMonster(asIndex)
      } else if (event.key.toLowerCase() === 'r') {
        this.spawnMonster(this.monsterIndex)
      } else if (event.key === 'Escape') {
        this.scene.start('Background')
      }
    })
  }

  spawnMonster(index) {
    if (this.monster) this.monster.destroy()
    this.monsterIndex = index
    this.monster = new Monster(this, index)
    const baseSize = this.monster.def.baseSize
    this.monster.container.setPosition(GAME_WIDTH / 2 - baseSize / 2, GAME_HEIGHT / 2 - baseSize / 2)
    this.label.setText(this.monster.def.name ?? `monster ${index + 1}`)
  }
}
