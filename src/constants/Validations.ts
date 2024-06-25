export const CHECK_EMAIL = (email: string) => {
  let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

export const CHECK_PASSWORD = (pass: string) => {
  if (pass.length < 8) {
    return false;
  }
  return true;
};

export const CHECK_NUMBER = (data: string) => {
  let numRegex = /^[0-9]*$/;
  return numRegex.test(data);
};
