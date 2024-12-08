const redis = require("../utils/redis");

async function validateCaptcha(req, res, next) {
  try {
    const { captcha_id, captcha: inputCaptcha } = req.body;

    const captcha = await redis.get(`captcha:${captcha_id}`);
    
    if (captcha?.toLowerCase() != inputCaptcha?.toLowerCase()) {
      req.flash("err", "captcha is not valid");
      return res.redirect("/auth/login");
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validateCaptcha;
