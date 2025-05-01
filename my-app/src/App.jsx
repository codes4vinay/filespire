import { useState, useEffect, useRef } from 'react';
import './App.css';
import { uploadFile } from './services/api.js';
import Navbar from './Navbar';
import Footer from './Footer.jsx';
import AuthComponent from './AuthComponent.jsx';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [expirationPeriod, setExpirationPeriod] = useState(24); // Default to 24 hours
  const fileInputRef = useRef();
  const logo = './filespp.jpeg';

  const onUploadClick = () => {
    fileInputRef.current.click();
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        setIsLoading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("expirationPeriod", expirationPeriod); // Pass expirationPeriod to backend

        try {
          const response = await uploadFile(data);
          console.log("Upload response:", response);

          if (response && response.path) {
            setResult(response.path);
          } else {
            console.error("Upload failed or invalid response format.");
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getImage();
  }, [file, expirationPeriod]);

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  return (
    <>
      <Navbar />
      <AuthComponent />

      {showNotification && (
        <div className="notification">
          <p>Welcome to Filespire!</p>
          <button className="close-btn" onClick={closeNotification}>✖</button>
        </div>
      )}

      <div className='container'>
        <img src={logo} alt="Logo" />
        <div className='wrapper'>
          <h1 className="mail-btn">Filespire</h1>
          <h3 className="mail-btn">Upload and share the download link</h3>
          <br />
          <button onClick={onUploadClick}>Upload</button>

          <input
            type='file'
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <br />

          {/* Add expiration period input */}
          <div>
            <label htmlFor="expirationPeriod">Expiration Period (in hours):</label>
            <input
              type="number"
              id="expirationPeriod"
              min="1"
              value={expirationPeriod}
              onChange={(e) => setExpirationPeriod(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="loading">
              <span className="mail-btn">Loading...</span>
              <div className="spinner"></div>
            </div>
          ) : result && (
            <>
              <a href={result} target="_blank" rel="noopener noreferrer">{result}</a>
              <button className="navbar-btn" onClick={copyToClipboard}>Copy Link</button>
              <br />
              <a href='./short'><button className="navbar-btn">Shorten Link</button></a>
            </>
          )}
          <br />
          <button className="recommended-btn">
            <span className="recommended-label">Recommended</span>
            <a className="mail-btn" href='https://app.filetranfer.tech/'>Send File via Email</a>
          </button>
        </div>
      </div>

      <div className='xyz'>
        <header className="features-header">
          <h1>Why Choose Filespire?</h1>
          <p>Secure, reliable, and easy-to-use file-sharing platform.</p>
        </header>
        <section className="features-grid">
          <div className="feature-item"><div className="icon">🔒</div><h2>QR code for links</h2><p>Easy sharing.</p></div>
          <div className="feature-item"><div className="icon">🔗</div><h2>Link Generation</h2><p>Get a sharable link as soon as you upload a file.</p></div>
          <div className="feature-item"><div className="icon">📧</div><h2>Email based file sharing</h2><p>Send file links directly to your email.</p></div>
          <div className="feature-item"><div className="icon">🛡️</div><h2>User Authentication</h2><p>Securely log in with Firebase.</p></div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default App;
