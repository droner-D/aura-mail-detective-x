

// API configuration for backend integration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  ANALYZE_HEADERS: '/api/analyze-headers',
  VALIDATE_SPF: '/api/validate-spf',
  VALIDATE_DKIM: '/api/validate-dkim',
  VALIDATE_DMARC: '/api/validate-dmarc',
  TEST_SMTP: '/api/test-smtp',
  MX_LOOKUP: '/api/mx-lookup',
  SMTP_SERVER_TEST: '/api/smtp-server-test',
};

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

export const apiRequest = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

