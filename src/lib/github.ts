// GitHub API Service for CRUD operations
const GITHUB_OWNER = 'ngajulp';
const GITHUB_REPO = 'sicaf-chemical-solutions';
const GITHUB_BRANCH = 'main';
const GITHUB_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public-data`;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public-data`;

let cachedToken: string | null = null;
export interface CompanyInfo {
  nomentreprise: string;
  boitepostate: string;
  siege: string;
  Telephone: string;
  email: string;
  siteweb: string;
  rc?: string;
  niu?: string;
}
export const getCompanyInfo = async (): Promise<CompanyInfo> => {
  const res = await fetch(
    `${GITHUB_BASE_URL}/infospersonnelles.json?t=${Date.now()}`
  );

  if (!res.ok) {
    throw new Error('Impossible de charger les informations de la société');
  }

  const raw = await res.json();

  /**
   * 🔹 Mapping centralisé
   * 🔹 Sécurisé (fallback)
   * 🔹 Normalisé
   */
  return {
    nomentreprise: raw.nomentreprise ?? '',
    boitepostate: raw.boitepostate ?? '',
    siege: raw.siege ?? '',
    Telephone: raw.Telephone ?? '',
    email: raw.email ?? '',
    siteweb: raw.siteweb ?? '',
    rc: raw.rc || undefined,
    niu: raw.niu || undefined,
  };
};
export const fetchGitHubToken = async (): Promise<string> => {
  if (cachedToken) return cachedToken;
  
  try {
    const response = await fetch(`${GITHUB_BASE_URL}/tokens.json?t=${Date.now()}`);
    if (!response.ok) throw new Error('Failed to fetch token');
    const data = await response.json();
    cachedToken = data.tokengit;
    return cachedToken || '';
  } catch (error) {
    console.error('Error fetching GitHub token:', error);
    throw error;
  }
};

// Clear cached token (useful when token expires)
export const clearTokenCache = () => {
  cachedToken = null;
};

// Fetch raw file content (for public read-only access)
export const fetchRawFile = async (filename: string): Promise<any> => {
  const response = await fetch(`${GITHUB_BASE_URL}/${filename}?t=${Date.now()}`);
  if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
  return response.json();
};

// Fetch file with SHA (for updates - requires token)
export const fetchFileContent = async (filename: string): Promise<{ content: any; sha: string }> => {
  const token = await fetchGitHubToken();
  
  const response = await fetch(`${GITHUB_API_URL}/${filename}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!response.ok) {
    // Clear cache if auth fails
    if (response.status === 401) {
      clearTokenCache();
    }
    throw new Error(`Failed to fetch ${filename}`);
  }
  
  const data = await response.json();
  //const content = JSON.parse(atob(data.content));
  const content = JSON.parse(
  decodeURIComponent(
    escape(atob(data.content))
  )
);
  return { content, sha: data.sha };
};

// Update file content on GitHub (UTF-8 SAFE)
export const updateFileContent = async (
  filename: string,
  content: any,
  sha: string,
  message: string
): Promise<{ success: boolean; newSha: string }> => {
  const token = await fetchGitHubToken();

  const encodedContent = Buffer
    .from(JSON.stringify(content, null, 2), 'utf-8')
    .toString('base64');

  const response = await fetch(`${GITHUB_API_URL}/${filename}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: encodedContent,
      sha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'GitHub update failed');
  }

  const result = await response.json();
  return { success: true, newSha: result.content.sha };
};


// Products CRUD
export const getProducts = async () => {
  return fetchFileContent('products.json');
};

export const getProductsRaw = async () => {
  return fetchRawFile('products.json');
};

export const updateProducts = async (products: any[], sha: string, message: string) => {
  return updateFileContent('products.json', products, sha, message);
};

// Users CRUD
export const getUsers = async () => {
  return fetchFileContent('users.json');
};

export const getUsersRaw = async () => {
  return fetchRawFile('users.json');
};

export const updateUsers = async (users: any[], sha: string, message: string) => {
  return updateFileContent('users.json', users, sha, message);
};

// History CRUD
export const getHistory = async () => {
  return fetchFileContent('history.json');
};

export const getHistoryRaw = async () => {
  return fetchRawFile('history.json');
};

export const updateHistory = async (history: any[], sha: string, message: string) => {
  return updateFileContent('history.json', history, sha, message);
};

// Company Info
export const getCompanyInfo = async () => {
  return fetchRawFile('infospersonnelles.json');
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
