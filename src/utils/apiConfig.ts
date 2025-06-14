
// API configuration for backend integration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  ANALYZE_HEADERS: '/api/analyze-headers',
  VALIDATE_SPF: '/api/validate-spf',
  VALIDATE_DKIM: '/api/validate-dkim',
  VALIDATE_DMARC: '/api/validate-dmarc',
  TEST_SMTP: '/api/test-smtp',
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
