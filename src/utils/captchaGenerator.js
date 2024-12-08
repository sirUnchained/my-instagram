const svgCaptcha = require("svg-captcha");
const redis = require("./redis");

async function generateCaptcha() {
  const captcha = svgCaptcha.create({
    noise: 6,
    color: true,
  });
  const captchaID = crypto.randomUUID();

  await redis.set(`captcha:${captchaID}`, captcha.text, "EX", 60 * 3);

  return { captchaPic: captcha.data, captchaID };
}

module.exports = generateCaptcha;
