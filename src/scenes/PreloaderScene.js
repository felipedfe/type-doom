import Phaser from 'phaser'

import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants'

import m1Cabeca from '../assets/monster-1/parts/cabeca.png'
import m1Chifre from '../assets/monster-1/parts/chifre.png'
import m1Olhos from '../assets/monster-1/parts/olhos.png'
import m1Pupila from '../assets/monster-1/parts/pupila.png'
import m1Nariz from '../assets/monster-1/parts/nariz.png'
import m1DentesCima from '../assets/monster-1/parts/dentes-cima.png'
import m1DentesBaixo from '../assets/monster-1/parts/dentes-baixo.png'

import m2Cabeca from '../assets/monster-2/parts/cabeca.png'
import m2Chifre from '../assets/monster-2/parts/chifre.png'
import m2DetalheChifre from '../assets/monster-2/parts/detalhe-chifre.png'
import m2Boca from '../assets/monster-2/parts/boca.png'
import m2Dentes from '../assets/monster-2/parts/dentes.png'
import m2Pupila from '../assets/monster-2/parts/pupila.png'

import m3Orelha from '../assets/monster-3/parts/orelha.png'
import m3CabecaEBoca from '../assets/monster-3/parts/cabeca-e-boca.png'
import m3Olho from '../assets/monster-3/parts/olho.png'
import m3Pupila from '../assets/monster-3/parts/pupila.png'
import m3Bochecha from '../assets/monster-3/parts/bochecha.png'
import m3DenteEsq from '../assets/monster-3/parts/dente-esq.png'
import m3DenteDir from '../assets/monster-3/parts/dente-dir.png'
import m3MascaraDentes from '../assets/monster-3/parts/mascara-dentes.png'

import wizardBraco from '../assets/wizard-bw/parts/braco.png'
import wizardMaoVarinha from '../assets/wizard-bw/parts/mao-e-varinha.png'

import smileImg from '../assets/smile.png'
import pandaImg from '../assets/panda.png'

import titleT from '../assets/title/t.png'
import titleY from '../assets/title/y.png'
import titleP from '../assets/title/p.png'
import titleE from '../assets/title/e.png'
import titleD from '../assets/title/d.png'
import titleO1 from '../assets/title/o_1.png'
import titleO2 from '../assets/title/o_2.png'
import titleM from '../assets/title/m.png'

import bgVideo from '../assets/fundo5-low.mp4'
import fireVideo from '../assets/fire_grain_1.mp4'
import bgMusic from '../assets/type-doom.wav'
import magicSfx from '../assets/magic-2.mp3'
import typeSfx from '../assets/type-2.mp3'

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader')
  }

  preload() {
    this.createLoadingBar()

    this.load.image('m1-cabeca', m1Cabeca)
    this.load.image('m1-chifre', m1Chifre)
    this.load.image('m1-olhos', m1Olhos)
    this.load.image('m1-pupila', m1Pupila)
    this.load.image('m1-nariz', m1Nariz)
    this.load.image('m1-dentes-cima', m1DentesCima)
    this.load.image('m1-dentes-baixo', m1DentesBaixo)

    this.load.image('m2-cabeca', m2Cabeca)
    this.load.image('m2-chifre', m2Chifre)
    this.load.image('m2-detalhe-chifre', m2DetalheChifre)
    this.load.image('m2-boca', m2Boca)
    this.load.image('m2-dentes', m2Dentes)
    this.load.image('m2-pupila', m2Pupila)

    this.load.image('m3-orelha', m3Orelha)
    this.load.image('m3-cabeca-e-boca', m3CabecaEBoca)
    this.load.image('m3-olho', m3Olho)
    this.load.image('m3-pupila', m3Pupila)
    this.load.image('m3-bochecha', m3Bochecha)
    this.load.image('m3-dente-esq', m3DenteEsq)
    this.load.image('m3-dente-dir', m3DenteDir)
    this.load.image('m3-mascara-dentes', m3MascaraDentes)

    this.load.image('wizard-braco', wizardBraco)
    this.load.image('wizard-mao-varinha', wizardMaoVarinha)

    this.load.image('wordflash-smile', smileImg)
    this.load.image('wordflash-panda', pandaImg)

    this.load.image('title-t', titleT)
    this.load.image('title-y', titleY)
    this.load.image('title-p', titleP)
    this.load.image('title-e', titleE)
    this.load.image('title-d', titleD)
    this.load.image('title-o1', titleO1)
    this.load.image('title-o2', titleO2)
    this.load.image('title-m', titleM)

    this.load.video('bg-video', bgVideo, true)
    this.load.video('fire-video', fireVideo, true)
    this.load.audio('bg-music', bgMusic)
    this.load.audio('magic', magicSfx)
    this.load.audio('key-type', typeSfx)
  }

  async create() {
    const params = new URLSearchParams(window.location.search)
    // Phaser bakes text into a canvas texture at creation time — if the
    // web font isn't ready yet, it silently falls back and never updates,
    // so wait for it here rather than in OpeningScene.
    await document.fonts.load("20px 'Press Start 2P'")
    this.scene.start(params.has('monsterlab') ? 'MonsterLab' : 'Opening')
  }

  createLoadingBar() {
    const centerX = GAME_WIDTH / 2
    const centerY = GAME_HEIGHT / 2
    const barWidth = 420
    const barHeight = 4

    const label = this.add.text(centerX, centerY - 30, 'LOADING', {
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      fontSize: '14px',
      fontStyle: '700',
      color: '#ffffff',
      letterSpacing: 4,
    }).setOrigin(0.5)

    const percentText = this.add.text(centerX, centerY + 20, '0%', {
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      fontSize: '12px',
      color: '#888888',
    }).setOrigin(0.5)

    const track = this.add.graphics()
    track.lineStyle(1, 0xffffff, 0.3)
    track.strokeRect(centerX - barWidth / 2, centerY - barHeight / 2, barWidth, barHeight)

    const bar = this.add.graphics()

    this.load.on('progress', (value) => {
      bar.clear()
      bar.fillStyle(0xffffff, 1)
      bar.fillRect(centerX - barWidth / 2, centerY - barHeight / 2, barWidth * value, barHeight)
      percentText.setText(`${Math.round(value * 100)}%`)
    })

    this.load.on('complete', () => {
      label.destroy()
      percentText.destroy()
      track.destroy()
      bar.destroy()
    })
  }
}
