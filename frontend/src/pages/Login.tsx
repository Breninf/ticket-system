import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('HANDLE SUBMIT EXECUTOU');

    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      console.log('VOU CHAMAR O FETCH');

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      console.log('FETCH RETORNOU');
      console.log('STATUS:', response.status);

      const data = await response.json();

      console.log(JSON.stringify(data, null, 2));

      if (!response.ok) {
        setError(data.message || 'E-mail ou senha incorretos.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', 'Usuário');

      console.log('LOGIN REALIZADO COM SUCESSO');

      navigate('/dashboard');
    } catch (err) {
      console.error('ERRO COMPLETO:', err);

      setError('Erro ao conectar com o servidor do Kubernetes.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f6f9',
        fontFamily: 'sans-serif'
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <h2
          style={{
            marginBottom: '24px',
            color: '#333',
            textAlign: 'center'
          }}
        >
          Acessar Sistema
        </h2>

        {error && (
          <div
            style={{
              color: '#721c24',
              backgroundColor: '#f8d7da',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: '8px',
              color: '#666',
              fontWeight: 'bold'
            }}
          >
            E-mail
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail cadastrado"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '8px',
              color: '#666',
              fontWeight: 'bold'
            }}
          >
            Senha
          </label>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha secreta"
              style={{
                width: '100%',
                padding: '12px',
                paddingRight: '60px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />

            <button
              type="button"
              id="toggle-password-login"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#007bff',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          Entrar
        </button>

        <div
          style={{
            textAlign: 'center',
            fontSize: '14px'
          }}
        >
          <span style={{ color: '#666' }}>
            Não tem uma conta?
          </span>{' '}

          <Link
            to="/register"
            style={{
              color: '#007bff',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}
          >
            Cadastre-se aqui
          </Link>
        </div>
      </form>
    </div>
  );
}

