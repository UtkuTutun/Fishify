let chalk;
let chalkInitPromise;

function loadChalk() {
  if (!chalkInitPromise) {
    chalkInitPromise = import('chalk')
      .then((mod) => {
        chalk = mod.default || mod;
        return chalk;
      })
      .catch(() => {
        chalk = null;
        return null;
      });
  }
  return chalkInitPromise;
}

// trigger chalk loading early so the first log does not block unnecessarily
void loadChalk();

// Configurable width for centering headers
const HEADER_WIDTH = 60;

function centerText(text, width = HEADER_WIDTH) {
  if (text.length >= width) return text;
  const totalPad = width - text.length;
  const padLeft = Math.floor(totalPad / 2);
  const padRight = totalPad - padLeft;
  return ' '.repeat(padLeft) + text + ' '.repeat(padRight);
}

function colorize(color, payload) {
  if (!chalk || typeof chalk[color] !== 'function') {
    return payload;
  }
  return chalk[color](payload);
}

function formatTimestamp() {
  const rawTimestamp = new Date().toLocaleString('tr-TR', { hour12: false });
  return chalk ? chalk.gray(rawTimestamp) : rawTimestamp;
}

function logHeader(title, width = HEADER_WIDTH) {
  const line = '-'.repeat(width);
  const formatter = chalk ? chalk.bold.cyan : (value) => value;
  console.log(formatter(line));
  console.log(formatter(centerText(title.toUpperCase(), width)));
  console.log(formatter(line));
}

async function log(level, color, args) {
  await loadChalk();
  const tag = colorize(color, `[${level}]`);
  const timestamp = formatTimestamp();
  if (level === 'ERROR' && args[0] instanceof Error) {
    const errorObject = args[0];
    const stack = errorObject.stack || errorObject.toString();
    console.error(timestamp, tag, colorize('red', stack), ...args.slice(1));
    return;
  }
  console.log(timestamp, tag, ...args);
}

function info(...args) {
  return log('INFO', 'green', args);
}

function warn(...args) {
  return log('WARN', 'yellow', args);
}

function error(...args) {
  return log('ERROR', 'red', args);
}

function debug(...args) {
  if (process.env.NODE_ENV !== 'production') {
    return log('DEBUG', 'magenta', args);
  }
  return Promise.resolve();
}

module.exports = {
  logHeader,
  info,
  warn,
  error,
  debug,
  centerText,
};
