// ============================================================
// SIM Lab Sign-In — Google Apps Script Backend
// ============================================================
// Deploy as: Web App → Execute as Me → Anyone can access
// Set Script Property: ADMIN_PASSWORD = your chosen password
// ============================================================

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// --------------- Routing ---------------

function doGet(e) {
  const action = e.parameter.action;
  let result;

  switch (action) {
    case 'validateSession':
      result = validateSession(e.parameter.token);
      break;
    case 'validateStudent':
      result = validateStudent(e.parameter.studentId, e.parameter.course);
      break;
    case 'getAttendance':
      result = withAdmin(e.parameter.adminKey, () => getAttendance(e.parameter.token));
      break;
    case 'getSessions':
      result = withAdmin(e.parameter.adminKey, () => getSessions());
      break;
    case 'getStats':
      result = withAdmin(e.parameter.adminKey, () => getStats());
      break;
    case 'getStudents':
      result = withAdmin(e.parameter.adminKey, () => getStudents(e.parameter.course));
      break;
    default:
      result = { error: 'Unknown action' };
  }

  return jsonResponse(result);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  let result;

  switch (action) {
    case 'recordAttendance':
      result = recordAttendance(data.token, data.studentId);
      break;
    case 'createSession':
      result = withAdmin(data.adminKey, () => createSession(data.course, data.sessionType, data.sessionDate));
      break;
    case 'toggleSession':
      result = withAdmin(data.adminKey, () => toggleSession(data.token, data.active));
      break;
    case 'uploadStudents':
      result = withAdmin(data.adminKey, () => uploadStudents(data.course, data.students, data.mode));
      break;
    case 'adminLogin':
      result = adminLogin(data.password);
      break;
    default:
      result = { error: 'Unknown action' };
  }

  return jsonResponse(result);
}

// --------------- Helpers ---------------

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function generateToken() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// --------------- Admin Auth ---------------

function adminLogin(password) {
  const stored = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  if (password !== stored) {
    return { success: false, message: 'Incorrect password' };
  }

  const adminKey = generateToken() + generateToken(); // 16 chars
  const props = PropertiesService.getScriptProperties();
  props.setProperty('ADMIN_KEY_' + adminKey, new Date().toISOString());

  return { success: true, adminKey: adminKey };
}

function isValidAdmin(adminKey) {
  if (!adminKey) return false;
  const props = PropertiesService.getScriptProperties();
  const created = props.getProperty('ADMIN_KEY_' + adminKey);
  if (!created) return false;

  // Expire after 24 hours
  const createdDate = new Date(created);
  const now = new Date();
  if (now - createdDate > 24 * 60 * 60 * 1000) {
    props.deleteProperty('ADMIN_KEY_' + adminKey);
    return false;
  }
  return true;
}

function withAdmin(adminKey, fn) {
  if (!isValidAdmin(adminKey)) {
    return { error: 'Unauthorized', success: false };
  }
  return fn();
}

// --------------- Session Management ---------------

function validateSession(token) {
  if (!token) return { valid: false, message: 'No session token provided' };

  const sheet = getSheet('Sessions');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === token) {
      if (data[i][4] === true || data[i][4] === 'TRUE') {
        return {
          valid: true,
          course: data[i][1],
          sessionType: data[i][2],
          sessionDate: data[i][3]
        };
      } else {
        return { valid: false, message: 'This session is no longer active' };
      }
    }
  }

  return { valid: false, message: 'Invalid session link' };
}

function createSession(course, sessionType, sessionDate) {
  const sheet = getSheet('Sessions');
  const token = generateToken();

  sheet.appendRow([token, course, sessionType, sessionDate, true, 'admin']);

  return { success: true, token: token };
}

function toggleSession(token, active) {
  const sheet = getSheet('Sessions');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === token) {
      sheet.getRange(i + 1, 5).setValue(active);
      return { success: true };
    }
  }

  return { success: false, message: 'Session not found' };
}

function getSessions() {
  const sessionsSheet = getSheet('Sessions');
  const sessionsData = sessionsSheet.getDataRange().getValues();

  const attendanceSheet = getSheet('AttendanceLog');
  const attendanceData = attendanceSheet.getDataRange().getValues();

  // Count attendance per session token
  const counts = {};
  for (let i = 1; i < attendanceData.length; i++) {
    const tk = attendanceData[i][6]; // SessionToken column
    counts[tk] = (counts[tk] || 0) + 1;
  }

  // Count total students per course
  const studentCounts = {};
  ['NURS701', 'NURS703'].forEach(course => {
    const studentSheet = getSheet(course + '_Students');
    if (studentSheet) {
      studentCounts[course] = Math.max(0, studentSheet.getLastRow() - 1); // minus header
    }
  });

  const sessions = [];
  for (let i = 1; i < sessionsData.length; i++) {
    const course = sessionsData[i][1];
    sessions.push({
      token: sessionsData[i][0],
      course: course,
      sessionType: sessionsData[i][2],
      sessionDate: sessionsData[i][3],
      active: sessionsData[i][4] === true || sessionsData[i][4] === 'TRUE',
      attendanceCount: counts[sessionsData[i][0]] || 0,
      totalStudents: studentCounts[course] || 0
    });
  }

  return { success: true, sessions: sessions.reverse() }; // newest first
}

