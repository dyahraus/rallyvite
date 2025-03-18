'use client';
import { useState } from 'react';

export default function GetTogetherDescriptionForm({
  description: initialDescription,
  onDescriptionSubmit,
  onSkip,
}) {
  const [description, setDescription] = useState(initialDescription || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDescriptionSubmit(description); // Pass back to parent
  };

  return (
    <div className="flex w-[90%] flex-col items-center mt-5">
      <h2 className="mb-2">Description (optional)</h2>

      <form
        onSubmit={handleSubmit}
        className="w-full relative border-2 border-rallyBlue rounded-2xl p-3"
      >
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="LFG!!!"
          className="w-full resize-none px-4 bg-transparent outline-none text-gray-600 placeholder-italic"
          rows={3}
        />

        <div className="flex justify-end space-x-2 mt-3">
          <p className="translate-y-1 px-3 italic text-black">Get creative!</p>

          <button
            type="button"
            onClick={onSkip}
            className="bg-rallyBlue text-rallyYellow font-medium py-1 px-6 rounded-full shadow hover:bg-rallyBlue"
          >
            Skip
          </button>

          <button
            type="submit"
            className={`font-medium py-1 px-6 rounded-full shadow transition-colors ${
              description.trim()
                ? 'bg-rallyBlue hover:bg-rallyBlue text-rallyYellow cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!description.trim()}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
