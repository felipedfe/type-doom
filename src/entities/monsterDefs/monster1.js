import { keyframeTween } from '../../anim/keyframeTween'
import { pulseScale, spin } from '../../anim/loopTweens'

export const monster1Def = {
  name: 'monster1',
  baseSize: 380,
  parts: [
    { name: 'chifreLeft', key: 'm1-chifre', xPct: 0.08, yPct: 0.12, widthPct: 0.25 },
    { name: 'chifreCenter', key: 'm1-chifre', xPct: 0.35, yPct: 0.11, widthPct: 0.25, angle: 45, origin: [0.5, 0.5] },
    { name: 'chifreRight', key: 'm1-chifre', xPct: 0.6, yPct: 0.13, widthPct: 0.25, flipX: true },
    { name: 'cabeca', key: 'm1-cabeca', xPct: 0.02, yPct: 0.25, widthPct: 0.96 },
    { name: 'dentesCima', key: 'm1-dentes-cima', xPct: 0.23, yPct: 0.62, widthPct: 0.55 },
    { name: 'dentesBaixo', key: 'm1-dentes-baixo', xPct: 0.23, yPct: 0.69, widthPct: 0.55 },
    { name: 'nariz', key: 'm1-nariz', xPct: 0.35, yPct: 0.53, widthPct: 0.19 },
    { name: 'olhos', key: 'm1-olhos', xPct: 0.23, yPct: 0.345, widthPct: 0.45 },
    { name: 'pupilaLeft', key: 'm1-pupila', xPct: 0.275, yPct: 0.385, widthPct: 0.125, origin: [0.5, 0.5] },
    { name: 'pupilaRight', key: 'm1-pupila', xPct: 0.52, yPct: 0.385, widthPct: 0.125, origin: [0.5, 0.5] },
  ],
  idle(scene, refs) {
    const tweens = []
    tweens.push(keyframeTween(scene, {
      targets: refs.chifreLeft,
      props: { x: [0, 8, -5, 0], y: [0, 8, -5, 0] },
      times: [0, 0.65, 0.8, 1],
      duration: 1000,
      ease: ['linear', 'easeOut', 'easeOut'],
      // ease: ['linear'],
      repeat: -1,
      delay: 0,
    })),
    tweens.push(keyframeTween(scene, {
      targets: refs.chifreCenter,
      props: { y: [0, 8, -5, 0] },
      times: [0, 0.65, 0.8, 1],
      duration: 1000,
      ease: ['easeIn', 'easeOut', 'easeOut'],
      repeat: -1,
      delay: 300,
    })),
    tweens.push(keyframeTween(scene, {
      targets: refs.chifreRight,
      props: { x: [0, -4, 4, 0], y: [0, 4, -4, 0] },
      times: [0, 0.65, 0.8, 1],
      duration: 1000,
      ease: ['easeIn', 'easeOut', 'easeOut'],
      repeat: -1,
      delay: 0,
    })),
    tweens.push(spin(scene, refs.pupilaLeft, { duration: 1500, direction: 1 })),
    tweens.push(spin(scene, refs.pupilaRight, { duration: 1500, direction: -1 })),
    pulseScale(scene, refs.nariz, { prop: 'scaleY', from: 0.6, to: 0.7, duration: 1000 })
    tweens.push(keyframeTween(scene, {
      targets: [refs.dentesCima],
      props: { x: [0, 3, -3, 0] },
      times: [0, 0.3, 0.7, 1],
      duration: 400,
      ease: 'linear',
      repeat: -1,
    })),
    pulseScale(scene, refs.nariz, { prop: 'scaleY', from: 0.6, to: 0.7, duration: 1500 })
    tweens.push(keyframeTween(scene, {
      targets: [refs.dentesBaixo],
      props: { x: [0, -3, 3, 0] },
      times: [0, 0.3, 0.7, 1],
      duration: 400,
      ease: 'linear',
      repeat: -1,
    }))
    return tweens
  },
}
