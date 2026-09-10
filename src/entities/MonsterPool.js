import { Monster, MONSTER_COUNT } from './Monster'

// Pre-builds one Monster per type up front and reuses them via
// activate()/deactivate() instead of destroying + recreating GameObjects
// every round, which was generating enough garbage to trigger visible
// Major GC pauses during play.
export class MonsterPool {
  constructor(scene, container) {
    this.monsters = []
    for (let i = 0; i < MONSTER_COUNT; i++) {
      const monster = new Monster(scene, i)
      container.add(monster.container)
      monster.deactivate()
      this.monsters.push(monster)
    }
  }

  activate(index) {
    const monster = this.monsters[index % this.monsters.length]
    monster.activate()
    return monster
  }
}
