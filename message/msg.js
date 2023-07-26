/**
  * Created by Riy
  * WhatsApp wa.me/6281575886399
  * Follow me on Instagram @riycoders
*/

"use strict";
const {
	downloadContentFromMessage,
	generateWAMessageFromContent
} = require("@whiskeysockets/baileys")
const { color, bgcolor } = require('../lib/color')
const { getBuffer, fetchJson, fetchText, getRandom, getGroupAdmins, runtime, sleep, makeid } = require("../lib/myfunc");
const { webp2mp4File } = require("../lib/convert")
const { isLimit, limitAdd, getLimit, giveLimit, addBalance, kurangBalance, getBalance, isGame, gameAdd, givegame, cekGLimit } = require("../lib/limit");
const { addPlayGame, getJawabanGame, isPlayGame, cekWaktuGame, getGamePosi } = require("../lib/game");
const _prem = require("../lib/premium");
const { yta, ytv } = require("../lib/ytdl");
const { genMath, modes } = require("../lib/math");

const fs = require ("fs");
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const yts = require("yt-search");
const speed = require("performance-now");
const request = require("request");
const ms = require("parse-ms");

const caliph = require("caliph-api");
const dylux = require("api-dylux");

// Exif
const Exif = require("../lib/exif")
const exif = new Exif()

// DB Game
let family100 = [];
let siapakahaku = [];
let math = [];

