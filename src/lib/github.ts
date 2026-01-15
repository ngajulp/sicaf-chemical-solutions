// GitHub API Service for CRUD operations
const GITHUB_OWNER = 'ngajulp';
const GITHUB_REPO = 'sicaf-chemical-solutions';
const GITHUB_BRANCH = 'main';
const GITHUB_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public-data`;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public-data`;

let cachedToken: string | null = null;

export const fetchGitHubToken = async (): Promise<string> => {
  if (cachedToken) return cachedToken;
  
  try {
    const response = await fetch(`${GITHUB_BASE_URL}/tokens.json`);
    if (!response.ok) throw new Error('Failed to fetch token');
    const data = await response.json();
    cachedToken = data.tokengit;
    return cachedToken || '';
  } catch (error) {
    console.error('Error fetching GitHub token:', error);
    throw error;
  }
};

export const fetchFileContent = async (filename: string): Promise<{ content: any; sha: string }> => {
  const token = await fetchGitHubToken();
  
  const response = await fetch(`${GITHUB_API_URL}/${filename}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
  
  const data = await response.json();
  const content = JSON.parse(atob(data.content));
  
  return { content, sha: data.sha };
};

export const updateFileContent = async (
  filename: string, 
  content: any, 
  sha: string, 
  message: string
): Promise<boolean> => {
  const token = await fetchGitHubToken();
  
  const response = await fetch(`${GITHUB_API_URL}/${filename}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
      sha,
      branch: GITHUB_BRANCH
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('GitHub API error:', error);
    throw new Error(`Failed to update ${filename}: ${error.message}`);
  }
  
  return true;
};

// Products CRUD
export const getProducts = async () => {
  return fetchFileContent('products.json');
};

export const updateProducts = async (products: any[], sha: string, message: string) => {
  return updateFileContent('products.json', products, sha, message);
};

// Users CRUD
export const getUsers = async () => {
  return fetchFileContent('users.json');
};

export const updateUsers = async (users: any[], sha: string, message: string) => {
  return updateFileContent('users.json', users, sha, message);
};

// History CRUD
export const getHistory = async () => {
  return fetchFileContent('history.json');
};

export const updateHistory = async (history: any[], sha: string, message: string) => {
  return updateFileContent('history.json', history, sha, message);
};

// Add connection log
export const addConnectionLog = async (userId: number, action: string = 'connexion') => {
  try {
    const { content: history, sha } = await getHistory();
    const newLog = {
      id: userId,
      date: new Date().toISOString().split('T')[0],
      heure: new Date().toTimeString().split(' ')[0],
      action
    };
    
    const updatedHistory = [...history, newLog];
    await updateHistory(updatedHistory, sha, `Ajout log connexion user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error adding connection log:', error);
    return false;
  }
};
