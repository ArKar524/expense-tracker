import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import * as Updates from "expo-updates";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import Container from "@/components/container";
import CustomHeader from "@/components/CustomHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { auth } from "@/firebaseConfig";
import useExpenseStore from "@/store/useExpenseStore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

export default function SettingsScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [size, setSize] = useState("");
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloadingUpdate, setDownloadingUpdate] = useState(false);
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
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

  /** ─── AUTH STATE ───────────────────────────────────────────────── */
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  /** ─── EMAIL/PASSWORD AUTH ─────────────────────────────────────── */
  const handleRegister = async () => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Account created", "You are now logged in!");
      setEmail("");
      setPassword("");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Welcome back!", "Login successful.");
      setEmail("");
      setPassword("");
    } catch (e: any) {
      Alert.alert("Login failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Signed out", "You have been logged out.");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  /** ─── APP UPDATE HANDLING ─────────────────────────────────────── */
  const checkForUpdates = async () => {
    try {
      const res = await Updates.checkForUpdateAsync();
      setUpdateAvailable(res.isAvailable ?? false);
      Alert.alert(
        res.isAvailable ? "Update available" : "Up to date",
        res.isAvailable
          ? "A new update is available."
          : "No updates are available."
      );
    } catch (error) {
      console.warn(error);
      Alert.alert("Error", "Failed to check for updates.");
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
      Alert.alert("Update ready", "Restart to apply it?", [
        { text: "Restart", onPress: async () => await Updates.reloadAsync() },
        { text: "Later", style: "cancel" },
      ]);
    } catch (error) {
      console.warn(error);
      Alert.alert("Error", "Failed to download or apply update.");
    } finally {
      setDownloadingUpdate(false);
    }
  };

  /** ─── UI ─────────────────────────────────────────────────────── */
  return (
    <Container>
      <CustomHeader title="Settings" />
      {/* Account Section */}
      {user ? (
        <ThemedView
          style={{
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <ThemedText>ACCOUNT</ThemedText>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Image
              source={{ uri: "https://www.gravatar.com/avatar?d=mp&s=100" }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <View style={{ flex: 1 }}>
              <ThemedText type="subtitle">{user.email}</ThemedText>
              <ThemedText type="secondary">Logged in</ThemedText>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={[
                color.button,
                { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
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
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <ThemedText style={{ marginBottom: 8 }}>ACCOUNT</ThemedText>
          <ThemedText style={{ fontWeight: "600" }}>
            Login or Register
          </ThemedText>
          <ThemedText type="secondary" style={{ fontSize: 12 }}>
            Sync your data securely
          </ThemedText>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              borderColor: color.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              marginTop: 10,
              height: 40,
              color: color.text,
            }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              borderColor: color.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              marginTop: 10,
              height: 40,
              color: color.text,
            }}
          />
          <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={[
                color.button,
                { borderRadius: 8, flex: 1, alignItems: "center", padding: 10 },
              ]}
            >
              {loading ? (
                <ActivityIndicator color={color.button.textColor} />
              ) : (
                <ThemedText style={{ color: color.button.textColor }}>
                  Login
                </ThemedText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              style={[
                color.button,
                { borderRadius: 8, flex: 1, alignItems: "center", padding: 10 },
              ]}
            >
              {loading ? (
                <ActivityIndicator color={color.button.textColor} />
              ) : (
                <ThemedText style={{ color: color.button.textColor }}>
                  Register
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
      )}

      {/* App Section */}
      <ThemedView
        style={{
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <ThemedText style={{ marginBottom: 8, fontSize: 13 }}>APP</ThemedText>

        {/* Update Check */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Ionicons name="download-outline" size={26} color={color.icon} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText>Check for update</ThemedText>
            <ThemedText type="secondary" style={{ fontSize: 12 }}>
              {updateAvailable
                ? "Update available"
                : "Check for updates to get the latest build"}
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
                {updateAvailable ? "Apply" : "Check"}
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>

        {/* Storage */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
              { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
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
          shadowColor: "#000",
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
            backgroundColor: "#b91c1c",
            borderRadius: 8,
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <ThemedText style={{ color: "#fff" }}>Delete Local Data</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </Container>
  );
}
