const yup = require("yup");

const loginValidator = yup.object({
  body: yup.string().required("this field is required"),
  password: yup
    .string()
    .min(8, "password must be at least 8 character")
    .required("password is required"),
  captcha: yup
    .string()
    .max(4, "at best captcha is 4 char")
    .required("captcha is required"),
});

const registerValidator = yup.object({
  name: yup.string().required("name is required"),
  username: yup
    .string()
    .min(5, "user name must be at least 5 character")
    .required("username is required"),
  email: yup.string().email("email is not valid").required("email is required"),
  password: yup
    .string()
    .min(8, "password must be at least 8 character")
    .required("password is required"),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "confirm password dose not match password"
    )
    .required("confirm password is required"),
  captcha: yup
    .string()
    .max(4, "at best captcha is 4 char")
    .required("captcha is required"),
});

module.exports = { loginValidator, registerValidator };
