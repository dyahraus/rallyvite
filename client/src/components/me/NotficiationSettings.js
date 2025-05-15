export default function NotificationSettings() {
  return (
    <div>
      <div className="flex items-center mt-1.5 space-x-2">
        <input
          type="checkbox"
          id="openEnded"
          checked={openEnded}
          onChange={() => setOpenEnded(!openEnded)}
        />
        <label htmlFor="openEnded" className="text-gray-600 text-sm">
          Open Ended
        </label>
      </div>

      <div className="flex items-center mt-1.5 space-x-2">
        <input
          type="checkbox"
          id="openEnded"
          checked={openEnded}
          onChange={() => setOpenEnded(!openEnded)}
        />
        <label htmlFor="openEnded" className="text-gray-600 text-sm">
          Open Ended
        </label>
      </div>

      <div className="flex items-center mt-1.5 space-x-2">
        <input
          type="checkbox"
          id="openEnded"
          checked={openEnded}
          onChange={() => setOpenEnded(!openEnded)}
        />
        <label htmlFor="openEnded" className="text-gray-600 text-sm">
          Open Ended
        </label>
      </div>
    </div>
  );
}
