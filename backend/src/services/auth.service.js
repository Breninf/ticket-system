import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const user = {
  email: "admin@test.com",

  passwordHash: bcrypt.hashSync("123456", 10), //cria haash
};

export function login(email, password) {
  if (email !== user.email) {
    //verifica email
    return {
      success: false,
      message: "Invalid credentials",
    };
  }
  // valida senha usando bcrypt. compara se bate com o hash
  const passwordMatch = bcrypt.compareSync(password, user.passwordHash);

  if (!passwordMatch) { //se nao bateu va dar false

    return {
      success: false,
      message: 'Invalid credentials'
    };

  }

  // gera JWT
  const token = jwt.sign(

    { email: user.email },

    process.env.JWT_SECRET, //chave 

    { expiresIn: '1h' } //tempo de expiração do token

  );

   return {

    success: true,

    message: 'Login successful',

    token

  };
}
