import { useState, useEffect } from 'react';
import { auth } from './firebase'; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from './components/Login'; 
import History from './components/History';
import { downloadPDF } from './utils/exportPDF'; // Ensure you created this file
import './App.css';
import Markdown from 'react-markdown';


// This checks if there is a 'VITE_API_URL' environment variable.
// If not (like on your local machine), it defaults to localhost.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
// --- Sub-Component: Navbar ---
const Navbar = ({ user, onLoginClick }) => (
  <nav className="fixed top-0 w-full flex justify-between items-center px-6 md:px-10 py-5 bg-white/70 backdrop-blur-md z-50 border-b border-slate-100">
    <div className="text-2xl font-black text-blue-600 tracking-tighter">
      Resumify<span className="text-slate-800">.ai</span>
    </div>
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <span className="hidden md:block text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {user.email}
          </span>
          <button 
            onClick={() => {
              signOut(auth);
              localStorage.removeItem('token');
            }}
            className="bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-700 transition active:scale-95"
          >
            Logout
          </button>
        </>
      ) : (
        <button 
          onClick={onLoginClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition active:scale-95"
        >
          Sign In
        </button>
      )}
    </div>
  </nav>
);

// --- Sub-Component: File Upload Box ---
const UploadBox = ({ onFileSelect, selectedFile, onClear }) => (
  <div className={`bg-white p-10 rounded-3xl shadow-2xl border-2 border-dashed transition-all group ${selectedFile ? 'border-blue-400 bg-blue-50/30' : 'border-blue-100 hover:border-blue-300'}`}>
    <div className="flex flex-col items-center">
      <div className={`mb-4 text-4xl ${selectedFile ? 'animate-bounce' : 'group-hover:scale-110 transition'}`}>
        {selectedFile ? '✅' : '📄'}
      </div>
      
      {!selectedFile ? (
        <label className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md active:scale-95">
          <span>Select PDF Resume</span>
          <input 
            type="file" className="hidden" accept=".pdf" 
            onChange={(e) => onFileSelect(e.target.files[0])} 
          />
        </label>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-sm text-blue-600 font-bold mb-3 truncate max-w-[200px]">
            {selectedFile.name}
          </p>
          <button 
            onClick={onClear}
            className="text-xs font-bold text-red-400 hover:text-red-600 underline uppercase tracking-tighter"
          >
            Remove File
          </button>
        </div>
      )}
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setShowAuth(false);
        const token = await currentUser.getIdToken();
        localStorage.setItem('token', token);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAnalysis = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    if (!file) return;

    setLoading(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('resume', file); 

    try {
      const token = await user.getIdToken(true);
      const response = await fetch(`${API_BASE_URL}/analyse/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 403) throw new Error(result.error || "AI Quota exceeded.");
        throw new Error("Server error occurred.");
      }

      setAnalysisResult(result);
      setRefreshHistory(prev => prev + 1);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-6 pt-32">
      <Navbar user={user} onLoginClick={() => setShowAuth(true)} />

      {showAuth ? (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
          <Login onLoginSuccess={() => setShowAuth(false)} /> 
          <button onClick={() => setShowAuth(false)} className="w-full mt-6 text-slate-400 hover:text-slate-600 text-sm font-medium">
            ← Back to Home
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl text-center">
          <header className="mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
              Stop guessing. <br />
              <span className="text-blue-600">Start landing.</span>
            </h1>
          </header>

          <div className="max-w-md mx-auto">
            <UploadBox onFileSelect={setFile} selectedFile={file} onClear={() => { setFile(null); setAnalysisResult(null); }} />
            
            <button 
              onClick={handleAnalysis}
              disabled={!file || loading}
              className={`w-full mt-8 py-5 rounded-2xl font-black text-xl transition-all shadow-xl active:scale-95 
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  </div>
                  AI is thinking...
                </span>
              ) : 'Analyse My Resume'}
            </button>
          </div>

          {/* --- ENHANCED LOADING UI --- */}
          {loading && (
            <div className="max-w-2xl mx-auto mt-10 p-10 bg-white rounded-3xl shadow-xl border border-blue-100 animate-pulse text-center">
              <div className="text-5xl mb-4 animate-spin-slow">🔄</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Resume...</h3>
              <p className="text-slate-500 mb-6">Our AI is matching your skills against industry standards.</p>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '45%' }}></div>
              </div>
            </div>
          )}

          {/* --- RESULTS + PDF EXPORT --- */}
          {analysisResult && (
            <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-50 text-left animate-in fade-in zoom-in-95 duration-700">
              <div id="analysis-report">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">🚀 Analysis Report</h3>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black rounded-lg">AI VERIFIED</div>
                </div>
                <div className="prose prose-blue max-w-none text-slate-700 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <Markdown>{analysisResult.analysis}</Markdown>
                </div>
              </div>
              
              <button 
                onClick={() => downloadPDF('analysis-report', `Analysis-${user?.email || 'Guest'}.pdf`)}
                className="w-full mt-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-black hover:bg-blue-50 transition active:scale-95 flex items-center justify-center gap-2"
              >
                📥 Download PDF Report
              </button>
            </div>
          )}

          {user && (
            <div className="w-full mt-20 pt-10 border-t border-slate-200">
               <History key={refreshHistory} />
            </div>
          )}
        </div>
      )}

      <footer className="mt-auto py-10 w-full text-center">
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
          Secure Firebase Auth // Django MySQL // Gemini 3.0 API
        </p>
      </footer>
    </main>
  );
}

export default App;