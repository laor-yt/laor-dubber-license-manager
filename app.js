
// ═══════════════════════════════════════════════════
//  Laor License Manager – app.js
// ═══════════════════════════════════════════════════

let db = { licenses: [] };
let currentLang = localStorage.getItem("lang") || "en";
let currentTheme = localStorage.getItem("theme") || "light";

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
  loadDB();
});

function loadDB() {
  fetch("db.json")
    .then(r => r.json())
    .then(data => { db = data; refreshAll(); })
    .catch(() => { db = { licenses: [] }; refreshAll(); });
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
}

function removeDevice(index) {
  const id = document.getElementById("deviceLicenseId").value;
  const lic = db.licenses.find(l => l.id === id);
  if (!lic) return;
  lic.devices.splice(index, 1);
  renderDeviceList(lic);
  refreshAll();
  showToast(t("toast_device_removed"), "#dc3545");
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
