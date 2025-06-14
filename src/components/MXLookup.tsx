
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Globe, Server, Shield, AlertTriangle } from 'lucide-react';
import { getApiUrl } from '@/utils/apiConfig';
import type { MXLookupResult } from '@/types/api';

const formSchema = z.object({
  domain: z.string().min(1, 'Domain is required').regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,})$/, 'Invalid domain format'),
});

const MXLookup = () => {
  const [result, setResult] = useState<MXLookupResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);
    console.log('Looking up MX records for:', values.domain);

    try {
      const response = await fetch(getApiUrl('/api/mx-lookup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: values.domain }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: MXLookupResult = await response.json();
      setResult(data);
      
      toast({
        title: "MX Lookup Complete",
        description: `Found ${data.mx_records.length} MX records for ${values.domain}`,
      });
    } catch (error) {
      console.error('Error looking up MX records:', error);
      toast({
        variant: "destructive",
        title: "MX Lookup Failed",
        description: error instanceof Error ? error.message : "Failed to lookup MX records",
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
            <Globe className="h-5 w-5 text-cyan-400" />
            MX Record Lookup
          </CardTitle>
          <CardDescription className="text-slate-300">
            Lookup Mail Exchange (MX) records for a domain to see mail server configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Domain</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="example.com" 
                        {...field} 
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {isLoading ? 'Looking up...' : 'Lookup MX Records'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-green-400" />
                MX Records Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Domain</label>
                  <p className="text-white font-mono text-sm">{result.domain}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Total Records</label>
                  <p className="text-white font-mono text-sm">{result.total_records}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Security Score</label>
                  <p className="text-white font-mono text-sm">{result.security_score}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MX Records */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-400" />
                Mail Exchange Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.mx_records.map((record, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg">
                    <Badge variant="outline" className="text-slate-300">
                      Priority {record.priority}
                    </Badge>
                    <div className="flex-1">
                      <div className="text-white font-mono">{record.host}</div>
                      <div className="text-xs text-slate-400">
                        IPs: {record.ip_addresses.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-yellow-400" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <p className="text-slate-300 text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default MXLookup;
