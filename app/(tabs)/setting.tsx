import { Ionicons } from '@expo/vector-icons';
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes
} from '@react-native-google-signin/google-signin';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import Container from '@/components/container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import useExpenseStore from '@/store/useExpenseStore';

// Configure Google Signin once (outside component)
GoogleSignin.configure({
  webClientId:
    '944144806007-2od9b1erf1gduji75qu9v05ka4il4pan.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/drive.readonly',],
  offlineAccess: false,
});

export default function SettingsScreen() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState('');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloadingUpdate, setDownloadingUpdate] = useState(false);
  const [updateManifest, setUpdateManifest] = useState<any>(null);

  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];
  const clearStorage = useExpenseStore((state) => state.clearStorage);

  /** ─── STORAGE SIZE ─────────────────────────────────────────────── */
  const loadStorageSize = async () => {
    const s = await useExpenseStore.getState().getStorageSize();
    setSize(s);
  };

  useFocusEffect(
    useCallback(() => {
      loadStorageSize();
    }, [])
  );

  /** ─── GOOGLE SIGN-IN ───────────────────────────────────────────── */
  const signIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        setUserInfo(response.data);
        console.log('Google User:', response.data);
      } else {
        console.log('Sign-in cancelled or failed:', response);
      }
    } catch (error) {
      console.log(' Sign-in Error:', error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert('Please wait', 'Sign-in already in progress.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Error', 'Play Services not available or outdated.');
            break;
          default:
            Alert.alert('Error', 'Something went wrong.');
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      Alert.alert('Signed out', 'You have successfully logged out.');
    } catch (error) {
      console.log('Sign-out Error:', error);
    }
  };

  /** ─── APP UPDATE HANDLING ─────────────────────────────────────── */
  const checkForUpdates = async () => {
    try {
      const res = await Updates.checkForUpdateAsync();
      setUpdateAvailable(res.isAvailable ?? false);
      setUpdateManifest(res.isAvailable ? res.manifest : null);

      Alert.alert(
        res.isAvailable ? 'Update available' : 'Up to date',
        res.isAvailable
          ? 'A new update is available. You can download it now.'
          : 'No updates are available.'
      );
    } catch (error) {
      console.warn(error);
      Alert.alert('Error', 'Failed to check for updates.');
    }
  };

  const applyUpdate = async () => {
    try {
      if (!updateAvailable) {
        await checkForUpdates();
        if (!updateAvailable) return;
      }
      setDownloadingUpdate(true);
      await Updates.fetchUpdateAsync();

      Alert.alert('Update ready', 'Restart to apply it?', [
        { text: 'Restart', onPress: async () => await Updates.reloadAsync() },
        { text: 'Later', style: 'cancel' },
      ]);
    } catch (error) {
      console.warn(error);
      Alert.alert('Error', 'Failed to download or apply update.');
    } finally {
      setDownloadingUpdate(false);
    }
  };

  /** ─── UI ─────────────────────────────────────────────────────── */
  return (
    <Container>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <ThemedText type="title" style={{ fontSize: 26 }}>
          Settings
        </ThemedText>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="home-outline" size={26} color={color.text} />
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      {userInfo ? (
        <ThemedView
          style={{
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <ThemedText>ACCOUNT</ThemedText>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={{ uri: userInfo?.user?.photo }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <View style={{ flex: 1 }}>
              <ThemedText type="subtitle">{userInfo?.user?.name}</ThemedText>
              <ThemedText type="secondary">{userInfo?.user?.email}</ThemedText>
            </View>
            <TouchableOpacity
              onPress={signOut}
              style={[
                color.button,
                {
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                },
              ]}
            >
              <ThemedText style={{ color: color.button.textColor }}>
                Logout
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      ) : (
        <ThemedView
          style={{
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <ThemedText style={{ marginBottom: 8 }}>ACCOUNT</ThemedText>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontWeight: '600' }}>
                Login to Save Data
              </ThemedText>
              <ThemedText style={{ fontSize: 12 }}>
                Sync your data to the cloud
              </ThemedText>
            </View> 
          </View>
        </ThemedView>
      )}

      {/* App Section */}
      <ThemedView
        style={{
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <ThemedText style={{ marginBottom: 8, fontSize: 13 }}>APP</ThemedText>

        {/* Update Check */}
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
        >
          <Ionicons name="download-outline" size={26} color={color.icon} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText>Check for update</ThemedText>
            <ThemedText type="secondary" style={{ fontSize: 12 }}>
              {updateAvailable
                ? 'Update available'
                : 'Check for updates to get the latest build'}
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={applyUpdate}
            style={[
              color.button,
              { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
            ]}
            disabled={downloadingUpdate}
          >
            {downloadingUpdate ? (
              <ActivityIndicator color={color.button.textColor} />
            ) : (
              <ThemedText style={{ color: color.button.textColor }}>
                {updateAvailable ? 'Apply' : 'Check'}
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>

        {/* Storage */}
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
        >
          <Ionicons name="folder-outline" size={26} color={color.icon} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText>Storage</ThemedText>
            <ThemedText type="secondary" style={{ fontSize: 12 }}>
              Local data: {size}
            </ThemedText>
          </View>
        </View>

        {/* Clear Cache */}
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
            <ThemedText style={{ color: color.button.textColor }}>
              Clear
            </ThemedText>
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
        }}
      >
        <ThemedText type="subtitle" style={{ marginBottom: 8, fontSize: 13 }}>
          DANGER ZONE
        </ThemedText>

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
        <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={signIn}
              disabled={loading}
            />
      </ThemedView>
    </Container>
  );
}
