/**
 * github.js — GitHub API helper for Eva's Rehab Tracker
 *
 * Strategy: Public repo + PAT stored in browser localStorage only.
 * Token never enters source code. All writes go through GitHub Contents API.
 *
 * Repo: ohchocolate/rehab
 * Data path: data/sessions/YYYY-MM-DD.json
 */

const STORAGE_KEY = 'gh_token';
const STORAGE_OWNER = 'gh_owner';
const STORAGE_REPO = 'gh_repo';

let _token = null;
let _owner = null;
let _repo = null;

// ---------------------------------------------------------------------------
// Config & Token Management
// ---------------------------------------------------------------------------

/**
 * Initialize the GitHub client. Call once after the user sets their PAT.
 * @param {string} token  - GitHub Fine-Grained PAT (contents: read+write)
 * @param {string} owner  - repo owner, e.g. "ohchocolate"
 * @param {string} repo   - repo name, e.g. "rehab"
 */
export function initGitHub(token, owner, repo) {
  _token = token;
  _owner = owner;
  _repo = repo;
  localStorage.setItem(STORAGE_KEY, token);
  localStorage.setItem(STORAGE_OWNER, owner);
  localStorage.setItem(STORAGE_REPO, repo);
}

/**
 * Load config from localStorage. Returns true if a token was found.
 * Call this on app startup before any API calls.
 */
export function loadStoredConfig() {
  _token = localStorage.getItem(STORAGE_KEY);
  _owner = localStorage.getItem(STORAGE_OWNER) || 'ohchocolate';
  _repo = localStorage.getItem(STORAGE_REPO) || 'rehab';
  return !!_token;
}

/** Returns true if a token exists in localStorage. */
export function hasToken() {
  return !!(localStorage.getItem(STORAGE_KEY));
}

/** Remove token and config from localStorage (logout / reset). */
export function clearToken() {
  _token = null;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_OWNER);
  localStorage.removeItem(STORAGE_REPO);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function _assertConfig() {
  if (!_token) throw new GitHubError('NO_TOKEN', '未找到 GitHub token，请先设置。');
  if (!_owner || !_repo) throw new GitHubError('NO_CONFIG', '未配置 owner/repo。');
}

async function _request(method, path, body) {
  _assertConfig();
  const url = `https://api.github.com/repos/${_owner}/${_repo}/${path}`;
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${_token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, opts);
  } catch (err) {
    throw new GitHubError('NETWORK', '保存失败，请检查网络', err);
  }

  if (res.status === 401) {
    throw new GitHubError('UNAUTHORIZED', 'Token 无效或已过期，请重新设置。');
  }
  if (res.status === 409) {
    throw new GitHubError('CONFLICT', 'SHA 冲突，请重试。');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new GitHubError('HTTP_ERROR', `GitHub API 错误 ${res.status}: ${text}`);
  }

  // 204 No Content (DELETE) — no body
  if (res.status === 204) return null;
  return res.json();
}

/** Encode a UTF-8 string to base64 (works with CJK characters). */
function _toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

/** Decode base64 to UTF-8 string. */
function _fromBase64(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function _sessionPath(date) {
  return `data/sessions/${date}.json`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Write (create or update) a session JSON to GitHub.
 *
 * Write flow:
 *   1. GET the file to check existence and retrieve SHA (if it exists).
 *   2. PUT the file with the new content (include SHA if updating).
 *
 * @param {string} date  - ISO date string, e.g. "2026-04-20"
 * @param {object} data  - Session data matching the project JSON schema
 * @returns {Promise<object>} GitHub API response
 */
export async function writeSession(date, data) {
  const path = _sessionPath(date);
  const content = _toBase64(JSON.stringify(data, null, 2));
  const message = `data: session log ${date}`;

  // Step 1 — check for existing file to get SHA
  let sha;
  try {
    const existing = await _request('GET', `contents/${path}`);
    sha = existing.sha;
  } catch (err) {
    // 404 is expected for a new file — all other errors re-throw
    if (err instanceof GitHubError && err.code !== 'HTTP_ERROR') throw err;
    // swallow 404; sha stays undefined
  }

  // Step 2 — PUT file
  const body = { message, content };
  if (sha) body.sha = sha;
  return _request('PUT', `contents/${path}`, body);
}

/**
 * List all session files in data/sessions/.
 * Returns an array of file metadata objects from the GitHub API
 * (each has .name, .path, .sha, .download_url, etc.).
 *
 * @returns {Promise<Array>}
 */
export async function listSessions() {
  try {
    const files = await _request('GET', 'contents/data/sessions');
    return Array.isArray(files)
      ? files.filter(f => f.name.endsWith('.json'))
      : [];
  } catch (err) {
    // If the directory doesn't exist yet return empty array
    if (err instanceof GitHubError && err.message.includes('404')) return [];
    throw err;
  }
}

/**
 * Read and parse a single session file from GitHub.
 *
 * @param {string} date  - ISO date string, e.g. "2026-04-20"
 * @returns {Promise<object|null>} Parsed session data, or null if not found
 */
export async function readSession(date) {
  const path = _sessionPath(date);
  try {
    const file = await _request('GET', `contents/${path}`);
    return JSON.parse(_fromBase64(file.content.replace(/\n/g, '')));
  } catch (err) {
    if (err instanceof GitHubError && err.message.includes('404')) return null;
    throw err;
  }
}

/**
 * Read ALL sessions and return them sorted by date (ascending).
 * Useful for rendering progress charts.
 *
 * @returns {Promise<Array<object>>} Array of parsed session objects
 */
export async function readAllSessions() {
  const files = await listSessions();
  const results = await Promise.all(
    files.map(async f => {
      const date = f.name.replace('.json', '');
      return readSession(date);
    })
  );
  return results
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

// ---------------------------------------------------------------------------
// Error class
// ---------------------------------------------------------------------------

export class GitHubError extends Error {
  /**
   * @param {string} code    - Machine-readable error code
   * @param {string} message - Human-readable message (Chinese-friendly)
   * @param {Error}  [cause] - Original error, if any
   */
  constructor(code, message, cause) {
    super(message);
    this.name = 'GitHubError';
    this.code = code;
    if (cause) this.cause = cause;
  }

  /** True if the caller should show the token setup screen. */
  get requiresReauth() {
    return this.code === 'NO_TOKEN' || this.code === 'UNAUTHORIZED';
  }

  /** True if the operation can safely be retried. */
  get retryable() {
    return this.code === 'CONFLICT' || this.code === 'NETWORK';
  }
}
