import TelegramBot from 'node-telegram-bot-api';

// bot token
const token = '7459803177:AAH4VHecsa-NAWtRaIdpDLajuH0E-Gn0ax0';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Object to store user counters
const userCounters = {};

// Inline keyboard markup
const getKeyboard = () => {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: 'Increment', callback_data: 'increment' }]]
    }
  };
};

// Handler for /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const firstName = msg.from.first_name;

  // Initialize user counter if not exists
  if (!userCounters[userId]) {
    userCounters[userId] = 0;
  }

  bot.sendMessage(
    chatId,
    `Hello, ${firstName}!\nYour current count is: ${userCounters[userId]}`,
    getKeyboard()
  );
});

// Handler for button clicks
bot.on('callback_query', (callbackQuery) => {
  const userId = callbackQuery.from.id;
  const firstName = callbackQuery.from.first_name;
  const messageId = callbackQuery.message.message_id;
  const chatId = callbackQuery.message.chat.id;

  // Increment user counter
  userCounters[userId] = (userCounters[userId] || 0) + 1;

  bot.editMessageText(
    `Hello, ${firstName}!\nYour current count is: ${userCounters[userId]}`,
    {
      chat_id: chatId,
      message_id: messageId,
      ...getKeyboard()
    }
  );

  // Answer the callback query
  bot.answerCallbackQuery(callbackQuery.id);
});

console.log('Bot is running...');