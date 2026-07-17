import { readdirSync, readFileSync, renameSync } from 'node:fs';
import { join, basename } from 'node:path';

export function listPending(queueDir) {
  const pendingDir = join(queueDir, 'pending');
  const files = readdirSync(pendingDir).filter(f => f.endsWith('.json'));
  return files
    .map(f => {
      const path = join(pendingDir, f);
      const data = JSON.parse(readFileSync(path, 'utf8'));
      return { path, edition: data.edition, data };
    })
    .sort((a, b) => a.edition - b.edition);
}

export function markProcessed(pendingPath, queueDir) {
  const newPath = join(queueDir, 'processed', basename(pendingPath));
  renameSync(pendingPath, newPath);
  return newPath;
}
