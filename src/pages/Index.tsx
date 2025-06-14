
import { useState } from 'react';
import { Mail, Shield, Key, Lock, Zap, ArrowRight, Send, Globe, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmailHeaderAnalyzer from '@/components/EmailHeaderAnalyzer';
import SPFValidator from '@/components/SPFValidator';
import DKIMValidator from '@/components/DKIMValidator';
import DMARCAnalyzer from '@/components/DMARCAnalyzer';
import SMTPTester from '@/components/SMTPTester';
import MXLookup from '@/components/MXLookup';
import SMTPServerTest from '@/components/SMTPServerTest';

const Index = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'header-analyzer',
      title: 'Email Header Analyzer',
      description: 'Analyze email headers for security, routing, and authentication information',
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
      component: EmailHeaderAnalyzer
    },
    {
      id: 'spf-validator',
      title: 'SPF Validator',
      description: 'Validate Sender Policy Framework records and check domain authorization',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      component: SPFValidator
    },
    {
      id: 'dkim-validator',
      title: 'DKIM Validator',
      description: 'Verify DomainKeys Identified Mail signatures and public key records',
      icon: Key,
      color: 'from-purple-500 to-violet-500',
      component: DKIMValidator
    },
    {
      id: 'dmarc-analyzer',
      title: 'DMARC Analyzer',
      description: 'Analyze DMARC policies and domain-based message authentication',
      icon: Lock,
      color: 'from-orange-500 to-red-500',
      component: DMARCAnalyzer
    },
    {
      id: 'smtp-tester',
      title: 'SMTP Connection Tester',
      description: 'Test SMTP connections and send bulk test emails with multi-recipient support and custom headers.',
      icon: Send,
      color: 'from-yellow-500 to-amber-500',
      component: SMTPTester
    },
    {
      id: 'mx-lookup',
      title: 'MX Lookup',
      description: 'Lookup Mail Exchange records for a domain to see mail server configuration',
      icon: Globe,
      color: 'from-teal-500 to-cyan-500',
      component: MXLookup
    },
    {
      id: 'smtp-server-test',
      title: 'SMTP Server Test',
      description: 'Test SMTP server connectivity, STARTTLS support, and authentication methods',
      icon: Server,
      color: 'from-indigo-500 to-purple-500',
      component: SMTPServerTest
    }
  ];

  if (activeTool) {
    const tool = tools.find(t => t.id === activeTool);
    const Component = tool?.component;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setActiveTool(null)}
              className="text-white hover:bg-white/10"
            >
              ← Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-cyan-400" />
              <span className="text-white font-semibold">Email Utility Toolbox</span>
            </div>
          </div>
          {Component && <Component />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Email Utility Toolbox
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Advanced email security analysis and validation tools with comprehensive reporting
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card 
                key={tool.id}
                className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group cursor-pointer"
                onClick={() => setActiveTool(tool.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 bg-gradient-to-r ${tool.color} rounded-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-cyan-200 transition-colors">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-base leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Why Choose Our Toolbox?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-slate-300">Real-time analysis with instant results and comprehensive reporting</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
              <p className="text-slate-300">Enterprise-grade security validation with detailed vulnerability assessment</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
              <p className="text-slate-300">Deep insights with actionable recommendations and best practices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
