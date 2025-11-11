const DailyTask = require('../../database/models/DailyTask');
const User = require('../../database/models/User');
const { roundCurrency } = require('../utils/currency');
const moment = require('moment');

const DEFAULT_TASKS = [
  { name: '5 balık yakala', key: 'catchFish', target: 5, reward: 50 },
  { name: '2 kişiye para gönder', key: 'sendMoney', target: 2, reward: 30 },
  { name: 'Profilini görüntüle', key: 'viewProfile', target: 1, reward: 20 }
];
const ALL_COMPLETED_REWARD = 100;

function getTodayKey() {
  return moment().format('YYYY-MM-DD');
}

async function getOrCreateDailyTasks(userId) {
  const today = getTodayKey();
  let daily = await DailyTask.findOne({ userId, date: today });
  if (!daily) {
    daily = await DailyTask.create({
      userId,
      date: today,
      tasks: DEFAULT_TASKS.map(t => ({ name: t.name, completed: false, reward: t.reward, key: t.key })),
      allCompletedRewardGiven: false
    });
  }
  return daily;
}

async function completeTask(userId, key) {
  const today = getTodayKey();
  const daily = await getOrCreateDailyTasks(userId);
  const task = daily.tasks.find(t => t.key === key);
  if (task && !task.completed) {
    task.completed = true;
    await daily.save();
    await giveUserReward(userId, task.reward);
    return { task, allCompleted: daily.tasks.every(t => t.completed) };
  }
  return { task: null, allCompleted: false };
}

async function giveUserReward(userId, amount) {
  const user = await User.findOne({ userId });
  if (user) {
    user.balance = roundCurrency((user.balance || 0) + amount);
    await user.save();
  }
}

async function giveAllCompletedReward(userId) {
  const today = getTodayKey();
  const daily = await getOrCreateDailyTasks(userId);
  if (!daily.allCompletedRewardGiven && daily.tasks.every(t => t.completed)) {
    await giveUserReward(userId, ALL_COMPLETED_REWARD);
    daily.allCompletedRewardGiven = true;
    await daily.save();
    return true;
  }
  return false;
}

async function getDailyTaskStatus(userId) {
  const daily = await getOrCreateDailyTasks(userId);
  return {
    tasks: daily.tasks,
    allCompleted: daily.tasks.every(t => t.completed),
    allCompletedRewardGiven: daily.allCompletedRewardGiven
  };
}

module.exports = {
  getOrCreateDailyTasks,
  completeTask,
  giveAllCompletedReward,
  getDailyTaskStatus,
  DEFAULT_TASKS,
  ALL_COMPLETED_REWARD
};
