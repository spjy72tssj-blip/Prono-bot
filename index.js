const { Telegraf } = require('telegraf');
const Groq = require('groq-sdk');
const http = require('http');
http.createServer((req, res) => res.end('Bot OK')).listen(process.env.PORT || 10000);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("🇹🇬 PRONO TOGO en ligne!\nEnvoie un match: Real vs Barca"));

bot.on('text', async (ctx) => {
  if (ctx.message.text.startsWith('/')) return;
  await ctx.sendChatAction('typing');
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: `Prono score exact pour ${ctx.message.text}. Donne en français 3 scores exacts probables avec %, petite analyse et conseil mise responsable. Style jeune togolais.` }]
    });
    await ctx.reply(completion.choices[0].message.content);
  } catch (e) {
    console.log("GROQ ERROR:", e.message);
    await ctx.reply(`Bug technique: ${e.message.slice(0,100)}\nVérifie ta clé GROQ sur Render.`);
  }
});

bot.launch();
console.log("BOT EN LIGNE!");
