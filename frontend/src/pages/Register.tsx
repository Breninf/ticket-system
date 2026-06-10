import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Dispara a criação real do perfil na tabela User do PostgreSQL!
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erro ao criar conta.');
        return;
      }

      alert('Conta criada com sucesso no banco PostgreSQL! Redirecionando...');
      navigate('/login'); 
    } catch (err) {
      setError('Erro ao conectar com o servidor do Kubernetes.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f6f9',
      fontFamily: 'sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ marginBottom: '24px', color: '#333', textAlign: 'center' }}>Criar Nova Conta</h2>
        
        {error && (
          <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Nome Completo</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: test@example.com"
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Senha</label>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha segura"
              style={{ width: '100%', padding: '12px', paddingRight: '60px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              id="toggle-password-register"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#007bff', fontWeight: 'bold', fontSize: '12px' }}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        <button type="submit" style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '16px'
        }}>
          Cadastrar
        </button>

        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#666' }}>Já tem uma conta? </span>
          <Link to="/login" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>
            Faça login aqui
          </Link>
        </div>
      </form>
    </div>
  );
}
