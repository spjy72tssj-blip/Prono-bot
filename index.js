const { Telegraf } = require('telegraf');
const Groq = require('groq-sdk');
const http = require('http');

// Pour que Render soit content
http.createServer((req, res) => res.end('Bot OK')).listen(process.env.PORT || 10000);

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!BOT_TOKEN ||!GROQ_API_KEY) {
  console.log("ERREUR: Mets BOT_TOKEN et GROQ_API_KEY dans Render > Environment");
}

const groq = new Groq({ apiKey: GROQ_API_KEY });
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("🇹🇬 PRONO TOGO en ligne!\nEnvoie un match: Real vs Barca");
});

bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith('/')) return;
  await ctx.sendChatAction('typing');
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: `Tu es pronostiqueur score exact. Match: "${text}". Réponds en français court, style jeune togolais. Donne 3 scores exacts avec % et petite analyse. Conseil mise. Jeu responsable.` }]
    });
    await ctx.reply(completion.choices[0].message.content);
  } catch (e) {
    console.log(e.message);
    await ctx.reply("Erreur, réessaie: Exemple: Togo vs Sénégal");
  }
});

bot.launch();
console.log("BOT TELEGRAM EN LIGNE!");
