'use client';

interface AdiDropzoneProps {
  disabled?: boolean;
}

export default function AdiDropzone({ disabled = false }: AdiDropzoneProps) {
  return (
    <div className="adi-section">
      <h2 className="section-title">ADI File Upload</h2>
      <div className="adi-upload-area">
        <p>Upload your ADI logbook file to submit QSO records to QRZ.</p>
        <input
          type="file"
          id="adi-file-input"
          name="adi-file-input"
          accept=".adi,.ADI"
          className={`file-input ${disabled ? 'disabled' : ''}`}
          disabled={disabled}
        />
        <button 
          className={`upload-btn ${disabled ? 'disabled' : ''}`}
          disabled={disabled}
        >
          Upload ADI File
        </button>
        {disabled && (
          <div className="auth-notice">
            <p>This feature is interactive for authenticated volunteers or admins. Enter PIN above to activate.</p>
          </div>
        )}
      </div>
    </div>
  );
} 