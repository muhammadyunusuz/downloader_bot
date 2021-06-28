const TelegramBot = require("node-telegram-bot-api");
const TOKEN = `1751322746:AAExuQ9IC-Q_vEiyOwDi2YqMneMHoo59loo`;
const http = require("https");
const options = {
	polling: true,
	baseApiUrl: "http://muhammadyunus.uz:8081",
};
const m3u8ToMp4 = require("m3u8-to-mp4");
const ytdl = require("youtube-dl");
const converter = new m3u8ToMp4();
const fs = require("fs");
const request = require("request");
const fetch = require("node-fetch");

const bot = new TelegramBot(TOKEN, options);

bot.on("text", async (message) => {
	ytdl.getInfo(message.text, async (err, info) => {
		let x = info.formats.filter((e) => {
			return e.protocol == "https";
		});

		let c = await fetch(info.thumbnail);
		c = await c.buffer();

		let p = await bot.sendPhoto(message.chat.id, c, {
			caption: "Downloading",
		});

		http.get(x[x.length - 1].url, async (res) => {
			var len = parseInt(res.headers["content-length"], 10);
			var body = "";
			var cur = 0;
			var total = len / 1048576;
			let interval;
			let obj = "";
			interval = setInterval(async () => {
				await bot.editMessageCaption(obj, {
					chat_id: message.chat.id,
					message_id: p.message_id,
				});
			}, 4000);
			res.on("data", async function (chunk) {
				body += chunk;
				cur += chunk.length;
				obj =
					"Downloading " +
					((100.0 * cur) / len).toFixed(2) +
					"% " +
					(cur / 1048576).toFixed(2) +
					" mb\n" +
					".<br/> Total size: " +
					total.toFixed(2) +
					" mb";
			});

			await bot.sendVideo(message.chat.id, res);
			await clearInterval(interval);
		});
	});
});
