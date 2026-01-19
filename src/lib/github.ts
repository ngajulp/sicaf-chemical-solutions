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
//export const getProducts = async () => {
//  return fetchFileContent('products.json');
//};
export const getProducts = async () => {
  return fetchRawFile('products.json');
};
export const getProductsRaw = async () => {
  return fetchRawFile('products.json');
};

export const updateProducts = async (products: any[], sha: string, message: string) => {
  return updateFileContent('products.json', products, sha, message);
};

export const getProductsSha = async (): Promise<string> => {
  const token = await fetchGitHubToken();

  const response = await fetch(`${GITHUB_API_URL}/products.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer le SHA produits');
  }

  const data = await response.json();
  return data.sha;
};


// Users CRUD
//export const getUsers = async () => {
//  return fetchFileContent('users.json');
//};
export const getUsers = async () => {
  return fetchRawFile('users.json');
};
export const getUsersRaw = async () => {
  return fetchRawFile('users.json');
};

export const updateUsers = async (users: any[], sha: string, message: string) => {
  return updateFileContent('users.json', users, sha, message);
};

export const getUsersSha = async (): Promise<string> => {
  const token = await fetchGitHubToken();

  const response = await fetch(`${GITHUB_API_URL}/users.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer le SHA users');
  }

  const data = await response.json();
  return data.sha;
};

export const getHistorySha = async (): Promise<string> => {
  const token = await fetchGitHubToken();

  const response = await fetch(`${GITHUB_API_URL}/history.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer le SHA history');
  }

  const data = await response.json();
  return data.sha;
};

// History CRUD
//export const getHistory = async () => {
//  return fetchFileContent('history.json');
//};
export const getHistory = async () => {
  return fetchRawFile('history.json');
};
export const getHistoryRaw = async () => {
  return fetchRawFile('history.json');
};

export const updateHistory = async (history: any[], sha: string, message: string) => {
  return updateFileContent('history.json', history, sha, message);
};

// Company Info CRUD
export const getCompanyInfo = async () => {
  return fetchRawFile('infospersonnelles.json');
};

export const getCompanyInfoSha = async (): Promise<string> => {
  const token = await fetchGitHubToken();

  const response = await fetch(`${GITHUB_API_URL}/infospersonnelles.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer le SHA company info');
  }

  const data = await response.json();
  return data.sha;
};

export const updateCompanyInfo = async (info: any, sha: string, message: string) => {
  return updateFileContent('infospersonnelles.json', info, sha, message);
};

// Document Counters for sequential numbering
export interface DocumentCounters {
  proforma: number;
  devis: number;
  facture: number;
  lastUpdate: string;
}

export const getCounters = async (): Promise<DocumentCounters> => {
  try {
    return await fetchRawFile('counters.json');
  } catch {
    // Return default counters if file doesn't exist
    return { proforma: 0, devis: 0, facture: 0, lastUpdate: new Date().toISOString() };
  }
};

