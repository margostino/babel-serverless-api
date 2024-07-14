import { logger } from "../logger"

export const handleEcho = async (query: string | string[]) => {    
    logger.info(`echo request: ${query}`)
    return {
        message: {
          thinking_process: 'this is just an echo',
          response: query,
          sources: [],
        },
      }
}