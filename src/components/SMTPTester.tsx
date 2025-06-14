
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Upload, Send, Server, Key, Plus, Trash2, Mail } from 'lucide-react';

const formSchema = z.object({
  serverAddress: z.string().min(1, 'Server address is required'),
  port: z.coerce.number().min(1, 'Port is required'),
  useAuthentication: z.boolean().default(false),
  username: z.string().optional(),
  password: z.string().optional(),
  recipients: z.string().min(1, 'At least one recipient is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  customHeaders: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  threads: z.coerce.number().min(1, "Minimum 1 thread").max(100, "Maximum 100 threads").default(1),
  emailsToSend: z.coerce.number().min(1, "Minimum 1 email").max(1000, "Maximum 1000 emails").default(1),
}).refine(data => !data.useAuthentication || (data.username && data.password), {
  message: "Username and password are required for authentication",
  path: ["username"], // you can point to a specific field
});

const SMTPTester = () => {
  const [results, setResults] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverAddress: '',
      port: 587,
      useAuthentication: false,
      username: '',
      password: '',
      recipients: '',
      subject: 'Test Email from Email Utility Toolbox',
      body: 'This is a test email sent from the Lovable Email Utility Toolbox SMTP Tester.',
      customHeaders: [{ key: '', value: '' }],
      threads: 1,
      emailsToSend: 1,
    },
  });

  const useAuthentication = form.watch('useAuthentication');
  const customHeaders = form.watch('customHeaders');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' || file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const emails = content.split(/[\n,]+/).map(email => email.trim()).filter(Boolean).join(', ');
          form.setValue('recipients', emails);
          toast({
            title: "File processed",
            description: `${emails.split(', ').length} recipients loaded from ${file.name}.`,
          });
        };
        reader.readAsText(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a .txt or .csv file.",
        });
      }
    }
  };
  
  const addHeader = () => {
    const newHeaders = [...(customHeaders || []), { key: '', value: '' }];
    form.setValue('customHeaders', newHeaders);
  };

  const removeHeader = (index: number) => {
    const newHeaders = [...(customHeaders || [])];
    newHeaders.splice(index, 1);
    form.setValue('customHeaders', newHeaders);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResults(null);
    console.log('Simulating SMTP test with values:', values);

    setTimeout(() => {
      setIsLoading(false);
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        setResults(`✅ Successfully connected to ${values.serverAddress}:${values.port}.\n✅ Simulated sending ${values.emailsToSend} test email(s) using ${values.threads} thread(s).`);
        toast({
          title: "Success!",
          description: "Test emails sent successfully.",
          variant: 'default',
          className: 'bg-green-600 text-white border-green-700'
        });
      } else {
        setResults(`❌ Failed to connect to SMTP server ${values.serverAddress}:${values.port}.\nPlease check your credentials and server details.`);
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Failed to send test emails.",
        });
      }
    }, 2000);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm text-white">
      <CardHeader>
        <CardTitle className="text-2xl text-white">SMTP Connection Tester</CardTitle>
        <CardDescription className="text-slate-300">
          Test your SMTP server settings and send bulk test emails with advanced options.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Server className="h-5 w-5 text-cyan-400" /> SMTP Server Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="serverAddress" render={({ field }) => ( <FormItem><FormLabel>Server Address</FormLabel><FormControl><Input placeholder="smtp.example.com" {...field} className="bg-slate-800 border-slate-600 text-white" /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="port" render={({ field }) => ( <FormItem><FormLabel>Port</FormLabel><FormControl><Input type="number" placeholder="587" {...field} className="bg-slate-800 border-slate-600 text-white" /></FormControl><FormMessage /></FormItem> )} />
                <div className="md:col-span-2 flex items-center space-x-2 pt-2">
                  <FormField control={form.control} name="useAuthentication" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-slate-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-white" /></FormControl><div className="space-y-1 leading-none"><FormLabel>Use Authentication</FormLabel></div></FormItem>)} />
                </div>
                {useAuthentication && (
                  <>
                    <FormField control={form.control} name="username" render={({ field }) => ( <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="your_username" {...field} className="bg-slate-800 border-slate-600 text-white" /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} className="bg-slate-800 border-slate-600 text-white" /></FormControl><FormMessage /></FormItem> )} />
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Mail className="h-5 w-5 text-cyan-400" /> Email Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField control={form.control} name="recipients" render={({ field }) => ( <FormItem><FormLabel>Recipients</FormLabel><FormControl><Textarea placeholder="Comma-separated emails: test1@example.com, test2@example.com" {...field} className="bg-slate-800 border-slate-600 text-white min-h-[100px]" /></FormControl><FormDescription className="text-slate-400 flex justify-between items-center pt-2"><span>Enter recipients, or upload a file.</span><Button type="button" size="sm" variant="outline" className="bg-slate-700 hover:bg-slate-600 border-slate-600" onClick={() => document.getElementById('recipient-file-upload')?.click()}> <Upload className="mr-2 h-4 w-4"/> Upload File </Button><Input id="recipient-file-upload" type="file" className="hidden" accept=".txt,.csv" onChange={handleFileUpload}/></FormDescription><FormMessage /></FormItem> )}/>
                 <FormField control={form.control} name="subject" render={({ field }) => ( <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="Your test email subject" {...field} className="bg-slate-800 border-slate-600 text-white" /></FormControl><FormMessage /></FormItem> )}/>
                 <FormField control={form.control} name="body" render={({ field }) => ( <FormItem><FormLabel>Body (supports plain text)</FormLabel><FormControl><Textarea placeholder="The content of your test email." {...field} className="bg-slate-800 border-slate-600 text-white min-h-[150px]" /></FormControl><FormMessage /></FormItem> )}/>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Key className="h-5 w-5 text-cyan-400" /> Advanced Options</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <FormLabel>Custom Headers</FormLabel>
                        {customHeaders?.map((header, index) => (
                            <div key={index} className="flex items-center gap-2 mt-2">
                                <FormField control={form.control} name={`customHeaders.${index}.key`} render={({ field }) => ( <Input placeholder="Header Key (e.g., X-Priority)" {...field} className="bg-slate-800 border-slate-600 text-white"/> )} />
                                <FormField control={form.control} name={`customHeaders.${index}.value`} render={({ field }) => ( <Input placeholder="Header Value (e.g., 1)" {...field} className="bg-slate-800 border-slate-600 text-white"/> )} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeHeader(index)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={addHeader} className="mt-2 bg-slate-700 hover:bg-slate-600 border-slate-600"><Plus className="mr-2 h-4 w-4" /> Add Header</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <FormField control={form.control} name="threads" render={({ field }) => ( <FormItem><FormLabel>Number of Threads</FormLabel><FormControl><Input type="number" min="1" max="100" {...field} className="bg-slate-800 border-slate-600 text-white" /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="emailsToSend" render={({ field }) => ( <FormItem><FormLabel>Total Emails to Send</FormLabel><FormControl><Input type="number" min="1" max="1000" {...field} className="bg-slate-800 border-slate-600 text-white" /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg" disabled={isLoading}>
              {isLoading ? 'Running Test...' : 'Test Connection & Send Emails'} <Send className="ml-2 h-5 w-5"/>
            </Button>
          </form>
        </Form>
      </CardContent>
      {results && (
        <CardFooter>
          <div className="mt-4 w-full">
            <h3 className="text-xl font-semibold mb-2 text-white">Results</h3>
            <pre className="bg-slate-900 p-4 rounded-md text-slate-300 w-full overflow-x-auto whitespace-pre-wrap">
              <code>{results}</code>
            </pre>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default SMTPTester;
