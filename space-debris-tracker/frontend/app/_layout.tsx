// ============================================================
// app/_layout.tsx — Root layout: fonts + Expo Router stack
// Space Debris Tracker | FIAP Global Solution 2026.1
// ============================================================

import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import {
  useFonts,
  SpaceMono_400Regular,
} from '@expo-google-fonts/space-mono';
import {
  Rajdhani_400Regular,
  Rajdhani_500Medium,
  Rajdhani_600SemiBold,
  Rajdhani_700Bold,
} from '@expo-google-fonts/rajdhani';
import { theme } from '../constants/theme';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function RootLayout(): React.JSX.Element | null {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    SpaceMono_400Regular,
    Rajdhani_400Regular,
    Rajdhani_500Medium,
    Rajdhani_600SemiBold,
    Rajdhani_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner message="INICIALIZANDO SISTEMA..." />
        <StatusBar style="light" backgroundColor={theme.colors.background} />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.accent,
          headerTitleStyle: {
            fontFamily: 'SpaceMono_400Regular',
            fontSize: 13,
            color: theme.colors.textPrimary,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          animation: 'slide_from_right',
          headerLeft: (props) => (
            props.canGoBack ? (
              <Pressable
                onPress={() => router.back()}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingRight: 16 }}
              >
                <Text style={{ fontSize: 16, color: theme.colors.accent, marginRight: 4 }}>⬅</Text>
                <Text style={{ color: theme.colors.accent, fontFamily: 'SpaceMono_400Regular', fontSize: 11 }}>VOLTAR</Text>
              </Pressable>
            ) : null
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/')}
              style={{ paddingVertical: 4, paddingLeft: 16 }}
            >
              <Text style={{ fontSize: 16 }}>🏠</Text>
            </Pressable>
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="debris/[id]"
          options={{
            headerTitle: 'DETALHES DO OBJETO',
            headerBackTitle: 'VOLTAR',
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            headerTitle: 'PAINEL DE CONTROLE',
          }}
        />
        <Stack.Screen
          name="agent"
          options={{
            headerTitle: 'AGENTE ORBITAL · IA',
          }}
        />
      </Stack>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
