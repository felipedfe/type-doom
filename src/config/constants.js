export const GAME_WIDTH = 1280
export const GAME_HEIGHT = 720

export const COLORS = {
  purple: 0x7200ff,
  orange: 0xfa5e00,
  green: 0x00e99f,
  gray: 0x111111,
  white: 0xffffff,
}

export const COLOR_STRINGS = {
  purple: '#7200ff',
  orange: '#fa5e00',
  green: '#00e99f',
  gray: '#111111',
}

// difficulty ramp
export const SPEED_INITIAL = 0.09
// export const SPEED_INCREMENT = 0.012
export const SPEED_INCREMENT = 0.010
export const SPEED_MAX = 0.32

// timing (ms)
export const MISTAKE_FLASH_MS = 220
export const CASTING_MS = 520
export const WORD_FLASH_MS = 300
export const WORD_FLASH_IMAGE_MS = 180
export const SPELL_FLASH_MS = 550

// scoring
export const SCORE_WORD = 160

// monster column approach (0 -> 1) drives these ranges
export const APPROACH_Y_FROM = 0
export const APPROACH_Y_TO =20
export const APPROACH_SCALE_FROM = 0.85
export const APPROACH_SCALE_TO = 1.8

export const MONSTER_COUNT = 3
export const MONSTER_BASE_SIZE = {
  monster1: 380,
  monster2: 380,
  monster3: 450,
}

export const WIZARD_BASE_SIZE = 260

export const WORD_FLASH_IMAGE_KEYS = {
  smile: 'wordflash-smile',
  panda: 'wordflash-panda',
}
