import { View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Container from '@/components/container';
import { ThemedText } from '@/components/themed-text';

export default function SettingsScreen() {
  const [isLoginned, setIsLoginned] = useState(false);
  const router = useRouter();
  return (
    <Container style={{ gap: 16, padding: 16 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <ThemedText type="title" style={{ fontSize: 26, lineHeight: 28 }}>Settings</ThemedText>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Ionicons name="home-outline" size={26} color="#000" />
      </TouchableOpacity>
    </View>


      {isLoginned ? (
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            marginBottom: 16,
          }}
        >
          <ThemedText style={{ color: '#666', marginBottom: 8, fontSize: 13 }}>ACCOUNT</ThemedText>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={{ uri: 'https://ui-avatars.com/api/?name=Paing+Soe+Ko' }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <View style={{ flex: 1 }}>
              <ThemedText type="subtitle" style={{ color: '#000' }}>
                Paing Soe Ko
              </ThemedText>
              <ThemedText style={{ color: '#666' }}>kopaing1</ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => setIsLoginned(false)}
              style={{
                backgroundColor: '#e5e7eb',
                borderRadius: 8,
                paddingHorizontal: 14,
                paddingVertical: 6,
              }}
            >
              <ThemedText style={{ color: '#000' }}>Switch</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            marginBottom: 16,
          }}
        >
          <ThemedText style={{ color: '#666', marginBottom: 8, fontSize: 13 }}>ACCOUNT</ThemedText>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ color: '#000', fontWeight: '600' }}>Login to Save Data</ThemedText>
              <ThemedText style={{ color: '#777', fontSize: 12 }}>Sync your data to the cloud</ThemedText>
            </View>

            <TouchableOpacity
              onPress={() => setIsLoginned(true)}
              style={{
                backgroundColor: '#131417ff',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <ThemedText style={{ color: '#fff' }}>Login</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}


      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          marginBottom: 16,
        }}
      >
        <ThemedText style={{ color: '#666', marginBottom: 8, fontSize: 13 }}>APP</ThemedText>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Ionicons name="download-outline" size={26} color="#333" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText style={{ color: '#000' }}>Install App</ThemedText>
            <ThemedText style={{ color: '#777', fontSize: 12 }}>Get the full experience</ThemedText>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#131417ff',
              borderRadius: 8,
              paddingHorizontal: 14,
              paddingVertical: 6,
            }}
          >
            <ThemedText style={{ color: '#fff' }}>Install</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Ionicons name="folder-outline" size={26} color="#333" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText style={{ color: '#000' }}>Storage</ThemedText>
            <ThemedText style={{ color: '#777', fontSize: 12 }}>Local data: 276 bytes</ThemedText>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="cloud-outline" size={26} color="#333" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText style={{ color: '#000' }}>Cache Data</ThemedText>
            <ThemedText style={{ color: '#777', fontSize: 12 }}>Cache app data for offline mode</ThemedText>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#e5e7eb',
              borderRadius: 8,
              paddingHorizontal: 14,
              paddingVertical: 6,
            }}
          >
            <ThemedText style={{ color: '#000' }}>Clear</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 12 }}>
          <ThemedText style={{ color: '#999', fontSize: 12 }}>App Version 1.0.0</ThemedText>
          <ThemedText style={{ color: '#999', fontSize: 12 }}>Build Number 100</ThemedText>
        </View>
      </View>

      {/* Danger Zone */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          marginBottom: 16,
        }}
      >
        <ThemedText style={{ color: '#666', marginBottom: 8, fontSize: 13 }}>DANGER ZONE</ThemedText>

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
      </View>
    </Container>
  );
}
