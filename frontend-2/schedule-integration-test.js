/**
 * Schedule Integration Test Script
 * 
 * Run this in your browser console on http://localhost:5173/schedule
 * to verify the backend-frontend connection.
 * 
 * Prerequisites:
 * 1. Backend running on http://localhost:8080
 * 2. User logged in (JWT token present)
 * 3. On the Schedule page
 */

// ========================================
// 1. Check Authentication
// ========================================
console.log('=== 1. Checking Authentication ===');
const token = localStorage.getItem('lexigrain:authToken');
if (!token) {
  console.error('❌ No auth token found. Please log in first.');
} else {
  console.log('✅ Auth token present:', token.substring(0, 50) + '...');
}

// ========================================
// 2. Check Lessons Cache
// ========================================
console.log('\n=== 2. Checking Lessons Cache ===');
const lessonsCache = localStorage.getItem('lexigrain:lessons:cache');
if (lessonsCache) {
  const lessons = JSON.parse(lessonsCache);
  console.log(`✅ ${lessons.length} lessons cached:`, lessons.map(l => l.title));
} else {
  console.warn('⚠️  No lessons cache found. Will fetch from backend.');
}

// ========================================
// 3. Check Schedule Data
// ========================================
console.log('\n=== 3. Checking Schedule Data ===');
const scheduleData = localStorage.getItem('lexigrain:schedule:v1');
if (scheduleData) {
  const schedule = JSON.parse(scheduleData);
  const weekIds = Object.keys(schedule);
  console.log(`✅ ${weekIds.length} weeks in localStorage:`, weekIds);
  weekIds.forEach(weekId => {
    const week = schedule[weekId];
    console.log(`  - ${weekId}: ${week.sessions.length} sessions (source: ${week.source})`);
  });
} else {
  console.warn('⚠️  No schedule data found.');
}

// ========================================
// 4. Test Backend Connection
// ========================================
console.log('\n=== 4. Testing Backend Connection ===');

async function testBackendConnection() {
  const currentWeekId = (() => {
    const target = new Date();
    target.setUTCDate(target.getUTCDate() + 4 - (target.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${target.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  })();

  try {
    // Test GET week
    const response = await fetch(`http://localhost:8080/api/schedule/weeks/${currentWeekId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ GET /api/schedule/weeks/' + currentWeekId + ' succeeded');
      console.log('   Response:', data);
      return true;
    } else {
      const text = await response.text();
      console.error('❌ GET /api/schedule/weeks/' + currentWeekId + ' failed');
      console.error('   Status:', response.status);
      console.error('   Response:', text);
      return false;
    }
  } catch (err) {
    console.error('❌ Backend connection failed:', err.message);
    console.error('   Is backend running on http://localhost:8080?');
    return false;
  }
}

// Run backend test
testBackendConnection().then(success => {
  if (success) {
    console.log('\n✅ All checks passed! Backend integration is working.');
    console.log('\n💡 Next steps:');
    console.log('   1. Try adding a session using the UI');
    console.log('   2. Check browser Network tab for API calls');
    console.log('   3. Verify backend logs show the operations');
  } else {
    console.log('\n❌ Backend connection failed. Check:');
    console.log('   1. Is Spring Boot backend running?');
    console.log('   2. Is it on http://localhost:8080?');
    console.log('   3. Is JWT token valid (try logging in again)?');
  }
});

// ========================================
// 5. Helper Functions for Manual Testing
// ========================================
console.log('\n=== 5. Helper Functions Available ===');
console.log('Use these in console for manual testing:');
console.log('  - testAddSession()    // Test adding a session');
console.log('  - testUpdateSession() // Test updating a session');
console.log('  - testDeleteSession() // Test deleting a session');

window.testAddSession = async function() {
  const weekId = '2025-W45'; // Adjust as needed
  const payload = {
    lessonId: 'lesson-1',
    date: '2025-11-11',
    plannedMinutes: 60,
    status: 'planned'
  };

  try {
    const response = await fetch(`http://localhost:8080/api/schedule/weeks/${weekId}/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Session created:', data);
      return data;
    } else {
      const text = await response.text();
      console.error('❌ Failed to create session:', response.status, text);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
};

window.testUpdateSession = async function(sessionId = '1') {
  const weekId = '2025-W45';
  const payload = { status: 'done' };

  try {
    const response = await fetch(`http://localhost:8080/api/schedule/weeks/${weekId}/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Session updated:', data);
      return data;
    } else {
      const text = await response.text();
      console.error('❌ Failed to update session:', response.status, text);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
};

window.testDeleteSession = async function(sessionId = '1') {
  const weekId = '2025-W45';

  try {
    const response = await fetch(`http://localhost:8080/api/schedule/weeks/${weekId}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok || response.status === 204) {
      console.log('✅ Session deleted');
      return true;
    } else {
      const text = await response.text();
      console.error('❌ Failed to delete session:', response.status, text);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
};

console.log('✅ Test script loaded. Functions ready to use.');
