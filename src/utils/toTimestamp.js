const REGEX = /^((?:\d+)?\.?\d+) *([\w+]+)?$/gi;
const DURATION = {
  /* eslint-disable key-spacing */
  SECOND: 1000,
  MINUTE: 1000 * 60,
  HOUR:   1000 * 60 * 60,
  DAY:    1000 * 60 * 60 * 24,
  WEEK:   1000 * 60 * 60 * 24 * 7,
  MONTH:  1000 * 60 * 60 * 24 * 30,
  YEAR:   1000 * 60 * 60 * 24 * 365.25,
};

function tokenize(str) {
  const units = [];
  let buf = '';
  let letter = false;
  for (const char of str) {
    if (['.', ','].includes(char)) {
      buf += char;
    } else if (isNaN(parseInt(char, 10))) {
      buf += char;
      letter = true;
    } else {
      if (letter) {
        units.push(buf.trim());
        buf = '';
      }
      letter = false;
      buf += char;
    }
  }
  if (buf.length) units.push(buf.trim());
  return units;
}

function convert(num, type) {
  switch (type) {
    case 'annees':
    case 'annee':
    case 'ans':
    case 'an':
    case 'a':
      return num * DURATION.YEAR;
    case 'mois':
    case 'mo':
      return num * DURATION.MONTH;
    case 'semaines':
    case 'semaine':
    case 'sem':
      return num * DURATION.WEEK;
    case 'jours':
    case 'jour':
    case 'j':
      return num * DURATION.DAY;
    case 'heures':
    case 'heure':
    case 'hrs':
    case 'hr':
    case 'h':
      return num * DURATION.HOUR;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return num * DURATION.MINUTE;
    case 'secondes':
    case 'seconde':
    case 'secs':
    case 'sec':
    case 's':
      return num * DURATION.SECOND;
    default:
      return num;
  }
}

export default function toTimestamp(val) {
  let abs;
  let total = 0;
  if (typeof val === 'string' && val.length) {
    if (val.length < 101) {
      const units = tokenize(val.toLowerCase());
      for (const unit of units) {
        const fmt = REGEX.exec(unit);
        if (fmt) {
          abs = parseFloat(fmt[1]);
          total += convert(abs, fmt[2]);
        }
      }
      return total;
    }
  }
  throw new Error(`Value is an empty string, an invalid number, or too long (>100). Value=${JSON.stringify(val)}`);
}