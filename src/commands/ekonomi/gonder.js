const { EmbedBuilder } = require('discord.js');

const config = require('../../config');
const formatPrice = require('../../core/utils/formatPrice');
const economyService = require('../../core/services/economy/economyService');
const logMoneyTransfer = require('../../core/services/moneyTransferLogger');
const logger = require('../../core/utils/logger');

function buildUsageEmbed(prefix) {
  return new EmbedBuilder()
    .setTitle('❗ Hatalı Kullanım')
    .setDescription(`Kullanım: \
\`${prefix}gonder @kullanıcı miktar\``)
    .setColor(0xe74c3c)
    .setTimestamp();
}

function parseAmount(raw) {
  if (!raw) {
    return NaN;
  }
  const normalized = raw.replace(',', '.');
  return Number(normalized);
}

async function resolveTargetUser(message, args) {
  const mention = message.mentions.users.first();
  if (mention) {
    return mention;
  }

  const candidate = args?.[0];
  if (candidate && /^\d{16,20}$/.test(candidate)) {
    try {
      return await message.client.users.fetch(candidate);
    } catch (error) {
      await logger.debug(error);
    }
  }

  return null;
}

function buildLimitField(title, limit, used) {
  if (!limit) {
    return null;
  }
  const remaining = Math.max(0, economyService.roundCurrency(limit - used));
  return {
    name: title,
    value: `${formatPrice(remaining)} (Limit: ${formatPrice(limit)})`,
    inline: true
  };
}

function pickAmountArgument(args) {
  if (!Array.isArray(args) || args.length === 0) {
    return null;
  }
  const tokens = [...args];
  const mentionIndex = tokens.findIndex((token) => token.startsWith('<@'));
  if (mentionIndex !== -1) {
    tokens.splice(mentionIndex, 1);
  } else if (tokens[0] && /^\d{16,20}$/.test(tokens[0])) {
    tokens.shift();
  }
  return tokens.length ? tokens[tokens.length - 1] : null;
}

module.exports = {
  name: 'gonder',
  description: 'Belirtilen kullanıcıya bakiye gönderir.',
  async execute(message, args) {
    const settings = economyService.getTransferSettingsSnapshot();
    if (!settings.enabled) {
      const embed = new EmbedBuilder()
        .setTitle('🚫 Transfer Özelliği Kapalı')
        .setDescription('Şu anda oyuncular arasında bakiye transferi devre dışı.')
        .setColor(0xe74c3c)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    const prefix = message.client.config?.prefix || config.prefix;
  const target = await resolveTargetUser(message, args);
  const amountArg = pickAmountArgument(args);
    const amount = parseAmount(amountArg);

    if (!target || !Number.isFinite(amount) || amount <= 0) {
      return message.reply({ embeds: [buildUsageEmbed(prefix)] });
    }

    if (target.id === message.author.id) {
      const embed = new EmbedBuilder()
        .setTitle('❗ Hatalı İşlem')
        .setDescription('Kendine bakiye gönderemezsin.')
        .setColor(0xe74c3c)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    try {
      const result = await economyService.transferBalance({
        senderId: message.author.id,
        receiverId: target.id,
        amount
      });

      const nextReset = economyService.getNextResetDate();
      const embed = new EmbedBuilder()
        .setTitle('� Bakiye Transferi')
        .setDescription(`**${message.author.tag}**, **${target.tag}** kullanıcısına ${formatPrice(result.amount)} gönderdi.`)
        .setColor(0x2ecc71)
        .setTimestamp()
        .addFields(
          { name: 'Kesinti', value: formatPrice(result.fee), inline: true },
          { name: 'Toplam Düşen Bakiye', value: formatPrice(result.totalDebit), inline: true },
          { name: 'Gönderen Yeni Bakiyesi', value: formatPrice(result.sender.balance), inline: true },
          { name: 'Alıcı Yeni Bakiyesi', value: formatPrice(result.receiver.balance), inline: true }
        );

  const totalField = buildLimitField('Günlük Toplam Limit Kalan', result.limits.dailyTotalLimit, result.dailyTotals.total);
  const pairField = buildLimitField('Bu Kullanıcıya Günlük Limit Kalan', result.limits.dailyLimitPerUser, result.dailyTotals.pair);

      const fieldsToAdd = [totalField, pairField].filter(Boolean);
      if (fieldsToAdd.length) {
        embed.addFields(fieldsToAdd);
      }

      if (nextReset) {
        embed.addFields({
          name: 'Limit Sıfırlanma Zamanı',
          value: `<t:${Math.floor(nextReset.getTime() / 1000)}:F>`
        });
      }

      await message.reply({ embeds: [embed] });

      await logMoneyTransfer(
        message.client,
        message.author,
        target,
        result.amount,
        result.sender.balance,
        result.receiver.balance
      );
    } catch (error) {
      if (error?.message) {
        await logger.warn(`Transfer işlemi başarısız: ${error.message}`);
      } else {
        await logger.error(error);
      }
      const embed = new EmbedBuilder()
        .setTitle('� Transfer Gerçekleşmedi')
        .setDescription(error.message || 'Transfer sırasında bir hata oluştu.')
        .setColor(0xe74c3c)
        .setTimestamp();
      await message.reply({ embeds: [embed] });
    }
  }
};
