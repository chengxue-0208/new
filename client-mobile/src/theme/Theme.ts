import { useColorScheme } from 'react-native';
import { Colors } from './Colors';

export const useTheme = () => {
  const isDark = useColorScheme() === 'dark';

  return {
    colors: isDark ? Colors.dark : Colors.light,
    isDark,
  };
};