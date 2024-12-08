const yup = require("yup");

const commentsValidation = yup.object({
  body: yup
    .string()
    .max(500, "comments must be 500 characters at most")
    .required("body of comment is required"),
});

module.exports = { commentsValidation };
