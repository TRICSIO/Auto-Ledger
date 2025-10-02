
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileText, Trash2, Download } from 'lucide-react';
import { addDocumentAction, deleteDocumentAction } from '@/app/actions';
import type { VehicleDocument } from '@/lib/types';
import { format } from 'date-fns';

interface DocumentManagerProps {
  documents: VehicleDocument[];
  vehicleId: string;
}

export default function DocumentManager({ documents, vehicleId }: DocumentManagerProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // This is a mock. In a real app, you would upload to a storage service.
    // Here we just add it to our mock data store.
    const result = await addDocumentAction({
      vehicleId,
      fileName: file.name,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
    });

    if (result.success) {
      toast({ title: 'Document Uploaded', description: `${file.name} has been saved.` });
    } else {
      toast({ variant: 'destructive', title: 'Upload Failed', description: result.message });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (docId: string) => {
    const result = await deleteDocumentAction(docId);
    if (result.success) {
      toast({ title: 'Document Deleted' });
    } else {
      toast({ variant: 'destructive', title: 'Delete Failed', description: result.message });
    }
  };
  
  // This is a mock download function
  const handleDownload = (docName: string) => {
      toast({
          title: "Download Started (Mock)",
          description: `Downloading ${docName}. This is a simulated action.`
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
          <span>Digital Glovebox</span>
          <Button size="sm" onClick={handleUploadClick}>
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </CardTitle>
        <CardDescription>
          Keep important documents like registration, insurance, and receipts handy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        {doc.fileName}
                    </TableCell>
                    <TableCell>{doc.fileType}</TableCell>
                    <TableCell>{format(new Date(doc.uploadedAt), 'PPP')}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.fileName)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No documents uploaded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
