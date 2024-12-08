const yup = require("yup");

exports.postValidator = yup.object({
  description: yup.string().max(500, "description maximum character it 500"),
});