// --------------- Student Validation ---------------

function validateStudent(studentId, course) {
  if (!studentId || !course) return { found: false };

  const sheetName = course + '_Students';
  const sheet = getSheet(sheetName);
  if (!sheet) return { found: false, message: 'Course not found' };

  const data = sheet.getDataRange().getValues();
  const searchId = String(studentId).trim();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === searchId) {
      return { found: true, name: data[i][1] };
    }
  }

  return { found: false };
}

// --------------- Attendance ---------------

function recordAttendance(token, studentId) {
  // Validate the session first
  const session = validateSession(token);
  if (!session.valid) {
    return { success: false, message: session.message || 'Invalid session' };
  }

  // Validate the student
  const student = validateStudent(studentId, session.course);
  if (!student.found) {
    return {
      success: false,
      message: 'Student ID not found in the ' + session.course + ' class list. Please check your ID and try again.'
    };
  }

  // Check for duplicate sign-in
  const attendanceSheet = getSheet('AttendanceLog');
  const attendanceData = attendanceSheet.getDataRange().getValues();
  const searchId = String(studentId).trim();

  for (let i = 1; i < attendanceData.length; i++) {
    if (String(attendanceData[i][1]).trim() === searchId && attendanceData[i][6] === token) {
      return {
        success: true,
        alreadySignedIn: true,
        name: student.name,
        message: "You've already signed in for this session, " + student.name + "."
      };
    }
  }

  // Record attendance
  const timestamp = new Date();
  attendanceSheet.appendRow([
    timestamp,
    studentId,
    student.name,
    session.course,
    session.sessionType,
    session.sessionDate,
    token
  ]);

  return {
    success: true,
    alreadySignedIn: false,
    name: student.name,
    message: 'Welcome, ' + student.name + '! You are signed in for ' + session.sessionType + '.'
  };
}

function getAttendance(token) {
  const attendanceSheet = getSheet('AttendanceLog');
  const data = attendanceSheet.getDataRange().getValues();

  const records = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][6] === token) {
      records.push({
        timestamp: data[i][0],
        studentId: String(data[i][1]),
        name: data[i][2]
      });
    }
  }

  return { success: true, records: records };
}

function getStats() {
  const attendanceSheet = getSheet('AttendanceLog');
  const data = attendanceSheet.getDataRange().getValues();

  const today = new Date();
  const todayStr = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');

  let totalToday = 0;
  const byCourse = {};
  const bySessionType = {};

  for (let i = 1; i < data.length; i++) {
    const ts = data[i][0];
    if (ts instanceof Date) {
      const rowDate = Utilities.formatDate(ts, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      if (rowDate === todayStr) {
        totalToday++;
        const course = data[i][3];
        const sessionType = data[i][4];
        byCourse[course] = (byCourse[course] || 0) + 1;
        bySessionType[sessionType] = (bySessionType[sessionType] || 0) + 1;
      }
    }
  }

  return {
    success: true,
    totalToday: totalToday,
    byCourse: byCourse,
    bySessionType: bySessionType
  };
}

// --------------- Student Management ---------------

function getStudents(course) {
  if (!course) return { success: false, message: 'Course required' };

  const sheetName = course + '_Students';
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: false, message: 'Course sheet not found' };

  const data = sheet.getDataRange().getValues();
  const students = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      students.push({ id: String(data[i][0]).trim(), name: data[i][1] });
    }
  }

  return { success: true, course: course, count: students.length, students: students };
}

function uploadStudents(course, students, mode) {
  if (!course || !students || !Array.isArray(students)) {
    return { success: false, message: 'Invalid data' };
  }

  const sheetName = course + '_Students';
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: false, message: 'Course sheet not found' };

  if (mode === 'replace') {
    // Clear all data except header
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 2).clearContent();
    }
  }

  // Determine starting row
  const startRow = mode === 'replace' ? 2 : sheet.getLastRow() + 1;

  if (students.length > 0) {
    const rows = students.map(s => [String(s.id).trim(), s.name]);
    sheet.getRange(startRow, 1, rows.length, 2).setValues(rows);
  }

  const totalCount = Math.max(0, sheet.getLastRow() - 1);
  return {
    success: true,
    message: mode === 'replace'
      ? students.length + ' students loaded (previous list replaced)'
      : students.length + ' students added (total: ' + totalCount + ')',
    count: totalCount
  };
}

// --------------- Setup Helper ---------------
// Run this once to create the sheet structure

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheets = {
    'NURS701_Students': ['StudentID', 'Name'],
    'NURS703_Students': ['StudentID', 'Name'],
    'Sessions': ['SessionToken', 'Course', 'SessionType', 'SessionDate', 'Active', 'CreatedBy'],
    'AttendanceLog': ['Timestamp', 'StudentID', 'Name', 'Course', 'SessionType', 'SessionDate', 'SessionToken']
  };

  for (const [name, headers] of Object.entries(sheets)) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}
