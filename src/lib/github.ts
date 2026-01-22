// GitHub API Service for CRUD operations
const GITHUB_OWNER = 'ngajulp';
const GITHUB_REPO = 'sicaf-chemical-solutions';
const GITHUB_BRANCH = 'main';
const GITHUB_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public-data`;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public-data`;

let cachedToken: string | null = null;

// ==================== AUTHENTIFICATION ====================

export const fetchGitHubToken = async (): Promise<string> => {
  if (cachedToken) return cachedToken;
  const response = await fetch("/.netlify/functions/githubs");
  if (!response.ok) throw new Error("Failed to fetch GitHub token");
  const data = await response.json();
  cachedToken = data.token;
  return cachedToken;
};

export const clearTokenCache = () => {
  cachedToken = null;
};

// ==================== CORE FUNCTIONS (UTF-8 & SHA) ====================

export const fetchRawFile = async (filename: string): Promise<any> => {
  const response = await fetch(`${GITHUB_BASE_URL}/${filename}?t=${Date.now()}`);
  if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
  return response.json();
};

export const fetchFileContent = async (filename: string): Promise<{ content: any; sha: string }> => {
  const token = await fetchGitHubToken();
  const response = await fetch(`${GITHUB_API_URL}/${filename}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) clearTokenCache();
    throw new Error(`Failed to fetch ${filename}`);
  }
  
  const data = await response.json();
  const content = JSON.parse(decodeURIComponent(escape(atob(data.content))));
  return { content, sha: data.sha };
};

export const updateFileContent = async (
  filename: string,
  content: any,
  sha: string,
  message: string
): Promise<{ success: boolean; newSha: string }> => {
  const token = await fetchGitHubToken();
  // Encodage Base64 compatible UTF-8 pour les accents
  const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));

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

// ==================== PRODUCTS CRUD ====================

export const getProducts = () => fetchRawFile('products.json');
export const getProductsRaw = () => fetchRawFile('products.json');

export const getProductsSha = async (): Promise<string> => {
  const { sha } = await fetchFileContent('products.json');
  return sha;
};

export const updateProducts = (products: any[], sha: string, message: string) => {
  return updateFileContent('products.json', products, sha, message);
};

// ==================== INDUSTRIES (CATEGORIES) CRUD PARALLÈLE ====================

export const getIndustries = () => fetchRawFile('productsindustries.json');

/**
 * SAUVEGARDE PARALLÈLE : Gère l'ID automatique et synchronise les produits associés.
 */
export const updateIndustriesAndProducts = async (categoryData: any) => {
  // 1. Récupération simultanée des versions fraîches (SHA + Contenu)
  const [indRes, prodRes] = await Promise.all([
    fetchFileContent('productsindustries.json'),
    fetchFileContent('products.json')
  ]);

  let finalCategory = { ...categoryData };
  let newIndustries = [...indRes.content];

  // 2. GESTION DE L'ID (Calcul du max pour auto-incrémentation)
  const isNew = !categoryData.ID || categoryData.ID === 0;

  if (isNew) {
    const maxId = indRes.content.reduce((max: number, item: any) => 
      (item.ID && item.ID > max) ? item.ID : max, 0
    );
    finalCategory.ID = maxId + 1;
    newIndustries.push(finalCategory);
  } else {
    newIndustries = newIndustries.map((cat: any) => 
      cat.ID === finalCategory.ID ? finalCategory : cat
    );
  }

  // 3. SYNCHRONISATION DES PRODUITS (On propage img et nom de catégorie)
  const newProducts = prodRes.content.map((p: any) => {
    if (p.category_id === finalCategory.ID || p.ID_categorie === finalCategory.ID) {
      return { 
        ...p, 
        img: finalCategory.img, 
        categorie: finalCategory.categorie 
      };
    }
    return p;
  });

  // 4. ÉCRITURE SIMULTANÉE SUR GITHUB
  await Promise.all([
    updateFileContent('productsindustries.json', newIndustries, indRes.sha, `Admin: ${isNew ? 'Create' : 'Update'} category ${finalCategory.categorie}`),
    updateFileContent('products.json', newProducts, prodRes.sha, `Admin: Sync products for category ID ${finalCategory.ID}`)
  ]);

  return finalCategory;
};

export const deleteCategoryAndSyncProducts = async (categoryId: number) => {
  const [indRes, prodRes] = await Promise.all([
    fetchFileContent('productsindustries.json'),
    fetchFileContent('products.json')
  ]);

  const newIndustries = indRes.content.filter((c: any) => c.ID !== categoryId);
  const newProducts = prodRes.content.map((p: any) => {
    if (p.category_id === categoryId || p.ID_categorie === categoryId) {
      return { ...p, categorie: "Non classé", img: "" }; 
    }
    return p;
  });

  return Promise.all([
    updateFileContent('productsindustries.json', newIndustries, indRes.sha, `Admin: Delete category ID ${categoryId}`),
    updateFileContent('products.json', newProducts, prodRes.sha, `Admin: Cleanup products for deleted category`)
  ]);
};

// ==================== USERS & HISTORY ====================

export const getUsers = () => fetchRawFile('users.json');
export const updateUsers = (users: any[], sha: string, message: string) => 
  updateFileContent('users.json', users, sha, message);

export const getHistory = () => fetchRawFile('history.json');
export const updateHistory = (history: any[], sha: string, message: string) => 
  updateFileContent('history.json', history, sha, message);

export const addConnectionLog = async (userId: number, action: string = 'connexion') => {
  try {
    const { content: history, sha } = await fetchFileContent('history.json');
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

// ==================== COMPANY INFO & COUNTERS ====================

export const getCompanyInfo = () => fetchRawFile('infospersonnelles.json');
export const updateCompanyInfo = (info: any, sha: string, message: string) => 
  updateFileContent('infospersonnelles.json', info, sha, message);

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
    return { proforma: 0, devis: 0, facture: 0, lastUpdate: new Date().toISOString() };
  }
};

export const getNextDocumentNumber = async (type: 'proforma' | 'devis' | 'facture') => {
  const { content: counters, sha } = await fetchFileContent('counters.json');
  counters[type] += 1;
  counters.lastUpdate = new Date().toISOString();
  await updateFileContent('counters.json', counters, sha, `Incrémentation compteur ${type}`);
  
  const year = new Date().getFullYear();
  const prefix = type === 'proforma' ? 'PRO' : type === 'devis' ? 'DEV' : 'FAC';
  return {
    number: `${prefix}-${year}-${counters[type].toString().padStart(5, '0')}`,
    newCounters: counters
  };
};

// ==================== FILE UPLOAD (IMAGE & PDF) ====================

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });
};

export const uploadImageToGitHub = async (file: File, reference: string) => {
  const token = await fetchGitHubToken();
  const base64Content = await fileToBase64(file);
  const fileName = `${reference}.png`;
  
  let sha: string | undefined;
  try {
    const res = await fetch(`${GITHUB_API_URL}/img/${fileName}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
    }
  } catch {}

  const response = await fetch(`${GITHUB_API_URL}/img/${fileName}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Upload image: ${fileName}`,
      content: base64Content,
      branch: GITHUB_BRANCH,
      sha
    }),
  });

  if (!response.ok) throw new Error('Image upload failed');
  return { success: true, url: `${GITHUB_BASE_URL}/img/${fileName}` };
};

