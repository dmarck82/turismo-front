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
      <h2>Bem vindo</h2>
      <p>Utilize essa página para realizar o seu login. Para cadastro utilize a aba pessoas.</p>
      <input type="text" placeholder="Usuário" onChange={(e) => setUsername(e.target.value)} />
      <br></br>
      <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
      <br></br>
      <button onClick={handleLogin}>Login</button>
      <button variant="primary" >Cadastrar</button>
    </div>
  );
};

export default Auth;
