// ============================================================
// Admin Dashboard Logic
// ============================================================

let adminKey = null;
let allSessions = [];
let refreshTimer = null;
let lastCreatedQrUrl = '';
let parsedCsvStudents = [];
let currentViewCourse = 'NURS701';

// --------------- Initialization ---------------

document.addEventListener('DOMContentLoaded', () => {
  // Check for existing admin session
  adminKey = sessionStorage.getItem('adminKey');
  if (adminKey) {
    showDashboard();
  }

  // Set today's date as default for session creation
  const dateInput = document.getElementById('create-date');
  dateInput.value = new Date().toISOString().split('T')[0];

  setupTabs();
  setupForms();
});

// --------------- Authentication ---------------

function setupForms() {
  // Login form
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    const loginError = document.getElementById('login-error');
    const loginBtn = document.getElementById('login-btn');

    loginError.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    // Demo mode
    if (CONFIG.API_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
      adminKey = 'demo-admin-key';
      sessionStorage.setItem('adminKey', adminKey);
      showDashboard();
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
      return;
    }

    const result = await apiPost('adminLogin', { password });

    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';

    if (result.success) {
      adminKey = result.adminKey;
      sessionStorage.setItem('adminKey', adminKey);
      showDashboard();
    } else {
      loginError.textContent = result.message || 'Incorrect password';
      loginError.classList.remove('hidden');
    }
  });

  // Create session form — dynamic session types
  document.getElementById('create-course').addEventListener('change', (e) => {
    const course = e.target.value;
    const typeSelect = document.getElementById('create-type');
    typeSelect.innerHTML = '';

    if (!course) {
      typeSelect.innerHTML = '<option value="">Select course first...</option>';
      typeSelect.disabled = true;
      return;
    }

    const types = CONFIG.SESSION_TYPES[course] || [];
    typeSelect.innerHTML = '<option value="">Select session type...</option>';
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      typeSelect.appendChild(opt);
    });
    typeSelect.disabled = false;
  });

  // Create session form submit
  document.getElementById('create-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const course = document.getElementById('create-course').value;
    const sessionType = document.getElementById('create-type').value;
    const sessionDate = document.getElementById('create-date').value;
    const pin = document.getElementById('create-pin').value.trim();
    const createBtn = document.getElementById('create-btn');

    if (!course || !sessionType || !sessionDate) {
      alert('Please fill in all fields.');
      return;
    }

    createBtn.disabled = true;
    createBtn.innerHTML = '<span class="spinner-sm inline-block mr-2"></span>Creating...';

    // Demo mode
    if (CONFIG.API_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
      await new Promise(r => setTimeout(r, 800));
      const demoToken = Math.random().toString(36).substring(2, 10);
      showQrCode(demoToken, course, sessionType, sessionDate, pin);
      createBtn.disabled = false;
      createBtn.textContent = 'Create Session & Generate QR Code';
      return;
    }

    const result = await apiPost('createSession', {
      adminKey,
      course,
      sessionType,
      sessionDate,
      pin
    });

    createBtn.disabled = false;
    createBtn.textContent = 'Create Session & Generate QR Code';

    if (result.success) {
      showQrCode(result.token, course, sessionType, sessionDate, pin);
      loadSessions(); // Refresh history
    } else {
      alert(result.message || 'Failed to create session.');
    }
  });

  // Live session selector
  document.getElementById('live-session-select').addEventListener('change', () => {
    refreshLiveAttendance();
  });
}

function showDashboard() {
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('dashboard-section').classList.remove('hidden');
  document.getElementById('logout-btn').classList.remove('hidden');

  loadStats();
  loadSessions();
  setupStudentUpload();
  viewStudents('NURS701');

  // Auto-refresh live attendance
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(() => {
    const select = document.getElementById('live-session-select');
    if (select.value) {
      refreshLiveAttendance();
    }
    loadStats();
  }, CONFIG.REFRESH_INTERVAL);
}

