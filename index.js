const Weather = require('./src/weather');
const Slack = require('./src/slack');

(async () => {
  const weather = new Weather();
  await weather.setup();
  await weather.goto();
  const filePath = await weather.saveImage();
  await weather.close();

  const slack = new Slack();
  slack.postImage(process.env.SLACK_CHANNEL, filePath);
})();