import Image from 'next/image';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import Lines from '@/assets/36.png';

export default function CollapsedSummary({
  label,
  value,
  onEdit,
  isCompleted,
}) {
  return (
    <div className="flex w-[90%] flex-col items-center mt-5">
      <h2 className="mb-0">{label}</h2>
      <div className="text-xl pb-0 font-semibold text-gray-700">{value}</div>
      <button
        type="button"
        onClick={onEdit}
        className="text-blue-500"
        aria-label={`Edit ${label}`}
      >
        {isCompleted ? (
          <PencilSquareIcon className="h-6 w-6" />
        ) : (
          <Image src={Lines} width={100} height={100} />
        )}
      </button>
    </div>
  );
}
