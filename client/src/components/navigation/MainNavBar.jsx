import Image from 'next/image';
import RSVPIcon from '@/assets/33-ofcpy.png';
import NewIcon from '@/assets/31-ofcpy.png';
import UpcomingIcon from '@/assets/32-ofcpy.png';
import HighlightsIcon from '@/assets/30-ofcpy.png';
import MeIcon from '@/assets/29-ofcpy.png';

export default function MainNavBar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'rsvp', label: 'RSVP', icon: RSVPIcon },
    { id: 'upcoming', label: 'Upcoming', icon: UpcomingIcon },
    { id: 'new', label: 'New', icon: NewIcon },
    { id: 'highlights', label: 'Highlights', icon: HighlightsIcon },
    { id: 'me', label: 'Me', icon: MeIcon },
  ];

  return (
    <nav className="w-full bg-blue-300 border-t border-gray-300 flex  items-center h-16">
      {navItems.map(({ id, label, icon }, index) => (
        <div key={id} className="relative flex flex-1 flex-col items-center">
          {activeTab === id && (
            <div className="absolute -top-1 w-16 h-14 bg-rallyBlue rounded-full z-0"></div>
          )}

          <button
            className={`flex flex-col items-center realtive z-10 ${
              activeTab === id ? 'text-rallyYellow' : 'text-white'
            }`}
          >
            <Image src={icon} alt={label} width={32} height={32} />
            <span className="text-sm">{label}</span>
          </button>
          {/* Divider Line (skip last item) */}
          {index < navItems.length - 1 && (
            <div className="absolute -right-0 top-1/2 transform -translate-y-1/2 h-10 w-0.5 bg-white "></div>
          )}
        </div>
      ))}
    </nav>
  );
}
