
// ═══════════════════════════════════════════════════
//  Laor License Manager – app.js
// ═══════════════════════════════════════════════════

let db = { licenses: [] };
const PUBLIC_DB_URL = window.LAOR_PUBLIC_DB_URL || "https://laor-yt.github.io/laor-dubber-license-manager/db.json";
const GITHUB_OWNER = window.LAOR_GITHUB_OWNER || "laor-yt";
const GITHUB_REPO = window.LAOR_GITHUB_REPO || "laor-dubber-license-manager";
const GITHUB_BRANCH = window.LAOR_GITHUB_BRANCH || "main";
const GITHUB_FILE_PATH = window.LAOR_GITHUB_FILE_PATH || "db.json";
const API_BASE_STORAGE_KEY = "laorApiBaseUrl";
const ADMIN_KEY_STORAGE_KEY = "adminSaveKey";
const DIRECT_GITHUB_TOKEN_STORAGE_KEY = "directGitHubToken";
let currentLang = localStorage.getItem("lang") || "en";
let currentTheme = localStorage.getItem("theme") || "light";

function cleanApiBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function getConfiguredApiBaseUrl() {
  return cleanApiBaseUrl(window.LAOR_API_BASE_URL || localStorage.getItem(API_BASE_STORAGE_KEY) || "");
}

function isStaticPreview() {
  return window.location.protocol === "file:" || window.location.hostname.endsWith("github.io");
}

function getBackendDbUrl() {
  const configuredBaseUrl = getConfiguredApiBaseUrl();
  if (configuredBaseUrl) return `${configuredBaseUrl}/api/db`;
  return isStaticPreview() ? "" : "/api/db";
}

function getReadDbUrl() {
  return getBackendDbUrl() || PUBLIC_DB_URL;
}

function encodeGitHubPath(filePath) {
  return String(filePath || "db.json").split("/").map(encodeURIComponent).join("/");
}

function getGitHubContentsApiUrl(includeRef = true) {
  const base = `https://api.github.com/repos/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(GITHUB_REPO)}/contents/${encodeGitHubPath(GITHUB_FILE_PATH)}`;
  return includeRef ? `${base}?ref=${encodeURIComponent(GITHUB_BRANCH)}` : base;
}

