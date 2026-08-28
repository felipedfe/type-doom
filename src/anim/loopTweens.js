/** Continuous rotation. direction: 1 = clockwise, -1 = counter-clockwise. */
export function spin(
  scene,
  target,
  { duration = 1000, direction = 1, delay = 0 } = {},
) {
  return scene.tweens.add({
    targets: target,
    angle: direction >= 0 ? '+=360' : '-=360',
    duration,
    delay,
    repeat: -1,
    ease: 'Linear',
  })
}

/** Ping-pongs a single numeric property between from/to forever. */
export function mirrorSlide(
  scene,
  target,
  { prop = 'x', from, to, duration = 1000, delay = 0 } = {},
) {
  target[prop] = from
  return scene.tweens.add({
    targets: target,
    [prop]: to,
    duration,
    delay,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  })
}

/** Ping-pongs scale (or scaleX/scaleY for a squash effect) between from/to forever. */
export function pulseScale(
  scene,
  target,
  { prop = 'scale', from = 1, to = 1.2, duration = 1200, delay = 0 } = {},
) {
  target[prop] = from
  return scene.tweens.add({
    targets: target,
    [prop]: to,
    duration,
    delay,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  })
}
