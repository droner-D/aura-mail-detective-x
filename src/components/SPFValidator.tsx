import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, XCircle, AlertTriangle, Server, Globe, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const SPFValidator = () => {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateSPF = async () => {
    if (!domain.trim()) return;
    
    setIsValidating(true);
    
    try {
      const response = await fetch('/api/validate-spf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: domain.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate SPF');
      }

      const result = await response.json();
      setResults(result);
      
      toast({
        title: "SPF Validation Complete",
        description: `SPF record for ${domain} validated successfully.`,
      });
    } catch (error) {
      console.error('Error validating SPF:', error);
      toast({
        variant: "destructive",
        title: "SPF Validation Failed",
        description: "Failed to validate SPF record. Please check your backend connection.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-green-400" />
            SPF Validator
          </CardTitle>
          <CardDescription className="text-slate-300">
            Validate Sender Policy Framework records and analyze domain authorization
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
              onClick={validateSPF}
              disabled={!domain.trim() || isValidating}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isValidating ? 'Validating...' : 'Validate SPF'}
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
                  SPF Record Overview
                </span>
                <Badge className={`${results.valid ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {results.valid ? 'VALID' : 'INVALID'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Domain</label>
                <p className="text-white font-mono text-lg">{results.domain}</p>
              </div>
              {results.record && (
                <div>
                  <label className="text-sm font-medium text-slate-300">SPF Record</label>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <code className="text-green-400 break-all">{results.record}</code>
                  </div>
                </div>
              )}
              {results.security_score !== undefined && results.lookups && results.mechanisms && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{results.security_score}%</div>
                    <div className="text-sm text-slate-300">Security Score</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{results.lookups.total}/{results.lookups.limit}</div>
                    <div className="text-sm text-slate-300">DNS Lookups</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{results.mechanisms.length}</div>
                    <div className="text-sm text-slate-300">Mechanisms</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mechanisms Analysis */}
          {results.mechanisms && (
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Server className="h-5 w-5 text-purple-400" />
                  SPF Mechanisms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.mechanisms.map((mechanism: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg">
                      {getStatusIcon(mechanism.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-slate-300 font-mono">
                            {mechanism.type}
                          </Badge>
                          <code className="text-green-400">{mechanism.value}</code>
                        </div>
                        <p className="text-slate-300 text-sm">{mechanism.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Policy Analysis */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-400" />
                Policy Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Current Policy</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Qualifier:</span>
                      <Badge className="bg-blue-500 text-white">{results.policy.qualifier}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Action:</span>
                      <span className="text-white">{results.policy.action}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mt-3">{results.policy.description}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Policy Options</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500 text-white">-all</Badge>
                      <span className="text-slate-300">Hard Fail (Reject)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500 text-white">~all</Badge>
                      <span className="text-slate-300">Soft Fail (Mark as spam)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500 text-white">?all</Badge>
                      <span className="text-slate-300">Neutral (No policy)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 text-white">+all</Badge>
                      <span className="text-slate-300">Pass (Allow all)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Included Domains */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-cyan-400" />
                Included Domains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.includes.map((include: any, index: number) => (
                  <div key={index} className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{include.domain}</h4>
                      <Badge className={`${include.valid ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {include.valid ? 'VALID' : 'INVALID'}
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <label className="text-sm font-medium text-slate-300">Record</label>
                      <code className="block text-green-400 text-sm mt-1">{include.record}</code>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Authorized IP Ranges</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {include.ip_ranges.map((ip: string, ipIndex: number) => (
                          <Badge key={ipIndex} variant="outline" className="text-slate-300 font-mono">
                            {ip}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
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

export default SPFValidator;
