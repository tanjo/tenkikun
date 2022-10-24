const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

class Weather {
    constructor() {
        // 東京（東京）
        this.url = "https://weather.yahoo.co.jp/weather/jp/13/4410.html";
    }    

    async setup() {
        this.browser = await puppeteer.launch();
        this.mainPage = await this.browser.newPage();
        await this.mainPage.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 2
        });
    }

    async goto(url) {
        if (url) {
            this.url = url;
        }
        await this.mainPage.goto(this.url);
    }

    async saveImage() {
        const imgdir = "img";
        const dirname = path.join(process.cwd(), imgdir);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }
        const filename = "東京(東京).png";
        const dst = path.join(process.cwd(), imgdir, filename);
        const rect = await this.mainPage.evaluate((selector) => {
            const element = document.querySelector(selector);
            const {x, y, width, height} = element.getBoundingClientRect();
            return {left: x, top: y, width, height, id: element.id};
        }, "#main > div.forecastCity > table > tbody > tr > td:nth-child(1)");
        await this.mainPage.screenshot({ path: dst, clip: {
            x: rect.left, 
            y: rect.top,
            width: rect.width, 
            height: rect.height
        } });
        return dst;
    }

    async close() {
        await this.mainPage.close();
        await this.browser.close();
    }
}
module.exports = Weather;