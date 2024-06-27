// TODO: validate

export const GITHUB_TOKEN = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN : ''
export const OPENAI_API_BASE_URL = process.env.OPENAI_HOST ? process.env.OPENAI_HOST : ''
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY : ''

export const OPENAI_MODEL = process.env.OPENAI_MODEL ? process.env.OPENAI_MODEL : ''

export const GITHUB_USERNAME = process.env.GITHUB_USERNAME ? process.env.GITHUB_USERNAME : ''

export const GITHUB_REPO_PROMPTS = process.env.GITHUB_REPO_PROMPTS
  ? process.env.GITHUB_REPO_PROMPTS
  : ''
export const GITHUB_MEMORY_CLASSIFICATION_PROMPT_PATH = process.env
  .GITHUB_MEMORY_CLASSIFICATION_PROMPT_PATH
  ? process.env.GITHUB_MEMORY_CLASSIFICATION_PROMPT_PATH
  : ''

export const GITHUB_MEMORY_ASSISTANT_PROMPT_PATH = process.env.GITHUB_MEMORY_ASSISTANT_PROMPT_PATH
  ? process.env.GITHUB_MEMORY_ASSISTANT_PROMPT_PATH
  : ''

export const GITHUB_REPO_DATA = process.env.GITHUB_REPO_DATA ? process.env.GITHUB_REPO_DATA : ''

export const GITHUB_REPO_METADATA_INDEX_PATH = process.env.GITHUB_REPO_METADATA_INDEX_PATH
  ? process.env.GITHUB_REPO_METADATA_INDEX_PATH
  : ''

export const BABEL_ADMIN_TOKEN = process.env.BABEL_ADMIN_TOKEN ? process.env.BABEL_ADMIN_TOKEN : ''

export const BABEL_API_TOKEN = process.env.BABEL_API_TOKEN ? process.env.BABEL_API_TOKEN : ''

export const HEADERS = {
  AUTHORIZATION: 'authorization',
  X_BABEL_ADMIN_TOKEN: 'x-babel-admin-token',
}
