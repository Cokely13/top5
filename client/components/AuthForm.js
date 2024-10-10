import React from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../store';

const AuthForm = (props) => {
  const { name, displayName, handleSubmit, error } = props;

  const isSignUp = name === 'signup';

  return (
    <div className="auth-container">
      {/* Logo at the top */}
      <div className="auth-logo">
        <img src="/logo.png" alt="Logo" className="auth-logo-image" />
      </div>

      <form onSubmit={handleSubmit} name={name} className="auth-form">
        {/* Username Input */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input name="username" type="text" className="form-input" required />
        </div>

        {/* Email Input for Sign Up */}
        {isSignUp && (
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input name="email" type="email" className="form-input" required />
          </div>
        )}

        {/* Password Input */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input name="password" type="password" className="form-input" required />
        </div>

        {/* Confirm Password Input for Sign Up */}
        {isSignUp && (
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input name="confirmPassword" type="password" className="form-input" required />
          </div>
        )}

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit" className="auth-button">
            {displayName}
          </button>
        </div>

        {/* Error Message */}
        {error && error.response && <div className="error-message">{error.response.data}</div>}
      </form>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapLogin = (state) => ({
  name: 'login',
  displayName: 'Login',
  error: state.auth.error,
});

const mapSignup = (state) => ({
  name: 'signup',
  displayName: 'Sign Up',
  error: state.auth.error,
});

const mapDispatch = (dispatch) => ({
  handleSubmit(evt) {
    evt.preventDefault();
    const formName = evt.target.name;
    const username = evt.target.username.value;
    const password = evt.target.password.value;

    if (formName === 'signup') {
      const email = evt.target.email.value;
      const confirmPassword = evt.target.confirmPassword.value;

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      dispatch(authenticate(username, password, formName, email));
    } else {
      // For login, dispatch authenticate without email
      dispatch(authenticate(username, password, formName));
    }
  },
});

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);
