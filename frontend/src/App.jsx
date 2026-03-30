import { useState } from 'react';

// --- Sub-Component: The Header ---
// Keeps the main App clean and readable.
const Header = () => (
  <header className="text-center mb-8">
    <h1 className="text-4xl font-extrabold text-blue-600 mb-2">
      Resumify AI
    </h1>
    <p className="text-gray-500 text-lg">
      Get shortlisted. Optimize your resume with AI.
    </p>
  </header>
);

// --- Sub-Component: File Upload Box ---
// Logic for handling the file selection.
const UploadBox = ({ onFileSelect, selectedFile }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-dashed border-blue-100 hover:border-blue-400 transition-all">
      <div className="flex flex-col items-center">
        <label className="group cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg active:scale-95">
          <span>{selectedFile ? 'Change PDF' : 'Upload Resume'}</span>
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf" 
            onChange={(e) => onFileSelect(e.target.files[0])} 
          />
        </label>
        
        {selectedFile && (
          <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-1 rounded-full animate-pulse">
            <span className="text-sm font-medium">📄 {selectedFile.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async () => {
    setLoading(true);
    // TODO: This is where we will call our FastAPI later!
    console.log("Sending to FastAPI...", file.name);
    
    // Fake delay to show how 'humanized' apps handle waiting
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Header />

      <div className="w-full max-w-md">
        <UploadBox onFileSelect={setFile} selectedFile={file} />

        <button 
          onClick={handleAnalysis}
          disabled={!file || loading}
          className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg 
                     hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed 
                     transition-all shadow-md active:translate-y-1"
        >
          {loading ? 'AI is thinking...' : 'Analyse Resume'}
        </button>
      </div>

      <footer className="mt-16 opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-xs font-mono text-slate-500">
          v1.0.0 // REACT_FASTAPI_GEMINI_STACK
        </p>
      </footer>
    </main>
  );
}



export default App;