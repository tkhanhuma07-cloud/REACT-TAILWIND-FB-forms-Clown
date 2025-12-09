 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email or phone number is required';
        } else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$|^\d{10,}$/.test(value)) {
          error = 'Please enter a valid email or phone number';
        }
        break;
      
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allTouched = {};
    Object.keys(touched).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (validateForm()) {
      // Get registered users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const user = storedUsers.find(
        u => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        alert('Login successful!');
        console.log('Logged in user:', user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/welcome');
      } else {
        alert('Invalid email or password');
      }
    }
  };

  const isFieldInvalid = (fieldName) => touched[fieldName] && errors[fieldName];

  const handleCreateAccount = () => {
    console.log('Navigating to signup page...');
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="flex flex-col lg:flex-row items-center justify-between max-w-[1000px] w-full gap-8 lg:gap-12">
        
        <div className="lg:w-1/2">
          <h1 className="text-6xl lg:text-7xl font-bold text-blue-600 mb-4">
            facebook
          </h1>
          <p className="text-2xl lg:text-3xl text-gray-800 max-w-[500px]">
            Facebook helps you connect and share with the people in your life.
          </p>
        </div>

        <div className="lg:w-1/2 flex justify-center lg:justify-start">
          <div className="w-full max-w-[400px]">
            <div className="bg-white p-5 rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <input
                    type="text"
                    name="email"
                    placeholder="Email address or phone number"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:outline-none ${
                      isFieldInvalid('email')
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {isFieldInvalid('email') && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:outline-none ${
                      isFieldInvalid('password')
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {isFieldInvalid('password') && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className={`w-full text-white font-bold p-3 rounded-md text-lg transition-colors ${
                    Object.values(errors).some(error => error) && Object.values(touched).some(t => t)
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={Object.values(errors).some(error => error) && Object.values(touched).some(t => t)}
                >
                  Log in
                </button>
                
                <div className="text-center mt-2">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => alert('Forgot password functionality can go here')}
                  >
                    Forgotten password?
                  </button>
                </div>
                
                <div className="border-t border-gray-300 pt-4">
                  <div className="text-center">
                    {/* FIXED: Using a separate handler function */}
                    <button
                      type="button"
                      className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-md transition-colors w-full"
                      onClick={handleCreateAccount}
                    >
                      Create new account
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="text-center mt-6 text-sm">
              <p>
                <button
                  className="font-bold hover:underline"
                  onClick={() => alert('Create Page functionality can go here')}
                >
                  Create a Page
                </button>{' '}
                for a celebrity, brand or business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