function adminLogout() {
  adminKey = null;
  sessionStorage.removeItem('adminKey');
  if (refreshTimer) clearInterval(refreshTimer);

  document.getElementById('login-section').classList.remove('hidden');
  document.getElementById('dashboard-section').classList.add('hidden');
  document.getElementById('logout-btn').classList.add('hidden');
  document.getElementById('admin-password').value = '';
}

// --------------- Tabs ---------------

function setupTabs() {
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all tabs
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

      // Activate clicked tab
      tab.classList.add('active');
      const tabName = tab.getAttribute('data-tab');
      document.getElementById('tab-' + tabName).classList.add('active');

      // Refresh data on tab switch
      if (tabName === 'history') loadSessions();
      if (tabName === 'live') refreshLiveAttendance();
      if (tabName === 'students') viewStudents(currentViewCourse);
    });
  });
}

// --------------- Stats ---------------

async function loadStats() {
  if (CONFIG.API_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
    // Demo stats
    document.getElementById('stat-total').textContent = '12';
    document.getElementById('stat-nurs701').textContent = '8';
    document.getElementById('stat-nurs703').textContent = '4';
    document.getElementById('stat-sessions').textContent = allSessions.filter(s => s.active).length || '2';
    return;
  }

  const result = await apiGet('getStats', { adminKey });
  if (result.success) {
    document.getElementById('stat-total').textContent = result.totalToday || 0;
    document.getElementById('stat-nurs701').textContent = (result.byCourse && result.byCourse['NURS701']) || 0;
    document.getElementById('stat-nurs703').textContent = (result.byCourse && result.byCourse['NURS703']) || 0;
    document.getElementById('stat-sessions').textContent = allSessions.filter(s => s.active).length;
  }
}

// --------------- Sessions ---------------

async function loadSessions() {
  if (CONFIG.API_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
    // Demo sessions
    allSessions = [
      { token: 'demo1234', course: 'NURS701', sessionType: 'SIM Lab', sessionDate: new Date().toISOString().split('T')[0], active: true, attendanceCount: 23, totalStudents: 45 },
      { token: 'demo5678', course: 'NURS701', sessionType: 'Skills Lab 1 (General)', sessionDate: '2026-04-14', active: true, attendanceCount: 38, totalStudents: 45 },
      { token: 'demo9012', course: 'NURS703', sessionType: 'SIM Lab', sessionDate: '2026-04-10', active: false, attendanceCount: 28, totalStudents: 30 },
    ];
    renderSessions();
    populateLiveSelect();
    return;
  }

  const result = await apiGet('getSessions', { adminKey });
  if (result.success) {
    allSessions = result.sessions;
    renderSessions();
    populateLiveSelect();
  }
}

function populateLiveSelect() {
  const select = document.getElementById('live-session-select');
  const currentVal = select.value;
  select.innerHTML = '<option value="">Select a session...</option>';

  allSessions.filter(s => s.active).forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.token;
    opt.textContent = `${s.course} — ${s.sessionType} — ${formatDate(s.sessionDate)}`;
    select.appendChild(opt);
  });

  // Restore selection
  if (currentVal) select.value = currentVal;
}

function renderSessions() {
  const container = document.getElementById('history-list');

  if (allSessions.length === 0) {
    container.innerHTML = '<p class="text-center py-8 text-gray-400">No sessions created yet.</p>';
    return;
  }

  container.innerHTML = allSessions.map(s => `
    <div class="session-card" onclick="toggleSessionCard(this)" data-token="${s.token}">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="badge ${s.active ? 'badge-active' : 'badge-inactive'}">${s.active ? 'Active' : 'Inactive'}</span>
          <div>
            <span class="font-semibold text-gray-800">${s.course}</span>
            <span class="text-gray-400 mx-1">&middot;</span>
            <span class="text-gray-600">${s.sessionType}</span>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-500">${formatDate(s.sessionDate)}</div>
          <div class="text-sm font-semibold text-aut-orange">${s.attendanceCount}${s.totalStudents ? ' / ' + s.totalStudents : ''}</div>
        </div>
      </div>
      <div class="session-card-expanded">
        <div class="flex gap-2 mb-3">
          <button
            onclick="event.stopPropagation(); toggleSessionActive('${s.token}', ${!s.active})"
            class="text-xs font-medium px-3 py-1.5 rounded-lg border ${s.active ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'} transition-colors"
          >
            ${s.active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onclick="event.stopPropagation(); viewSessionAttendance('${s.token}')"
            class="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            View Attendance
          </button>
        </div>
        <div id="attendance-${s.token}" class="text-sm text-gray-500"></div>
      </div>
    </div>
  `).join('');

  // Update stats
  document.getElementById('stat-sessions').textContent = allSessions.filter(s => s.active).length;
}

