// components/FileUpload.js
import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [translatedText, setTranslatedText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e:any) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Send file to the backend API
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Translation failed');
      }

      const data = await res.json();
      setTranslatedText(data.translatedText);
    } catch (err:any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={loading}>
        {loading ? 'Uploading and Translating...' : 'Upload and Translate'}
      </button>

      {error && <p>Error: {error}</p>}

      {translatedText && (
        <div>
          <h3>Translated Text:</h3>
          <pre>{translatedText}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
