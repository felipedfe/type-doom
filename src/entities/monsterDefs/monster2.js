import { keyframeTween } from '../../anim/keyframeTween'
import { mirrorSlide, spin } from '../../anim/loopTweens'

export const monster2Def = {
  name: 'monster2',
  baseSize: 380,
  parts: [
    { name: 'chifreLeft', key: 'm2-chifre', xPct: 0.11, yPct: 0.06, widthPct: 0.15 },
    { name: 'chifreRight', key: 'm2-chifre', xPct: 0.74, yPct: 0.06, widthPct: 0.15, flipX: true },
    { name: 'cabeca', key: 'm2-cabeca', xPct: 0.08, yPct: 0.28, widthPct: 0.84 },
    { name: 'dentes', key: 'm2-dentes', xPct: 0.23, yPct: 0.52, widthPct: 0.54 },
    { name: 'boca', key: 'm2-boca', xPct: 0.14, yPct: 0.5, widthPct: 0.72 },
    { name: 'pupila1', key: 'm2-pupila', xPct: 0.5, yPct: 0.31, widthPct: 0.035 },
    { name: 'pupila2', key: 'm2-pupila', xPct: 0.48, yPct: 0.39, widthPct: 0.035 },
    { name: 'pupila3', key: 'm2-pupila', xPct: 0.5, yPct: 0.46, widthPct: 0.035 },
    { name: 'detalheLeft', key: 'm2-detalhe-chifre', xPct: 0.08, yPct: 0, widthPct: 0.13, origin: [0.5, 0.5] },
    { name: 'detalheRight', key: 'm2-detalhe-chifre', xPct: 0.78, yPct: 0, widthPct: 0.13, origin: [0.5, 0.5] },
  ],
  idle(scene, refs) {
    return [
      mirrorSlide(scene, refs.pupila1, { prop: 'x', from: refs.pupila1.x - 18, to: refs.pupila1.x + 18, duration: 800 }),
      mirrorSlide(scene, refs.pupila2, { prop: 'x', from: refs.pupila2.x - 18, to: refs.pupila2.x + 18, duration: 1700 }),
      mirrorSlide(scene, refs.pupila3, { prop: 'x', from: refs.pupila3.x - 18, to: refs.pupila3.x + 18, duration: 1000 }),
      spin(scene, refs.detalheLeft, { duration: 4000, direction: 1 }),
      spin(scene, refs.detalheRight, { duration: 3000, direction: -1 }),
      keyframeTween(scene, {
        targets: [refs.dentes],
        props: { y: [0, 2, -2, 0] },
        times: [0, 0.3, 0.7, 1],
        duration: 100,
        ease: 'linear',
        repeat: -1,
      }),
    ]
  },
}

