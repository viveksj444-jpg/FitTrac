import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('loading'); // 'loading', 'online', 'offline'
  const [dbStatus, setDbStatus] = useState('unknown'); // 'connected', 'disconnected', 'connecting', 'unknown'
  const [serverInfo, setServerInfo] = useState(null);

  const checkHealth = async () => {
    setBackendStatus('loading');
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        const data = await response.json();
        setBackendStatus('online');
        setDbStatus(data.database || 'unknown');
        setServerInfo(data);
      } else {
        setBackendStatus('offline');
        setDbStatus('unknown');
        setServerInfo(null);
      }
    } catch (error) {
      setBackendStatus('offline');
      setDbStatus('unknown');
      setServerInfo(null);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  // Directory Tree Data
  const treeNodes = [
    { name: 'calorie-tracker/', type: 'dir', indent: 0, comment: 'Project Root' },
    { name: '.gitignore', type: 'file', indent: 20, comment: 'Global Git Ignore' },
    { name: 'README.md', type: 'file', indent: 20, comment: 'Project documentation' },
    { name: 'frontend/', type: 'dir', indent: 20, comment: 'React client app' },
    { name: 'src/', type: 'dir', indent: 40, comment: 'Source code' },
    { name: 'components/', type: 'dir', indent: 60, comment: 'Reusable UI elements' },
    { name: 'pages/', type: 'dir', indent: 60, comment: 'Main app pages' },
    { name: 'context/', type: 'dir', indent: 60, comment: 'Global states' },
    { name: 'hooks/', type: 'dir', indent: 60, comment: 'Custom hooks' },
    { name: 'services/', type: 'dir', indent: 60, comment: 'API integrations' },
    { name: 'utils/', type: 'dir', indent: 60, comment: 'Helper functions' },
    { name: 'App.jsx', type: 'file', indent: 60, comment: 'Root component' },
    { name: 'index.css', type: 'file', indent: 60, comment: 'Global styles' },
    { name: 'backend/', type: 'dir', indent: 20, comment: 'Express API server' },
    { name: 'config/', type: 'dir', indent: 40, comment: 'Configuration settings' },
    { name: 'db.js', type: 'file', indent: 60, comment: 'Mongoose connector' },
    { name: 'controllers/', type: 'dir', indent: 40, comment: 'API request controllers' },
    { name: 'routes/', type: 'dir', indent: 40, comment: 'Express routing rules' },
    { name: 'models/', type: 'dir', indent: 40, comment: 'Mongoose schemas' },
    { name: 'middleware/', type: 'dir', indent: 40, comment: 'Global middlewares' },
    { name: 'server.js', type: 'file', indent: 40, comment: 'API Server entry point' },
    { name: '.env', type: 'file', indent: 40, comment: 'Environment secrets' },
    { name: '.env.example', type: 'file', indent: 40, comment: 'Env configuration template' },
    { name: 'package.json', type: 'file', indent: 40, comment: 'Backend packages config' }
  ];

  return (
    <div className="dashboard-container">
      <header>
        <span className="logo-badge">Day 1 Complete</span>
        <h1>Calorie Tracker App</h1>
        <p>Your full-stack architecture is successfully initialized and ready for development.</p>
      </header>

      <main className="dashboard-grid">
        {/* Status Card */}
        <section className="dashboard-card">
          <h2 className="card-title">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            System Connections
          </h2>

          <div className="status-indicator">
            {/* Frontend Status */}
            <div className="status-row">
              <div className="status-label">
                <span className="status-name">Vite Dev Server</span>
                <span className="status-desc">Port: 5173</span>
              </div>
              <span className="status-badge badge-online">
                <span className="status-dot dot-online"></span>
                Running
              </span>
            </div>

            {/* Backend Status */}
            <div className="status-row">
              <div className="status-label">
                <span className="status-name">Express API Server</span>
                <span className="status-desc">Port: 5000</span>
              </div>
              {backendStatus === 'loading' ? (
                <span className="status-badge badge-warning">
                  <span className="status-dot dot-warning"></span>
                  Checking...
                </span>
              ) : backendStatus === 'online' ? (
                <span className="status-badge badge-online">
                  <span className="status-dot dot-online"></span>
                  Online
                </span>
              ) : (
                <span className="status-badge badge-offline">
                  <span className="status-dot dot-offline"></span>
                  Offline
                </span>
              )}
            </div>

            {/* DB Status */}
            <div className="status-row">
              <div className="status-label">
                <span className="status-name">MongoDB Database</span>
                <span className="status-desc">Atlas Connection</span>
              </div>
              {dbStatus === 'connected' ? (
                <span className="status-badge badge-online">
                  <span className="status-dot dot-online"></span>
                  Connected
                </span>
              ) : dbStatus === 'connecting' ? (
                <span className="status-badge badge-warning">
                  <span className="status-dot dot-warning"></span>
                  Connecting
                </span>
              ) : dbStatus === 'disconnected' ? (
                <span className="status-badge badge-offline">
                  <span className="status-dot dot-offline"></span>
                  Disconnected (Check .env URI)
                </span>
              ) : (
                <span className="status-badge badge-offline">
                  <span className="status-dot dot-offline"></span>
                  Offline (Backend Offline)
                </span>
              )}
            </div>

            <button id="btn-refresh-connections" className="action-btn" onClick={checkHealth}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
              </svg>
              Refresh Connections
            </button>
          </div>
        </section>

        {/* Directory Tree Card */}
        <section className="dashboard-card">
          <h2 className="card-title">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Project Folder Structure
          </h2>

          <div className="folder-tree">
            {treeNodes.map((node, index) => (
              <div key={index} className="tree-node" style={{ '--indent': `${node.indent}px` }}>
                {node.type === 'dir' ? (
                  <span className="node-icon-dir">📁</span>
                ) : (
                  <span className="node-icon-file">📄</span>
                )}
                <span className={node.type === 'dir' ? 'node-name-dir' : 'node-name-file'}>
                  {node.name}
                </span>
                <span className="node-comment"># {node.comment}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Guide / Next Steps */}
        <section className="dashboard-card guide-section">
          <h2 className="card-title">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Quick-Start Developer Guide
          </h2>

          <div className="commands-container">
            <div className="command-group">
              <h3>Running Locally</h3>
              
              <div className="command-block">
                <span className="command-desc">Start API backend (run inside backend/):</span>
                <span className="command-code">npm run dev</span>
              </div>

              <div className="command-block">
                <span className="command-desc">Start client (run inside frontend/):</span>
                <span className="command-code">npm run dev</span>
              </div>
            </div>

            <div className="command-group">
              <h3>Pushing to GitHub</h3>

              <div className="command-block">
                <span className="command-desc">Initialize & Add files:</span>
                <span className="command-code">git add . && git commit -m "feat: init setup"</span>
              </div>

              <div className="command-block">
                <span className="command-desc">Link Remote & Push (replace username):</span>
                <span className="command-code">git remote add origin https://github.com/USER/calorie-tracker.git</span>
                <span className="command-code">git push -u origin main</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>Calorie Tracker Project Boilerplate © {new Date().getFullYear()} — Designed with Best Practices</p>
      </footer>
    </div>
  );
}

export default App;
