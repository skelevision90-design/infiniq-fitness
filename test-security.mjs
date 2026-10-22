// Automated Security and Route Handler Test Suite for INFINIQ Fitness Club

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('=== STARTING SECURITY & ENDPOINT VERIFICATION ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`PASS: ${testName}`);
      passed++;
    } else {
      console.error(`FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  // Helper to make test requests with dedicated IP addresses
  const postTest = async (ip, payload, customHeaders = {}) => {
    return fetch(`${BASE_URL}/api/pre-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
        'X-Forwarded-For': ip,
        ...customHeaders,
      },
      body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    });
  };

  // 1. Method Not Allowed Test (GET on POST-only route)
  try {
    const res = await fetch(`${BASE_URL}/api/pre-register`, { method: 'GET' });
    assert(
      res.status === 405,
      'Reject GET with 405 Method Not Allowed',
      `Got status ${res.status}`
    );
    assert(
      res.headers.get('allow')?.includes('POST'),
      'Includes Allow: POST header on 405',
      `Got allow: ${res.headers.get('allow')}`
    );
  } catch (err) {
    assert(false, 'Reject GET with 405', err.message);
  }

  // 2. Wrong Origin Test (Cross-site POST prevention)
  try {
    const payload = {
      name: 'Kabir Singh',
      phone: '9815320963',
      goal: 'Build strength',
      website: '',
      _ts: Date.now() - 5000,
      turnstileToken: '1x00000000000000000000AA',
    };

    const res = await postTest('198.51.100.10', payload, {
      'Origin': 'https://malicious-attacker-site.com',
    });
    assert(
      res.status === 403,
      'Reject unauthorized Origin with 403 Forbidden',
      `Got status ${res.status}`
    );
  } catch (err) {
    assert(false, 'Reject unauthorized Origin', err.message);
  }

  // 3. Oversized Payload (> 2KB)
  try {
    const largeString = 'A'.repeat(2500);
    const payload = JSON.stringify({
      name: 'Kabir Singh',
      phone: '9815320963',
      goal: 'Build strength',
      website: '',
      _ts: Date.now() - 5000,
      turnstileToken: '1x00000000000000000000AA',
      notes: largeString,
    });

    const res = await postTest('198.51.100.20', payload, {
      'Content-Length': String(Buffer.byteLength(payload)),
    });
    assert(
      res.status === 413,
      'Reject oversized payload (> 2KB) with 413 Payload Too Large',
      `Got status ${res.status}`
    );
  } catch (err) {
    assert(false, 'Reject oversized payload', err.message);
  }

  // 4. Invalid Input: Honeypot filled (Bot detection)
  try {
    const payload = {
      name: 'Bot Spammer',
      phone: '9815320963',
      goal: 'Build strength',
      website: 'https://spamlink.com', // Filled honeypot!
      _ts: Date.now() - 5000,
      turnstileToken: '1x00000000000000000000AA',
    };

    const res = await postTest('198.51.100.30', payload);
    const body = await res.json();
    assert(
      res.status === 400 && body.error?.includes('Spam detected'),
      'Reject filled honeypot with 400',
      `Got status ${res.status}, error: ${body.error}`
    );
  } catch (err) {
    assert(false, 'Reject filled honeypot', err.message);
  }

  // 5. Invalid Input: Submission under 3 seconds (Too fast)
  try {
    const payload = {
      name: 'Flash User',
      phone: '9815320963',
      goal: 'Build strength',
      website: '',
      _ts: Date.now() - 1000, // Only 1 second ago!
      turnstileToken: '1x00000000000000000000AA',
    };

    const res = await postTest('198.51.100.40', payload);
    const body = await res.json();
    assert(
      res.status === 400 && body.error?.includes('quickly'),
      'Reject submission under 3 seconds with 400',
      `Got status ${res.status}, error: ${body.error}`
    );
  } catch (err) {
    assert(false, 'Reject submission under 3 seconds', err.message);
  }

  // 6. Invalid Input: Bad Phone Number (non-Indian or invalid prefix)
  try {
    const payload = {
      name: 'Kabir Singh',
      phone: '1234567890', // Invalid Indian phone (doesn't start with 6-9)
      goal: 'Build strength',
      website: '',
      _ts: Date.now() - 5000,
      turnstileToken: '1x00000000000000000000AA',
    };

    const res = await postTest('198.51.100.50', payload);
    const body = await res.json();
    assert(
      res.status === 400 && body.error?.includes('phone number'),
      'Reject invalid phone number with 400',
      `Got status ${res.status}, error: ${body.error}`
    );
  } catch (err) {
    assert(false, 'Reject invalid phone number', err.message);
  }

  // 7. Invalid Input: Unknown field (Zod .strict() rejection)
  try {
    const payload = {
      name: 'Kabir Singh',
      phone: '9815320963',
      goal: 'Build strength',
      website: '',
      _ts: Date.now() - 5000,
      turnstileToken: '1x00000000000000000000AA',
      adminAccess: true, // Unknown field!
    };

    const res = await postTest('198.51.100.60', payload);
    assert(
      res.status === 400,
      'Reject unexpected extra fields (.strict) with 400',
      `Got status ${res.status}`
    );
  } catch (err) {
    assert(false, 'Reject unexpected extra fields', err.message);
  }

  // 8. Valid Submission
  try {
    const payload = {
      name: 'Kabir Singh',
      phone: '+91 98153 20963', // Valid +91 prefix with spaces, will be normalized
      goal: 'Build strength',
      website: '',
      _ts: Date.now() - 6000,
      turnstileToken: '1x00000000000000000000AA',
    };

    const res = await postTest('198.51.100.70', payload);
    const body = await res.json();
    assert(
      res.status === 200 && body.success === true,
      'Accept valid submission with normalized phone',
      `Got status ${res.status}, response: ${JSON.stringify(body)}`
    );
    assert(
      body.lead?.phone === '9815320963',
      'Normalized phone number to 10 digits',
      `Got normalized phone: ${body.lead?.phone}`
    );
  } catch (err) {
    assert(false, 'Accept valid submission', err.message);
  }

  // 9. Rate Limiter Test (Rapid repeated submissions: limit is 5 per 10 mins)
  try {
    console.log('\nTesting rate limiter with 6 rapid requests from IP 198.51.100.99...');
    let rateLimited = false;
    let rateStatus = 0;

    for (let i = 0; i < 6; i++) {
      const payload = {
        name: `Test Member ${i}`,
        phone: '9815320963',
        goal: 'Pilates and mobility',
        website: '',
        _ts: Date.now() - 5000,
        turnstileToken: '1x00000000000000000000AA',
      };

      const res = await postTest('198.51.100.99', payload);
      if (res.status === 429) {
        rateLimited = true;
        rateStatus = res.status;
        break;
      }
    }

    assert(
      rateLimited && rateStatus === 429,
      'Rate limiter triggered 429 Too Many Requests after 5 requests',
      `Rate limited: ${rateLimited}, status: ${rateStatus}`
    );
  } catch (err) {
    assert(false, 'Rate limiter test', err.message);
  }

  // 10. Security Headers Verification
  try {
    const res = await fetch(`${BASE_URL}/`);
    const headers = res.headers;

    assert(
      headers.get('strict-transport-security')?.includes('max-age=63072000'),
      'Strict-Transport-Security header present and correct',
      `HSTS: ${headers.get('strict-transport-security')}`
    );
    assert(
      headers.get('x-content-type-options') === 'nosniff',
      'X-Content-Type-Options: nosniff present',
      `Got: ${headers.get('x-content-type-options')}`
    );
    assert(
      headers.get('x-frame-options') === 'DENY',
      'X-Frame-Options: DENY present',
      `Got: ${headers.get('x-frame-options')}`
    );
    assert(
      headers.get('referrer-policy')?.includes('strict-origin'),
      'Referrer-Policy present and secure',
      `Got: ${headers.get('referrer-policy')}`
    );
    assert(
      !headers.get('x-powered-by'),
      'X-Powered-By header is removed/disabled',
      `Got: ${headers.get('x-powered-by')}`
    );
  } catch (err) {
    assert(false, 'Security headers verification', err.message);
  }

  console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
