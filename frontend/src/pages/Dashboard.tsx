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

  //  CORRIGIDO: Removido o 'setLoading' que não era usado para limpar o erro do ESLint!
  const [userName] = useState(() => {
    return localStorage.getItem('userName') || 'Usuário';
  });

  const [loading] = useState(() => {
    const token = localStorage.getItem('token');
    return !token; // Começa bloqueado (true) se o token não existir
  });

  //  TRAVA DE SEGURANÇA: Apenas expulsa o usuário se o token não existir
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Acesso negado! Por favor, faça login para acessar o painel.');
      navigate('/login');
    }
  }, [navigate]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 1, title: 'Falha na conexão com o banco', description: 'O container Postgres caiu inesperadamente.', status: 'OPEN' },
    { id: 2, title: 'Erro de CORS no login', description: 'A rota de autenticação está bloqueando a API local.', status: 'CLOSED' }
  ]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description) {
      setError('Título e descrição são obrigatórios para abrir um chamado.');
      return;
    }

    const newTicket: Ticket = {
      id: Date.now(),
      title,
      description,
      status: 'OPEN'
    };

    setTickets([newTicket, ...tickets]);
    setTitle('');
    setDescription('');
    alert('Ticket simulado com sucesso! Na quarta-feira ele será salvo direto no banco PostgreSQL via API.');
  };

  const handleLogout = () => {
    localStorage.clear(); // Limpa as credenciais da sessão
    alert('Efetuando logout do sistema...');
    navigate('/login'); // Redireciona para o login
  };

  //  Bloqueio estrutural de tela enquanto valida o acesso
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', color: '#666' }}>
        Verificando credenciais...
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>Olá, <span style={{ color: '#007bff' }}>{userName}</span>! 👋</h1>
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Sair
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#007bff' }}>Abrir Novo Ticket</h3>
            
            {error && (
              <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleCreateTicket}>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="ticket-title" style={{ display: 'block', marginBottom: '6px', color: '#555', fontWeight: 'bold', fontSize: '14px' }}>Título do Problema</label>
                <input
                  id="ticket-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Queda do servidor de banco"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="ticket-desc" style={{ display: 'block', marginBottom: '6px', color: '#555', fontWeight: 'bold', fontSize: '14px' }}>Descrição do Chamado</label>
                <textarea
                  id="ticket-desc"
                  value={description}
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhe o erro ocorrido..."
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'none' }}
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                Enviar Chamado
              </button>
            </form>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Seus Chamados Cadastrados</h3>
            
            {tickets.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>Nenhum ticket encontrado.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tickets.map(ticket => (
                  <div key={ticket.id} style={{ padding: '16px', border: '1px solid #e3e6f0', borderRadius: '6px', backgroundColor: '#f8f9fc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '16px', color: '#4e73df' }}>{ticket.title}</strong>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#fff',
                        backgroundColor: ticket.status === 'OPEN' ? '#f6c23e' : '#1cc88a'
                      }}>
                        {ticket.status}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{ticket.description}</p>
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