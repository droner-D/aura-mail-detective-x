// TypeScript interfaces for API responses

export interface EmailSummary {
  from: string;
  to: string;
  subject: string;
  date: string;
  messageId: string;
  returnPath: string;
}

export interface AuthenticationResult {
  spf: {
    status: string;
    details: string;
  };
  dkim: {
    status: string;
    selector: string;
    domain: string;
  };
  dmarc: {
    status: string;
    policy: string;
    alignment: string;
  };
}

export interface RoutingHop {
  server: string;
  ip: string;
  timestamp: string;
  delay: string;
}

export interface SecurityAnalysis {
  tls: boolean;
  encryption: string;
  spam_score: number;
  virus_scan: string;
  phishing_check: string;
}

export interface EmailHeaderAnalysisResult {
  summary: EmailSummary;
  routing: RoutingHop[];
  authentication: AuthenticationResult;
  security: SecurityAnalysis;
  metadata: Record<string, any>;
}

export interface SPFValidationResult {
  domain: string;
  record: string;
  valid: boolean;
  mechanisms: Array<{
    type: string;
    value: string;
    description: string;
    status: string;
  }>;
  lookups: {
    total: number;
    limit: number;
    warning: boolean;
  };
  policy: {
    qualifier: string;
    action: string;
    description: string;
  };
  security_score: number;
}

export interface DKIMValidationResult {
  domain: string;
  selector: string;
  record_found: boolean;
  dkim_record: string;
  public_key: {
    algorithm: string;
    key_type: string;
    key_size: number;
    valid: boolean;
    expires: string | null;
  };
  signature_analysis: {
    canonicalization: string;
    hash_algorithm: string;
    signature_valid: boolean;
    body_hash_valid: boolean;
    header_hash_valid: boolean;
  };
  validation_tests: Array<{
    test: string;
    status: string;
    details: string;
  }>;
  security_score: number;
}

export interface SMTPTestResult {
  success: boolean;
  message: string;
  connection_details: {
    server: string;
    port: number;
    tls_used: boolean;
    auth_method: string;
  };
  emails_sent: number;
  errors: string[];
}

export interface MXRecord {
  host: string;
  priority: number;
  ip_addresses: string[];
}

export interface MXLookupResult {
  domain: string;
  mx_records: MXRecord[];
  has_mx: boolean;
  total_records: number;
  lowest_priority: number;
  security_score: number;
  recommendations: string[];
}

export interface SMTPServerTestResult {
  server: string;
  port: number;
  connection_successful: boolean;
  starttls_supported: boolean;
  starttls_required: boolean;
  auth_methods: string[];
  server_banner: string;
  ehlo_response: string[];
  response_time: number;
  security_analysis: {
    tls_version: string;
    cipher_suite: string;
    certificate_valid: boolean;
    certificate_issuer: string;
    certificate_expires: string;
  };
  error_message?: string;
}
