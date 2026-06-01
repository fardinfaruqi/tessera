import type { TesseraBlock, MendResult } from '../types';

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function mendSchedule(blocks: TesseraBlock[]): MendResult {
  const scheduled = blocks.filter(b => b.status === 'scheduled');
  const others = blocks.filter(b => b.status !== 'scheduled');

  // Step 1: Move low priority scheduled items to overflow
  const lowPriority = scheduled.filter(b => b.priority === 'low');
  const keepBlocks = scheduled.filter(b => b.priority !== 'low');

  const overflowed = lowPriority.map(b => ({
    ...b,
    status: 'overflow' as const,
    startTime: undefined,
  }));

  // Step 2: Sort remaining by startTime
  const sorted = [...keepBlocks].sort((a, b) => {
    if (!a.startTime || !b.startTime) return 0;
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });

  // Step 3: Resolve conflicts by re-packing without overlaps
  const resolved: TesseraBlock[] = [];
  let currentEnd = 9 * 60; // Start at 09:00

  for (const block of sorted) {
    const blockStart = block.startTime ? timeToMinutes(block.startTime) : currentEnd;
    const actualStart = Math.max(blockStart, currentEnd);

    resolved.push({
      ...block,
      startTime: minutesToTime(actualStart),
    });

    currentEnd = actualStart + block.duration;
  }

  const shiftedNames = keepBlocks
    .filter((b, i) => b.startTime !== resolved[i]?.startTime)
    .map(b => `"${b.title}"`);

  const overflowNames = overflowed.map(b => `"${b.title}"`);

  let message = `🧩 Tessera Realignment Complete: `;
  if (shiftedNames.length > 0) {
    message += `Shifted ${shiftedNames.join(', ')} to resolve conflicts. `;
  }
  if (overflowed.length > 0) {
    message += `Moved ${overflowed.length} low-priority item${overflowed.length > 1 ? 's' : ''} (${overflowNames.join(', ')}) to tomorrow to preserve your Deep Work windows.`;
  }

  return {
    updatedBlocks: [...resolved, ...overflowed, ...others],
    message,
    itemsShifted: shiftedNames.length,
    itemsOverflowed: overflowed.length,
  };
}
