const validateForm = () => {
  let errors = {};

  // Validate name field
  if (!name) {
    errors.name = "Name is required.";
  }

  // Validate email field
  if (!email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid.";
  }

  // Validate password field
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  // Set the errors and update form validity
  setErrors(errors);
  setIsFormValid(Object.keys(errors).length === 0);
};
