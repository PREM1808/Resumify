import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;

      // --- TOKEN LOGIC START ---
      // 1. Get the Secure ID Token from the logged-in user
      const token = await user.getIdToken();

      // 2. Save it to localStorage so other components (like History) can access it
      localStorage.setItem('token', token);
      
      console.log("✅ Login successful, token saved to localStorage!");
      // --- TOKEN LOGIC END ---

      // 3. Update the app state
      onLoginSuccess(token); 
    } catch (error) {
      console.error("Auth Error:", error);
      alert("Auth Error: " + error.message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
        {isRegistering ? "Create Account" : "Welcome Back"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          required
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          required
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition transform active:scale-95"
        >
          {isRegistering ? "Sign Up" : "Login"}
        </button>
      </form>
      <p 
        className="mt-6 text-center text-sm text-slate-500 cursor-pointer hover:text-blue-600 transition" 
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
      </p>
    </div>
  );
};

export default Login;