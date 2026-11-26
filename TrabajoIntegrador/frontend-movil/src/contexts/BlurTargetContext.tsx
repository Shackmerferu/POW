import { createContext, type ComponentRef, type RefObject } from 'react';
import { View } from 'react-native';

export const BlurTargetContext = createContext<RefObject<ComponentRef<typeof View> | null> | null>(null);
