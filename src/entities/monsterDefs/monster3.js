import { keyframeTween } from '../../anim/keyframeTween'
import { pulseScale, spin } from '../../anim/loopTweens'

export const monster3Def = {
  name: 'monster3',
  baseSize: 450,
  parts: [
    { name: 'orelhaLeft', key: 'm3-orelha', xPct: 0.14, yPct: 0.1, widthPct: 0.22, origin: [1, 1] },
    { name: 'orelhaRight', key: 'm3-orelha', xPct: 0.42, yPct: 0.1, widthPct: 0.22, flipX: true, origin: [1, 1] },
    { name: 'cabeca', key: 'm3-cabeca-e-boca', xPct: 0.09, yPct: 0.17, widthPct: 0.82 },
    { name: 'bochechaLeft', key: 'm3-bochecha', xPct: 0.14, yPct: 0.34, widthPct: 0.12, origin: [0.5, 0.5] },
    { name: 'bochechaRight', key: 'm3-bochecha', xPct: 0.72, yPct: 0.34, widthPct: 0.12, origin: [0.5, 0.5] },
    { name: 'pupila', key: 'm3-pupila', xPct: 0.4, yPct: 0.28, widthPct: 0.12, origin: [0.5, 0.5] },
    { name: 'olho', key: 'm3-olho', xPct: 0.3, yPct: 0.24, widthPct: 0.38 },
  ],
  idle(scene, refs) {
    return [
      keyframeTween(scene, {
        targets: refs.orelhaLeft,
        props: { angle: [0, -10, 6, -4, 0] },
        times: [0, 0.3, 0.6, 0.8, 1],
        duration: 2000,
        ease: 'easeInOut',
        repeat: -1,
        delay: 0,
      }),
      keyframeTween(scene, {
        targets: refs.orelhaRight,
        props: { angle: [0, 10, -6, 4, 0] },
        times: [0, 0.3, 0.6, 0.8, 1],
        duration: 2000,
        ease: 'easeInOut',
        repeat: -1,
        delay: 300,
      }),
      spin(scene, refs.bochechaLeft, { duration: 2000, direction: 1 }),
      spin(scene, refs.bochechaRight, { duration: 3000, direction: -1 }),
      pulseScale(scene, refs.pupila, { from: 1, to: 1.2, duration: 600 }),
    ]
  },
}
