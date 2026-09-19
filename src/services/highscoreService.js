import { supabase } from './supabaseClient'
import { HIGHSCORE_LIST_SIZE } from '../config/constants'

export async function getTopScores(limit = HIGHSCORE_LIST_SIZE) {
  const { data, error } = await supabase
    .from('highscores')
    .select('name, score')
    .order('score', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch highscores', error)
    return []
  }
  return data
}

export async function submitScore(name, score) {
  const { error } = await supabase.from('highscores').insert({ name, score })
  if (error) console.error('Failed to submit highscore', error)
  return !error
}
