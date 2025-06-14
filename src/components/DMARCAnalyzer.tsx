
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Shield, AlertTriangle, CheckCircle, XCircle, BarChart3, Mail, Globe } from 'lucide-react';

const DMARCAnalyzer = () => {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeDMARC = async () => {
    if (!domain.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call - replace with actual backend call
    setTimeout(() => {
      const mockResults = {
        domain: domain,
        record_found: true,
        dmarc_record: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com; ruf=mailto:dmarc-forensic@example.com; fo=1; adkim=r; aspf=r; pct=100; ri=86400',
        policy: {
          version: 'DMARC1',
          policy: 'quarantine',
          subdomain_policy: 'none',
          percentage: 100,
          alignment: {
            dkim: 'relaxed',
            spf: 'relaxed'
          },
          reporting: {
            aggregate_uri: ['mailto:dmarc@example.com'],
            forensic_uri: ['mailto:dmarc-forensic@example.com'],
            interval: 86400,
            failure_options: ['1']
          }
        },
        compliance_analysis: {
          overall_score: 78,
          spf_alignment: 'pass',
          dkim_alignment: 'pass',
          policy_strength: 'moderate',
          reporting_configured: true,
          subdomain_protection: 'partial'
        },
        policy_effectiveness: {
          protection_level: 'Medium',
          spoofing_protection: 85,
          phishing_protection: 70,
          brand_protection: 90
        },
        validation_checks: [
          { check: 'DMARC Record Exists', status: 'pass', details: 'Valid DMARC record found' },
          { check: 'Policy Configuration', status: 'pass', details: 'Quarantine policy configured' },
          { check: 'Reporting Setup', status: 'pass', details: 'Both aggregate and forensic reporting configured' },
          { check: 'Subdomain Policy', status: 'warning', details: 'No explicit subdomain policy set' },
          { check: 'Alignment Mode', status: 'pass', details: 'Relaxed alignment for both SPF and DKIM' },
          { check: 'Percentage Coverage', status: 'pass', details: '100% of emails covered by policy' }
        ],
        subdomain_analysis: {
          explicitly_protected: false,
          inherits_policy: true,
          recommended_policy: 'reject',
          risk_level: 'medium'
        },
        aggregate_reports: {
          enabled: true,
          frequency: 'Daily',
          destinations: ['dmarc@example.com'],
          last_report: '2024-06-13'
        },
        forensic_reports: {
          enabled: true,
          triggers: ['SPF failure', 'DKIM failure', 'Both fail'],
          destinations: ['dmarc-forensic@example.com']
        },
        recommendations: [
          'Consider upgrading policy from "quarantine" to "reject" for maximum protection',
          'Add explicit subdomain policy (sp=reject) to protect subdomains',
          'Monitor aggregate reports regularly for unauthorized sending sources',
          'Set up automated report processing for better visibility',
          'Consider implementing DKIM signing for all outbound email'
        ],
        policy_migration: {
          current_stage: 'Monitor',
          next_stage: 'Quarantine',
          recommended_timeline: '2-4 weeks',
          migration_path: ['none → monitor → quarantine → reject']
        }
      };
      
      setResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPolicyColor = (policy: string) => {
    switch (policy.toLowerCase()) {
      case 'reject': return 'bg-red-500';
      case 'quarantine': return 'bg-yellow-500';
      case 'none': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getProtectionLevel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="h-5 w-5 text-orange-400" />
            DMARC Analyzer
          </CardTitle>
          <CardDescription className="text-slate-300">
            Analyze DMARC policies and domain-based message authentication reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter domain (e.g., example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
            />
            <Button 
              onClick={analyzeDMARC}
              disabled={!domain.trim() || isAnalyzing}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze DMARC'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* Overview */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  DMARC Policy Overview
                </span>
                <Badge className={`${results.record_found ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {results.record_found ? 'CONFIGURED' : 'NOT FOUND'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Domain</label>
                <p className="text-white font-mono text-lg">{results.domain}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">DMARC Record</label>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <code className="text-green-400 break-all text-sm">{results.dmarc_record}</code>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">{results.compliance_analysis.overall_score}%</div>
                  <div className="text-sm text-slate-300">Compliance Score</div>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                  <Badge className={`${getPolicyColor(results.policy.policy)} text-white text-lg px-3 py-1`}>
                    {results.policy.policy.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-slate-300 mt-2">Policy</div>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">{results.policy.percentage}%</div>
                  <div className="text-sm text-slate-300">Coverage</div>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                  <div className={`text-2xl font-bold ${getProtectionLevel(results.policy_effectiveness.protection_level)}`}>
                    {results.policy_effectiveness.protection_level.toUpperCase()}
                  </div>
                  <div className="text-sm text-slate-300">Protection</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Effectiveness */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                Policy Effectiveness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Spoofing Protection</span>
                    <span className="text-white font-semibold">{results.policy_effectiveness.spoofing_protection}%</span>
                  </div>
                  <Progress value={results.policy_effectiveness.spoofing_protection} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Phishing Protection</span>
                    <span className="text-white font-semibold">{results.policy_effectiveness.phishing_protection}%</span>
                  </div>
                  <Progress value={results.policy_effectiveness.phishing_protection} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Brand Protection</span>
                    <span className="text-white font-semibold">{results.policy_effectiveness.brand_protection}%</span>
                  </div>
                  <Progress value={results.policy_effectiveness.brand_protection} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Checks */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Validation Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.validation_checks.map((check: any, index: number) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-semibold">{check.check}</h4>
                        <Badge className={`${
                          check.status === 'pass' ? 'bg-green-500' : 
                          check.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white`}>
                          {check.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-sm">{check.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Policy Configuration */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Policy Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-4">Policy Settings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Domain Policy:</span>
                      <Badge className={`${getPolicyColor(results.policy.policy)} text-white`}>
                        {results.policy.policy.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Subdomain Policy:</span>
                      <Badge className={`${getPolicyColor(results.policy.subdomain_policy)} text-white`}>
                        {results.policy.subdomain_policy.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Percentage:</span>
                      <span className="text-white">{results.policy.percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Report Interval:</span>
                      <span className="text-white">{results.policy.reporting.interval / 86400} days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Alignment Settings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">DKIM Alignment:</span>
                      <Badge className="bg-blue-500 text-white">{results.policy.alignment.dkim.toUpperCase()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">SPF Alignment:</span>
                      <Badge className="bg-blue-500 text-white">{results.policy.alignment.spf.toUpperCase()}</Badge>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-slate-900/30 rounded-lg">
                    <p className="text-slate-300 text-sm">
                      <strong>Relaxed alignment</strong> allows emails from subdomains to pass authentication, 
                      while <strong>strict alignment</strong> requires exact domain match.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting Configuration */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-400" />
                Reporting Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-4">Aggregate Reports</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Status:</span>
                      <Badge className={`${results.aggregate_reports.enabled ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {results.aggregate_reports.enabled ? 'ENABLED' : 'DISABLED'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Frequency:</span>
                      <span className="text-white">{results.aggregate_reports.frequency}</span>
                    </div>
                    <div>
                      <span className="text-slate-300 block mb-2">Destinations:</span>
                      {results.aggregate_reports.destinations.map((dest: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-slate-300 mr-2 mb-1">
                          {dest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Forensic Reports</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Status:</span>
                      <Badge className={`${results.forensic_reports.enabled ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {results.forensic_reports.enabled ? 'ENABLED' : 'DISABLED'}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-slate-300 block mb-2">Triggers:</span>
                      {results.forensic_reports.triggers.map((trigger: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-slate-300 mr-2 mb-1">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DMARCAnalyzer;
