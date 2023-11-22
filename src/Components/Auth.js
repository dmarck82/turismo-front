import React, { useState } from 'react';
import axios from 'axios';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth', { username, password });
      const token = response.data.token;

      // Armazene o token onde você preferir (por exemplo, localStorage)
      localStorage.setItem('token', token);

      // Redirecione ou atualize a página após o login
      window.location.reload();
    } catch (error) {
      console.error('Erro de login:', error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Usuário" onChange={(e) => setUsername(e.target.value)} />
      <br></br>
      <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
      <br></br>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Auth;
