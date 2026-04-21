import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useRoomMessages, useSendMessage, useChatRooms } from '@/hooks/useChat';
import { useChatStore, useUserStore } from '@/stores';
import { Caption } from '@/components';
import { colors } from '@/theme';
import type { ChatStackParamList } from '@/navigation/types';
import type { Message } from '@/types';

type ChatRoomRouteProp = RouteProp<ChatStackParamList, 'ChatRoom'>;

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  if (message.isSystem) {
    return (
      <View className="my-2 items-center px-6">
        <Caption className="text-center italic text-sage-400">{message.content}</Caption>
      </View>
    );
  }

  return (
    <View className={`my-1 px-4 ${isOwn ? 'items-end' : 'items-start'}`}>
      {!isOwn && (
        <Caption className="mb-0.5 ml-3 text-lavender-500">{message.senderName}</Caption>
      )}
      <View
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isOwn
            ? 'rounded-br-sm bg-lavender-100'
            : 'rounded-bl-sm border border-lavender-100 bg-surface'
        }`}
      >
        <Text className="text-body-md text-text-primary">{message.content}</Text>
      </View>
      <Caption className={`mt-0.5 ${isOwn ? 'mr-3' : 'ml-3'}`}>
        {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Caption>
    </View>
  );
}

export default function ChatRoomScreen() {
  const navigation = useNavigation();
  const route = useRoute<ChatRoomRouteProp>();
  const { roomId } = route.params;

  const [text, setText] = useState('');
  const user = useUserStore((s) => s.user);
  const isAnonymous = useChatStore((s) => s.isAnonymous);
  const toggleAnonymous = useChatStore((s) => s.toggleAnonymous);

  const { data: roomsData } = useChatRooms();
  const room = roomsData?.data?.find((r) => r.id === roomId);

  const { data, isLoading } = useRoomMessages(roomId);
  const messages = data?.data ?? [];

  const sendMessage = useSendMessage();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sendMessage.isPending) return;

    sendMessage.mutate(
      {
        roomId,
        content: trimmed,
        senderName: isAnonymous ? 'Anonyme' : user?.firstName,
      },
      { onSuccess: () => setText('') }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-lavender-100 px-4 pb-3 pt-2">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 p-1">
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-body-md font-semibold text-text-primary">
            {room?.name ?? 'Salon'}
          </Text>
          <Caption>{room?.participantCount ?? 0} participants</Caption>
        </View>
        <TouchableOpacity onPress={toggleAnonymous} className="p-2">
          <Feather
            name={isAnonymous ? 'eye-off' : 'eye'}
            size={20}
            color={isAnonymous ? colors.lavender[500] : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <MessageBubble message={item} isOwn={item.senderId === user?.id} />
          )}
          inverted
          contentContainerStyle={{ paddingVertical: 12 }}
          ListEmptyComponent={
            isLoading ? null : (
              <View className="flex-1 items-center justify-center py-12">
                <Text className="text-3xl">💬</Text>
                <Caption className="mt-2">Aucun message pour l'instant</Caption>
                <Caption>Soyez le premier à écrire !</Caption>
              </View>
            )
          }
        />

        {/* Input bar */}
        <View className="flex-row items-end border-t border-lavender-100 bg-surface px-4 py-3">
          <View className="mr-3 flex-1">
            <TextInput
              className="max-h-24 rounded-2xl border border-lavender-200 bg-background px-4 py-2.5 text-body-md text-text-primary"
              placeholder="Votre message..."
              placeholderTextColor={colors.textMuted}
              value={text}
              onChangeText={setText}
              multiline
              returnKeyType="default"
            />
            {isAnonymous && (
              <Caption className="ml-2 mt-1 text-lavender-400">
                Mode anonyme activé
              </Caption>
            )}
          </View>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim() || sendMessage.isPending}
            className={`mb-1 items-center justify-center rounded-full p-3 ${
              text.trim() ? 'bg-lavender-300' : 'bg-lavender-100'
            }`}
          >
            <Feather
              name="send"
              size={18}
              color={text.trim() ? colors.lavender[900] : colors.lavender[400]}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
