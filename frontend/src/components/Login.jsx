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
      // Get the Secure Token to send to Django
      const token = await userCredential.user.getIdToken();
      onLoginSuccess(token); 
    } catch (error) {
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
          type="email" placeholder="Email" 
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          {isRegistering ? "Sign Up" : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500 cursor-pointer" onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
      </p>
    </div>
  );
};

export default Login;