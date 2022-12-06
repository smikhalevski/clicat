export function parseCliOptions(args: string[]): Record<string, string[] | undefined>;

/**
 * Parses CLI options from the list of CLI arguments.
 *
 * @param args CLI arguments retrieved by `process.argv.slice(2)`.
 * @param aliases Map from a full option name to a shorthand.
 */
export function parseCliOptions<T extends string>(args: string[], aliases: Record<T, string | string[]>): Record<T, string[] | undefined>;

export function parseCliOptions<T extends string>(args: string[], aliases?: Record<string, string | string[]>): Record<string, string[] | undefined> {
  const result: Record<string, string[] | undefined> = {};

  let optionKey: string | undefined = '';

  let shorthands = undefined;

  for (let i = 0; i < args.length; ++i) {
    const arg = args[i];

    // Everything after -- is preserved as is
    if (arg === '--') {
      result['--'] = args.slice(i + 1);
      break;
    }

    // --foo as a longhand option
    if (arg.startsWith('--')) {
      optionKey = arg.substring(2);
      result[optionKey] ||= [];
      continue;
    }

    // -abc is the same as -a -b -c
    if (arg.length !== 1 && arg.charAt(0) === '-') {

      shorthands ||= aliases && createShorthands(aliases);

      // No aliases, no key
      if (!shorthands) {
        optionKey = undefined;
        continue;
      }

      // Only known aliases are allowed
      for (const shorthand of arg.substring(1).split('')) {
        optionKey = shorthands[shorthand];
        if (optionKey !== undefined) {
          result[optionKey] ||= [];
        }
      }
      continue;
    }

    if (optionKey === undefined) {
      optionKey = '';
      continue;
    }

    if (optionKey === '') {
      result[optionKey] ||= [];
    }

    result[optionKey]!.push(arg);
    optionKey = '';
  }

  return result;
}

function createShorthands(aliases: Record<string, string | string[]>): Record<string, string | undefined> {
  const shorthands: Record<string, string | undefined> = {};

  for (const optionKey in aliases) {
    const shorthand = aliases[optionKey];

    if (typeof shorthand === 'string') {
      shorthands[shorthand] = optionKey;
      continue;
    }
    for (let i = 0; i < shorthand.length; ++i) {
      shorthands[shorthand[i]] ||= optionKey;
    }
  }
  return shorthands;
}
