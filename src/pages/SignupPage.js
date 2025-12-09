import React, { useState } from 'react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    gender: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    gender: '',
    email: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    birthDay: false,
    birthMonth: false,
    birthYear: false,
    gender: false,
    email: false,
    password: false
  });

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required';
        else if (value.length < 2) error = 'First name must be at least 2 characters';
        else if (!/^[A-Za-z\s]+$/.test(value)) error = 'First name can only contain letters';
        break;
      
      case 'lastName':
        if (!value.trim()) error = 'Last name is required';
        else if (value.length < 2) error = 'Last name must be at least 2 characters';
        else if (!/^[A-Za-z\s]+$/.test(value)) error = 'Last name can only contain letters';
        break;
      
      case 'email':
        if (!value.trim()) error = 'Email or mobile number is required';
        else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$|^\d{10,}$/.test(value)) {
          error = 'Please enter a valid email or mobile number';
        }
        break;
      
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(value)) {
          error = 'Password must contain letters and numbers';
        }
        break;
      
      case 'birthDay':
        if (!value) error = 'Day is required';
        else if (parseInt(value) < 1 || parseInt(value) > 31) error = 'Invalid day';
        break;
      
      case 'birthMonth':
        if (!value) error = 'Month is required';
        break;
      
      case 'birthYear':
        if (!value) error = 'Year is required';
        else {
          const year = parseInt(value);
          const currentYear = new Date().getFullYear();
          if (year < currentYear - 100 || year > currentYear - 13) {
            error = 'You must be at least 13 years old';
          }
        }
        break;
      
      case 'gender':
        if (!value) error = 'Please select your gender';
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

    // Additional validation for complete date
    if (formData.birthDay && formData.birthMonth && formData.birthYear) {
      const day = parseInt(formData.birthDay);
      const month = parseInt(formData.birthMonth);
      const year = parseInt(formData.birthYear);
      
      // Validate date exists
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        newErrors.birthDay = 'Invalid date';
        isValid = false;
      }
      
      // Validate age is at least 13
      const today = new Date();
      const age = today.getFullYear() - year;
      const monthDiff = today.getMonth() - (month - 1);
      const dayDiff = today.getDate() - day;
      
      if (age < 13 || (age === 13 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
        newErrors.birthYear = 'You must be at least 13 years old';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(touched).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Validate entire form
    if (validateForm()) {
      console.log('Signup attempt with:', formData);
      
      // Get existing users or create empty array
      const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if user already exists
      const userExists = existingUsers.some(user => user.email === formData.email);
      
      if (userExists) {
        alert('User with this email already exists!');
        return;
      }
      
      // Add new user
      const newUser = { ...formData };
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      alert('Signup successful! You can now login.');
      // Redirect to login page
      window.location.href = '/';
    } else {
      console.log('Form has errors:', errors);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const isFieldInvalid = (fieldName) => touched[fieldName] && errors[fieldName];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center p-4">
        {/* Just facebook text at the top */}
        <div className="w-full max-w-md text-center mt-4 mb-2">
          <h1 className="text-5xl font-bold text-[#1877f2]">facebook</h1>
        </div>

        {/* Form container */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="text-center mb-5">
            <h2 className="text-2xl font-semibold">Create a new account</h2>
            <p className="text-[#606770] text-sm">It's quick and easy.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`flex-1 w-full p-3 text-sm h-12 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-1 ${
                    isFieldInvalid('firstName')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-[#ccd0d5] focus:border-[#1877f2] focus:ring-[#1877f2]'
                  }`}
                />
                {isFieldInvalid('firstName') && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Surname"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`flex-1 w-full p-3 text-sm h-12 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-1 ${
                    isFieldInvalid('lastName')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-[#ccd0d5] focus:border-[#1877f2] focus:ring-[#1877f2]'
                  }`}
                />
                {isFieldInvalid('lastName') && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-[#1c1e21] text-sm font-medium mb-2">
                Date of birth {isFieldInvalid('birthDay') || isFieldInvalid('birthMonth') || isFieldInvalid('birthYear') ? '🔴' : ''}
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <select
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 h-12 border rounded-md text-sm bg-white focus:outline-none focus:ring-1 ${
                      isFieldInvalid('birthDay')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#ccd0d5] focus:border-[#1877f2] focus:ring-[#1877f2]'
                    }`}
                  >
                    <option value="">Day</option>
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                  {isFieldInvalid('birthDay') && (
                    <p className="text-red-500 text-xs mt-1">{errors.birthDay}</p>
                  )}
                </div>
                <div className="flex-1">
                  <select
                    name="birthMonth"
                    value={formData.birthMonth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 h-12 border rounded-md text-sm bg-white focus:outline-none focus:ring-1 ${
                      isFieldInvalid('birthMonth')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#ccd0d5] focus:border-[#1877f2] focus:ring-[#1877f2]'
                    }`}
                  >
                    <option value="">Month</option>
                    {months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
                  </select>
                  {isFieldInvalid('birthMonth') && (
                    <p className="text-red-500 text-xs mt-1">{errors.birthMonth}</p>
                  )}
                </div>
                <div className="flex-1">
                  <select
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 h-12 border rounded-md text-sm bg-white focus:outline-none focus:ring-1 ${
                      isFieldInvalid('birthYear')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#ccd0d5] focus:border-[#1877f2] focus:ring-[#1877f2]'
                    }`}
                  >
                    <option value="">Year</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                  {isFieldInvalid('birthYear') && (
                    <p className="text-red-500 text-xs mt-1">{errors.birthYear}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[#1c1e21] text-sm font-medium mb-2">
                Gender {isFieldInvalid('gender') ? '🔴' : ''}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Female', 'Male', 'Custom'].map(g => (
                  <label key={g} className={`border rounded-md p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                    isFieldInvalid('gender') ? 'border-red-500' : 'border-[#ccd0d5]'
                  }`}>
                    <span className="text-sm">{g}</span>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="text-[#1877f2] w-4 h-4"
                    />
                  </label>
                ))}
              </div>
              {isFieldInvalid('gender') && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="text"
                name="email"
                placeholder="Mobile number or email address"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 h-12 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 ${
                  isFieldInvalid('email')
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#ccd0d5] focus:border-[#1877f2] focus:ring-[#1877f2]'
                }`}
              />
              {isFieldInvalid('email') && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="New password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 h-12 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 ${
                  isFieldInvalid('password')
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#ccd0d5] focus:border-[#1877f2] focus:ring-[#1877f2]'
                }`}
              />
              {isFieldInvalid('password') && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Terms */}
            <div className="text-xs text-[#777] pt-2">
              <p className="mb-2">
                People who use our service may have uploaded your contact information to Facebook. 
                <a href="#" className="text-[#1877f2] ml-1 hover:underline">Learn more</a>.
              </p>
              <p>
                By clicking Sign Up, you agree to our 
                <a href="#" className="text-[#1877f2] mx-1 hover:underline">Terms</a>, 
                <a href="#" className="text-[#1877f2] mx-1 hover:underline">Privacy Policy</a> and 
                <a href="#" className="text-[#1877f2] mx-1 hover:underline">Cookies Policy</a>.
              </p>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-[#00a400] hover:bg-[#36a420] text-white font-bold py-3 rounded-md text-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={Object.values(errors).some(error => error) && Object.values(touched).some(t => t)}
            >
              Sign Up
            </button>

            {/* Already have an account */}
            <div className="text-center pt-4 border-t border-[#dadde1]">
              <a href="/" className="text-[#1877f2] hover:underline font-medium text-sm inline-block py-2">
                Already have an account?
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-300 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Language selector */}
          <div className="mb-4">
            <select className="text-sm border border-gray-300 rounded p-2 text-gray-700">
              <option>English (UK)</option>
              <option>Français (FR)</option>
              <option>Deutsch</option>
              <option>Español</option>
              <option>Italiano</option>
            </select>
          </div>

          {/* Footer links */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
            <a href="#" className="hover:underline">Sign Up</a>
            <a href="#" className="hover:underline">Login</a>
            <a href="#" className="hover:underline">Messenger</a>
            <a href="#" className="hover:underline">Facebook Lite</a>
            <a href="#" className="hover:underline">Video</a>
            <a href="#" className="hover:underline">MetaPay</a>
            <a href="#" className="hover:underline">Meta Store</a>
            <a href="#" className="hover:underline">Meta Quest</a>
            <a href="#" className="hover:underline">Ray-Ban Meta</a>
            <a href="#" className="hover:underline">Meta AI</a>
            <a href="#" className="hover:underline">more content</a>
            <a href="#" className="hover:underline">Instagram</a>
            <a href="#" className="hover:underline">Threads</a>
            <a href="#" className="hover:underline">Voting Information Centre</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Privacy Centre</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Create ad</a>
            <a href="#" className="hover:underline">Create Page</a>
            <a href="#" className="hover:underline">Developers</a>
            <a href="#" className="hover:underline">Careers</a>
            <a href="#" className="hover:underline">Cookies</a>
            <a href="#" className="hover:underline">AdChoices</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">Contact uploading and non-users</a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500">
            <p>Meta © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignupPage;