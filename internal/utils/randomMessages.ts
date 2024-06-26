const messages = [
  'Hello, world!',
  'How are you today?',
  'What a lovely day!',
  'Good to see you!',
  'How are you doing?',
]

export const getRandomMessage = () => {
  return messages[Math.floor(Math.random() * messages.length)]
}
