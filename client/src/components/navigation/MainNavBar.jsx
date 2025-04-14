import Image from 'next/image';
import RSVPIcon from '@/assets/33-ofcpy.PNG';
import NewIcon from '@/assets/31-ofcpy.PNG';
import UpcomingIcon from '@/assets/32-ofcpy.PNG';
import HighlightsIcon from '@/assets/30-ofcpy.PNG';
import MeIcon from '@/assets/29-ofcpy.PNG';

export default function MainNavBar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'rsvp', label: 'RSVP', icon: RSVPIcon },
    { id: 'upcoming', label: 'Upcoming', icon: UpcomingIcon },
    { id: 'new', label: 'New', icon: NewIcon },
    { id: 'highlights', label: 'Highlights', icon: HighlightsIcon },
    { id: 'me', label: 'Me', icon: MeIcon },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <nav className="w-full bg-blue-300 border-t border-gray-300 flex items-center h-16">
      {navItems.map(({ id, label, icon }, index) => (
        <div key={id} className="relative flex flex-1 flex-col items-center">
          {activeTab === id && (
            <div className="absolute -top-1 w-16 h-14 bg-rallyBlue rounded-full z-0"></div>
          )}

          <button
            onClick={() => handleTabClick(id)}
            className={`flex flex-col items-center relative z-10 w-full h-full ${
              activeTab === id ? 'text-rallyYellow' : 'text-white'
            }`}
          >
            <Image src={icon} alt={label} width={32} height={32} />
            <span className="text-sm">{label}</span>
          </button>
          {/* Divider Line (skip last item) */}
          {index < navItems.length - 1 && (
            <div className="absolute -right-0 top-1/2 transform -translate-y-1/2 h-10 w-0.5 bg-white"></div>
          )}
        </div>
      ))}
    </nav>
  );
}
