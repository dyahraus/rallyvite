'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GetTogetherNameForm({
  name: initialName,
  onNameSubmit,
}) {
  const [name, setName] = useState(initialName || '');

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name);
    }
  };

  return (
    <div className="flex w-[90%] flex-col items-center mt-1">
      <h2 className="mb-2">Get-Together Activity Name</h2>

      <form onSubmit={handleSubmit} className="w-full relative">
        <input
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="Ex: Pickleball & Beers"
          className="w-full border border-gray-300 rounded-xl p-3 pr-[120px] focus:outline-none focus:ring-2 focus:ring-rallyBlue"
        />

        {/* Use AnimatePresence for smooth enter/exit transitions */}
        <AnimatePresence mode="wait">
          {name.trim() === '' ? (
            <motion.button
              key="need-inspo"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              type="button"
              className="absolute inset-y-1 right-1 h-full bg-rallyYellow text-gray-800 text-xs font-medium px-1 py-1 rounded-full shadow hover:bg-rallyYellow"
              style={{ minWidth: '110px', height: '40px' }}
            >
              Need Inspo?
            </motion.button>
          ) : (
            <motion.button
              key="next"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              type="button"
              onClick={handleSubmit}
              className="absolute inset-y-1 right-1 bg-rallyBlue text-white font-medium text-sm py-1 px-1 rounded-full shadow hover:bg-rallyBlue"
              style={{ minWidth: '110px', height: '40px' }}
            >
              Next
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
