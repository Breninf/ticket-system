import prisma from '../../config/prisma.js';

// Cria um ticket amarrado ao ID do usuário logado
export async function createTicket(title, description, userId) {
  const ticket = await prisma.ticket.create({
    data: { title, description, userId }
  });
  return { success: true, ticket };
}

// Busca todos os tickets criados por aquele usuário específico
export async function getTicketsByUser(userId) {
  const tickets = await prisma.ticket.findMany({
    where: { userId }
  });
  return { success: true, tickets };
}

// 3. Buscar um ticket específico por ID
export async function getTicketById(id) {
  const ticket = await prisma.ticket.findUnique({
    where: { id }
  });
  return ticket; // Retorna o ticket encontrado ou null
}

// Atualizar o ticket no banco
export async function updateTicket(id, data) {
  const ticket = await prisma.ticket.update({
    where: { id },
    data
  });
  return { success: true, ticket };
}

// Deletar o ticket do banco
export async function deleteTicket(id) {
  await prisma.ticket.delete({
    where: { id }
  });
  return { success: true, message: 'Ticket deleted successfully' };
}