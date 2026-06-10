import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'OPEN' | 'CLOSED';
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [userName] = useState(() => {
    return localStorage.getItem('userName') || 'Usuário';
  });

  const [loading] = useState(() => {
    const token = localStorage.getItem('token');
    return !token;
  });

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Expulsa usuário se não tiver token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Acesso negado! Por favor, faça login para acessar o painel.');
      navigate('/login');
    }
  }, [navigate]);

  // Buscar tickets
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3000/tickets', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        console.log("RESPOSTA BACKEND:", data);

        // ✅ CORREÇÃO PRINCIPAL: Blindagem universal contra objetos ou arrays puros
        if (Array.isArray(data)) {
          setTickets(data);
        } else if (data && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        } else {
          setTickets([]);
        }
      })
      .catch(() => {
        console.log('Erro ao carregar tickets reais. Usando lista vazia.');
        setTickets([]);
      });
  }, []);

  // Criar ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description) {
      setError('Título e descrição são obrigatórios para abrir um chamado.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erro ao salvar o chamado.');
        return;
      }

      const newTicket: Ticket = {
        id: data.id || Date.now(),
        title: data.title || title,
        description: data.description || description,
        status: data.status || 'OPEN'
      };

      // ✅ MELHORIA: Atualização segura usando o estado anterior (prev)
      setTickets(prev => [newTicket, ...prev]);

      setTitle('');
      setDescription('');
      alert('Ticket aberto com sucesso e gravado no banco PostgreSQL do Kubernetes!');
    } catch (err) {
      setError('Erro ao conectar com o servidor para salvar ticket.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    alert('Efetuando logout do sistema...');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        backgroundColor: '#f4f6f9',
        color: '#666'
      }}>
        Verificando credenciais...
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
            Olá, <span style={{ color: '#007bff' }}>{userName}</span>! 👋
          </h1>

          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Sair
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>

          {/* FORM */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            height: 'fit-content'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#007bff' }}>
              Abrir Novo Ticket
            </h3>

            {error && (
              <div style={{
                color: '#721c24',
                backgroundColor: '#f8d7da',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '13px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleCreateTicket}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                  Título
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Enviar Chamado
              </button>
            </form>
          </div>

          {/* LISTA */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>
              Seus Chamados
            </h3>

            {tickets.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>
                Nenhum ticket encontrado.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tickets.map(ticket => (
                  <div key={ticket.id} style={{
                    padding: '16px',
                    border: '1px solid #e3e6f0',
                    borderRadius: '6px',
                    backgroundColor: '#f8f9fc'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#4e73df' }}>
                        {ticket.title}
                      </strong>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: '#fff',
                        fontWeight: 'bold',
                        backgroundColor: ticket.status === 'OPEN' ? '#f6c23e' : '#1cc88a'
                      }}>
                        {ticket.status}
                      </span>
                    </div>

                    <p style={{ margin: '8px 0', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                      {ticket.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
