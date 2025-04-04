import telebot
from agent import initialize_agent_with_tools
bot=telebot.TeleBot(token="8058726824:AAHaj0XydG8pdpdiMO7FqhdjHFNjZwKb1yk")
print(bot.get_me())
import os
@bot.message_handler(commands=['start'])
def start(message):
    bot.send_message(message.chat.id, "Welcome to the Chatbot! How can I assist you today?")
    
    
    
@bot.message_handler(func=lambda message: True)
def handle_message(message):
    # Initialize the agent with tools
    agent = initialize_agent_with_tools()
    
    # Process the user's message using the agent
    response = agent.run(message.text)
    
    # Send the response back to the user
    bot.send_message(message.chat.id, response)
    
    
bot.infinity_polling()