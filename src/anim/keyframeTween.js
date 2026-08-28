const EASE_MAP = {
  linear: 'Linear',
  easeIn: 'Cubic.easeIn',
  easeOut: 'Cubic.easeOut',
  easeInOut: 'Cubic.easeInOut',
}

// x/y/angle keyframes are offsets stacked on top of the target's current
// (already-positioned) value, mirroring how Framer's transform props compose
// on top of a CSS-positioned element. scale/alpha keyframes are absolute.
const ADDITIVE_PROPS = new Set(['x', 'y', 'angle', 'rotation'])

function resolveEase(ease) {
  return EASE_MAP[ease] ?? ease ?? 'Linear'
}

function toArray(value) {
  return Array.isArray(value) ? value : [value]
}

/**
 * Builds a scene.tweens.chain() out of a Framer-style keyframe spec:
 * per-property value arrays sampled at normalized `times`, with a duration
 * (ms) split proportionally across the times gaps and one ease per segment.
 */
export function keyframeTween(
  scene,
  {
    targets,
    props,
    times,
    duration,
    ease = 'linear',
    repeat = 0,
    delay = 0,
    onComplete,
  },
) {
  // scene.tweens.chain()'s own `delay` never reactivates the chain once the
  // countdown ends (Phaser 3.90 TweenChain.update() bug: it flips `hasStarted`
  // but never calls setActiveState(), so isActive() stays false forever and
  // the chain freezes). Deferring creation instead sidesteps that entirely.
  if (delay > 0) {
    let chain = null
    let cancelled = false
    const timer = scene.time.delayedCall(delay, () => {
      if (!cancelled) {
        chain = keyframeTween(scene, { targets, props, times, duration, ease, repeat, onComplete })
      }
    })
    return {
      stop: () => {
        cancelled = true
        timer.remove()
        if (chain) chain.stop()
      },
    }
  }

  const targetList = toArray(targets)
  const propNames = Object.keys(props)
  const segmentCount = times.length - 1

  const bases = targetList.map((target) => {
    const base = {}
    for (const name of propNames) {
      base[name] = ADDITIVE_PROPS.has(name) ? target[name] : 0
    }
    return base
  })

  const tweens = []
  for (let i = 0; i < segmentCount; i++) {
    const segDuration = Math.max(
      1,
      Math.round(duration * (times[i + 1] - times[i])),
    )
    const segEase = resolveEase(Array.isArray(ease) ? ease[i] : ease)
    const segProps = {}
    for (const name of propNames) {
      const keyframeValue = props[name][i + 1]
      segProps[name] = ADDITIVE_PROPS.has(name)
        ? (target, key, value, targetIndex) =>
            bases[targetIndex][name] + keyframeValue
        : keyframeValue
    }
    tweens.push({ ...segProps, duration: segDuration, ease: segEase })
  }

  return scene.tweens.chain({
    targets,
    tweens,
    loop: repeat === Infinity || repeat === -1 ? -1 : repeat,
    onComplete,
  })
}
