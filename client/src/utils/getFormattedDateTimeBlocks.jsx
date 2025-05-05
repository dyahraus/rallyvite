export function getFormattedDateTimeBlocks(getTogether) {
  console.log('getFormattedDateTimeBlocks input:', getTogether);
  const allBlocks = [];

  getTogether.locations.forEach((location) => {
    console.log('Processing location:', location);
    location.dates.forEach(({ date, times }) => {
      console.log('Processing date:', date, 'with times:', times);
      // Step 1: convert and sort active times
      const baseDate = new Date(date);
      // Ensure we're using the correct timezone
      const timezoneOffset = baseDate.getTimezoneOffset();
      baseDate.setMinutes(baseDate.getMinutes() + timezoneOffset);

      const selectedTimes = Object.entries(times)
        .filter(([, selected]) => selected)
        .map(([key]) => {
          const [hour, minute] = key.split('-').map(Number);
          const d = new Date(baseDate);
          d.setHours(hour, minute, 0, 0);
          return d;
        })
        .sort((a, b) => a - b);

      console.log('Selected times after filtering:', selectedTimes);

      if (selectedTimes.length === 0) {
        console.log('No selected times found for this date, skipping...');
        return;
      }

      // Step 2: group adjacent 15-min slots
      const grouped = [];
      let start = selectedTimes[0];
      let end = start;

      for (let i = 1; i < selectedTimes.length; i++) {
        const current = selectedTimes[i];
        const diff = (current - end) / (1000 * 60); // in minutes
        if (diff === 15) {
          end = current;
        } else {
          grouped.push([start, end]);
          start = end = current;
        }
      }
      grouped.push([start, end]);

      console.log('Grouped time blocks:', grouped);

      // Step 3: format the output
      const formattedBlocks = grouped.map(([start, end]) => {
        const dateLabel = start.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

        const formatTime = (d) =>
          d
            .toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })
            .toLowerCase();

        return {
          location: location.name,
          address: location.address,
          date: dateLabel,
          time: `${formatTime(start)} – ${formatTime(
            new Date(end.getTime() + 15 * 60 * 1000)
          )}`,
        };
      });

      console.log('Formatted blocks for this date:', formattedBlocks);
      allBlocks.push(...formattedBlocks);
    });
  });

  console.log('Final blocks array:', allBlocks);
  return allBlocks;
}
