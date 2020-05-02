const ERROR = {
  INVALID_URL: 'This is not the web page you are looking for.',
  GENERAL_ERROR: 'There was an error on the server. Please try again in a moment.',
  INVALID_SIGNUP: 'We can\'t sign up for unknown reasons',
  INVALID_LOGIN: 'We can\'t login for unknown reasons',
  TOKEN_EXPIRED: 'You should login again because login valid time is expired',
  INVALID_TOKEN: 'There was a error with login. Please login again.',
  INVALID_EMAIL: 'You should input email. Try again.',
  FAIL_CUSTOMER: 'This is a duplicate nickname or email. Or The email and nickname you entered is different from the one you previously entered.',
  FAIL_NEW_CUSTOMER: 'We can\'t create new customer for unknown reasons',
  FAIL_SAVE_AUDIO: 'We can\'t save consulting audio for unknown reasons',
  INVALID_CUSTOMER: 'we can\'t save consulting audio because we can\'t find your customer.',
  NONE_CONSULTINGS: 'we can\'t find your consulting history.',
  NONE_CUSTOMER: 'we can\'t find your selected customer.',
};

module.exports = { ERROR };
