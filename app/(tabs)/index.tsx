
import Container from '@/components/container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { StyleSheet, TextInput, useColorScheme } from 'react-native';

export default function HomeScreen() {
    const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];
  return (
    <Container>
      <ThemedText type='title' numberOfLines={1}>
           Dot Balance
      </ThemedText>

      <ThemedView style={styles.card}>
        <ThemedView>
          <ThemedText>
            CURRENT BALANCE
          </ThemedText>
        </ThemedView>
        <ThemedView style={{paddingVertical: 5}}>
          <ThemedText type="subtitle">
            $ -10000.0
          </ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row",justifyContent: "space-between"}}>
          <ThemedView>
            <ThemedText>
              Income
            </ThemedText>
            <ThemedText style={{color: "green"}}>
              $0.000
            </ThemedText>
          </ThemedView>
          <ThemedView>
            <ThemedText>
              Expenses
            </ThemedText>
            <ThemedText style={{color: "red"}}>
              $0.000
            </ThemedText>
          </ThemedView> 
        </ThemedView> 
      </ThemedView>

      <ThemedView style={{ borderRadius: 50, paddingHorizontal: 30 }} >
        <IconSymbol name='chevron.up' color={'red'} style={{ position: "absolute", top: 8,left: 8}} />
        <TextInput style={{ borderRadius: 10 }} placeholder='Quick add expense ....' placeholderTextColor={color.text} />
        <IconSymbol name='paperplane.fill' color={ color.text} size={18} style={{ position: "absolute", top: 10,right: 8}} />
      </ThemedView>
    </Container>
  );
} 

const styles = StyleSheet.create({
  card: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 15
  }
})