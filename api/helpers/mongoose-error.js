const errorMessageByCode = (error) => {
  let message = '';
  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = 'Unique field already exists';
        break;
      default:
        message = 'Bad request';
    }
  } else {
    for (let err in error.errors) {
      if (error.errors[err].message) {
        message = error.errors[err].message;
      }
    }
  }
  return { message };
}
export default errorMessageByCode;
