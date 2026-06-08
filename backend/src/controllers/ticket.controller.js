import { createTicket, getTicketsByUser, getTicketById, updateTicket, deleteTicket } from '../services/ticket.service.js';
//controller de criação do ticket
export async function create(req, res) {
  const { title, description } = req.body;
  const userId = req.user.id; //  Injetado de forma segura pelo seu authMiddleware!

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required' });
  }

  const result = await createTicket(title, description, userId);
  return res.status(201).json(result);
}
//con.Busca de todos os tickets de um único usuário
export async function findAll(req, res) {
  const userId = req.user.id; // Só traz os tickets do dono do token
  const result = await getTicketsByUser(userId);
  return res.status(200).json(result);
}

// Buscar um único ticket por ID (Com trava de segurança)
export async function findOne(req, res) {
  const ticketId = parseInt(req.params.id);
  const userId = req.user.id;

  const ticket = await getTicketById(ticketId);

  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found' });
  }

  // TRAVA DE SEGURANÇA: O ticket pertence ao usuário logado?
  if (ticket.userId !== userId) {
    return res.status(403).json({ success: false, message: 'Access denied: You do not own this ticket' });
  }

  return res.status(200).json({ success: true, ticket });
}

// 4. NOVA: Editar ticket (Com trava de segurança)
export async function update(req, res) {
  const ticketId = parseInt(req.params.id);
  const userId = req.user.id;
  const { title, description, status } = req.body;

  const ticket = await getTicketById(ticketId);

  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found' });
  }

  if (ticket.userId !== userId) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  // Passa apenas os campos que vieram no body
  const result = await updateTicket(ticketId, { title, description, status });
  return res.status(200).json(result);
}

// Deletar ticket (Com trava de segurança)
export async function remove(req, res) {
  const ticketId = parseInt(req.params.id);
  const userId = req.user.id;

  const ticket = await getTicketById(ticketId);

  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found' });
  }

  if (ticket.userId !== userId) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const result = await deleteTicket(ticketId);
  return res.status(200).json(result);
}
