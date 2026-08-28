import Phaser from 'phaser'
import './style.css'
import { GAME_WIDTH, GAME_HEIGHT } from './config/constants'
import { PreloaderScene } from './scenes/PreloaderScene'
import { BackgroundScene } from './scenes/BackgroundScene'
import { PlayScene } from './scenes/PlayScene'
import { GameOverScene } from './scenes/GameOverScene'
import { MonsterLabScene } from './scenes/MonsterLabScene'

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [PreloaderScene, BackgroundScene, PlayScene, GameOverScene, MonsterLabScene],
})
