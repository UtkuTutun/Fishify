const dailyTaskService = require('../../core/services/economy/dailyTaskService');

module.exports = {
  name: 'gorevler',
  description: 'Günlük görevlerini ve durumunu gösterir.',
  usage: '!gorevler',
  async execute(message, args) {
    const userId = message.author.id;
    const status = await dailyTaskService.getDailyTaskStatus(userId);
    let desc = '';
    for (const task of status.tasks) {
      desc += `${task.completed ? '✅' : '❌'} ${task.name} (+${task.reward}₺)\n`;
    }
    if (status.allCompleted) {
      desc += `\n🎉 Tüm görevler tamamlandı!`;
      if (!status.allCompletedRewardGiven) {
        await dailyTaskService.giveAllCompletedReward(userId);
        desc += `\n💰 Toplu ödül kazandın! (+${dailyTaskService.ALL_COMPLETED_REWARD}₺)`;
      } else {
        desc += `\n💰 Toplu ödülünü zaten aldın.`;
      }
    }
    return message.channel.send({
      embeds: [{
        color: 0x43b581,
        title: 'Günlük Görevler',
        description: desc
      }]
    });
  }
};
