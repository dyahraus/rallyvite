import { useBottomActionBar } from '@/context/BottomActionBarContext';

export default function BottomActionBar() {
  const { label, disabled, onClick, textColor } = useBottomActionBar();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full max-w-2xl text-xl h-12 text font-bold  md:max-w-full ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : `bg-rallyBlue ${textColor ?? 'text-white'} hover:bg-blue-600`
      }`}
    >
      {label}
    </button>
  );
}
