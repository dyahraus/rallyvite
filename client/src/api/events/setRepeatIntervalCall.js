import axios from 'axios';

export const setRepeatIntervalCall = async (eventUuid, repeatInterval) => {
  console.log('Incoming repeatInterval:', repeatInterval);

  if (!eventUuid || !repeatInterval || repeatInterval === 'None') return;

  // Normalize the input
  const normalized = repeatInterval.trim().toLowerCase();

  // Handle "Every Week", "Every Month", "Every Year" (no number specified)
  const simpleMatch = normalized.match(/^every\s+(week|month|year)$/);
  if (simpleMatch) {
    const unit = simpleMatch[1]; // already singular
    const formatted = `1 ${unit}`;
    return await sendRepeat(eventUuid, formatted);
  }

  // Handle "Every X Weeks", "Every X Months", "Every X Years"
  const numberedMatch = normalized.match(
    /^every\s+(\d+)\s+(weeks?|months?|years?)$/
  );
  if (numberedMatch) {
    const value = numberedMatch[1];
    let unit = numberedMatch[2];

    // Normalize plural to singular
    if (unit.endsWith('s')) {
      unit = unit.slice(0, -1);
    }

    const formatted = `${value} ${unit}`;
    return await sendRepeat(eventUuid, formatted);
  }

  throw new Error(`Invalid repeat interval format: ${repeatInterval}`);
};

const sendRepeat = async (eventUuid, formatted) => {
  const url = `/api/events/setrepeat/${eventUuid}`;
  console.log('POSTING formatted repeatInterval:', formatted);
  const res = await axios.post(url, { repeatInterval: formatted });
  return res.data;
};