function githubApiHeaders(token) {
  return {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

function base64EncodeUtf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function validateDatabaseShape(data) {
  if (!data || !Array.isArray(data.licenses)) {
    throw new Error('Invalid db.json: expected top-level { "licenses": [] }');
  }
}

// ── i18n Translations ──
const i18n = {
  en: {
    nav_dashboard: "Dashboard",
    nav_licenses: "Licenses",
    nav_devices: "Devices",
    nav_settings: "Settings",
    stat_total: "Total Licenses",
    stat_active: "Active",
    stat_expired: "Expired / Revoked",
    stat_devices: "Total Devices",
    recent_licenses: "Recent Licenses",
    all_licenses: "All Licenses",
    all_devices: "All Devices",
    th_key: "License Key",
    th_product: "Product",
    th_owner: "Owner",
    th_status: "Status",
    th_end: "End Date",
    th_devices: "Devices",
    th_role: "Role",
    th_actions: "Actions",
    th_imei: "IMEI",
    th_device_name: "Device Name",
    th_license: "License Key",
    th_registered: "Registered",
    filter_all: "All Status",
    filter_active: "Active",
    filter_expired: "Expired",
    filter_revoked: "Revoked",
    filter_all_role: "All Roles",
    btn_add: "Add License",
    btn_save: "Save",
    btn_cancel: "Cancel",
    btn_delete: "Delete",
    btn_export: "Export JSON",
    btn_add_device: "Add Device",
    export_db: "Export Database",
    export_desc: "Download the current database as a JSON file.",
    import_db: "Import Database",
    import_desc: "Upload a JSON file to replace the current database.",
    manage_devices: "Manage Devices",
    add_device: "Add Device",
    lbl_key: "License Key",
    lbl_product: "Product Name",
    lbl_status: "Status",
    lbl_end: "End Date",
    lbl_max_devices: "Max Devices",
    lbl_role: "Role",
    lbl_owner: "Owner Name",
    lbl_email: "Email",
    delete_confirm: "Are you sure you want to delete this license?",
    toast_added: "License added successfully!",
    toast_updated: "License updated successfully!",
    toast_deleted: "License deleted successfully!",
    toast_device_added: "Device added successfully!",
    toast_device_removed: "Device removed successfully!",
    toast_imported: "Database imported successfully!",
    toast_max_reached: "Maximum device limit reached!",
    toast_fill_fields: "Please fill in all required fields!",
    add_license_title: "Add License",
    edit_license_title: "Edit License"
  },
  kh: {
    nav_dashboard: "ផ្ទាំងគ្រប់គ្រង",
    nav_licenses: "អាជ្ញាប័ណ្ណ",
    nav_devices: "ឧបករណ៍",
    nav_settings: "ការកំណត់",
    stat_total: "អាជ្ញាប័ណ្ណសរុប",
    stat_active: "សកម្ម",
    stat_expired: "ផុតកំណត់ / ដកហូត",
    stat_devices: "ឧបករណ៍សរុប",
    recent_licenses: "អាជ្ញាប័ណ្ណថ្មីៗ",
    all_licenses: "អាជ្ញាប័ណ្ណទាំងអស់",
    all_devices: "ឧបករណ៍ទាំងអស់",
    th_key: "លេខកូដអាជ្ញាប័ណ្ណ",
    th_product: "ផលិតផល",
    th_owner: "ម្ចាស់",
    th_status: "ស្ថានភាព",
    th_end: "កាលបរិច្ឆេទបញ្ចប់",
    th_devices: "ឧបករណ៍",
    th_role: "តួនាទី",
    th_actions: "សកម្មភាព",
    th_imei: "IMEI",
    th_device_name: "ឈ្មោះឧបករណ៍",
    th_license: "លេខកូដអាជ្ញាប័ណ្ណ",
    th_registered: "ចុះឈ្មោះ",
    filter_all: "ស្ថានភាពទាំងអស់",
    filter_active: "សកម្ម",
    filter_expired: "ផុតកំណត់",
    filter_revoked: "ដកហូត",
    filter_all_role: "តួនាទីទាំងអស់",
    btn_add: "បន្ថែមអាជ្ញាប័ណ្ណ",
    btn_save: "រក្សាទុក",
    btn_cancel: "បោះបង់",
    btn_delete: "លុប",
    btn_export: "នាំចេញ JSON",
    btn_add_device: "បន្ថែមឧបករណ៍",
    export_db: "នាំចេញមូលដ្ឋានទិន្នន័យ",
    export_desc: "ទាញយកមូលដ្ឋានទិន្នន័យបច្ចុប្បន្នជាឯកសារ JSON។",
    import_db: "នាំចូលមូលដ្ឋានទិន្នន័យ",
    import_desc: "បង្ហោះឯកសារ JSON ដើម្បីជំនួសមូលដ្ឋានទិន្នន័យបច្ចុប្បន្ន។",
    manage_devices: "គ្រប់គ្រងឧបករណ៍",
    add_device: "បន្ថែមឧបករណ៍",
    lbl_key: "លេខកូដអាជ្ញាប័ណ្ណ",
    lbl_product: "ឈ្មោះផលិតផល",
    lbl_status: "ស្ថានភាព",
    lbl_end: "កាលបរិច្ឆេទបញ្ចប់",
    lbl_max_devices: "ឧបករណ៍អតិបរមា",
    lbl_role: "តួនាទី",
    lbl_owner: "ឈ្មោះម្ចាស់",
    lbl_email: "អ៊ីមែល",
    delete_confirm: "តើអ្នកពិតជាចង់លុបអាជ្ញាប័ណ្ណនេះមែនទេ?",
    toast_added: "បានបន្ថែមអាជ្ញាប័ណ្ណដោយជោគជ័យ!",
    toast_updated: "បានធ្វើបច្ចុប្បន្នភាពអាជ្ញាប័ណ្ណដោយជោគជ័យ!",
    toast_deleted: "បានលុបអាជ្ញាប័ណ្ណដោយជោគជ័យ!",
    toast_device_added: "បានបន្ថែមឧបករណ៍ដោយជោគជ័យ!",
    toast_device_removed: "បានដកឧបករណ៍ដោយជោគជ័យ!",
    toast_imported: "បាននាំចូលមូលដ្ឋានទិន្នន័យដោយជោគជ័យ!",
    toast_max_reached: "ឈានដល់ដែនកំណត់ឧបករណ៍អតិបរមា!",
    toast_fill_fields: "សូមបំពេញវាលដែលត្រូវការទាំងអស់!",
    add_license_title: "បន្ថែមអាជ្ញាប័ណ្ណ",
    edit_license_title: "កែសម្រួលអាជ្ញាប័ណ្ណ"
  }
};

// ── Helper: translate page ──
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18n[currentLang] && i18n[currentLang][key]) {
      el.textContent = i18n[currentLang][key];
    }
  });
}

