'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { BottomActionBarProvider } from '@/context/BottomActionBarContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <BottomActionBarProvider>{children}</BottomActionBarProvider>
    </Provider>
  );
}
