export default function BottomActionBar({ label, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full max-w-2xl py-3 text-xl h-14 text font-bold ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-rallyBlue text-white hover:bg-blue-600'
      }`}
    >
      {label}
    </button>
  );
}
