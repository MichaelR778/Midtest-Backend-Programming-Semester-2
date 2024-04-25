const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const loginFails = {};
const maxAttempts = 5;
const minutes = 30;
// Durasi blokir dalam milisekon
const duration = minutes * 60 * 1000;

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;
  // Jika belum terdaftar, daftarkan email ke loginFails
  if (!loginFails[email]) {
    loginFails[email] = {
      count: 0,
      time: Date.now(),
    };
  }

  // Email ter blokir
  if (loginFails[email].count >= maxAttempts) {
    // cek apakah sudah 30 menit sejak blokir
    try {
      if (Date.now() - loginFails[email].time < duration) {
        // masih terblokir
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'This email is blocked, try again later'
        );
      } else {
        //reset
        loginFails[email].count = 0;
      }
    } catch (error) {
      return next(error);
    }
  }

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    // Login failed
    if (!loginSuccess) {
      // Inkremen failed login attempts
      loginFails[email].count++;
      loginFails[email].time = Date.now();

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    //login sukses, reset attempt count
    loginFails[email].count = 0;
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