// Database
let pendaftar = JSON.parse(fs.readFileSync('./database/user.json'))
let mess = JSON.parse(fs.readFileSync('./message/response.json'));
let premium = JSON.parse(fs.readFileSync('./database/premium.json'));
let balance = JSON.parse(fs.readFileSync('./database/balance.json'));
let limit = JSON.parse(fs.readFileSync('./database/limit.json'));
let glimit = JSON.parse(fs.readFileSync('./database/glimit.json'));

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async(conn, msg, m, setting, store, welcome) => {
	try {
		let { ownerNumber, botName, gamewaktu, limitCount } = setting
		let { allmenu } = require('./help')
		const { type, quotedMsg, mentioned, isBaileys, now, fromMe } = msg
		if (isBaileys) return
		const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
		let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
		const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
		const content = JSON.stringify(msg.message)
		const from = msg.key.remoteJid
		const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
        const toJSON = j => JSON.stringify(j, null,'\t')
		if (conn.multi) {
			var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
		} else {
			if (conn.nopref) {
				prefix = ''
			} else {
				prefix = conn.prefa
			}
		}
		const args = chats.split(' ')
		const command = chats.toLowerCase().split(' ')[0] || ''
		const isCmd = command.startsWith(prefix)
		const isGroup = msg.key.remoteJid.endsWith('@g.us')
		const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
		const isOwner = ownerNumber.includes(sender)
		const pushname = msg.pushName
		const q = chats.slice(command.length + 1, chats.length)
		const body = chats.startsWith(prefix) ? chats : ''
		const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
		const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.id : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const isGroupAdmins = groupAdmins.includes(sender)
		const isUser = pendaftar.includes(sender)
		const isPremium = isOwner ? true : _prem.checkPremiumUser(sender, premium)
        const isWelcome = isGroup ? welcome.includes(from) ? true : false : false

		const gcounti = setting.gcount
		const gcount = isPremium ? gcounti.prem : gcounti.user

		const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByReply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : []
		
		async function downloadAndSaveMediaMessage (type_file, path_file) {
			if (type_file === 'image') {
				var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'video') {
				var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'sticker') {
				var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'audio') {
				var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			}
		}
		const sendFileFromUrl = async (from, url, caption, options = {}) => {
		    let mime = '';
		    let res = await axios.head(url)
		    mime = res.headerd["content-type"]
		    let type = mime.split("/")[0]+"Message"
		    if (mime.split("/")[0] === "image") {
		       var img = await getBuffer(url)
		       return conn.sendMessage(from, { image: img, caption: caption }, options)
		    } else if (mime.split("/")[0] === "video") {
		       var vid = await getBuffer(url)
		       return conn.sendMessage(from, { video: vid, caption: caption }, options)
		    } else if (mime.split("/")[0] === "audio") {
		       var aud = await getBuffer(url)
		       return conn.sendMessage(from, { audio: aud, mimetype: 'audio/mp3' }, options)
		    } else {
		       var doc = await getBuffer(url)
		       return conn.sendMessage(from, { document: doc, mimetype: mime, caption: caption }, options)
		    }
		}
		const isUrl = (url) => {
			return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
		}
		function jsonformat(string) {
            return JSON.stringify(string, null, 2)
        }
		function monospace(string) {
            return '```' + string + '```'
        }
		function randomNomor(min, max = null) {
		  if (max !== null) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min;
		  } else {
			return Math.floor(Math.random() * min) + 1
		  }
		}
		const pickRandom = (arr) => {
			return arr[Math.floor(Math.random() * arr.length)]
		}
		function mentions(teks, mems = [], id) {
			if (id == null || id == undefined || id == false) {
			  let res = conn.sendMessage(from, { text: teks, mentions: mems })
			  return res
			} else {
		      let res = conn.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
		      return res
 		    }
		}
		const reply = (teks) => {
			conn.sendMessage(from, { text: teks }, { quoted: msg })
		}
		const textImg = (teks) => {
			return conn.sendMessage(from, { text: teks, jpegThumbnail: fs.readFileSync(setting.pathimg) }, { quoted: msg })
		}
		const sendMess = (hehe, teks) => {
			conn.sendMessage(hehe, { text, teks })
		}

		const isImage = (type == 'imageMessage')
		const isVideo = (type == 'videoMessage')
		const isSticker = (type == 'stickerMessage')
		const isQuotedMsg = (type == 'extendedTextMessage')
		const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
		const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
		const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
		const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
		const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false

		// Auto Read & Presence Online
		if (conn.mode === 'self'){
            if (!fromMe && !isOwner) return
            if (fromMe && isBaileys) return
            conn.sendPresenceUpdate('unavailable', from)
        } else {
		     conn.readMessages([msg.key])
		}
		
		// Auto Registrasi
		if (isCmd && !isUser) {
		  pendaftar.push(sender)
		  fs.writeFileSync('./database/user.json', JSON.stringify(pendaftar, null, 2))
		}
		
		// Premium
		_prem.expiredCheck(conn, premium)

        // Game
		cekWaktuGame(conn, family100) // Family 100
        if (isPlayGame(from, family100) && isUser) {
           var anjuy = getJawabanGame(from, family100)
           for (let i of anjuy) {
              if (chats.toLowerCase().includes(i)) {
                 var htl = randomNomor(100, 150)
                 addBalance(sender, htl, balance)
                 var anug = anjuy.indexOf(i)
                 anjuy.splice(anug, 1)
                 reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${i}\nHadiah : ${htl} balance\n\nTersisa ${anjuy.length} jawaban lagi!`)
              }
           }
          if (anjuy.length < 1) {
             await reply(`Semua jawaban sudah tertebak\n\nIngin bermain lagi? ketik *${prefix}family100*`)
             family100.splice(getGamePosi(from, family100), 1)
            }
        }
        cekWaktuGame(conn, math) // Math Game
        if (isPlayGame(from, math) && isUser) {
           if (chats.toLowerCase() == getJawabanGame(from, math)) {
           var htgm = randomNomor(100, 150)
           addBalance(sender, htgm, balance)
           reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, math)}\nHadiah : ${htgm} balance\n\nIngin bermain lagi? ketik *${prefix}math*`)
           math.splice(getGamePosi(from, math), 1)
           }
        }
        cekWaktuGame(conn, siapakahaku) // Whoim Game
        if (isPlayGame(from, siapakahaku) && isUser) {
           if (chats.toLowerCase() == getJawabanGame(from, siapakahaku)) {
           var htgm = randomNomor(100, 150)
           addBalance(sender, htgm, balance)
           reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, siapakahaku)}\nHadiah : ${htgm} balance\n\nIngin bermain lagi? ketik *${prefix}whoim*`)
           siapakahaku.splice(getGamePosi(from, siapakahaku), 1)
           }
        }

		if (chats.startsWith("> ") && isOwner) {
		console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
		  const ev = (sul) => {
            var sat = JSON.stringify(sul, null, 2)
            var bang = util.format(sat)
            if (sat == undefined) {
              bang = util.format(sul)
            }
            return textImg(bang)
          }
          try {
           textImg(util.format(eval(`;(async () => { ${chats.slice(2)} })()`)))
          } catch (e) {
           textImg(util.format(e))
          }
		} else if (chats.startsWith("$ ") && isOwner) {
        console.log(color('[EXEC]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
          exec(chats.slice(2), (err, stdout) => {
		    if (err) return reply(`${err}`)
		    if (stdout) reply(`${stdout}`)
		  })
        } else if (chats.startsWith("x ") && isOwner) {
	    console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkaokwoak`))
		 try {
	       let evaled = await eval(chats.slice(2))
		   if (typeof evaled !== 'string') evaled = require("util").inspect(evaled)
			reply(`${evaled}`)
		 } catch (err) {
		   reply(`${err}`)
		 }
		}
		
		// Logs;
		if (!isGroup && isCmd && !fromMe) {
			addBalance(sender, randomNomor(20), balance)
			console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
		}
		if (isGroup && isCmd && !fromMe) {
			addBalance(sender, randomNomor(20), balance)
			console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp *1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
		}

		switch(command) {
			// Main Menu
			case prefix+'menu':
			case prefix+'help':
			    var teks = allmenu(sender, prefix, pushname, isOwner, isPremium, balance, limit, limitCount, glimit, gcount)
			    reply(teks)
				break
			case prefix+'runtime':
			    reply(runtime(process.uptime()))
			    break
			case prefix+'speed':
               let timestamp = speed();
               let latensi = speed() - timestamp
               textImg(`${latensi.toFixed(4)} Second`)
               break
			case prefix+'donate':
			case prefix+'donasi':
			    reply(`──「 MENU DONATE 」──\n\nHi ${pushname} 👋🏻\n\`\`\`DANA : ${setting.donasi.dana}\`\`\`\n\`\`\`GOPAY : ${setting.donasi.gopay}\`\`\`\nTerimakasih untuk kamu yang sudah donasi untuk perkembangan bot ini _^\n──「 THX FOR YOU ! 」──`)
			    break
			case prefix+'owner':{
				let arrey = []
                    for ( let x of ownerNumber){
                        let getnem = conn.getName(x)
                        let conara = { displayName: getnem, vcard: 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + getnem + '\n' + 'ORG:Kontak\n' + 'TEL;type=CELL;type=VOICE;waid=' + x.split("@")[0] + ':+' + x.split("@")[0] + '\n' + 'END:VCARD'.trim()}
                        arrey.push(conara)
				}
                        let aa = generateWAMessageFromContent(from, { contactsArrayMessage: { contacts : arrey } }, {quoted: msg})
				 conn.relayMessage(from, aa.message, {})
			}
                break
			case prefix+'cekprem':
            case prefix+'cekpremium':
                if (!isPremium) return reply(`Kamu bukan user premium, kirim perintah *${prefix}daftarprem* untuk membeli premium`)
                if (isOwner) return reply(`Lu owner bego!`)
                if (_prem.getPremiumExpired(sender, premium) == "PERMANENT") return reply(`PERMANENT`)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let premiumnya = `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`
                reply(premiumnya)
                break
            case prefix+'listprem':
                let txt = `List Prem\nJumlah : ${premium.length}\n\n`
                let men = [];
                for (let i of premium) {
                    men.push(i.id)
                    txt += `*ID :* @${i.id.split("@")[0]}\n`
                  if (i.expired === 'PERMANENT') {
                    let cekvip = 'PERMANENT'
                    txt += `*Expire :* PERMANENT\n\n`
                  } else {
                    let cekvip = ms(i.expired - Date.now())
                    txt += `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`
                  }
                }
                mentions(txt, men, true)
                break
	        // Converter & Tools Menu
			case prefix+'sticker': case prefix+'stiker': case prefix+'s':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
				if (isImage || isQuotedImage) {
		           var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
			       var buffer = Buffer.from([])
			       for await(const chunk of stream) {
			          buffer = Buffer.concat([buffer, chunk])
			       }
			       var rand1 = 'sticker/'+getRandom('.jpg')
			       var rand2 = 'sticker/'+getRandom('.webp')
			       fs.writeFileSync(`./${rand1}`, buffer)
			       ffmpeg(`./${rand1}`)
				.on("error", console.error)
				.on("end", () => {
				  exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
				    conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
				    limitAdd(sender, limit)
					fs.unlinkSync(`./${rand1}`)
			            fs.unlinkSync(`./${rand2}`)
			          })
				 })
				.addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
				.toFormat('webp')
				.save(`${rand2}`)
			    } else if (isVideo || isQuotedVideo) {
				 var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
				 var buffer = Buffer.from([])
				 for await(const chunk of stream) {
				   buffer = Buffer.concat([buffer, chunk])
				 }
			     var rand1 = 'sticker/'+getRandom('.mp4')
				 var rand2 = 'sticker/'+getRandom('.webp')
			         fs.writeFileSync(`./${rand1}`, buffer)
			         ffmpeg(`./${rand1}`)
				  .on("error", console.error)
				  .on("end", () => {
				    exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
				      conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
				      limitAdd(sender, limit)
					  fs.unlinkSync(`./${rand1}`)
				      fs.unlinkSync(`./${rand2}`)
				    })
				  })
				 .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
				 .toFormat('webp')
				 .save(`${rand2}`)
                } else {
			       reply(`Kirim gambar/vidio dengan caption ${command} atau balas gambar/vidio yang sudah dikirim\nNote : Maximal vidio 10 detik!`)
			    }
                break
			case prefix+'toimg': case prefix+'toimage':
            case prefix+'tovid': case prefix+'tovideo':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isQuotedSticker) return reply(`Reply stikernya!`)
                var stream = await downloadContentFromMessage(msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
                var buffer = Buffer.from([])
                for await(const chunk of stream) {
                   buffer = Buffer.concat([buffer, chunk])
                }
                var rand1 = 'sticker/'+getRandom('.webp')
                var rand2 = 'sticker/'+getRandom('.png')
                fs.writeFileSync(`./${rand1}`, buffer)
                if (isQuotedSticker && msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated !== true) {
                reply(mess.wait)
                exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
                   fs.unlinkSync(`./${rand1}`)
                   if (err) return reply(mess.error.api)
                   conn.sendMessage(from, { image: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
                   limitAdd(sender, limit)
                   fs.unlinkSync(`./${rand2}`)
                 })
                 } else {
                    reply(mess.wait)
                    webp2mp4File(`./${rand1}`).then(async(data) => {
                    fs.unlinkSync(`./${rand1}`)
                    conn.sendMessage(from, { video: await getBuffer(data.data) }, { quoted: msg })
                    limitAdd(sender, limit)
                  })
                }
                break
	        // Downloader Menu
	        case prefix+'tiktok':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} link`)
                   if (!isUrl(args[1])) return reply(mess.error.Iv)
                   if (!args[1].includes('tiktok')) return reply(mess.error.Iv)
                   reply(mess.wait)
                   require('api-dylux').tiktok(args[1]).then( data => {
                     conn.sendMessage(from, { video: { url: data.hdplay }}, { quoted: msg })
                     limitAdd(sender, limit)
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'tiktoknowm':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} link`)
                   if (!isUrl(args[1])) return reply(mess.error.Iv)
                   if (!args[1].includes('tiktok')) return reply(mess.error.Iv)
                   reply(mess.wait)
                   require('api-dylux').tiktok(args[1]).then( data => {
                     conn.sendMessage(from, { video: { url: data.hdplay }}, { quoted: msg })
                     limitAdd(sender, limit)
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'tiktokaudio':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} link\nAtau ${command} link --ori`)
                   if (!isUrl(args[1])) return reply(mess.error.Iv)
                   if (!args[1].includes('tiktok')) return reply(mess.error.Iv)
                   reply(mess.wait)
                   require('api-dylux').tiktok(args[1]).then(async(data) => {
                      conn.sendMessage(from, { audio: { url: data.music }, mimetype: 'audio/mp4' }, { quoted: msg })
                      limitAdd(sender, limit)
                   }).catch(() => reply(mess.error.api))
                   break
			case prefix+'play':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} query\nContoh : ${command} monokrom`)
                   reply(mess.wait)
                   var dataa = await yts(q)
                   dataa = dataa.videos[0].url
                   dataa = dataa.includes('shorts') ? dataa.replace('https://youtube.com/shorts/', 'https://youtu.be/') : dataa
                   yta(dataa).then(async(data) => {
                     var teks = `*Youtube Play Music*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${args[1]}\n\n_wait a minute sending media..._`
                     if (Number(data.filesize) >= 30000) {
                       var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                       teks = `*Youtube Play Music*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${args[1]}\n*≻ Download :* ${res.data}\n\n_for larger sizes, presented in the form of a link_`
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       limitAdd(sender, limit)
                     } else {
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       conn.sendMessage(from, { document: { url: data.dl_link.replace("https://", "http://")}, fileName: `${data.title}.mp3`, mimetype: 'audio/mp3'}, { quoted: msg })
                       limitAdd(sender, limit)
                     }
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'ytmp4': case prefix+'mp4':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} link`)
                   if (!isUrl(args[1])) return reply(mess.error.Iv)
                   if (!args[1].includes('youtu.be') && !args[1].includes('youtube.com')) return reply(mess.error.Iv)
                   reply(mess.wait)
                   args[1] = args[1].includes('shorts') ? args[1].replace('https://youtube.com/shorts/', 'https://youtu.be/') : args[1]
                   ytv(args[1]).then(async(data) => {
                     var teks = `*Youtube Video Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 360p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${args[1]}`
                     if (Number(data.filesize) >= 30000) {
                       var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                       teks += `\n*≻ Download :* ${res.data}\n\n_for larger sizes, presented in the form of a link_`
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       limitAdd(sender, limit)
                     } else {
                       conn.sendMessage(from, { video: { url: data.dl_link.replace("https://", "http://"), caption: teks }}, { quoted: msg })
                       limitAdd(sender, limit)
                     }
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'ytmp3': case prefix+'mp3':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (args.length < 2) return reply(`Kirim perintah ${command} link`)
                   if (!isUrl(args[1])) return reply(mess.error.Iv)
                   if (!args[1].includes('youtu.be') && !args[1].includes('youtube.com')) return reply(mess.error.Iv)
                   reply(mess.wait)
                   args[1] = args[1].includes('shorts') ? args[1].replace('https://youtube.com/shorts/', 'https://youtu.be/') : args[1]
                   yta(args[1]).then(async(data) => {
                     var teks = `*Youtube Audio Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${args[1]}\n\n_wait a minute sending media..._`
                     if (Number(data.filesize) >= 30000) {
                       var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                       teks = `*Youtube Audio Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${args[1]}\n*≻ Download :* ${res.data}\n\n_for larger sizes, presented in the form of a link_`
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       limitAdd(sender, limit)
                     } else {
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       conn.sendMessage(from, { document: { url: data.dl_link.replace("https://", "http://")}, fileName: `${data.title}.mp3`, mimetype: 'audio/mp3'}, { quoted: msg })
                       limitAdd(sender, limit)
                     }
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'getvideo': case prefix+'getvidio':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (!isQuotedImage) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                   if (!quotedMsg.fromMe) return reply(`Hanya bisa mengambil hasil dari pesan bot`)
                   if (args.length < 2) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                   var kuoted = await quotedMsg.chats
                   var ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/gi
                   var arrey = [...kuoted.matchAll(ytIdRegex)].map(x => x[1])
                   if (arrey.length == 0) return reply(`Reply hasil dari *${prefix}ytsearch* dengan perintah *${command}* urutan`)
                   if (isNaN(args[1])) return reply(`Hanya support angka! pilih angka 1 sampai 10\nContoh : ${command} 2`)
                   if (args[1] > arrey.length) return reply(`Urutan Hasil *${prefix}ytsearch* Hanya Sampai *${arrey.length}*`)
                   reply(mess.wait)
                   ytv(`https://youtube.com/watch?v=${arrey[args[1] -1]}`).then(async(data) => {
                     data.url = `https://youtube.com/watch?v=${arrey[args[1] -1]}`
                     var teks = `*Youtube Video Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 360p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${data.url}`
                     if (Number(data.filesize) >= 30000) {
                       var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                       teks += `\n*≻ Download :* ${res.data}\n\n_for larger sizes, presented in the form of a link_`
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       limitAdd(sender, limit)
                     } else {
                       conn.sendMessage(from, { video: { url: data.dl_link.replace("https://", "http://"), caption: teks }}, { quoted: msg })
                       limitAdd(sender, limit)
                     }
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'getmusik': case prefix+'getmusic':
                   if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                   if (!isQuotedImage) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                   if (!quotedMsg.fromMe) return reply(`Hanya bisa mengambil hasil dari pesan bot`)
                   if (args.length < 2) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                   var kuoted = await quotedMsg.chats
                   var ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/gi
                   var arrey = [...kuoted.matchAll(ytIdRegex)].map(x => x[1])
                   if (arrey.length == 0) return reply(`Reply hasil dari *${prefix}ytsearch* dengan perintah *${command}* urutan`)
                   if (isNaN(args[1])) return reply(`Hanya support angka! pilih angka 1 sampai 10\nContoh : ${command} 2`)
                   if (args[1] > arrey.length) return reply(`Urutan Hasil *${prefix}ytsearch* Hanya Sampai *${arrey.length}*`)
                   reply(mess.wait)
                   yta(`https://youtube.com/watch?v=${arrey[args[1] -1]}`).then(async(data) => {
                     data.url = `https://youtube.com/watch?v=${arrey[args[1] -1]}`
                     var teks = `*Youtube Audio Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${data.url}\n\n_wait a minute sending media..._`
                     if (Number(data.filesize) >= 30000) {
                       var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                       teks = `*Youtube Audio Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* 128p\n*≻ Size :* ${data.filesizeF}\n*≻ Url Source :* ${data.url}\n*≻ Download :* ${res.data}\n\n_for larger sizes, presented in the form of a link_`
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       limitAdd(sender, limit)
                     } else {
                       conn.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                       conn.sendMessage(from, { document: { url: data.dl_link.replace("https://", "http://") }, fileName: `${data.title}.mp3`, mimetype: 'audio/mp3'}, { quoted: msg })
                       limitAdd(sender, limit)
                     }
                   }).catch(() => reply(mess.error.api))
                   break
			// Owner Menu
			case prefix+'exif':
			    if (!isOwner) return reply(mess.OnlyOwner)
			    var namaPack = q.split('|')[0] ? q.split('|')[0] : q
                var authorPack = q.split('|')[1] ? q.split('|')[1] : ''
                exif.create(namaPack, authorPack)
				reply(`Sukses membuat exif`)
				break
			case prefix+'leave':
			    if (!isOwner) return reply(mess.OnlyOwner)
				if (!isGroup) return reply(mess.OnlyGrup)
				conn.groupLeave(from)
			    break
			case prefix+'join':
			    if (!isOwner) return reply(mess.OnlyOwner)
				if (args.length < 2) return reply(`Kirim perintah ${command} _linkgrup_`)
				if (!isUrl(args[1])) return reply(mess.error.Iv)
				var url = args[1]
			    url = url.split('https://chat.whatsapp.com/')[1]
				var data = await conn.groupAcceptInvite(url)
				reply(jsonformat(data))
				break
            case prefix+'bc': case prefix+'broadcast':
			    if (!isOwner) return reply(mess.OnlyOwner)
		        if (args.length < 2) return reply(`Masukkan isi pesannya`)
                var data = await store.chats.all()
                for (let i of data) {
                   conn.sendMessage(i.id, { text: `${q}\n\n_*BROADCAST MESSAGE*_` })
                   await sleep(1000)
                }
                break
			case prefix+'setpp': case prefix+'setppbot':
		        if (!isOwner) return reply(mess.OnlyOwner)
		        if (isImage || isQuotedImage) {
				  var media = await downloadAndSaveMediaMessage('image', 'ppbot.jpeg')
				  var data =  await conn.updateProfilePicture(botNumber, { url: media })
			      fs.unlinkSync(media)
				  reply(`Sukses`)
				} else {
				  reply(`Kirim/balas gambar dengan caption ${command} untuk mengubah foto profil bot`)
				}
				break
			case prefix+'self':
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                conn.mode = 'self'
                reply(`Berhasil berubah ke mode Self!`)
                break
			case prefix+'public': case prefix+'publik':
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                conn.mode = 'public'
			    reply(`Berhasil berubah ke mode Public!`)
                break
			case prefix+'addprem':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}addprem* @tag waktu\n*${prefix}addprem* nomor waktu\n\nContoh : ${command} @tag 30d`)
                if (!args[2]) return reply(`Mau yang berapa hari?`)
                if (mentioned.length !== 0) {
                    _prem.addPremiumUser(mentioned[0], args[2], premium)
                    reply('Sukses')
                } else {
                 var cekap = await conn.onWhatsApp(args[1]+"@s.whatsapp.net")
                 if (cekap.length == 0) return reply(`Masukkan nomer yang valid/terdaftar di WhatsApp`)
                    _prem.addPremiumUser(args[1] + '@s.whatsapp.net', args[2], premium)
                    reply('Sukses')
                }
                break
            case prefix+'delprem':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}delprem* @tag\n*${prefix}delprem* nomor`)
                if (mentioned.length !== 0){
                    premium.splice(_prem.getPremiumPosition(mentioned[0], premium), 1)
                    fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                    reply('Sukses!')
                } else {
                 var cekpr = await conn.oWhatsApp(args[1]+"@s.whatsapp.net")
                 if (cekpr.length == 0) return reply(`Masukkan nomer yang valid/terdaftar di WhatsApp`)
                    premium.splice(_prem.getPremiumPosition(args[1] + '@s.whatsapp.net', premium), 1)
                    fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                    reply('Sukses!')
                }
                break
			// Random Menu
			
			// Search Menu
			case prefix+'yts': case prefix+'ytsearch':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
			    if (args.length < 2) return reply(`Kirim perintah ${command} query`)
				reply(mess.wait)
			    yts(q).then( data => {
				  let yt = data.videos
				  var jumlah = 15
				  if (yt.length < jumlah) jumlah = yt.length
				  var no = 0
				  let txt = `*YOUTUBE SEARCH*

 *Data berhasil didapatkan*
 *Hasil pencarian dari ${q}*
 
 *${prefix}getmusic <no urutan>*
 *${prefix}getvideo <no urutan>*
 Untuk mengambil Audio/Video dari hasil pencarian`
                for (let i = 0; i < jumlah; i++) {
				  no += 1
				  txt += `\n─────────────────\n\n*No Urutan : ${no.toString()}*\n*▢ Judul :* ${yt[i].title}\n*▢ ID :* ${yt[i].videoId}\n*▢ Channel :* ${yt[i].author.name}\n*▢ Upload :* ${yt[i].ago}\n*▢ Ditonton :* ${yt[i].views}\n*▢ Duration :* ${yt[i].timestamp}\n*▢ URL :* ${yt[i].url}\n`
				}
				conn.sendMessage(from, { image: { url: yt[0].image }, caption: txt }, { quoted: msg })
				limitAdd(sender, limit)
				}).catch(() => reply(mess.error.api))
			    break
			// Game Menu
			case prefix+'family100':
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (isPlayGame(from, family100)) return conn.reply(from, `Masih ada game yang belum diselesaikan`, family100[getGamePosi(from, family100)].msg)
                caliph.game.family100().then( data => {
                   var { pertanyaan, jawaban } = data.result
                   var teks = `*FAMILY 100*\n\n`+monospace(`Soal : ${pertanyaan}\nTotal Jawaban : ${jawaban.length}\nWaktu : ${gamewaktu}s`)
                   conn.sendMessage(from, { text: teks }, { quoted: msg, messageId: 'BAE5'+makeid(10).toUpperCase()+'FML' })
                   .then( res => {
                      let rgfds = []
                      for (let i of jawaban) {
                      let fefs = i.split('/') ? i.split('/')[0] : i
                      let iuhbb = fefs.startsWith(' ') ? fefs.replace(' ', '') : fefs
                      let axsf = iuhbb.endsWith(' ') ? iuhbb.replace(iuhbb.slice(-1), '') : iuhbb
                      rgfds.push(axsf.toLowerCase())
                    }
                     addPlayGame(from, 'Family 100', rgfds, gamewaktu, res, family100)
                     gameAdd(sender, glimit)
                     })
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'whoim':
                   if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                   if (isPlayGame(from, siapakahaku)) return conn.reply(from, `Masih ada game yang belum diselesaikan`, siapakahaku[getGamePosi(from, siapakahaku)].msg)
                   caliph.game.siapakahaku().then( data => {
                     var { pertanyaan, jawaban } = data.result
                     var teks = `*WHOIM GAME*\n\n`+monospace(`Soal : ${pertanyaan}\nPetunjuk : ${jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')}\nWaktu : ${gamewaktu}s`)
                     conn.sendMessage(from, { text: teks }, { quoted: msg, messageId: 'BAE5'+makeid(10).toUpperCase()+'WM' })
                     .then( res => {
                       var jawab = jawaban.toLowerCase()
                       addPlayGame(from, 'Whoim Game', jawab, gamewaktu, res, siapakahaku)
                       gameAdd(sender, glimit)
                     })
                   }).catch(() => reply(mess.error.api))
                   break
                case prefix+'math':
                   if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                   if (isPlayGame(from, math)) return conn.reply(from, `Masih ada game yang belum diselesaikan`, math[getGamePosi(from, math)].msg)
                   if (args.length < 2) return reply(`Masukkan modenya!\n\nMode yang tersedia :\n1. noob\n2. easy\n3. medium\n4. hard\n5. extreme\n6. impossible\n7. impossible2\n\nContoh : ${command} noob`)
                   try {
                      let bjir = await genMath(q.toLowerCase())
                   } catch {
                   	reply(`Lah?`)
                   }
                   var poke = await genMath(q.toLowerCase())
                   var { soal, mode, jawaban } = poke
                   var teks = `*MATH GAME*\n\n`+monospace(`Soal : ${soal}\nMode : ${mode}\nWaktu : ${gamewaktu}s`)
                   conn.sendMessage(from, { text: teks }, { quoted: msg, messageId: 'BAE5'+makeid(10).toUpperCase()+'MH' })
                   .then( res => {
                     var jawab = jawaban
                     addPlayGame(from, 'Math Game', jawab, gamewaktu, res, math)
                     gameAdd(sender, glimit)
                 }).catch(() => reply(mess.error.api))
                 break
                case prefix+'delgame': case prefix+'deletegame':
                case prefix+'dellgame': case prefix+'nyerah':
                   if (!isQuotedMsg) return reply(`Balas pesan soal game yang ingin dihapus`)
                   if (quotedMsg.id.endsWith('FML')) {
                     var fml = getGamePosi(from, family100)
                     if (fml == undefined) return reply(`Game tersebut sudah selesai`)
                     if (family100[fml].msg.key.id !== quotedMsg.id) return reply(`Game tersebut sudah selesai`)
                     reply(`*Tebak Gambar*\nJawaban : ${family100[fml].jawaban}`)
                     family100.splice(tg, 1)
                   } else if (quotedMsg.id.endsWith('WM')) {
                     var wm = getGamePosi(from, siapakahaku)
                     if (wm == undefined) return reply(`Game tersebut sudah selesai`)
                     if (siapakahaku[wm].msg.key.id !== quotedMsg.id) return reply(`Game tersebut sudah selesai`)
                     reply(`*Kuis Game*\nJawaban : ${siapakahaku[wm].jawaban}`)
                     siapakahaku.splice(wm, 1)
                   } else if (quotedMsg.id.endsWith('MH')) {
                     var mh = getGamePosi(from, math)
                     if (mh == undefined) return reply(`Game tersebut sudah selesai`)
                     if (math[mh].msg.key.id !== quotedMsg.id) return reply(`Game tersebut sudah selesai`)
                     reply(`*Tebak Lagu*\nJawaban : ${math[mh].jawaban}`)
                     math.splice(mh, 1)
                   } else {
                     reply(`Balas soal game!`)
                   }
                   break
			// Group Menu
			case prefix+'linkgrup': case prefix+'link': case prefix+'linkgc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				var url = await conn.groupInviteCode(from).catch(() => reply(mess.error.api))
			    url = 'https://chat.whatsapp.com/'+url
				reply(url)
				break
			case prefix+'setppgrup': case prefix+'setppgc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (isImage || isQuotedImage) {
				  var media = await downloadAndSaveMediaMessage('image', `ppgc${from}.jpeg`)
			      await conn.updateProfilePicture(from, { url: media })
				  .then( res => {
					reply(`Sukses`)
					fs.unlinkSync(media)
				  }).catch(() => reply(mess.error.api))
				} else {
			      reply(`Kirim/balas gambar dengan caption ${command}`)
				}
				break
			case prefix+'setnamegrup': case prefix+'setnamegc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} teks`)
				await conn.groupUpdateSubject(from, q)
			    .then( res => {
				  reply(`Sukses`)
				}).catch(() => reply(mess.error.api))
			    break
			case prefix+'setdesc': case prefix+'setdescription':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} teks`)
				await conn.groupUpdateDescription(from, q)
			    .then( res => {
			      reply(`Sukses`)
				}).catch(() => reply(mess.error.api))
				break
			case prefix+'group': case prefix+'grup':
		        if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
				if (args[1] == "close") {
				  conn.groupSettingUpdate(from, 'announcement')
				  reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
				} else if (args[1] == "open") {
				  conn.groupSettingUpdate(from, 'not_announcement')
				  reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
				} else {
				  reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
				}
			    break
			case prefix+'revoke':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				await conn.groupRevokeInvite(from)
			    .then( res => {
				  reply(`Sukses menyetel tautan undangan grup ini`)
				}).catch(() => reply(mess.error.api))
				break
			case prefix+'hidetag':
		        if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
			    let mem = [];
		        groupMembers.map( i => mem.push(i.id) )
				conn.sendMessage(from, { text: q ? q : '', mentions: mem })
			    break
             case prefix+'welcome':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (args.length < 2) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === "enable") {
                   if (isWelcome) return reply(`Welcome sudah aktif`)
                   welcome.push(from)
                   fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
                   reply(`Sukses mengaktifkan welcome di grup ini`)
                } else if (args[1].toLowerCase() === "disable") {
                   if (!isWelcome) return reply(`Welcome sudah nonaktif`)
                   var posi = welcome.indexOf(from)
                   welcome.splice(posi, 1)
                   fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
                   reply(`Sukses menonaktifkan welcome di grup ini`)
                } else {
                   reply(`Pilih enable atau disable`)
                }
                break
			// Bank & Payment Menu
			case prefix+'topbalance':{
                balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
                let top = '*── 「 TOP BALANCE 」 ──*\n\n'
                let arrTop = []
				var total = 10
				if (balance.length < 10) total = balance.length
                for (let i = 0; i < total; i ++){
                    top += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${balance[i].balance}\n\n`
                    arrTop.push(balance[i].id)
                }
                mentions(top, arrTop, true)
            }
                break
            case prefix+'buylimit':{
                if (args.length < 2) return reply(`Kirim perintah *${prefix}buylimit* jumlah limit yang ingin dibeli\n\nHarga 1 limit = $150 balance`)
                if (args[1].includes('-')) return reply(`Jangan menggunakan -`)
                if (isNaN(args[1])) return reply(`Harus berupa angka`)
                if (args[1].toLowerCase() === 'infinity') return reply(`Yahaha saya ndak bisa di tipu`)
                let ane = Number(parseInt(args[1]) * 150)
                if (getBalance(sender, balance) < ane) return reply(`Balance kamu tidak mencukupi untuk pembelian ini`)
                kurangBalance(sender, ane, balance)
                giveLimit(sender, parseInt(args[1]), limit)
                reply(monospace(`Pembeliaan limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Limit : ${getLimit(sender, limitCount, limit)}/${limitCount}`))
            }
                break
			case prefix+'transfer':
            case prefix+'tf':{
                 if (args.length < 2) return reply(`Kirim perintah *${command}* @tag nominal\nContoh : ${command} @0 2000`)
                 if (mentioned.length == 0) return reply(`Tag orang yang ingin di transfer balance`)
                 if (!args[2]) return reply(`Masukkan nominal nya!`)
                 if (isNaN(args[2])) return reply(`Nominal harus berupa angka!`)
                 if (args[2].toLowerCase() === 'infinity') return reply(`Yahaha saya ndak bisa di tipu`)
                 if (args[2].includes("-")) return reply(`Jangan menggunakan -`)
                 var anu = getBalance(sender, balance)
                 if (anu < args[2] || anu == 'undefined') return reply(`Balance Kamu Tidak Mencukupi Untuk Transfer Sebesar $${args[2]}, Kumpulkan Terlebih Dahulu\nKetik ${prefix}balance, untuk mengecek Balance mu!`)
                 kurangBalance(sender, parseInt(args[2]), balance)
                 addBalance(mentioned[0], parseInt(args[2]), balance)
                 reply(`Sukses transfer balance sebesar $${args[2]} kepada @${mentioned[0].split("@")[0]}`)
            }
                 break
            case prefix+'buygamelimit':
            case prefix+'buyglimit':{
                if (args.length < 2) return reply(`Kirim perintah *${prefix}buyglimit* jumlah game limit yang ingin dibeli\n\nHarga 1 game limit = $150 balance\nPajak $1 / $10`)
                if (args[1].includes('-')) return reply(`Jangan menggunakan -`)
                if (isNaN(args[1])) return reply(`Harus berupa angka`)
                if (args[1].toLowerCase() === 'infinity') return reply(`Yahaha saya ndak bisa di tipu`)
                let ane = Number(parseInt(args[1]) * 150)
                if (getBalance(sender, balance) < ane) return reply(`Balance kamu tidak mencukupi untuk pembelian ini`)
                kurangBalance(sender, ane, balance)
                givegame(sender, parseInt(args[1]), glimit)
                reply(monospace(`Pembeliaan game limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Game Limit : ${cekGLimit(sender, gcount, glimit)}/${gcount}`))
            }
                break
			case prefix+'limit': case prefix+'balance':
			case prefix+'ceklimit': case prefix+'cekbalance':
			    if (mentioned.length !== 0){
					var Ystatus = ownerNumber.includes(mentioned[0])
					var isPrim = Ystatus ? true : _prem.checkPremiumUser(mentioned[0], premium)
				    var ggcount = isPrim ? gcounti.prem : gcounti.user
                    var limitMen = `${getLimit(mentioned[0], limitCount, limit)}`
                    textImg(`Limit : ${_prem.checkPremiumUser(mentioned[0], premium) ? 'Unlimited' : limitMen}/${limitCount}\nLimit Game : ${cekGLimit(mentioned[0], ggcount, glimit)}/${ggcount}\nBalance : $${getBalance(mentioned[0], balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`)
                } else {
                    var limitPrib = `${getLimit(sender, limitCount, limit)}/${limitCount}`
                    textImg(`Limit : ${isPremium ? 'Unlimited' : limitPrib}\nLimit Game : ${cekGLimit(sender, gcount, glimit)}/${gcount}\nBalance : $${getBalance(sender, balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`)
                }
				break
			default:
			if (!isGroup && isCmd) {
				reply(`Command belum tersedia, coba beberapa hari kedepan yaa! _^`)
			}
		}
	} catch (err) {
		console.log(color('[ERROR]', 'red'), err)
	}
}
