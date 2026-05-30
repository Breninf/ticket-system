import { login } from '../services/auth.service.js';

export function loginController(req, res) {

  const { email, password } = req.body; //recebemos esse json e pegamos as chaves email e password

  // validação básica
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const result = login(email, password); //enviamos os dados json para a função login do service

  if (!result.success) {
    return res.status(401).json(result); // devolvemos uma resposta http com base no resultado da função anterior
  }

  return res.status(200).json(result);
}
