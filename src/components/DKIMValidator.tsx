import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Key, CheckCircle, XCircle, AlertTriangle, Lock, Hash, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const DKIMValidator = () => {
  const [domain, setDomain] = useState('');
  const [selector, setSelector] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateDKIM = async () => {
    if (!domain.trim() || !selector.trim()) return;
    
    setIsValidating(true);
    
    try {
      const response = await fetch('/api/validate-dkim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          domain: domain.trim(),
          selector: selector.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate DKIM');
      }

      const result = await response.json();
      setResults(result);
      
      toast({
        title: "DKIM Validation Complete",
        description: `DKIM record for ${selector}._domainkey.${domain} validated successfully.`,
      });
    } catch (error) {
      console.error('Error validating DKIM:', error);
      toast({
        variant: "destructive",
        title: "DKIM Validation Failed",
        description: "Failed to validate DKIM record. Please check your backend connection.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Key className="h-5 w-5 text-purple-400" />
            DKIM Validator
          </CardTitle>
          <CardDescription className="text-slate-300">
            Verify DomainKeys Identified Mail signatures and public key records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Domain (e.g., example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
            />
            <Input
              placeholder="Selector (e.g., default, google, s1)"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          <Button 
            onClick={validateDKIM}
            disabled={!domain.trim() || !selector.trim() || isValidating}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
          >
            {isValidating ? 'Validating...' : 'Validate DKIM'}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* Overview */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-400" />
                  DKIM Record Overview
                </span>
                <Badge className={`${results.record_found ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {results.record_found ? 'FOUND' : 'NOT FOUND'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Domain</label>
                  <p className="text-white font-mono text-lg">{results.domain}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Selector</label>
                  <p className="text-white font-mono text-lg">{results.selector}</p>
                </div>
              </div>
              {results.dkim_record && (
                <div>
                  <label className="text-sm font-medium text-slate-300">DKIM Record</label>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <code className="text-green-400 break-all text-sm">{results.dkim_record}</code>
                  </div>
                </div>
              )}
              {results.security_score !== undefined && results.public_key && results.signature_analysis && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className={`text-2xl font-bold ${getScoreColor(results.security_score)}`}>
                      {results.security_score}%
                    </div>
                    <div className="text-sm text-slate-300">Security Score</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{results.public_key.key_size}</div>
                    <div className="text-sm text-slate-300">Key Size (bits)</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{results.public_key.algorithm}</div>
                    <div className="text-sm text-slate-300">Algorithm</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{results.signature_analysis.hash_algorithm.toUpperCase()}</div>
                    <div className="text-sm text-slate-300">Hash Algorithm</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Tests */}
          {results.validation_tests && (
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Validation Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.validation_tests.map((test: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg">
                      {getStatusIcon(test.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-semibold">{test.test}</h4>
                          <Badge className={`${
                            test.status === 'pass' ? 'bg-green-500' : 
                            test.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          } text-white`}>
                            {test.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm">{test.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Public Key Analysis */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-400" />
                Public Key Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Key Properties</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Algorithm:</span>
                      <Badge className="bg-blue-500 text-white">{results.public_key.algorithm}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Key Size:</span>
                      <Badge className={`${results.public_key.key_size >= 2048 ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                        {results.public_key.key_size} bits
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Key Type:</span>
                      <span className="text-white">{results.public_key.key_type.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Expiration:</span>
                      <span className="text-white">{results.public_key.expires || 'None'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Signature Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Canonicalization:</span>
                      <span className="text-white font-mono">{results.signature_analysis.canonicalization}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Hash Algorithm:</span>
                      <Badge className="bg-green-500 text-white">{results.signature_analysis.hash_algorithm.toUpperCase()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Body Hash:</span>
                      <Badge className={`${results.signature_analysis.body_hash_valid ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {results.signature_analysis.body_hash_valid ? 'VALID' : 'INVALID'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Header Hash:</span>
                      <Badge className={`${results.signature_analysis.header_hash_valid ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {results.signature_analysis.header_hash_valid ? 'VALID' : 'INVALID'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Analysis */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-400" />
                Security Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Key Strength</label>
                    <p className="text-yellow-400 font-semibold">{results.security_analysis.key_strength}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">Recommended</label>
                    <p className="text-green-400">{results.security_analysis.recommended_key_size}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Vulnerabilities</label>
                  <div className="space-y-2">
                    {results.security_analysis.vulnerabilities.map((vuln: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-red-200">{vuln}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Hash className="h-5 w-5 text-cyan-400" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
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

export default DKIMValidator;
