const { WebClient } = require('@slack/web-api');
const fs = require('fs');

module.exports = class Slack {
    constructor() {
        this.token = process.env.SLACK_TOKEN;
        this.web = new WebClient(this.token);
    }

    async postImage(channelId, filePath) {
        const data = fs.readFileSync(filePath);
        this.web.files.upload({
            channels: channelId,
            file: data,
            filename: "東京(東京).png",
            filetype: 'image/png',
            title: "今日の天気"
        });
    }
}