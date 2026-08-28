import Phaser from 'phaser'

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

import wizardBraco from '../assets/wizard-bw/parts/braco.png'
import wizardMaoVarinha from '../assets/wizard-bw/parts/mao-e-varinha.png'

import smileImg from '../assets/smile.png'
import pandaImg from '../assets/panda.png'

import bgVideo from '../assets/fundo5-low.mp4'

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader')
  }

  preload() {
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

    this.load.image('wizard-braco', wizardBraco)
    this.load.image('wizard-mao-varinha', wizardMaoVarinha)

    this.load.image('wordflash-smile', smileImg)
    this.load.image('wordflash-panda', pandaImg)

    this.load.video('bg-video', bgVideo, true)
  }

  create() {
    const params = new URLSearchParams(window.location.search)
    this.scene.start(params.has('monsterlab') ? 'MonsterLab' : 'Background')
  }
}
