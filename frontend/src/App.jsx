import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const BACKEND_URL = 'http://localhost:5002';

export default function App() {
  const [view, setView] = useState('hub'); // 'hub', 'control', 'review', 'export'
  const [topic, setTopic] = useState('First Dhyana Shloka of Lalita Sahasranama');
  const [platform, setPlatform] = useState('Instagram Carousel (3 Slides)');
  const [audience, setAudience] = useState('Devotees & Spiritual Seekers');
  const [tone, setTone] = useState('Devotional & Inspiring');
  
  const [missionId, setMissionId] = useState('');
  const [status, setStatus] = useState('Waiting');
  const [progress, setProgress] = useState(0);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [logs, setLogs] = useState([]);
  const [agentOutputs, setAgentOutputs] = useState({}); // Stores output text/JSON from each agent
  const [selectedOutput, setSelectedOutput] = useState(null); // Active output shown in Modal
  
  // Results from generation
  const [slides, setSlides] = useState([]);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');

  const socketRef = useRef(null);
  const logEndRef = useRef(null);

  const agentsList = [
    'Research Agent',
    'Narrative Architect',
    'Carousel Planner',
    'Carousel Writer',
    'Creative Director',
    'Image Prompt Director',
    'Layout Designer'
  ];

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Handle launch mission
  const handleLaunch = async (e) => {
    e.preventDefault();
    console.log("clicked on launch");
    setLogs([]);
    setProgress(0);
    setCurrentAgentIndex(-1);
    setStatus('Launching');
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/missions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, audience, tone })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMissionId(data.missionId);
        setView('control');
        
        // Connect and join WebSocket room
        socketRef.current = io(BACKEND_URL);
        socketRef.current.emit('join-mission', data.missionId);
        console.log("the client is connected and mission has been joined");
        
        // Load initial state if joining an active/completed mission
        socketRef.current.on('mission-history', (history) => {
          setLogs(history.logs);
          setProgress(history.progress);
          setStatus(history.status);
          setCurrentAgentIndex(history.currentAgentIndex);
          if (history.agentOutputs) {
            setAgentOutputs(history.agentOutputs);
          }
          if (history.status === 'Completed') {
            setSlides(history.slides);
            setCaption(history.caption);
            setHashtags(history.hashtags);
          }
        });

        console.log("starting the agent");
        socketRef.current.on('agent-start', ({ agentIndex }) => {
          setCurrentAgentIndex(agentIndex);
          console.log(agentIndex);
          setStatus('Running');
        });

        socketRef.current.on('agent-complete', ({ agentIndex, output }) => {
          setAgentOutputs((prev) => ({ ...prev, [agentIndex]: output }));
        });

        socketRef.current.on('mission-log', ({ log, progress }) => {
          console.log("setting up the log");
          setLogs((prev) => [...prev, log]);
          setProgress(progress);
        });

        socketRef.current.on('mission-complete', (finalData) => {
          setSlides(finalData.slides);
          setCaption(finalData.caption);
          setHashtags(finalData.hashtags);
          setStatus('Completed');
          setProgress(100);
        });
      } else {
        alert(data.error || 'Failed to launch mission');
        setStatus('Failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend server');
      setStatus('Failed');
    }
  };

  const handleEditSlide = (index, field, value) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    setSlides(updated);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 sidebar bg-dark text-white d-flex flex-column justify-content-between">
          <div>
            <div className="sidebar-brand text-primary">
              <span style={{ fontSize: '1.6rem' }}>🕉️</span> Shruti Sadhana
            </div>
            <nav className="nav flex-column">
              <a href="#" className={`nav-link-custom ${view === 'hub' ? 'active' : ''}`} onClick={() => setView('hub')}>
                Mission Hub
              </a>
              <a href="#" className={`nav-link-custom ${view === 'control' ? 'active' : ''}`} onClick={() => { if(missionId) setView('control') }}>
                AI Control Room
              </a>
              <a href="#" className={`nav-link-custom ${view === 'review' ? 'active' : ''}`} onClick={() => { if(slides.length) setView('review') }}>
                Review Studio
              </a>
              <a href="#" className={`nav-link-custom ${view === 'export' ? 'active' : ''}`} onClick={() => { if(slides.length) setView('export') }}>
                Exports Center
              </a>
            </nav>
          </div>
          <div className="text-secondary small mt-auto">
            Powering Devotion. <br /> Powered by AI.
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9 col-lg-10 p-5" style={{ minHeight: '100vh', background: '#0a0914' }}>
          
          {/* VIEW: Mission Hub */}
          {view === 'hub' && (
            <div>
              <h2 className="mb-4 text-white">Mission Hub</h2>
              <p className="text-secondary mb-5">Create and launch a new AI content creation mission.</p>
              
              <div className="row">
                <div className="col-lg-7">
                  <div className="glass-panel text-white">
                    <h5 className="mb-4 text-primary">✨ Mission Input</h5>
                    <form onSubmit={handleLaunch}>
                      <div className="mb-3">
                        <label className="form-label text-secondary">Topic</label>
                        <input 
                          type="text" 
                          className="form-control form-control-custom"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-secondary">Platform</label>
                        <select className="form-select form-control-custom" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                          <option>Instagram Carousel (3 Slides)</option>
                          <option>Facebook Post</option>
                          <option>YouTube Shorts</option>
                          <option>LinkedIn Post</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-secondary">Audience</label>
                        <select className="form-select form-control-custom" value={audience} onChange={(e) => setAudience(e.target.value)}>
                          <option>Devotees & Spiritual Seekers</option>
                          <option>General Public</option>
                          <option>Youth & Beginners</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-secondary">Tone</label>
                        <select className="form-select form-control-custom" value={tone} onChange={(e) => setTone(e.target.value)}>
                          <option>Devotional & Inspiring</option>
                          <option>Educational & Philosophical</option>
                          <option>Calm & Reflective</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary-custom w-100 mt-3 py-2">
                        🚀 Launch Mission
                      </button>
                    </form>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="glass-panel text-white h-100">
                    <h5 className="mb-4 text-primary">📋 Mission Preview</h5>
                    <ul className="list-unstyled text-secondary">
                      <li className="mb-3"><strong className="text-white">Topic:</strong> {topic}</li>
                      <li className="mb-3"><strong className="text-white">Platform:</strong> {platform}</li>
                      <li className="mb-3"><strong className="text-white">Audience:</strong> {audience}</li>
                      <li className="mb-3"><strong className="text-white">Tone:</strong> {tone}</li>
                      <li className="mb-3"><strong className="text-white">Estimated Time:</strong> ~2-3 minutes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: AI Control Room */}
          {view === 'control' && (
            <div>
              <h2 className="mb-4 text-white">AI Control Room</h2>
              <p className="text-secondary mb-4">Your AI agents are working together to create amazing content.</p>

              <div className="glass-panel text-white mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-0 text-primary">Mission Status: {status}</h5>
                    <span className="text-secondary small">ID: {missionId}</span>
                  </div>
                  <h4 className="text-success mb-0">{progress}%</h4>
                </div>
                <div className="progress bg-dark mb-4" style={{ height: '8px' }}>
                  <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="row g-3 mb-4">
                  {agentsList.map((agentName, idx) => {
                    const isCompleted = idx < currentAgentIndex || (status === 'Completed' && idx < 4);
                    const isActive = currentAgentIndex === idx && status === 'Running';
                    const hasOutput = agentOutputs[idx] !== undefined;

                    return (
                      <div key={idx} className="col-md-3">
                        <div className="card h-100 border-0 p-3" style={{ 
                          background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                          border: isActive ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                          borderRadius: '12px'
                        }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>Agent {idx + 1}</span>
                            <span className="small" style={{ 
                              color: isCompleted ? 'var(--success-color)' : isActive ? 'var(--warning-color)' : 'var(--text-secondary)',
                              fontSize: '0.75rem' 
                            }}>
                              {isCompleted ? '● Completed' : isActive ? '● Running' : '○ Waiting'}
                            </span>
                          </div>
                          <h6 className="text-white mb-2" style={{ fontSize: '0.9rem' }}>{agentName}</h6>
                          
                          {hasOutput ? (
                            <button 
                              type="button" 
                              className="btn btn-sm btn-outline-primary mt-auto w-100 py-1"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => setSelectedOutput({ name: agentName, content: agentOutputs[idx] })}
                            >
                              👁️ View Output
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              className="btn btn-sm btn-outline-secondary mt-auto w-100 py-1" 
                              style={{ fontSize: '0.75rem' }} 
                              disabled
                            >
                              Waiting...
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <h6 className="text-secondary mb-2">Live Agent Logs</h6>
                <div className="console-panel">
                  {logs.map((log, idx) => (
                    <div key={idx} className="mb-1">{log}</div>
                  ))}
                  {status === 'Running' && <div className="text-secondary">_ (running...)</div>}
                  <div ref={logEndRef} />
                </div>

                {status === 'Completed' && (
                  <div className="mt-4 text-center">
                    <button className="btn btn-primary-custom px-5 py-2" onClick={() => setView('review')}>
                      Go to Review Studio ➡️
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: Review Studio */}
          {view === 'review' && (
            <div>
              <h2 className="mb-4 text-white">Review Studio</h2>
              <p className="text-secondary mb-5">Review and refine your AI-generated content before exporting.</p>

              <div className="row">
                <div className="col-lg-8">
                  <div className="glass-panel text-white mb-4">
                    <h5 className="mb-4 text-primary">Generated Slides</h5>
                    {slides.map((slide, idx) => (
                      <div key={idx} className="mb-4 p-3 rounded" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h6 className="text-primary mb-3">Slide {idx + 1}</h6>
                        <div className="mb-3">
                          <label className="small text-secondary">Title</label>
                          <input 
                            type="text" 
                            className="form-control form-control-custom"
                            value={slide.title}
                            onChange={(e) => handleEditSlide(idx, 'title', e.target.value)}
                          />
                        </div>
                        <div className="mb-0">
                          <label className="small text-secondary">Body Text</label>
                          <textarea 
                            rows="2" 
                            className="form-control form-control-custom"
                            value={slide.body}
                            onChange={(e) => handleEditSlide(idx, 'body', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="glass-panel text-white mb-4">
                    <h5 className="mb-3 text-primary">Caption & Hashtags</h5>
                    <div className="mb-3">
                      <label className="small text-secondary">Caption</label>
                      <textarea 
                        rows="6" 
                        className="form-control form-control-custom"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="small text-secondary">Hashtags</label>
                      <textarea 
                        rows="3" 
                        className="form-control form-control-custom"
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                      />
                    </div>
                    <button className="btn btn-primary-custom w-100 py-2" onClick={() => setView('export')}>
                      Approve & Export Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Export Center */}
          {view === 'export' && (
            <div className="text-center">
              <h2 className="mb-4 text-white">Export Center</h2>
              <p className="text-secondary mb-5">Choose format and export your AI generated content.</p>

              <div className="glass-panel text-white max-w-md mx-auto p-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <span style={{ fontSize: '4rem' }}>📦</span>
                <h4 className="mt-4 text-primary">Ready to Download</h4>
                <p className="text-secondary mt-2">All slide graphics, captions, and tags have been assembled successfully.</p>
                
                <div className="border border-secondary border-opacity-25 rounded p-3 my-4 bg-black bg-opacity-20 text-start">
                  <div className="mb-2"><strong className="text-white">Slides:</strong> 3 Images (PNG Format)</div>
                  <div className="mb-2"><strong className="text-white">Metadata:</strong> caption.txt + hashtags.txt</div>
                  <div><strong className="text-white">Est. Size:</strong> ~2.4 MB</div>
                </div>

                <button 
                  className="btn btn-primary-custom px-5 py-3 fs-5"
                  onClick={() => alert('ZIP export generated successfully!')}
                >
                  📥 Export Now (ZIP)
                </button>
              </div>
            </div>
          )}

          {/* Modal for viewing agent output */}
          {selectedOutput && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1050 }} tabIndex="-1">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content text-white" style={{ background: '#11101a', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                  <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title text-primary">📄 {selectedOutput.name} Output</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedOutput(null)}></button>
                  </div>
                  <div className="modal-body">
                    <pre className="p-3 rounded text-light" style={{ 
                      background: 'rgba(0, 0, 0, 0.3)', 
                      maxHeight: '400px', 
                      overflowY: 'auto', 
                      whiteSpace: 'pre-wrap', 
                      fontFamily: 'Courier New, monospace',
                      fontSize: '0.9rem'
                    }}>
                      {typeof selectedOutput.content === 'object' 
                        ? JSON.stringify(selectedOutput.content, null, 2) 
                        : selectedOutput.content}
                    </pre>
                  </div>
                  <div className="modal-footer border-0 pt-0">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedOutput(null)}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
