export function login(email, password) {

  if (email === 'admin@test.com' && password === '123456') {
    return {
      success: true,
      message: 'Login successful'
    };
  }

  return {
    success: false,
    message: 'Invalid credentials'
  };
}