export const getCountersSha = async (): Promise<string> => {
  const token = await fetchGitHubToken();

  const response = await fetch(`${GITHUB_API_URL}/counters.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    // File may not exist, we'll create it
    throw new Error('Counters file not found');
  }

  const data = await response.json();
  return data.sha;
};

export const updateCounters = async (counters: DocumentCounters, sha: string, message: string) => {
  return updateFileContent('counters.json', counters, sha, message);
};

export const createCountersFile = async (): Promise<{ success: boolean; sha: string }> => {
  const token = await fetchGitHubToken();
  const initialCounters: DocumentCounters = {
    proforma: 0,
    devis: 0,
    facture: 0,
    lastUpdate: new Date().toISOString()
  };

  const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(initialCounters, null, 2))));

  const response = await fetch(`${GITHUB_API_URL}/counters.json`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Création fichier compteurs documents',
      content: encodedContent,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create counters file');
  }

  const result = await response.json();
  return { success: true, sha: result.content.sha };
};

// Increment counter and return new number
export const getNextDocumentNumber = async (type: 'proforma' | 'devis' | 'facture'): Promise<{ number: string; newCounters: DocumentCounters }> => {
  let counters = await getCounters();
  let sha: string;
  
  try {
    sha = await getCountersSha();
  } catch {
    // Create file if it doesn't exist
    const result = await createCountersFile();
    sha = result.sha;
    counters = { proforma: 0, devis: 0, facture: 0, lastUpdate: new Date().toISOString() };
  }
  
  // Increment the counter
  counters[type] = counters[type] + 1;
  counters.lastUpdate = new Date().toISOString();
  
  // Update on GitHub
  const result = await updateCounters(counters, sha, `Incrémentation compteur ${type}: ${counters[type]}`);
  
  // Format number with padding
  const year = new Date().getFullYear();
  const prefix = type === 'proforma' ? 'PRO' : type === 'devis' ? 'DEV' : 'FAC';
  const paddedNumber = counters[type].toString().padStart(5, '0');
  
  return {
    number: `${prefix}-${year}-${paddedNumber}`,
    newCounters: counters
  };
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

// ==================== FILE UPLOAD FUNCTIONS ====================

const GITHUB_UPLOAD_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:*/*;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
};

// Upload image to GitHub
export const uploadImageToGitHub = async (
  file: File,
  fileName: string
): Promise<{ success: boolean; url: string }> => {
  const token = await fetchGitHubToken();
  const base64Content = await fileToBase64(file);
  
  // Clean filename
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `public-data/img/${cleanFileName}`;
  
  const response = await fetch(`${GITHUB_UPLOAD_API}/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Upload image: ${cleanFileName}`,
      content: base64Content,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Image upload failed');
  }

  const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;
  return { success: true, url: rawUrl };
};

// Upload PDF to GitHub
export const uploadPdfToGitHub = async (
  file: File,
  fileName: string
): Promise<{ success: boolean; url: string }> => {
  const token = await fetchGitHubToken();
  const base64Content = await fileToBase64(file);
  
  // Clean filename
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `public-data/pdf/${cleanFileName}`;
  
  const response = await fetch(`${GITHUB_UPLOAD_API}/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Upload PDF: ${cleanFileName}`,
      content: base64Content,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'PDF upload failed');
  }

  const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;
  return { success: true, url: rawUrl };
};

// Get default product image URL
export const getDefaultProductImage = (reference: string): string => {
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public-data/img/default-product.png`;
};

// Get default category image URL  
export const getDefaultCategoryImage = (categoryName: string): string => {
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public-data/img/default-category.png`;
};



// ==================== UPDATE PRODUCT WITH FILES ====================

export const updateProductWithFile = async (
  reference: string,
  updatedData: Partial<any>,
  newImage?: File,
  newPdf?: File
) => {
  // 1️⃣ Récupérer produits existants et SHA
  const { content: products, sha } = await fetchFileContent('products.json');

  // 2️⃣ Trouver le produit par référence
  const productIndex = products.findIndex((p: any) => p.reference === reference);
  if (productIndex === -1) throw new Error('Produit non trouvé');

  // 3️⃣ Upload nouveau fichier si fourni, en écrasant l'existant
  if (newImage) {
    // Nom basé sur la référence (toujours le même)
    const fileName = `${reference}.png`; // ou jpg selon ton standard
    const { url } = await uploadImageToGitHub(newImage, fileName);
    updatedData.img = url;
  }

  if (newPdf) {
    // Nom basé sur la référence
    const fileName = `${reference}.pdf`;
    const { url } = await uploadPdfToGitHub(newPdf, fileName);
    updatedData.pdf = url;
  }

  // 4️⃣ Mettre à jour le produit dans le tableau
  products[productIndex] = { ...products[productIndex], ...updatedData };

  // 5️⃣ Envoyer sur GitHub
  await updateFileContent('products.json', products, sha, `Update product ${reference}`);

  return products[productIndex];
};
