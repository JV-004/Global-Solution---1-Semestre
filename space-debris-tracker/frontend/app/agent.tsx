// ============================================================
// app/agent.tsx — RAG Orbital Agent Chat Screen
// Inverted FlatList, quick chips, typing indicator
// Space Debris Tracker | FIAP Global Solution 2026.1
// ============================================================

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { theme } from '../constants/theme';
import { AgentService } from '../services/api';
import { ChatBubble } from '../components/ChatBubble';
import { AgentMessage } from '../types';

let messageCounter = 0;
function nextId(): string {
  messageCounter += 1;
  return `msg-${messageCounter}-${Date.now()}`;
}

const INITIAL_MESSAGE: AgentMessage = {
  id: 'initial-agent',
  role: 'agent',
  content:
    'Olá! Sou o agente de monitoramento orbital. Posso responder perguntas sobre debris, órbitas e riscos de colisão em português. Como posso ajudar?',
  timestamp: new Date(),
};

const QUICK_SUGGESTIONS = [
  'Quais são os debris mais perigosos?',
  'O que é debris orbital?',
  'Como o risco é calculado?',
  'O que é o modelo TLE?',
  'Quais órbitas têm mais debris?',
];

// Typing dots animation component
function TypingDots(): React.JSX.Element {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animDot = (dot: Animated.Value, delay: number): Animated.CompositeAnimation =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      );

    const a1 = animDot(dot1, 0);
    const a2 = animDot(dot2, 200);
    const a3 = animDot(dot3, 400);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={typingStyles.container}>
      <Text style={typingStyles.label}>Agente analisando</Text>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          style={[typingStyles.dot, { opacity: dot }]}
        />
      ))}
    </View>
  );
}

const typingStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignSelf: 'flex-start',
    gap: 4,
    marginVertical: theme.spacing.xs,
  },
  label: {
    fontFamily: 'Rajdhani_400Regular',
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
  },
});

export default function AgentScreen(): React.JSX.Element {
  const { prefill } = useLocalSearchParams<{ prefill?: string }>();
  const [messages, setMessages] = useState<AgentMessage[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList<AgentMessage>>(null);

  // If navigated from debris detail with a pre-filled name
  useEffect(() => {
    if (prefill) {
      setInputText(`O que você sabe sobre o debris ${prefill}?`);
    }
  }, [prefill]);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || isLoading) return;

      const userMessage: AgentMessage = {
        id: nextId(),
        role: 'user',
        content: question.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [userMessage, ...prev]);
      setInputText('');
      setIsLoading(true);

      try {
        const res = await AgentService.query(question.trim());
        const agentMessage: AgentMessage = {
          id: nextId(),
          role: 'agent',
          content: res.data.answer,
          timestamp: new Date(),
        };
        setMessages((prev) => [agentMessage, ...prev]);
      } catch {
        const errorMessage: AgentMessage = {
          id: nextId(),
          role: 'agent',
          content:
            'Desculpe, não consegui conectar ao servidor de IA. Verifique se o backend está rodando e tente novamente.',
          timestamp: new Date(),
        };
        setMessages((prev) => [errorMessage, ...prev]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const handleSend = useCallback(() => {
    void sendMessage(inputText);
  }, [inputText, sendMessage]);

  const handleChip = useCallback(
    (text: string) => {
      void sendMessage(text);
    },
    [sendMessage]
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={88}
    >
      {/* ── Agent Status Header ──────────────────── */}
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.background]}
        style={styles.agentHeader}
      >
        <View style={styles.statusRow}>
          <View style={styles.onlineDot} />
          <Text style={styles.statusLabel}>AGENTE ONLINE — SISTEMA ATIVO</Text>
        </View>
        <Text style={styles.agentDesc}>
          Consulte o agente de IA sobre debris orbitais, trajetórias e riscos de colisão.
        </Text>
      </LinearGradient>

      {/* ── Messages List (inverted) ─────────────── */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        inverted
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={isLoading ? <TypingDots /> : null}
      />

      {/* ── Input Area ───────────────────────────── */}
      <View style={styles.inputArea}>
        {/* Quick suggestion chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContainer}
        >
          {QUICK_SUGGESTIONS.map((suggestion) => (
            <Pressable
              key={suggestion}
              style={({ pressed }) => [
                styles.chip,
                pressed && { opacity: 0.7 },
                isLoading && styles.chipDisabled,
              ]}
              onPress={() => handleChip(suggestion)}
              disabled={isLoading}
            >
              <Text style={styles.chipText} numberOfLines={1}>
                {suggestion}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Text input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Faça uma pergunta sobre órbitas..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            maxLength={500}
            editable={!isLoading}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              pressed && { opacity: 0.7 },
              (!inputText.trim() || isLoading) && styles.sendBtnDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <LinearGradient
              colors={
                !inputText.trim() || isLoading
                  ? [theme.colors.border, theme.colors.border]
                  : [theme.colors.accent, theme.colors.accentDim]
              }
              style={styles.sendBtnGradient}
            >
              <Text style={styles.sendBtnIcon}>🚀</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Animated dot for agent status
const pulseAnim = new Animated.Value(1);
Animated.loop(
  Animated.sequence([
    Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
  ])
).start();

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Agent header
  agentHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.riskLow,
    shadowColor: theme.colors.riskLow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: theme.colors.riskLow,
    letterSpacing: 1.5,
  },
  agentDesc: {
    fontFamily: 'Rajdhani_400Regular',
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 17,
  },

  // Messages
  messageList: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },

  // Input area
  inputArea: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingBottom: theme.spacing.md,
  },
  chipsScroll: {
    paddingTop: theme.spacing.xs,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  chip: {
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.accentDim,
    backgroundColor: `${theme.colors.accentDim}30`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 5,
    maxWidth: 200,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 12,
    color: theme.colors.accent,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontFamily: 'Rajdhani_400Regular',
    fontSize: 14,
    color: theme.colors.textPrimary,
    maxHeight: 100,
    minHeight: 44,
  },
  sendBtn: {
    borderRadius: theme.radius.full,
    overflow: 'hidden',
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  sendBtnDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  sendBtnGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnIcon: {
    fontSize: 20,
  },
});
