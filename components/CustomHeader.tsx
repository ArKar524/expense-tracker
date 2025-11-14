import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { Colors } from '../constants/theme';
import { ThemedText } from './themed-text';

interface CustomHeaderProps {
  title: string;
  showBack?: boolean;
  onAdd?: () => void;
}

export default function CustomHeader({ title, showBack = true, onAdd }: CustomHeaderProps) {
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];

  return (
    <View style={[styles.header, { backgroundColor: color.background, borderBottomColor: color.icon }]}>
      {showBack && (
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={color.icon} />
        </Pressable>
      )}
      <ThemedText style={styles.title}>{title}</ThemedText>
      {onAdd && (
        <Pressable onPress={onAdd} style={styles.addButton}>
          <Ionicons name="add" size={24} color={color.icon} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
    
  },
  backButton: {
    marginRight: 16,
  },
  addButton: {
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
      fontWeight: 'bold',
      flex: 1, 
      alignItems: "center",
        textAlign: "center"
    },
});