function t(key) {
  return (i18n[currentLang] && i18n[currentLang][key]) || (i18n.en[key]) || key;
}

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  document.getElementById("langSwitcher").value = currentLang;
  initApiSettings();
  loadDB();
});

function normalizeDB(data) {
  const normalized = data && Array.isArray(data.licenses) ? data : { licenses: [] };
  normalized.licenses = normalized.licenses.map(license => ({
    devices: [],
    ...license,
    devices: Array.isArray(license.devices) ? license.devices : []
  }));
  return normalized;
}

async function loadDB() {
  // Load live license data. If a backend API is configured, read through it;
  // otherwise read the public GitHub Pages db.json endpoint.
  const readUrl = getReadDbUrl();
  setApiStatus(`Loading database from ${readUrl} ...`);

  try {
    const response = await fetch(`${readUrl}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    const data = await response.json();
    db = normalizeDB(data);
    refreshAll();
    updateApiStatus();
    showToast("Database loaded from API");
  } catch (error) {
    console.error("Could not load API db.json. Falling back to local db.json.", error);
    try {
      const response = await fetch("db.json", { cache: "no-store" });
      const data = await response.json();
      db = normalizeDB(data);
      refreshAll();
      setApiStatus("API load failed. Showing local db.json fallback.", true);
    } catch (_) {
      db = { licenses: [] };
      refreshAll();
      setApiStatus("API load failed and local db.json could not be loaded.", true);
    }
  }
}

function setApiStatus(message, isError = false) {
  const statusEl = document.getElementById("apiStatusText");
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#dc3545" : "var(--text-muted)";
}

function updateApiStatus() {
  const backendUrl = getBackendDbUrl();
  const readUrl = getReadDbUrl();
  const mode = backendUrl ? "Read/write backend enabled" : "Read-only public API mode";
  setApiStatus(`${mode}. Reading from: ${readUrl}`);
}

function initApiSettings() {
  const apiInput = document.getElementById("apiBaseUrlInput");
  if (apiInput) apiInput.value = getConfiguredApiBaseUrl();

  const adminInput = document.getElementById("adminKeyInput");
  if (adminInput) adminInput.value = sessionStorage.getItem(ADMIN_KEY_STORAGE_KEY) || "";

  const directTokenInput = document.getElementById("githubTokenInput");
  if (directTokenInput) directTokenInput.value = sessionStorage.getItem(DIRECT_GITHUB_TOKEN_STORAGE_KEY) || "";

  const githubTargetEl = document.getElementById("githubTargetText");
  if (githubTargetEl) {
    githubTargetEl.textContent = `${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_FILE_PATH} on ${GITHUB_BRANCH}`;
  }

  updateApiStatus();
}

function saveApiBaseUrl() {
  const input = document.getElementById("apiBaseUrlInput");
  const value = cleanApiBaseUrl(input && input.value);
  if (value) localStorage.setItem(API_BASE_STORAGE_KEY, value);
  else localStorage.removeItem(API_BASE_STORAGE_KEY);
  updateApiStatus();
  showToast(value ? "Backend API URL saved" : "Backend API URL cleared");
  loadDB();
}

function clearApiBaseUrl() {
  localStorage.removeItem(API_BASE_STORAGE_KEY);
  const input = document.getElementById("apiBaseUrlInput");
  if (input) input.value = "";
  updateApiStatus();
  showToast("Backend API URL cleared", "#f7971e");
  loadDB();
}

function saveAdminKeySetting() {
  const input = document.getElementById("adminKeyInput");
  const value = input ? input.value.trim() : "";
  if (value) sessionStorage.setItem(ADMIN_KEY_STORAGE_KEY, value);
  else sessionStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
  showToast(value ? "Admin key saved for this browser session" : "Admin key cleared", value ? undefined : "#f7971e");
}

function clearAdminKeySetting() {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
  const input = document.getElementById("adminKeyInput");
  if (input) input.value = "";
  showToast("Admin key cleared", "#f7971e");
}

function saveGitHubTokenSetting() {
  const input = document.getElementById("githubTokenInput");
  const value = input ? input.value.trim() : "";
  if (value) sessionStorage.setItem(DIRECT_GITHUB_TOKEN_STORAGE_KEY, value);
  else sessionStorage.removeItem(DIRECT_GITHUB_TOKEN_STORAGE_KEY);
  showToast(value ? "GitHub token saved for this browser session" : "GitHub token cleared", value ? undefined : "#f7971e");
}

function clearGitHubTokenSetting() {
  sessionStorage.removeItem(DIRECT_GITHUB_TOKEN_STORAGE_KEY);
  const input = document.getElementById("githubTokenInput");
  if (input) input.value = "";
  showToast("GitHub token cleared", "#f7971e");
}

async function getDirectGitHubToken() {
  let token = sessionStorage.getItem(DIRECT_GITHUB_TOKEN_STORAGE_KEY) || "";
  const input = document.getElementById("githubTokenInput");
  if (input && input.value.trim()) {
    token = input.value.trim();
    sessionStorage.setItem(DIRECT_GITHUB_TOKEN_STORAGE_KEY, token);
  }
  if (!token) {
    token = window.prompt("Enter a GitHub token with Contents read/write permission for this repository:") || "";
    if (token) {
      sessionStorage.setItem(DIRECT_GITHUB_TOKEN_STORAGE_KEY, token);
      if (input) input.value = token;
    }
  }
  return token;
}

async function checkDirectGitHubStatus() {
  const token = await getDirectGitHubToken();
  if (!token) {
    setApiStatus("No backend configured. Add a backend URL or enter a GitHub token in Direct GitHub Save.", true);
    return;
  }

  try {
    const response = await fetch(`${getGitHubContentsApiUrl(true)}&t=${Date.now()}`, {
      headers: githubApiHeaders(token),
      cache: "no-store"
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || `GitHub check failed: HTTP ${response.status}`);
    setApiStatus(`Direct GitHub connected: ${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_FILE_PATH} on ${GITHUB_BRANCH}`);
    showToast("Direct GitHub connection ready");
  } catch (error) {
    setApiStatus(error.message || "Direct GitHub check failed", true);
    showToast(error.message || "Direct GitHub check failed", "#dc3545");
  }
}

async function checkApiStatus() {
  const backendUrl = getBackendDbUrl();
  if (!backendUrl) {
    await checkDirectGitHubStatus();
    return;
  }

  const statusUrl = backendUrl.replace(/\/api\/db$/, "/api/status");
  try {
    const response = await fetch(`${statusUrl}?t=${Date.now()}`, { cache: "no-store" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `Status failed: HTTP ${response.status}`);
    const writeState = result.can_write ? "write ready" : "server missing token or admin key";
    setApiStatus(`Backend connected: ${result.owner}/${result.repo}/${result.file_path} (${writeState})`);
    showToast("Backend API connected");
  } catch (error) {
    setApiStatus(error.message || "Backend API status check failed", true);
    showToast(error.message || "Backend API status check failed", "#dc3545");
  }
}

async function getAdminKey() {
  let adminKey = sessionStorage.getItem(ADMIN_KEY_STORAGE_KEY) || "";
  const input = document.getElementById("adminKeyInput");
  if (input && input.value.trim()) {
    adminKey = input.value.trim();
    sessionStorage.setItem(ADMIN_KEY_STORAGE_KEY, adminKey);
  }
  if (!adminKey) {
    adminKey = window.prompt("Enter your admin save key to update GitHub db.json:") || "";
    if (adminKey) {
      sessionStorage.setItem(ADMIN_KEY_STORAGE_KEY, adminKey);
      if (input) input.value = adminKey;
    }
  }
  return adminKey;
}

async function saveThroughBackend(backendUrl) {
  const adminKey = await getAdminKey();
  if (!adminKey) {
    showToast("Save cancelled: admin key is required.", "#f7971e");
    return;
  }

  setApiStatus("Saving database through backend API ...");
  const response = await fetch(backendUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey
    },
    body: JSON.stringify(db, null, 2)
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) sessionStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
    throw new Error(result.error || `Save failed: HTTP ${response.status}`);
  }

  setApiStatus(`Saved to GitHub db.json${result.commit ? ` at commit ${String(result.commit).slice(0, 7)}` : ""}`);
  showToast("Saved to API database");
}

async function saveDirectlyToGitHub() {
  validateDatabaseShape(db);
  const token = await getDirectGitHubToken();
  if (!token) {
    showToast("Save cancelled: GitHub token is required.", "#f7971e");
    setApiStatus("Enter a GitHub token in Settings, or configure a backend API URL.", true);
    return;
  }

  setApiStatus("Saving directly to GitHub db.json ...");

  const currentResponse = await fetch(`${getGitHubContentsApiUrl(true)}&t=${Date.now()}`, {
    headers: githubApiHeaders(token),
    cache: "no-store"
  });
  const current = await currentResponse.json().catch(() => ({}));
  if (!currentResponse.ok) {
    if (currentResponse.status === 401 || currentResponse.status === 403) sessionStorage.removeItem(DIRECT_GITHUB_TOKEN_STORAGE_KEY);
    throw new Error(current.message || `GitHub read failed: HTTP ${currentResponse.status}`);
  }

  const updateResponse = await fetch(getGitHubContentsApiUrl(false), {
    method: "PUT",
    headers: {
      ...githubApiHeaders(token),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update db.json from Laor License Manager",
      content: base64EncodeUtf8(JSON.stringify(db, null, 2) + "\n"),
      sha: current.sha,
      branch: GITHUB_BRANCH
    })
  });

  const result = await updateResponse.json().catch(() => ({}));
  if (!updateResponse.ok) {
    if (updateResponse.status === 401 || updateResponse.status === 403) sessionStorage.removeItem(DIRECT_GITHUB_TOKEN_STORAGE_KEY);
    throw new Error(result.message || `GitHub update failed: HTTP ${updateResponse.status}`);
  }

  const shortCommit = result.commit && result.commit.sha ? String(result.commit.sha).slice(0, 7) : "";
  setApiStatus(`Saved directly to GitHub db.json${shortCommit ? ` at commit ${shortCommit}` : ""}. GitHub Pages may need a minute to refresh.`);
  showToast("Saved directly to API database");
}

async function syncDBToGitHub() {
  const backendUrl = getBackendDbUrl();

  try {
    if (backendUrl) {
      await saveThroughBackend(backendUrl);
    } else {
      await saveDirectlyToGitHub();
    }
  } catch (error) {
    console.error("Could not save to GitHub db.json", error);
    setApiStatus(error.message || "Could not save to GitHub db.json", true);
    showToast(error.message || "Could not save to GitHub db.json", "#dc3545");
  }
}

function refreshAll() {
  applyI18n();
  renderStats();
  renderRecentTable();
  renderLicenses();
  renderDevices();
}

// ── Theme ──
function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
  const icon = document.getElementById("themeIcon");
  icon.className = currentTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
}
function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
  applyTheme();
}

// ── Language ──
function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  refreshAll();
}

// ── Sidebar Navigation ──
function navigate(page) {
  document.querySelectorAll("[data-page]").forEach(el => el.classList.remove("active"));
  document.querySelector(`[data-page="${page}"]`).classList.add("active");
  ["dashboard","licenses","devices","settings"].forEach(p => {
    document.getElementById("page-" + p).style.display = (p === page) ? "block" : "none";
  });
  const titles = { dashboard: t("nav_dashboard"), licenses: t("nav_licenses"), devices: t("nav_devices"), settings: t("nav_settings") };
  document.getElementById("pageTitle").textContent = titles[page] || page;
  // close sidebar on mobile
  if (window.innerWidth <= 768) toggleSidebar();
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("show");
  document.getElementById("sidebarOverlay").classList.toggle("show");
}

// ── Stats ──
function renderStats() {
  const total = db.licenses.length;
  const active = db.licenses.filter(l => l.status === "active").length;
  const expRev = db.licenses.filter(l => l.status === "expired" || l.status === "revoked").length;
  const devices = db.licenses.reduce((sum, l) => sum + l.devices.length, 0);
  document.getElementById("statTotal").textContent = total;
  document.getElementById("statActive").textContent = active;
  document.getElementById("statExpired").textContent = expRev;
  document.getElementById("statDevices").textContent = devices;
}

// ── Recent Table (Dashboard) ──
function renderRecentTable() {
  const tbody = document.getElementById("recentTableBody");
  const recent = [...db.licenses].sort((a, b) => b.created_date.localeCompare(a.created_date)).slice(0, 5);
  tbody.innerHTML = recent.map(l => `
    <tr>
      <td class="license-key">${l.license_key}</td>
      <td>${l.product_name}</td>
      <td>${l.owner_name}</td>
      <td><span class="badge-${l.status}">${l.status.charAt(0).toUpperCase() + l.status.slice(1)}</span></td>
      <td>${l.end_date}</td>
      <td>${l.devices.length} / ${l.max_devices}</td>
    </tr>
  `).join("");
}

// ── License Table (Licenses Page) ──
function renderLicenses() {
  const search = document.getElementById("searchLicense").value.toLowerCase();
  const statusFilter = document.getElementById("filterStatus").value;
  const roleFilter = document.getElementById("filterRole").value;

  let filtered = db.licenses.filter(l => {
    const matchSearch = l.license_key.toLowerCase().includes(search) ||
      l.product_name.toLowerCase().includes(search) ||
      l.owner_name.toLowerCase().includes(search) ||
      l.owner_email.toLowerCase().includes(search);
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const matchRole = roleFilter === "all" || l.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  const tbody = document.getElementById("licenseTableBody");
  tbody.innerHTML = filtered.map((l, i) => `
    <tr>
      <td>${i + 1}</td>
      <td class="license-key">${l.license_key}</td>
      <td>${l.product_name}</td>
      <td>${l.owner_name}<br><small style="color:var(--text-muted)">${l.owner_email}</small></td>
      <td><span class="badge-${l.role}">${l.role.charAt(0).toUpperCase() + l.role.slice(1)}</span></td>
      <td><span class="badge-${l.status}">${l.status.charAt(0).toUpperCase() + l.status.slice(1)}</span></td>
      <td>${l.end_date}</td>
      <td>${l.devices.length} / ${l.max_devices}</td>
      <td>
        <button class="btn-sm-action devices" title="Devices" onclick='openDeviceModal("${l.id}")'><i class="fas fa-mobile-screen-button"></i></button>
        <button class="btn-sm-action edit" title="Edit" onclick='openEditModal("${l.id}")'><i class="fas fa-pen"></i></button>
        <button class="btn-sm-action delete" title="Delete" onclick='openDeleteModal("${l.id}")'><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join("");
}

// ── Devices Table (Devices Page) ──
function renderDevices() {
  const search = document.getElementById("searchDevice").value.toLowerCase();
  let rows = [];
  let idx = 1;
  db.licenses.forEach(l => {
    l.devices.forEach(d => {
      if (d.imei.toLowerCase().includes(search) || d.device_name.toLowerCase().includes(search)) {
        rows.push(`
          <tr>
            <td>${idx++}</td>
            <td style="font-family:monospace">${d.imei}</td>
            <td>${d.device_name}</td>
            <td class="license-key">${l.license_key}</td>
            <td>${l.product_name}</td>
            <td>${d.registered_date}</td>
          </tr>
        `);
      }
    });
  });
  document.getElementById("deviceTableBody").innerHTML = rows.join("");
}

// ── Generate License Key (XXXX-XXXX-XXXX format) ──
function generateKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";
  for (let g = 0; g < 3; g++) {
    for (let i = 0; i < 4; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
    if (g < 2) key += "-";
  }
  document.getElementById("inputKey").value = key;
}

// ── Generate unique ID ──
function generateId() {
  return "LIC-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

// ── Add License Modal ──
function openAddModal() {
  document.getElementById("editLicenseId").value = "";
  document.getElementById("licenseModalTitle").textContent = t("add_license_title");
  document.getElementById("inputKey").value = "";
  document.getElementById("inputProduct").value = "";
  document.getElementById("inputStatus").value = "active";
  document.getElementById("inputEndDate").value = "";
  document.getElementById("inputMaxDevices").value = 1;
  document.getElementById("inputRole").value = "user";
  document.getElementById("inputOwner").value = "";
  document.getElementById("inputEmail").value = "";
  generateKey();
  new bootstrap.Modal(document.getElementById("licenseModal")).show();
}

// ── Edit License Modal ──
function openEditModal(id) {
  const lic = db.licenses.find(l => l.id === id);
  if (!lic) return;
  document.getElementById("editLicenseId").value = id;
  document.getElementById("licenseModalTitle").textContent = t("edit_license_title");
  document.getElementById("inputKey").value = lic.license_key;
  document.getElementById("inputProduct").value = lic.product_name;
  document.getElementById("inputStatus").value = lic.status;
  document.getElementById("inputEndDate").value = lic.end_date;
  document.getElementById("inputMaxDevices").value = lic.max_devices;
  document.getElementById("inputRole").value = lic.role;
  document.getElementById("inputOwner").value = lic.owner_name;
  document.getElementById("inputEmail").value = lic.owner_email;
  new bootstrap.Modal(document.getElementById("licenseModal")).show();
}

// ── Save License ──
function saveLicense() {
  const id = document.getElementById("editLicenseId").value;
  const key = document.getElementById("inputKey").value.trim();
  const product = document.getElementById("inputProduct").value.trim();
  const status = document.getElementById("inputStatus").value;
  const endDate = document.getElementById("inputEndDate").value.trim();
  const maxDevices = parseInt(document.getElementById("inputMaxDevices").value) || 1;
  const role = document.getElementById("inputRole").value;
  const owner = document.getElementById("inputOwner").value.trim();
  const email = document.getElementById("inputEmail").value.trim();

  if (!key || !product || !owner) {
    showToast(t("toast_fill_fields"), "#dc3545");
    return;
  }

  if (id) {
    // Edit existing
    const lic = db.licenses.find(l => l.id === id);
    if (lic) {
      lic.license_key = key;
      lic.product_name = product;
      lic.status = status;
      lic.end_date = endDate || "Lifetime";
      lic.max_devices = maxDevices;
      lic.role = role;
      lic.owner_name = owner;
      lic.owner_email = email;
    }
    showToast(t("toast_updated"));
  } else {
    // Add new
    const today = new Date().toISOString().slice(0, 10);
    db.licenses.push({
      id: generateId(),
      license_key: key,
      product_name: product,
      status: status,
      end_date: endDate || "Lifetime",
      max_devices: maxDevices,
      devices: [],
      role: role,
      created_date: today,
      owner_name: owner,
      owner_email: email
    });
    showToast(t("toast_added"));
  }

  bootstrap.Modal.getInstance(document.getElementById("licenseModal")).hide();
  refreshAll();
  syncDBToGitHub();
}

// ── Delete License ──
function openDeleteModal(id) {
  document.getElementById("deleteLicenseId").value = id;
  new bootstrap.Modal(document.getElementById("deleteModal")).show();
}
function confirmDelete() {
  const id = document.getElementById("deleteLicenseId").value;
  db.licenses = db.licenses.filter(l => l.id !== id);
  bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
  showToast(t("toast_deleted"), "#dc3545");
  refreshAll();
  syncDBToGitHub();
}

// ── Device Management Modal ──
function openDeviceModal(id) {
  const lic = db.licenses.find(l => l.id === id);
  if (!lic) return;
  document.getElementById("deviceLicenseId").value = id;
  document.getElementById("deviceModalKey").textContent = lic.license_key;
  document.getElementById("deviceModalMax").textContent = lic.max_devices;
  renderDeviceList(lic);
  document.getElementById("newDeviceImei").value = "";
  document.getElementById("newDeviceName").value = "";
  new bootstrap.Modal(document.getElementById("deviceModal")).show();
}

function renderDeviceList(lic) {
  const container = document.getElementById("deviceList");
  if (lic.devices.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px;">No devices registered.</p>';
    return;
  }
  container.innerHTML = lic.devices.map((d, i) => `
    <div class="device-item">
      <div class="info">
        <strong>${d.device_name}</strong><br>
        <small>IMEI: ${d.imei} &nbsp;|&nbsp; ${d.registered_date}</small>
      </div>
      <button class="btn-sm-action delete" onclick="removeDevice(${i})"><i class="fas fa-times-circle"></i></button>
    </div>
  `).join("");
}

function addDevice() {
  const id = document.getElementById("deviceLicenseId").value;
  const lic = db.licenses.find(l => l.id === id);
  if (!lic) return;
  if (lic.devices.length >= lic.max_devices) {
    showToast(t("toast_max_reached"), "#f7971e");
    return;
  }
  const imei = document.getElementById("newDeviceImei").value.trim();
  const name = document.getElementById("newDeviceName").value.trim();
  if (!imei || !name) { showToast(t("toast_fill_fields"), "#dc3545"); return; }
  const today = new Date().toISOString().slice(0, 10);
  lic.devices.push({ imei, device_name: name, registered_date: today });
  document.getElementById("newDeviceImei").value = "";
  document.getElementById("newDeviceName").value = "";
  renderDeviceList(lic);
  refreshAll();
  showToast(t("toast_device_added"));
  syncDBToGitHub();
}

function removeDevice(index) {
  const id = document.getElementById("deviceLicenseId").value;
  const lic = db.licenses.find(l => l.id === id);
  if (!lic) return;
  lic.devices.splice(index, 1);
  renderDeviceList(lic);
  refreshAll();
  showToast(t("toast_device_removed"), "#dc3545");
  syncDBToGitHub();
}

// ── Export / Import ──
function exportDB() {
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "db.json";
  a.click();
}

function importDB(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.licenses) {
        db = data;
        refreshAll();
        showToast(t("toast_imported"));
        syncDBToGitHub();
      }
    } catch (err) {
      showToast("Invalid JSON file!", "#dc3545");
    }
  };
  reader.readAsText(file);
}

// ── Toast Notification ──
function showToast(message, color) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.textContent = message;
  if (color) toast.style.background = color;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}
