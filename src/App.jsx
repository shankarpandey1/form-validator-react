// import { useState } from 'react';

import { useImmer } from "use-immer";
import * as EmailValidator from 'email-validator';
import { passwordStrength } from "check-password-strength";

import './app.scss';



function App() {

  // const [user, setUser] = useState('');
  // const [password, setPassword] = useState('');
  // const [passwordConfirm, setPasswordConfirm] = useState('');

  const [state, setState] = useImmer({

    user: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showInvalidEmail: false,
    isPasswordShort: false,
    passwordMatch: false,
    passwordStrength: {
      color: '',
      value: '',
    },
  });

  const validate = (
    state.user
    && !state.showInvalidEmail
    && state.password.length > 8
    && ['Strong', 'Medium'].includes(state.passwordStrength.value)
    && state.password === state.confirmPassword
  )

  return (
    <div id="app">
      <form id="my-form" class="shadow">
        <h4>Form Validator</h4>
        <div className="mb-4">
          <label>Username</label>
          <input
            className="form-control"
            type="text"
            data-rules="required|digits:5|min:5"
            placeholder="Please enter your email as username"
            value={state?.user || ''}
            onChange={(event) => {
              setState((draft) => {
                draft.user = event.target.value;
              })
            }}
            onBlur={() => {
              setState((draft) => {
                draft.showInvalidEmail = !EmailValidator.validate(state?.user);
              });
            }}
          />
          {
            state.showInvalidEmail
            && <p className="validator-error">Username is not valid, please use correct email</p>
          }
        </div>
        <div
          className="mb-4"
          style={{
            position: "relative"
          }}
        >
          <label>Password</label>
          <input
            className="form-control"
            type={state.showPassword ? 'text' : 'password'}
            // type="text"
            data-rules="required|string|min:5"
            value={state?.password || ''}
            onChange={(event) => {
              setState((draft) => {
                draft.password = event.target.value;
                if (event.target.value.length > 8) {
                  const passwordStrengthValue = passwordStrength(event.target.value).value
                  draft.passwordStrength.value = passwordStrengthValue;
                  console.log(passwordStrengthValue);
                  draft.passwordStrength.value = passwordStrengthValue;
                  switch (passwordStrengthValue) {
                    case 'Too Weak':
                      draft.passwordStrength.color = 'red';
                      break;
                    case 'Weak':
                      draft.passwordStrength.color = 'orange';
                      break;
                    case 'Medium':
                      draft.passwordStrength.color = 'blue';
                      break;
                    default:
                      draft.passwordStrength.color = 'green';
                  }


                  draft.isPasswordShort = false;
                } else {
                  draft.passwordStrength.value = '';
                  draft.passwordStrength.color = '';
                }
              })
            }}
            onBlur={() => {
              setState((draft) => {
                draft.isPasswordShort = state.password.length < 8;
              });
            }}
          />
          {
            state.isPasswordShort
            && <p className="validator-error">Password must be more than 8 characters</p>
          }
          <button
            style={{
              position: 'absolute',
              top: 30,
              right: 10,
              width: 50,
              padding: 0,
              margin: 0,
              fontSize: 2,
              border: 'none !important'
            }}
            type='button'
            onClick={() => {
              setState((draft) => {
                draft.showPassword = !draft.showPassword;
                if (!state.showPassword) {
                  draft.confirmPassword = state.password;
                  draft.passwordMatch = true;
                } else {
                  draft.passwordMatch = false;
                  draft.confirmPassword = '';
                }
              });
            }}
          >eye</button>
        </div>
        {
          !state.showPassword
          &&
          <div className="mb-4">
            <label>Password Confirm</label>
            <input
              className="form-control"
              type="password"
              // type="text"
              data-rules="required|string|min:5"
              value={state?.confirmPassword || ''}
              onChange={(event) => {
                setState((draft) => {
                  draft.confirmPassword = event.target.value;
                  draft.passwordMatch = event.target.value === state.password
                })
              }}

            />
          </div>
        }
        {
          !state.passwordMatch
          && state.confirmPassword
          && <p className="validator-error">Confirmed password did not match</p>
        }

        {
          state.passwordStrength.value
          && <div
            className="mb-4"
            style={{
              position: "relative",
              color: state.passwordStrength.color
            }}
          >
            {state.passwordStrength.value}
          </div>
        }



        <button
          disabled={
            !validate
          }

          style={{ backgroundColor: validate ? '' : 'gray' }}
          onClick={() => {
            alert('your form is validated')
          }}
          type='button'
        >
          Create User
        </button>
      </form>
    </div>
  );
}

export default App;
