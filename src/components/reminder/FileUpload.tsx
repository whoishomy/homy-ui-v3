import * as React from 'react';
import { Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  selectedFile?: File;
  accept?: Record<string, string[]>;
  className?: string;
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ onFileSelect, onClear, selectedFile, accept, className }, ref) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        if (acceptedFiles?.[0]) {
          onFileSelect(acceptedFiles[0]);
        }
      },
      accept,
      maxFiles: 1,
      multiple: false,
    });

    return (
      <div ref={ref} className={className}>
        <div
          {...getRootProps()}
          className={cn(
            'relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 px-6 py-4 text-center transition-colors hover:bg-muted',
            isDragActive && 'border-primary bg-muted',
            selectedFile && 'border-success bg-success/10'
          )}
        >
          <input {...getInputProps()} />
          
          {selectedFile ? (
            <>
              <Upload className="h-10 w-10 text-success" />
              <p className="mt-2 text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="absolute right-2 top-2 rounded-full p-1 hover:bg-muted-foreground/10"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </button>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">
                {isDragActive ? 'Drop the file here' : 'Drag & drop file here'}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to select file
              </p>
            </>
          )}
        </div>
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload'; 