export const uploadPdfToGitHub = async (file: File, reference: string) => {
  const token = await fetchGitHubToken();
  const base64Content = await fileToBase64(file);
  const fileName = `${reference}.pdf`;

  let sha: string | undefined;
  try {
    const res = await fetch(`${GITHUB_API_URL}/pdf/${fileName}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
    }
  } catch {}

  const response = await fetch(`${GITHUB_API_URL}/pdf/${fileName}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Upload PDF: ${fileName}`,
      content: base64Content,
      branch: GITHUB_BRANCH,
      sha
    }),
  });

  if (!response.ok) throw new Error('PDF upload failed');
  return { success: true, url: `${GITHUB_BASE_URL}/pdf/${fileName}` };
};

export const updateProductWithFile = async (reference: string, updatedData: Partial<any>, newImage?: File, newPdf?: File) => {
  const { content: products, sha } = await fetchFileContent('products.json');
  const index = products.findIndex((p: any) => p.reference === reference);
  if (index === -1) throw new Error('Produit non trouvé');

  if (newImage) {
    const { url } = await uploadImageToGitHub(newImage, reference);
    updatedData.img = url;
  }
  if (newPdf) {
    const { url } = await uploadPdfToGitHub(newPdf, reference);
    updatedData.pdf = url;
  }

  products[index] = { ...products[index], ...updatedData };
  await updateFileContent('products.json', products, sha, `Update product ${reference}`);
  return products[index];
};
