import Container from '@/components/container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function SettingsScreen() {
  const [isLoginned, setIsLoginned] = useState(false);
  const [size, setSize] = useState('');
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];
  const clearStorage = useExpenseStore((state) => state.clearStorage);

  const loadStorageSize = async () => {
    const s = await useExpenseStore.getState().getStorageSize();
     setSize(s);
  }; 
  useFocusEffect(
    useCallback(() => {
       loadStorageSize();
    }, [])
  );
  return (
    <Container>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <ThemedText type="title" style={{ fontSize: 26, lineHeight: 28 }}>
          Settings
        </ThemedText>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="home-outline" size={26} color={color.text} />
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      {isLoginned ? (
        <ThemedView
          style={{
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            marginBottom: 16,
          }}
        >
          <ThemedText>ACCOUNT</ThemedText>

          <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={{ uri: 'https://ui-avatars.com/api/?name=Paing+Soe+Ko' }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <View style={{ flex: 1 }}>
              <ThemedText type="subtitle">Paing Soe Ko</ThemedText>
              <ThemedText type="secondary">kopaing1</ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => setIsLoginned(false)}
              style={[
                color.button,
                {
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                },
              ]}
            >
              <ThemedText style={{ color: color.button.textColor }}>Switch</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView
          style={{
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            marginBottom: 16,
          }}
        >
          <ThemedText style={{ marginBottom: 8 }}>ACCOUNT</ThemedText>

          <ThemedView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontWeight: '600' }}>Login to Save Data</ThemedText>
              <ThemedText style={{ fontSize: 12 }}>Sync your data to the cloud</ThemedText>
            </View>

            <TouchableOpacity
              onPress={() => setIsLoginned(true)}
              style={[
                color.button,
                {
                  borderWidth: 1,
                  alignItems: 'center',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                },
              ]}
            >
              <ThemedText style={{ color: color.button.textColor }}>Login</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      )}

      {/* App Section */}
      <ThemedView
        style={{
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          marginBottom: 16,
        }}
      >
        <ThemedText style={{ marginBottom: 8, fontSize: 13 }}>APP</ThemedText>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Ionicons name="download-outline" size={26} color={color.icon} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText>Install App</ThemedText>
            <ThemedText type="secondary" style={{ fontSize: 12 }}>
              Get the full experience
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[
              color.button,
              {
                borderRadius: 8,
                paddingHorizontal: 14,
                paddingVertical: 6,
              },
            ]}
          >
            <ThemedText style={{ color: color.button.textColor }}>Install</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Ionicons name="folder-outline" size={26} color={color.icon} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText>Storage</ThemedText>
            <ThemedText type="secondary" style={{ fontSize: 12 }}>
              Local data: {size}
            </ThemedText>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="cloud-outline" size={26} color={color.icon} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText>Cache Data</ThemedText>
            <ThemedText type="secondary" style={{ fontSize: 12 }}>
              Cache app data for offline mode
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={async () => {
              await clearStorage();
              await loadStorageSize();
            }}
            style={[
              color.button,
              {
                borderRadius: 8,
                paddingHorizontal: 14,
                paddingVertical: 6,
              },
            ]}
          >
            <ThemedText style={{ color: color.button.textColor }}>Clear</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 12 }}>
          <ThemedText type="secondary" style={{ fontSize: 12 }}>
            App Version 1.0.0
          </ThemedText>
          <ThemedText type="secondary" style={{ fontSize: 12 }}>
            Build Number 100
          </ThemedText>
        </View>
      </ThemedView>

      {/* Danger Zone */}
      <ThemedView
        style={{
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          marginBottom: 16,
        }}
      >
        <ThemedText type="subtitle" style={{ marginBottom: 8, fontSize: 13 }}>
          DANGER ZONE
        </ThemedText>

        {isLoginned ? (
          <TouchableOpacity
            onPress={() => setIsLoginned(false)}
            style={{
              backgroundColor: '#dc2626',
              borderRadius: 8,
              alignItems: 'center',
              paddingVertical: 10,
            }}
          >
            <ThemedText style={{ color: '#fff' }}>Logout</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={async () => {
              await clearStorage();
              await loadStorageSize();
            }}
            style={{
              backgroundColor: '#b91c1c',
              borderRadius: 8,
              alignItems: 'center',
              paddingVertical: 10,
            }}
          >
            <ThemedText style={{ color: '#fff' }}>Delete Local Data</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    </Container>
  );
}
