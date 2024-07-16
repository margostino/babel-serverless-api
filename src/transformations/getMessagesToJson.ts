export const getMessagesToJson = (messages: any[][] | null | undefined) => {
  return messages?.map((message) => {
    const jsonMessage = JSON.parse(message[1])
    return {
      timestamp: message[0],
      sender: jsonMessage['sender'],
      content: jsonMessage['content'],
    }
  })
}
