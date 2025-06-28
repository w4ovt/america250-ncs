'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import styles from './K4ADropzone.module.css';

interface VolunteerData {
  volunteerId: number;
  name: string;
  callsign: string;
  state: string;
}

interface AuthResponse {
  pinId: number;
  role: 'admin' | 'volunteer';
  volunteer: VolunteerData | null;
}

interface K4ADropzoneProps {
  disabled?: boolean;
  volunteerData?: AuthResponse | null;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function K4ADropzone({ disabled = false, volunteerData }: K4ADropzoneProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [message, setMessage] = useState('');
  const [recordCount, setRecordCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isAuthenticated = !!volunteerData;

  // Set loading to false after component mounts
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const playSuccessAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        console.warn('Could not play audio');
      });
    }
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (!file || !isAuthenticated || disabled) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.adi')) {
      setStatus('error');
      setMessage('Please select a valid .adi file');
      return;
    }

    setStatus('uploading');
    setMessage('Uploading to QRZ Logbook...');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const fileContent = e.target?.result as string;
        
        const response = await fetch('/api/logs/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: file.name,
            fileContent,
            volunteerData: volunteerData.volunteer,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setStatus('success');
          setMessage(result.message || 'SUCCESS: Contacts Have Been Uploaded to the K4A QRZ Logbook. Thank you for Volunteering!');
          setRecordCount(result.recordCount);
          playSuccessAudio();
        } else {
          setStatus('error');
          setMessage(result.error || 'ERROR: Your .adi file contains errors. Contact Marc W4OVT for assistance.');
          setRecordCount(null);
        }
      } catch {
        setStatus('error');
        setMessage('ERROR: Your .adi file contains errors. Contact Marc W4OVT for assistance.');
        setRecordCount(null);
      }
    };

    reader.onerror = () => {
      setStatus('error');
      setMessage('ERROR: Your .adi file contains errors. Contact Marc W4OVT for assistance.');
      setRecordCount(null);
    };

    reader.readAsText(file);
  }, [isAuthenticated, disabled, volunteerData, playSuccessAudio]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || !isAuthenticated) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, isAuthenticated, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && isAuthenticated && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, isAuthenticated]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const resetStatus = useCallback(() => {
    setStatus('idle');
    setMessage('');
    setRecordCount(null);
  }, []);

  return (
    <div className={styles.k4aDropzoneSection}>
      <h2 className={styles.sectionTitle}>K4A Log Dropbox</h2>
      
      {/* Hidden audio element for success sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/logdrop.mp3" type="audio/mpeg" />
      </audio>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id="k4a-file-input"
        name="k4a-file-input"
        accept=".adi,.ADI"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {!isLoading && (
        <div className={styles.k4aDropzone + ' ' + styles[status] + (disabled ? ' ' + styles.disabled : '')}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
          title={disabled ? 'Enter PIN above to enable upload' : 'Drag your .adi file here to upload to QRZ Logbook'}
        >
          <div className={styles.dropzoneContent}>
            <Image
              src="/K4A-Log-Dropbox.webp"
              alt="K4A Log Dropbox"
              width={200}
              height={150}
              className={styles.dropzoneImage}
              style={{
                width: 'auto',
                height: 'auto'
              }}
            />
            
            {status === 'idle' && (
              <div className={styles.dropzoneText}>
                <p>Drag your .adi file here to upload to QRZ Logbook</p>
                <p className={styles.dropzoneHint}>or click to select a file</p>
              </div>
            )}
            
            {status === 'uploading' && (
              <div className={styles.dropzoneText}>
                <p>Uploading to QRZ Logbook...</p>
                <div className={styles.loadingSpinner}></div>
              </div>
            )}
            
            {status === 'success' && (
              <div className={styles.dropzoneText + ' ' + styles.success}>
                <p>✅ {message}</p>
                {recordCount && <p>Records uploaded: {recordCount}</p>}
                <button onClick={resetStatus} className="btn btn-primary">
                  Upload Another File
                </button>
              </div>
            )}
            
            {status === 'error' && (
              <div className={styles.dropzoneText + ' ' + styles.error}>
                <p>❌ {message}</p>
                <button onClick={resetStatus} className="btn btn-danger">
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {disabled && !isLoading && (
        <div className={styles.authNotice}>
          <p>This feature is interactive for authenticated volunteers or admins. Enter PIN above to activate.</p>
        </div>
      )}
    </div>
  );
} 