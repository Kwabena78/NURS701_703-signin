// ============================================================
// Student Sign-In Page Logic
// ============================================================

let currentSession = null;

// --------------- Initialization ---------------

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('s');

  if (!token) {
    showError('No session token found. Please scan the QR code provided by your instructor.');
    return;
  }

  initSession(token);
});

async function initSession(token) {
  showState('loading');

  // For demo/preview mode when API isn't configured yet
  if (CONFIG.API_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
    currentSession = {
      token: token || 'demo123',
      course: 'NURS701',
      sessionType: 'SIM Lab',
      sessionDate: new Date().toISOString().split('T')[0]
    };
    renderSessionBanner();
    showState('signin');
    return;
  }

  const result = await apiGet('validateSession', { token });

  if (result.error) {
    showError(result.error);
    return;
  }

  if (!result.valid) {
    showError(result.message || 'This session link is no longer active.');
    return;
  }

  currentSession = {
    token: token,
    course: result.course,
    sessionType: result.sessionType,
    sessionDate: result.sessionDate
  };

  renderSessionBanner();
  showState('signin');
}

// --------------- UI Rendering ---------------

function renderSessionBanner() {
  document.getElementById('banner-course').textContent = currentSession.course;
  document.getElementById('banner-type').textContent = currentSession.sessionType;

  const dateStr = formatDate(currentSession.sessionDate);
  document.getElementById('banner-date').textContent = dateStr;
}

function formatDate(dateStr) {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-NZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

function showState(state) {
  const states = ['loading', 'error', 'signin', 'success', 'already', 'notfound'];
  states.forEach(s => {
    const el = document.getElementById(s + '-state');
    if (el) {
      el.classList.toggle('hidden', s !== state);
    }
  });
}

function showError(message) {
  document.getElementById('error-message').textContent = message;
  showState('error');
}

// --------------- Form Handling ---------------

document.getElementById('signin-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const input = document.getElementById('student-id');
  const studentId = input.value.trim();
  const inputError = document.getElementById('input-error');
  const submitBtn = document.getElementById('submit-btn');

  // Clear previous errors
  inputError.classList.add('hidden');
  input.classList.remove('border-red-400', 'shake');

  // Validate input
  if (!studentId) {
    showInputError('Please enter your student ID.');
    return;
  }

  if (!/^\d{4,12}$/.test(studentId)) {
    showInputError('Student ID should be 4-12 digits.');
    return;
  }

  // Disable form during submission
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-sm inline-block mr-2"></span>Signing in...';

  // Demo mode
  if (CONFIG.API_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
    await new Promise(r => setTimeout(r, 1000));
    document.getElementById('success-message').textContent =
      'Welcome, Demo Student! You are signed in for ' + currentSession.sessionType + '.';
    document.getElementById('success-time').textContent =
      'Signed in at ' + new Date().toLocaleTimeString('en-NZ');
    showState('success');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Sign In';
    return;
  }

  const result = await apiPost('recordAttendance', {
    token: currentSession.token,
    studentId: studentId
  });

  // Re-enable form
  submitBtn.disabled = false;
  submitBtn.innerHTML = 'Sign In';

  if (result.error) {
    showInputError(result.error);
    return;
  }

  if (!result.success) {
    // Student not found
    document.getElementById('notfound-message').textContent =
      result.message || 'Student ID not found. Please check and try again.';
    showState('notfound');
    return;
  }

  if (result.alreadySignedIn) {
    document.getElementById('already-message').textContent = result.message;
    showState('already');
    return;
  }

  // Success
  document.getElementById('success-message').textContent = result.message;
  document.getElementById('success-time').textContent =
    'Signed in at ' + new Date().toLocaleTimeString('en-NZ');
  showState('success');
});

function showInputError(message) {
  const input = document.getElementById('student-id');
  const inputError = document.getElementById('input-error');

  inputError.textContent = message;
  inputError.classList.remove('hidden');
  input.classList.add('border-red-400');

  // Shake animation
  input.classList.add('shake');
  setTimeout(() => input.classList.remove('shake'), 500);

  input.focus();
}

// --------------- Reset ---------------

function resetForm() {
  document.getElementById('student-id').value = '';
  document.getElementById('input-error').classList.add('hidden');
  document.getElementById('student-id').classList.remove('border-red-400');
  showState('signin');
  document.getElementById('student-id').focus();
}
