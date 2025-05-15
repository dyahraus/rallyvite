import axios from 'axios';

export const setRepeatIntervalCall = async (eventUuid, repeatInterval) => {
  if (!eventUuid || !repeatInterval || repeatInterval === 'None') return;

  // Extract number and unit from string like "Every 2 Weeks"
  const match = repeatInterval
    .trim()
    .toLowerCase()
    .match(/^every\s+(\d+)\s+(week|weeks|month|months)$/);

  if (!match) {
    throw new Error('Invalid repeat interval format');
  }

  const [_, value, unit] = match;

  const formatted = `${value} ${unit}`;
  const url = `/api/events/setrepeat/${eventUuid}`;

  const res = await axios.post(url, {
    repeatInterval: formatted,
  });

  return res.data;
};
