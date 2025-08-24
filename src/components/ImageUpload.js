import React, { useState, useRef } from 'react';

const ImageUpload = ({ onImageUpload, currentImage }) => {
  const [preview, setPreview] = useState(currentImage || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file! 📸');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB! 📁');
      return;
    }

    setUploading(true);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // For demo purposes, we'll use a placeholder service
      // In production, you'd upload to your server or a service like Cloudinary
      const mockImageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onImageUpload) {
        onImageUpload(mockImageUrl);
      }
      
      alert('Image uploaded successfully! 📸✨');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again! ❌');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    if (onImageUpload) {
      onImageUpload('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">Recipe Photo</label>
      
      {preview ? (
        <div style={{ position: 'relative', marginBottom: '15px' }}>
          <img 
            src={preview} 
            alt="Recipe preview"
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '200px',
              objectFit: 'cover',
              border: '3px solid var(--pixel-dark)',
              borderRadius: '8px'
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="pixel-btn pixel-btn-warning"
            style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px',
              fontSize: '10px',
              padding: '8px 12px'
            }}
          >
            🗑️ Remove
          </button>
        </div>
      ) : (
        <div 
          style={{
            border: '3px dashed var(--pixel-dark)',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '15px',
            cursor: 'pointer'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="pixel-text" style={{ fontSize: '16px', color: '#666' }}>
            📸 Click to upload a photo of your dish
          </div>
          <div className="pixel-text" style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>
            Supports: JPG, PNG, GIF (max 5MB)
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="pixel-btn pixel-btn-accent"
          disabled={uploading}
        >
          {uploading ? '📤 Uploading...' : '📁 Choose File'}
        </button>
        
        {preview && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="pixel-btn pixel-btn-secondary"
          >
            🗑️ Remove
          </button>
        )}
      </div>

      <small className="pixel-text" style={{ fontSize: '14px', color: '#666', display: 'block', marginTop: '8px' }}>
        💡 High-quality photos make your recipes more appealing!
      </small>
    </div>
  );
};

export default ImageUpload;
