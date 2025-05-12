export default function RSVPBar({ setCurrentStep, setResponse }) {
  return (
    <nav className="w-full flex items-center h-14">
      <div className="relative flex flex-1 flex-col items-center h-full">
        <button
          onClick={() => {
            setCurrentStep(2);
            setResponse('maybe');
          }}
          className="bg-rallyYellow text-white flex flex-col items-center relative z-10 w-full  py-3 text-xl h-full text font-bold "
        >
          Maybe
        </button>
      </div>
      <div className="relative flex flex-1 flex-col items-center h-full">
        <button
          onClick={() => {
            setCurrentStep(2);
            setResponse('no');
          }}
          className="bg-red-600 flex text-white flex-col items-center relative z-10 w-full h-full py-3 text-xl text font-bold"
        >
          No
        </button>
      </div>
    </nav>
  );
}
