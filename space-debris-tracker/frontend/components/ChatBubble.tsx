// ============================================================
// components/ChatBubble.tsx — Chat message bubble for RAG agent
// Space Debris Tracker | FIAP Global Solution 2026.1
// ============================================================

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { AgentMessage } from '../types';

interface ChatBubbleProps {
  message: AgentMessage;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function ChatBubble({ message }: ChatBubbleProps): React.JSX.Element {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperAgent]}>
      {/* Role label */}
      {!isUser && (
        <Text style={styles.agentLabel}>◈ AGENTE ORBITAL</Text>
      )}

      {/* Bubble */}
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAgent,
        ]}
      >
        <Text style={[styles.content, isUser ? styles.contentUser : styles.contentAgent]}>
          {message.content}
        </Text>
      </View>

      {/* Timestamp */}
      <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampAgent]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: theme.spacing.xs,
    maxWidth: '85%',
    gap: 4,
  },
  wrapperUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  wrapperAgent: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  agentLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: theme.colors.accent,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  bubble: {
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
  },
  bubbleUser: {
    backgroundColor: theme.colors.accentDim,
    borderBottomRightRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.accent + '40',
  },
  bubbleAgent: {
    backgroundColor: theme.colors.surfaceLight,
    borderBottomLeftRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    fontSize: 14,
    lineHeight: 21,
  },
  contentUser: {
    fontFamily: 'Rajdhani_400Regular',
    color: theme.colors.textPrimary,
  },
  contentAgent: {
    fontFamily: 'Rajdhani_400Regular',
    color: theme.colors.textPrimary,
  },
  timestamp: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  timestampUser: {
    alignSelf: 'flex-end',
  },
  timestampAgent: {
    alignSelf: 'flex-start',
  },
});
