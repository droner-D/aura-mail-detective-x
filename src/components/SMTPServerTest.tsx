
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Server, Shield, CheckCircle, XCircle, Clock, Key } from 'lucide-react';
import { getApiUrl } from '@/utils/apiConfig';
import type { SMTPServerTestResult } from '@/types/api';

const formSchema = z.object({
  server: z.string().min(1, 'Server address is required'),
  port: z.coerce.number().min(1, 'Port is required').max(65535, 'Invalid port'),
  testAuth: z.boolean().default(false),
  username: z.string().optional(),
  password: z.string().optional(),
}).refine(data => !data.testAuth || (data.username && data.password), {
  message: "Username and password are required for authentication test",
  path: ["username"],
});

const SMTPServerTest = () => {
  const [result, setResult] = useState<SMTPServerTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      server: '',
      port: 587,
      testAuth: false,
      username: '',
      password: '',
    },
  });

  const testAuth = form.watch('testAuth');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);
    console.log('Testing SMTP server:', values);

    try {
      const response = await fetch(getApiUrl('/api/smtp-server-test'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server: values.server,
          port: values.port,
          test_auth: values.testAuth,
          username: values.username,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: SMTPServerTestResult = await response.json();
      setResult(data);
      
      toast({
        title: data.connection_successful ? "SMTP Test Successful" : "SMTP Test Failed",
        description: data.connection_successful 
          ? `Successfully connected to ${values.server}:${values.port}`
          : data.error_message || "Failed to connect to SMTP server",
        variant: data.connection_successful ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error testing SMTP server:', error);
      toast({
        variant: "destructive",
        title: "SMTP Test Failed",
        description: error instanceof Error ? error.message : "Failed to test SMTP server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Server className="h-5 w-5 text-cyan-400" />
            SMTP Server Test
          </CardTitle>
          <CardDescription className="text-slate-300">
            Test SMTP server connectivity, STARTTLS support, and authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="server"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">SMTP Server</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="smtp.example.com" 
                          {...field} 
                          className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Port</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="587" 
                          {...field} 
                          className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="testAuth"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-slate-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-white"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-white">Test Authentication</FormLabel>
                      <FormDescription className="text-slate-400">
                        Test SMTP authentication with credentials
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {testAuth && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your_username" 
                            {...field} 
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {isLoading ? 'Testing Server...' : 'Test SMTP Server'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Connection Status */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {result.connection_successful ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Server</label>
                  <p className="text-white font-mono text-sm">{result.server}:{result.port}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Response Time</label>
                  <p className="text-white font-mono text-sm">{result.response_time}ms</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Status</label>
                  <Badge className={result.connection_successful ? 'bg-green-500' : 'bg-red-500'}>
                    {result.connection_successful ? 'Connected' : 'Failed'}
                  </Badge>
                </div>
              </div>
              {result.error_message && (
                <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
                  <p className="text-red-300 text-sm">{result.error_message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {result.connection_successful && (
            <>
              {/* Server Information */}
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Server className="h-5 w-5 text-blue-400" />
                    Server Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Server Banner</label>
                    <p className="text-white font-mono text-sm bg-slate-900/50 p-2 rounded">{result.server_banner}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">EHLO Response</label>
                    <div className="bg-slate-900/50 p-2 rounded">
                      {result.ehlo_response.map((line, index) => (
                        <p key={index} className="text-white font-mono text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      {result.starttls_supported ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-slate-300">STARTTLS Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.starttls_required ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-400" />
                      )}
                      <span className="text-slate-300">STARTTLS Required</span>
                    </div>
                  </div>
                  {result.auth_methods.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-slate-300">Authentication Methods</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {result.auth_methods.map((method, index) => (
                          <Badge key={index} variant="outline" className="text-slate-300">
                            <Key className="h-3 w-3 mr-1" />
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* TLS Certificate Info */}
              {result.security_analysis && (
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-400" />
                      TLS Certificate Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300">TLS Version</label>
                        <p className="text-white font-mono text-sm">{result.security_analysis.tls_version}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300">Cipher Suite</label>
                        <p className="text-white font-mono text-sm">{result.security_analysis.cipher_suite}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300">Certificate Valid</label>
                        <Badge className={result.security_analysis.certificate_valid ? 'bg-green-500' : 'bg-red-500'}>
                          {result.security_analysis.certificate_valid ? 'Valid' : 'Invalid'}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300">Certificate Expires</label>
                        <p className="text-white font-mono text-sm">{result.security_analysis.certificate_expires}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Certificate Issuer</label>
                      <p className="text-white font-mono text-sm">{result.security_analysis.certificate_issuer}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SMTPServerTest;
