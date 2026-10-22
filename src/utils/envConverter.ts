/**
 * Utility for parsing and formatting .env (dotenv) files
 * Supporting bidirectional conversion with JSON/YAML
 */

export function parseEnv(envStr: string): Record<string, any> {
  const result: Record<string, any> = {};
  if (!envStr || !envStr.trim()) return result;

  const lines = envStr.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    // Skip empty lines or pure comment lines
    if (!rawLine || rawLine.startsWith('#') || rawLine.startsWith(';')) {
      continue;
    }

    // Strip optional export prefix
    const line = rawLine.startsWith('export ') ? rawLine.slice(7).trim() : rawLine;

    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) {
      // Key without value
      const key = line.trim();
      if (key) result[key] = '';
      continue;
    }

    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();

    if (!key) continue;

    // Handle quoted values
    if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
      val = val.slice(1, -1);
      // Unescape standard escape characters
      val = val
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
      result[key] = val;
    } else if (val.startsWith("'") && val.endsWith("'") && val.length >= 2) {
      // Single-quoted: raw string
      result[key] = val.slice(1, -1);
    } else {
      // Unquoted value: remove inline comment if separated by space
      const commentIdx = val.search(/\s+#/);
      if (commentIdx !== -1) {
        val = val.slice(0, commentIdx).trim();
      }

      // Check if it's a JSON array or object
      if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
        try {
          result[key] = JSON.parse(val);
          continue;
        } catch {
          // Keep as string if invalid JSON
        }
      }

      // Type inferences for unquoted values
      if (val.toLowerCase() === 'true') {
        result[key] = true;
      } else if (val.toLowerCase() === 'false') {
        result[key] = false;
      } else if (val.toLowerCase() === 'null') {
        result[key] = null;
      } else if (/^-?\d+(\.\d+)?$/.test(val) && !/^0\d+/.test(val)) {
        // Number, but exclude octal-like leading zeros (e.g. 0123)
        result[key] = Number(val);
      } else {
        result[key] = val;
      }
    }
  }

  return result;
}

/**
 * Flattens nested object keys with underscore (e.g. { db: { host: '127.0.0.1' } } -> { DB_HOST: '127.0.0.1' })
 */
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const flattened: Record<string, any> = {};

  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return flattened;
  }

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}_${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }

  return flattened;
}

export function stringifyEnv(obj: any): string {
  if (!obj || typeof obj !== 'object') {
    return '';
  }

  const flattened = Array.isArray(obj) ? {} : flattenObject(obj);
  const lines: string[] = [];

  for (const [key, val] of Object.entries(flattened)) {
    const formattedKey = key.trim();
    if (!formattedKey) continue;

    if (val === null || val === undefined) {
      lines.push(`${formattedKey}=`);
    } else if (typeof val === 'boolean' || typeof val === 'number') {
      lines.push(`${formattedKey}=${val}`);
    } else if (Array.isArray(val) || typeof val === 'object') {
      lines.push(`${formattedKey}='${JSON.stringify(val)}'`);
    } else {
      const strVal = String(val);
      // Quote strings that contain spaces, newlines, quotes, or special characters
      if (strVal.includes('\n') || strVal.includes('\r')) {
        const escaped = strVal
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r');
        lines.push(`${formattedKey}="${escaped}"`);
      } else if (/[\s#"']/.test(strVal) || strVal === '') {
        lines.push(`${formattedKey}="${strVal.replace(/"/g, '\\"')}"`);
      } else {
        lines.push(`${formattedKey}=${strVal}`);
      }
    }
  }

  return lines.join('\n');
}
