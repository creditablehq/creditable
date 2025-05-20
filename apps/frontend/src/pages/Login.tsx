import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", email, password);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mt-2"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="block">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mt-2"
            required
          />
        </div>
        <button onClick={handleSubmit} type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white">Login</button>
      </form>
    </div>
  );
};

export default Login;
