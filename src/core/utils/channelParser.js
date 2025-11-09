function extractChannelIdsFromArgs(args, guild) {
  if (!Array.isArray(args) || !guild) {
    return [];
  }

  const results = new Set();

  args.forEach((arg) => {
    if (!arg || typeof arg !== 'string') {
      return;
    }

    const trimmed = arg.trim();

    const mentionMatch = trimmed.match(/^<#!?(\d+)>$/);
    if (mentionMatch) {
      results.add(mentionMatch[1]);
      return;
    }

    if (/^\d+$/.test(trimmed)) {
      results.add(trimmed);
      return;
    }

    const channelByName = guild.channels.cache.find((channel) => channel.name === trimmed);
    if (channelByName) {
      results.add(channelByName.id);
    }
  });

  return Array.from(results);
}

function ensureGuildChannel(channelId, guild) {
  if (!guild) {
    return null;
  }
  return guild.channels.cache.get(channelId) || null;
}

module.exports = {
  extractChannelIdsFromArgs,
  ensureGuildChannel
};
