import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";

//Função de registro
// 1. AVISO PRÉVIO: Avisou que a função é especial
export async function register(name, email, password) {
  //2. prisma vai no pg e verifica se email já existe
  const userExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  
  if (userExists) {
    return {
      success: false,
      message: 'User already exists'
    };
  }
  //3. faz criptografia na senha
  const hashedPassword = await bcrypt.hash(password, 10);
  //4. Cria usuário no banco
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });
  //5. Retorno pro cliente
  return {
    success: true,
    message: 'User created successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}

//Função de login
export async function login(email, password) {
  //Verifica se email existe no banco
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
 //retorno se não existir (caso retone vazio)
  if (!user) {
    return {
      success: false,
      message: 'Invalid credentials'
    };
  }
  //verifica se a senha bate com o hash
  const validPassword = await bcrypt.compare(
    password,
    user.password
  );
 //retorno se não bater
  if (!validPassword) {
    return {
      success: false,
      message: 'Invalid credentials'
    };
  }
  //criação do token de acesso
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d'
    }
  );
  //retorno se tudo der certo
  return {
    success: true,
    token
  };
}