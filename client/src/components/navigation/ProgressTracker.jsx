export default function ProgressTracker({ currentStep }) {
  const steps = [
    { id: 1, label: 'Name Get-Together' },
    { id: 2, label: 'Poll Locations & Times' }, // Shortened slightly to help on mobile
    { id: 3, label: 'Send Invite Link' },
  ];

  return (
    <div className="flex w-[92%] max-w-2xl mx-auto my-4 px-2 rounded-full overflow-hidden bg-gray-300">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div
            key={step.id}
            className="flex-1 flex justify-center items-center py-1"
          >
            <div
              className={`px-1 py-2 text-xs whitespace-nowrap leading-tight text-center rounded-full ${
                isActive
                  ? 'bg-rallyBlue text-white'
                  : isCompleted
                  ? 'text-gray-700'
                  : 'text-gray-500'
              }`}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
