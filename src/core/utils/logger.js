

let chalk;
async function getChalk() {
  if (!chalk) {
    chalk = (await import('chalk')).default;
  }
  return chalk;
}

// Configurable width for centering headers
const HEADER_WIDTH = 60;

function centerText(text, width = HEADER_WIDTH) {
  if (text.length >= width) return text;
  const totalPad = width - text.length;
  const padLeft = Math.floor(totalPad / 2);
  const padRight = totalPad - padLeft;
  return ' '.repeat(padLeft) + text + ' '.repeat(padRight);
}

function getTimestamp() {
  return chalk.gray(new Date().toLocaleString('tr-TR', { hour12: false }));
}

function logHeader(title, width = HEADER_WIDTH) {
  const line = '-'.repeat(width);
  console.log(chalk.bold.cyan(line));
  console.log(chalk.bold.cyan(centerText(title.toUpperCase(), width)));
  console.log(chalk.bold.cyan(line));
}


const colorNames = ['green', 'yellow', 'red', 'magenta', 'cyan', 'white'];

async function log(level, color, args) {
  const chalk = await getChalk();
  const colorFn = colorNames.includes(color) ? chalk[color] : chalk.white;
  const tag = colorFn(`[${level}]`);
  const ts = chalk.gray(new Date().toLocaleString('tr-TR', { hour12: false }));
  if (level === 'ERROR' && args[0] instanceof Error) {
    console.error(ts, tag, chalk.red(args[0].stack || args[0].toString()), ...args.slice(1));
  } else {
    console.log(ts, tag, ...args);
  }
}


function info(...args) {
  log('INFO', 'green', args);
}

function warn(...args) {
  log('WARN', 'yellow', args);
}

function error(...args) {
  log('ERROR', 'red', args);
}

function debug(...args) {
  if (process.env.NODE_ENV !== 'production') {
    log('DEBUG', 'magenta', args);
  }
}

module.exports = {
  logHeader,
  info,
  warn,
  error,
  debug,
  centerText,
};
