const { Telegraf } = require('telegraf');
const Groq = require('groq-sdk');
const BOT_TOKEN = process.env.BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });
const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => {
  ctx.reply("🇹🇬 Bienvenue PRONO TOGO!\nEnvoie un match comme:\nReal vs Barca\nTogo vs Sénégal");
});
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  if(text.startsWith('/')) return;
  await ctx.sendChatAction('typing');
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: `Tu es pronostiqueur score exact Togo. Match: "${text}". Réponds français style jeune togolais. Format: ⚽ MATCH: [equipes] 🎯 3 PRONOS SCORE EXACT: 1. [score] - [%] - [explication] 2. [score] - [%] - [explication] 3. [score] - [%] - [explication] 💰 MISE: conseille ⚠️ Jeu responsable` }]
    });
    await ctx.reply(completion.choices[0].message.content);
  } catch(e) {
    await ctx.reply("Erreur, réessaie. Ex: Real vs Barca");
  }
});
bot.launch();
console.log("BOT TELEGRAM EN LIGNE!");
