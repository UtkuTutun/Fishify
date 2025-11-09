const Guild = require('../../database/models/Guild');
const config = require('../../config');

const CACHE_TTL_MS = 60 * 1000;
const cache = new Map(); // guildId -> { data, expiresAt }

function getDefaultSettings() {
  return {
    prefix: config.prefix,
    allowedChannels: []
  };
}

function readFromCache(guildId) {
  const entry = cache.get(guildId);
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(guildId);
    return null;
  }

  return entry.data;
}

function writeToCache(guildId, data) {
  cache.set(guildId, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS
  });
}

function normalizeChannels(channels) {
  if (!Array.isArray(channels)) {
    return [];
  }
  return [...new Set(channels.map(String))];
}

async function fetchGuildDocument(guildId) {
  const guild = await Guild.findOne({ guildId });
  if (!guild) {
    return null;
  }
  return guild;
}

async function ensureGuildDocument(guildId) {
  let guild = await fetchGuildDocument(guildId);
  if (!guild) {
    guild = await Guild.create({ guildId, prefix: config.prefix, allowedChannels: [] });
  }
  return guild;
}

async function getGuildSettings(guildId) {
  const cached = readFromCache(guildId);
  if (cached) {
    return cached;
  }

  const guild = await fetchGuildDocument(guildId);
  if (!guild) {
    const defaults = getDefaultSettings();
    writeToCache(guildId, defaults);
    return defaults;
  }

  const settings = {
    prefix: guild.prefix || config.prefix,
    allowedChannels: normalizeChannels(guild.allowedChannels)
  };
  writeToCache(guildId, settings);
  return settings;
}

async function addAllowedChannels(guildId, channelIds) {
  const normalized = normalizeChannels(channelIds);
  if (normalized.length === 0) {
    return { added: [], alreadyPresent: [] };
  }

  const guild = await ensureGuildDocument(guildId);
  const current = normalizeChannels(guild.allowedChannels);

  const added = [];
  const alreadyPresent = [];

  normalized.forEach((id) => {
    if (current.includes(id)) {
      alreadyPresent.push(id);
    } else {
      current.push(id);
      added.push(id);
    }
  });

  if (added.length > 0) {
    guild.allowedChannels = current;
    await guild.save();
    writeToCache(guildId, {
      prefix: guild.prefix || config.prefix,
      allowedChannels: current
    });
  }

  return { added, alreadyPresent };
}

async function removeAllowedChannels(guildId, channelIds) {
  const normalized = normalizeChannels(channelIds);
  if (normalized.length === 0) {
    return { removed: [], notFound: [] };
  }

  const guild = await ensureGuildDocument(guildId);
  const current = normalizeChannels(guild.allowedChannels);

  const removed = [];
  const notFound = [];

  normalized.forEach((id) => {
    if (current.includes(id)) {
      removed.push(id);
    } else {
      notFound.push(id);
    }
  });

  if (removed.length > 0) {
    const updated = current.filter((id) => !removed.includes(id));
    guild.allowedChannels = updated;
    await guild.save();
    writeToCache(guildId, {
      prefix: guild.prefix || config.prefix,
      allowedChannels: updated
    });
  }

  return { removed, notFound };
}

async function clearAllowedChannels(guildId) {
  const guild = await ensureGuildDocument(guildId);
  guild.allowedChannels = [];
  await guild.save();
  writeToCache(guildId, {
    prefix: guild.prefix || config.prefix,
    allowedChannels: []
  });
}

async function setPrefix(guildId, prefix) {
  const guild = await ensureGuildDocument(guildId);
  guild.prefix = prefix;
  await guild.save();
  writeToCache(guildId, {
    prefix,
    allowedChannels: normalizeChannels(guild.allowedChannels)
  });
}

module.exports = {
  getGuildSettings,
  addAllowedChannels,
  removeAllowedChannels,
  clearAllowedChannels,
  setPrefix
};