function toggleSessionCard(el) {
  el.classList.toggle('open');
}

async function toggleSessionActive(token, active) {
  if (CONFIG.API_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
    const session = allSessions.find(s => s.token === token);
    if (session) session.active = active;
    renderSessions();
    populateLiveSelect();
    return;
  }

  const result = await apiPost('toggleSession', { adminKey, token, active });
  if (result.success) {
    loadSessions();
  }
}

async function viewSessionAttendance(token) {
  const container = document.getElementById('attendance-' + token);
  container.innerHTML = '<span class="text-gray-400">Loading...</span>';

  if (CONFIG.API_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
    container.innerHTML = `
      <table class="data-table mt-2">
        <thead><tr><th>#</th><th>Student ID</th><th>Name</th><th>Time</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>12345678</td><td>Jane Smith</td><td>9:15 AM</td></tr>
          <tr><td>2</td><td>87654321</td><td>John Doe</td><td>9:18 AM</td></tr>
        </tbody>
      </table>`;
    return;
  }

  const result = await apiGet('getAttendance', { token, adminKey });
  if (result.success && result.records.length > 0) {
    const rows = result.records.map((r, i) => {
      const time = new Date(r.timestamp).toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' });
      return `<tr><td>${i + 1}</td><td>${r.studentId}</td><td>${r.name}</td><td>${time}</td></tr>`;
    }).join('');

    container.innerHTML = `
      <table class="data-table mt-2">
        <thead><tr><th>#</th><th>Student ID</th><th>Name</th><th>Time</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  } else {
    container.innerHTML = '<span class="text-gray-400">No attendance records yet.</span>';
  }
}

// --------------- Live Attendance ---------------

async function refreshLiveAttendance() {
  const select = document.getElementById('live-session-select');
  const token = select.value;

  if (!token) {
    document.getElementById('live-empty').classList.remove('hidden');
    document.getElementById('live-content').classList.add('hidden');
    return;
  }

  const session = allSessions.find(s => s.token === token);

  if (CONFIG.API_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
    renderLiveAttendance(
      [
        { timestamp: new Date().toISOString(), studentId: '12345678', name: 'Jane Smith' },
        { timestamp: new Date().toISOString(), studentId: '87654321', name: 'John Doe' },
        { timestamp: new Date().toISOString(), studentId: '11223344', name: 'Sarah Johnson' },
      ],
      session ? session.totalStudents : 45
    );
    return;
  }

  const result = await apiGet('getAttendance', { token, adminKey });
  if (result.success) {
    renderLiveAttendance(result.records, session ? session.totalStudents : 0);
  }
}

function renderLiveAttendance(records, totalStudents) {
  document.getElementById('live-empty').classList.add('hidden');
  document.getElementById('live-content').classList.remove('hidden');

  const count = records.length;
  const total = totalStudents || count;
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  document.getElementById('live-count').textContent = `${count} / ${total} students`;
  document.getElementById('live-percent').textContent = `${percent}%`;
  document.getElementById('live-progress').style.width = `${Math.min(percent, 100)}%`;

  const tbody = document.getElementById('live-table-body');
  tbody.innerHTML = records.map((r, i) => {
    const time = new Date(r.timestamp).toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' });
    return `<tr class="fade-in"><td>${i + 1}</td><td>${r.studentId}</td><td>${r.name}</td><td>${time}</td></tr>`;
  }).join('');
}

// --------------- QR Code Generation ---------------

function showQrCode(token, course, sessionType, sessionDate, pin) {
  const url = `${CONFIG.APP_URL}/?s=${token}`;
  lastCreatedQrUrl = url;

  // Show PIN if set
  const pinDisplay = document.getElementById('qr-pin-display');
  if (pin) {
    document.getElementById('qr-pin-number').textContent = pin;
    pinDisplay.classList.remove('hidden');
  } else {
    pinDisplay.classList.add('hidden');
  }

  // Show the QR output section
  document.getElementById('qr-output').classList.remove('hidden');
  document.getElementById('qr-session-info').textContent = `${course} — ${sessionType} — ${formatDate(sessionDate)}`;
  document.getElementById('qr-url').textContent = url;

  // Generate QR code
  const qrContainer = document.getElementById('qr-code');
  qrContainer.innerHTML = '';

  if (typeof QRCode !== 'undefined') {
    new QRCode(qrContainer, {
      text: url,
      width: 200,
      height: 200,
      colorDark: '#00263A',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    qrContainer.innerHTML = `<p class="text-gray-500 text-sm">QR library not loaded. Use this URL:<br><strong>${url}</strong></p>`;
  }

  // Scroll to QR code
  document.getElementById('qr-output').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function copyQrUrl() {
  if (!lastCreatedQrUrl) return;

  navigator.clipboard.writeText(lastCreatedQrUrl).then(() => {
    const btn = document.getElementById('copy-url-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy Link'; }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = lastCreatedQrUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    const btn = document.getElementById('copy-url-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy Link'; }, 2000);
  });
}

// --------------- Student Management ---------------

function setupStudentUpload() {
  const input = document.getElementById('csv-file-input');
  const zone = document.getElementById('upload-zone');

  input.addEventListener('change', (e) => {
    if (e.target.files[0]) parseCSVFile(e.target.files[0]);
  });

  // Drag and drop
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('border-aut-orange');
  });
  zone.addEventListener('dragleave', () => {
    zone.classList.remove('border-aut-orange');
  });
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('border-aut-orange');
    const file = e.dataTransfer.files[0];
    if (file) parseCSVFile(file);
  });
}

function parseCSVFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const rows = text.split('\n').map(r => r.split(',').map(c => c.trim().replace(/^"|"$/g, '')));

    // Detect and skip header row
    let startRow = 0;
    if (rows[0] && (
      rows[0][0].toLowerCase().includes('student') ||
      rows[0][0].toLowerCase().includes('id') ||
      isNaN(rows[0][0])
    )) {
      startRow = 1;
    }

    parsedCsvStudents = [];
    for (let i = startRow; i < rows.length; i++) {
      const id = rows[i][0] ? rows[i][0].trim() : '';
      const name = rows[i][1] ? rows[i][1].trim() : '';
      if (id && name) {
        parsedCsvStudents.push({ id, name });
      }
    }

    if (parsedCsvStudents.length === 0) {
      showUploadResult('error', 'No valid rows found. Make sure the file has StudentID in column A and Name in column B.');
      return;
    }

    showUploadPreview(parsedCsvStudents, file.name);
  };
  reader.readAsText(file);
}

function showUploadPreview(students, filename) {
  document.getElementById('upload-preview').classList.remove('hidden');
  document.getElementById('upload-result').classList.add('hidden');

  const summary = document.getElementById('preview-summary');
  summary.textContent = `Found ${students.length} students in "${filename}"`;

  const tbody = document.getElementById('preview-table-body');
  // Show first 10 rows + summary if more
  const previewRows = students.slice(0, 10);
  tbody.innerHTML = previewRows.map(s =>
    `<tr><td>${s.id}</td><td>${s.name}</td></tr>`
  ).join('');

  if (students.length > 10) {
    tbody.innerHTML += `<tr><td colspan="2" class="text-center text-gray-400 text-xs py-2">... and ${students.length - 10} more</td></tr>`;
  }
}

function clearUpload() {
  parsedCsvStudents = [];
  document.getElementById('upload-preview').classList.add('hidden');
  document.getElementById('upload-result').classList.add('hidden');
  document.getElementById('csv-file-input').value = '';
}

async function confirmUpload() {
  const course = document.getElementById('students-course').value;
  if (!course) {
    alert('Please select a course before uploading.');
    return;
  }
  if (parsedCsvStudents.length === 0) {
    alert('No student data to upload.');
    return;
  }

  const mode = document.querySelector('input[name="upload-mode"]:checked').value;
  const btn = document.getElementById('upload-confirm-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-sm inline-block mr-2"></span>Uploading...';

  // Demo mode
  if (CONFIG.API_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
    await new Promise(r => setTimeout(r, 1000));
    showUploadResult('success', `Demo: ${parsedCsvStudents.length} students would be ${mode === 'replace' ? 'loaded (replacing old list)' : 'added to existing list'} for ${course}.`);
    clearUpload();
    viewStudents(course);
    btn.disabled = false;
    btn.textContent = 'Upload & Save to Google Sheets';
    return;
  }

  const result = await apiPost('uploadStudents', {
    adminKey,
    course,
    students: parsedCsvStudents,
    mode
  });

  btn.disabled = false;
  btn.textContent = 'Upload & Save to Google Sheets';

  if (result.success) {
    showUploadResult('success', result.message);
    clearUpload();
    viewStudents(course); // Refresh the list view
  } else {
    showUploadResult('error', result.message || 'Upload failed. Please try again.');
  }
}

function showUploadResult(type, message) {
  const el = document.getElementById('upload-result');
  el.classList.remove('hidden');
  if (type === 'success') {
    el.innerHTML = `<div class="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">✓ ${message}</div>`;
  } else {
    el.innerHTML = `<div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">${message}</div>`;
  }
}

