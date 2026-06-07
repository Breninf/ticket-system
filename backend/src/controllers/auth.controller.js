import { register, login } from '../services/auth.service.js';

// CONTROLLER DE CADASTRO 
export async function registerController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Precisamos do await porque o service vai ao banco de dados
  const result = await register(email, password);

  if (!result.success) {
    return res.status(400).json(result); // 400 Bad Request se o usuário já existir
  }

  return res.status(201).json(result); // 201 Created para sucesso
}

// CONTROLLER DE LOGIN 
export async function loginController(req, res) {
  const { email, password } = req.body; 

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Adicionado o 'await' para esperar o banco de dados verificar as credenciais
  const result = await login(email, password); 

  if (!result.success) {
    return res.status(401).json(result); 
  }

  return res.status(200).json(result);
}

