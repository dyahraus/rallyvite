import { useEffect, useState } from 'react';

const ShareInviteButton = ({ inviteUrl }) => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Check if Web Share API is available
    setCanShare(!!navigator.share);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Rallyvite!',
          text: 'Hey, join my get-together using this link:',
          url: inviteUrl, // This should be your rallyvite invite link
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.log('Web Share API is not supported on this device.');
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={!canShare}
      className={`px-4 py-2 rounded-md ${
        canShare
          ? 'bg-blue-500 text-white'
          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
      }`}
    >
      Share
    </button>
  );
};

export default ShareInviteButton;