async function loadStudentList() {
  viewStudents(currentViewCourse);
}

async function viewStudents(course) {
  currentViewCourse = course;

  // Update button styles
  document.getElementById('view-701-btn').className =
    'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ' +
    (course === 'NURS701' ? 'border-aut-orange bg-aut-orange text-white' : 'border-gray-200 text-gray-600 hover:border-aut-orange');
  document.getElementById('view-703-btn').className =
    'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ' +
    (course === 'NURS703' ? 'border-aut-orange bg-aut-orange text-white' : 'border-gray-200 text-gray-600 hover:border-aut-orange');

  const container = document.getElementById('student-list-content');
  container.innerHTML = '<p class="text-center py-6 text-gray-400">Loading...</p>';

  // Demo mode
  if (CONFIG.API_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
    const demoStudents = course === 'NURS701'
      ? [{ id: '12345678', name: 'Jane Smith' }, { id: '87654321', name: 'John Doe' }, { id: '11223344', name: 'Sarah Johnson' }]
      : [{ id: '55667788', name: 'Mark Williams' }, { id: '99001122', name: 'Emma Brown' }];
    renderStudentList(course, demoStudents);
    return;
  }

  const result = await apiGet('getStudents', { adminKey, course });
  if (result.success) {
    renderStudentList(course, result.students);
  } else {
    container.innerHTML = `<p class="text-center py-6 text-red-400">${result.message || 'Failed to load student list.'}</p>`;
  }
}

function renderStudentList(course, students) {
  const container = document.getElementById('student-list-content');

  if (students.length === 0) {
    container.innerHTML = `<p class="text-center py-6 text-gray-400">No students in ${course} yet. Upload a CSV to get started.</p>`;
    return;
  }

  const csvData = 'StudentID,Name\n' + students.map(s => `${s.id},${s.name}`).join('\n');
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  container.innerHTML = `
    <div class="flex items-center justify-between mb-3">
      <p class="text-sm text-gray-500">${students.length} students enrolled in ${course}</p>
      <a href="${url}" download="${course}_students.csv"
        class="text-xs text-aut-orange hover:text-aut-orange-hover font-medium flex items-center gap-1">
        ↓ Download CSV
      </a>
    </div>
    <div class="overflow-x-auto max-h-80 overflow-y-auto">
      <table class="data-table">
        <thead><tr><th>#</th><th>Student ID</th><th>Name</th></tr></thead>
        <tbody>
          ${students.map((s, i) => `<tr><td>${i + 1}</td><td>${s.id}</td><td>${s.name}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// --------------- Utilities ---------------

function formatDate(dateStr) {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-NZ', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}
