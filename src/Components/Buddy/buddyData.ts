export type BuddyVariant = 'warrior' | 'mentor' | 'panda';

interface BuddyAction {
  id: string;
  label: string;
  icon: string;
  message: string;
}

export interface BuddyProfile {
  id: BuddyVariant;
  name: string;
  emoji: string;
  title: string;
  defaultMessage: string;
  actions: BuddyAction[];
}

export const buddyOptions: BuddyProfile[] = [
  {
    id: 'warrior',
    name: 'Kakarot',
    emoji: '🔥',
    title: 'Saiyan Focus Coach',
    defaultMessage: 'I see your streak charging up. Shall we push it even higher today? ⚡',
    actions: [
      {
        id: 'train',
        label: 'Train',
        icon: '💥',
        message: 'Gravity chamber active! Give me one tiny win before the next break.'
      },
      {
        id: 'focus',
        label: 'Focus',
        icon: '🎯',
        message: 'Lock in for five minutes. No distractions, just pure power mode.'
      },
      {
        id: 'review',
        label: 'Review',
        icon: '📈',
        message: 'Scan your calendar. Find the next weak spot and conquer it early.'
      }
    ]
  },
  {
    id: 'mentor',
    name: 'Master Roshi',
    emoji: '🐢',
    title: 'Calm Discipline Sage',
    defaultMessage: 'Slow is smooth, smooth is fast. Breathe, then strike with intent.',
    actions: [
      {
        id: 'breath',
        label: 'Breathe',
        icon: '🧘',
        message: 'Inhale confidence, exhale doubt. Your next move is already decided.'
      },
      {
        id: 'story',
        label: 'Story',
        icon: '📜',
        message: 'Remember the promise you wrote in your journal. Honor it now.'
      },
      {
        id: 'guide',
        label: 'Guide',
        icon: '🌊',
        message: 'Tides rise and fall. Your discipline must remain unmoved.'
      }
    ]
  },
  {
    id: 'panda',
    name: 'Kung Fu Panda',
    emoji: '🐼',
    title: 'Playful Momentum Buddy',
    defaultMessage: 'Legendary status requires legendary snack discipline. Ready?',
    actions: [
      {
        id: 'boost',
        label: 'Boost',
        icon: '✨',
        message: 'One tiny task right now earns you a cosmic dumpling later.'
      },
      {
        id: 'dance',
        label: 'Dance',
        icon: '🕺',
        message: 'Shake off the stress. 30 seconds of movement, then back to legend mode.'
      },
      {
        id: 'cheer',
        label: 'Cheer',
        icon: '🏅',
        message: 'You already survived worse days. This one is easy mode.'
      }
    ]
  }
];
