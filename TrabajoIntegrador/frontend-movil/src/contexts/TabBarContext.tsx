import { createContext, useContext } from 'react';

type TabBarContextValue = {
  tabBarHidden: boolean;
  setTabBarHidden: (hidden: boolean) => void;
};

export const TabBarContext = createContext<TabBarContextValue>({
  tabBarHidden: false,
  setTabBarHidden: () => undefined,
});

export function useTabBar() {
  return useContext(TabBarContext);
}
