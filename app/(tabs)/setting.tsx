import Container from '@/components/container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, TouchableOpacity, useColorScheme, View } from 'react-native';

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

  // OTA update states
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloadingUpdate, setDownloadingUpdate] = useState(false);
  const [updateManifest, setUpdateManifest] = useState<any>(null);

  const checkForUpdates = async () => {
    try {
      const res = await Updates.checkForUpdateAsync();
      setUpdateAvailable(res.isAvailable ?? false);
      setUpdateManifest(res.isAvailable ? res.manifest : null);
      if (res.isAvailable) {
        Alert.alert('Update available', 'A new update is available. You can download it now.');
      } else {
        Alert.alert('Up to date', 'No updates are available.');
      }
    } catch (error) {
      console.warn(error);
      Alert.alert('Error', 'Failed to check for updates');
    }
  };

  // renamed and refactored from downloadUpdate -> applyUpdate
  const applyUpdate = async () => {
    try {
      // if we don't already know an update is available, check first
      if (!updateAvailable) {
        await checkForUpdates();
        if (!useExpenseStore.getState() && !updateAvailable) {
          // defensive: if still not available, inform and return
          Alert.alert('No update', 'No update available to download');
          return;
        }
        if (!updateAvailable) return; // nothing to do
      }

      setDownloadingUpdate(true);
      await Updates.fetchUpdateAsync();

      // reset local flags and store manifest
      setUpdateAvailable(false);
      setUpdateManifest(null);

      // let user decide when to restart
      Alert.alert('Update downloaded', 'The update is downloaded. Restart now to apply it.', [
        {
          text: 'Restart now',
          onPress: async () => {
            try {
              await Updates.reloadAsync();
            } catch (err) {
              console.warn(err);
              Alert.alert('Error', 'Failed to restart app to apply update.');
            }
          },
        },
        { text: 'Later', style: 'cancel' },
      ]);
    } catch (error) {
      console.warn(error);
      Alert.alert('Error', 'Failed to download or apply update');
    } finally {
      setDownloadingUpdate(false);
    }
  };

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
            <ThemedText>Check for update</ThemedText>
            <ThemedText type="secondary" style={{ fontSize: 12 }}>
              {updateAvailable ? 'Update available' : 'Check for updates to get the latest build'}
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={() => {
              applyUpdate();
            }}
            style={[
              color.button,
              { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
            ]}
            disabled={downloadingUpdate}
          >
            {downloadingUpdate ? (
              <ActivityIndicator color={color.button.textColor} />
            ) : (
              <ThemedText style={{ color: color.button.textColor }}>{updateAvailable ? 'Apply' : 'Check & Apply'}</ThemedText>
            )}
          </TouchableOpacity>

          {/* show manifest/build info when available */}
          {updateManifest ? (
            <ThemedText type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
              New build: {String(updateManifest?.revisionId ?? updateManifest?.id ?? 'unknown')}
            </ThemedText>
          ) : null}
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
