
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Shield, AlertTriangle, CheckCircle, Clock, MapPin, User, Server } from 'lucide-react';

const EmailHeaderAnalyzer = () => {
  const [headers, setHeaders] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeHeaders = async () => {
    if (!headers.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call - replace with actual backend call
    setTimeout(() => {
      const mockAnalysis = {
        summary: {
          from: 'sender@example.com',
          to: 'recipient@example.com',
          subject: 'Important Email',
          date: '2024-06-14T10:30:00Z',
          messageId: '<abc123@example.com>',
          returnPath: 'bounce@example.com'
        },
        routing: [
          { server: 'mail.example.com', ip: '192.168.1.1', timestamp: '2024-06-14T10:29:55Z', delay: '0.5s' },
          { server: 'mx.recipient.com', ip: '10.0.0.1', timestamp: '2024-06-14T10:30:00Z', delay: '0.2s' }
        ],
        authentication: {
          spf: { status: 'pass', details: 'v=spf1 include:_spf.example.com ~all' },
          dkim: { status: 'pass', selector: 'default', domain: 'example.com' },
          dmarc: { status: 'pass', policy: 'quarantine', alignment: 'relaxed' }
        },
        security: {
          tls: true,
          encryption: 'TLS 1.3',
          spam_score: 2.1,
          virus_scan: 'clean',
          phishing_check: 'safe'
        },
        metadata: {
          user_agent: 'Mozilla Thunderbird 91.0',
          x_originating_ip: '203.0.113.1',
          x_mailer: 'Thunderbird',
          mime_version: '1.0',
          content_type: 'text/html; charset=UTF-8'
        }
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pass': return 'bg-green-500';
      case 'fail': return 'bg-red-500';
      case 'warn': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="h-5 w-5 text-cyan-400" />
            Email Header Analyzer
          </CardTitle>
          <CardDescription className="text-slate-300">
            Paste your email headers below for comprehensive analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your email headers here..."
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="min-h-[200px] bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
          />
          <Button 
            onClick={analyzeHeaders}
            disabled={!headers.trim() || isAnalyzing}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Headers'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-cyan-400" />
                Email Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">From</label>
                  <p className="text-white font-mono text-sm">{analysis.summary.from}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">To</label>
                  <p className="text-white font-mono text-sm">{analysis.summary.to}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Subject</label>
                  <p className="text-white font-mono text-sm">{analysis.summary.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Date</label>
                  <p className="text-white font-mono text-sm">{new Date(analysis.summary.date).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                Authentication Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">SPF</span>
                    <Badge className={`${getStatusColor(analysis.authentication.spf.status)} text-white`}>
                      {analysis.authentication.spf.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{analysis.authentication.spf.details}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">DKIM</span>
                    <Badge className={`${getStatusColor(analysis.authentication.dkim.status)} text-white`}>
                      {analysis.authentication.dkim.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">Selector: {analysis.authentication.dkim.selector}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">DMARC</span>
                    <Badge className={`${getStatusColor(analysis.authentication.dmarc.status)} text-white`}>
                      {analysis.authentication.dmarc.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">Policy: {analysis.authentication.dmarc.policy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Routing Information */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                Email Routing Path
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.routing.map((hop: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 text-white">
                        <span className="font-mono">{hop.server}</span>
                        <span className="text-slate-400">({hop.ip})</span>
                        <Badge variant="outline" className="text-slate-300">
                          <Clock className="h-3 w-3 mr-1" />
                          {hop.delay}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">{new Date(hop.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Analysis */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Security Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">TLS Encryption</span>
                  </div>
                  <p className="text-white font-mono text-sm">{analysis.security.encryption}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">Virus Scan</span>
                  </div>
                  <p className="text-white capitalize">{analysis.security.virus_scan}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-slate-300">Spam Score</span>
                  </div>
                  <p className="text-white">{analysis.security.spam_score}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmailHeaderAnalyzer;
