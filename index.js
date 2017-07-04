var Config = require('./config.json');
var Twitter = require('twitter');
var twitter = new Twitter({
  consumer_key: Config.consumer_key,
  consumer_secret: Config.consumer_secret,
  access_token_key: Config.access_token_key,
  access_token_secret: Config.access_token_secret
});
var Nightmare = require('nightmare');
var nightmare = Nightmare({
  show: false,
  width: 2048,
  height: 1536
});
var fs = require('fs');


nightmare
  .goto('https://www.google.co.jp/search?q=%E9%80%B1%E9%96%93%E5%A4%A9%E6%B0%97%20%E6%9D%B1%E4%BA%AC')
  .click('#wob_rain')
  .wait(1000)
  .evaluate(function() {
    var rect = document.getElementById('wob_wc').getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    };
  })
  .then(function(result) {
    nightmare
      .screenshot('tenki.png', result)
      .end()
      .then(function() {
        console.log("screenshot");

        var data = fs.readFileSync('tenki.png');

        twitter.post('media/upload', {
          media: data
        },
        function(error, media, resopnse) {
          if (error) {
            console.log('Twitter media upload error: ', error);
            return;
          }

          twitter.post('statuses/update', {
            status: '天気',
            media_ids: media.media_id_string
          }, function(error, tweet, response) {
            if (!error) {
              console.log(tweet);
            } else {
              console.log('Twitter Error: ', error);
            }
          });
        });
      })
      .catch(function(error) {
        console.log("Screenshot error: ", error);
      });
  })
  .catch(function(error) {
    console.log('Screenshot failed: ', error);
  });
