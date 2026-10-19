import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";

import { useAppFonts } from "@/hooks/useAppFonts";

import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function RootLayout() {
  const { loaded: fontsLoaded, error: fontError, retry } = useAppFonts();

  if (fontError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Não foi possível carregar as fontes. Confira sua conexão.</Text>
        <TouchableOpacity
          onPress={retry}
          accessibilityRole="button"
          style={{ marginTop: 16, padding: 12, backgroundColor: "#155DFC", borderRadius: 8 }}
        >
          <Text style={{ color: "#FFFFFF" }}>Tentar novamente</Text>
        </TouchableOpacity>
        {__DEV__ && (
          <Text selectable style={{ marginTop: 16, paddingHorizontal: 24 }}>
            {fontError.message}
          </Text>
        )}
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#155DFC" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
