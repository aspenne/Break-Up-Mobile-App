import { Body, Caption, Card, Container, EmptyState, Heading, LoadingSpinner } from '@/components';
import { useChatRooms, useJoinRoom } from '@/hooks/useChat';
import type { ChatStackParamList } from '@/navigation/types';
import { useChatStore } from '@/stores';
import { colors } from '@/theme';
import type { ChatRoom } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { ActivityIndicator, FlatList, Switch, Text, TouchableOpacity, View } from 'react-native';

const MAX_PARTICIPANTS = 10;

function RoomCard({ room }: { room: ChatRoom }) {
  const navigation = useNavigation<NavigationProp<ChatStackParamList>>();
  const joinRoom = useJoinRoom();

  const isFull = room.participantCount >= MAX_PARTICIPANTS;

  const handlePress = () => {
    if (room.isMember) {
      navigation.navigate('ChatRoom', { roomId: room.id });
      return;
    }

    if (isFull) return;

    joinRoom.mutate(room.id, {
      onSuccess: () => navigation.navigate('ChatRoom', { roomId: room.id }),
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} disabled={isFull && !room.isMember}>
      <Card className="mx-4 mb-3 border border-lavender-200">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Body className="font-semibold">{room.name}</Body>
            <View className="mt-1 flex-row items-center">
              <View className="rounded-full bg-lavender-50 px-2.5 py-0.5">
                <Caption className="text-lavender-600">{room.theme}</Caption>
              </View>
            </View>
          </View>
          <View className="items-end">
            <View className="flex-row items-center">
              <Feather name="users" size={12} color={colors.textMuted} />
              <Caption className="ml-1" style={{ color: colors.textMuted }}>
                {room.participantCount}/{MAX_PARTICIPANTS}
              </Caption>
            </View>
            {room.isMember && (
              <View className="mt-1 rounded-full bg-sage-100 px-2 py-0.5">
                <Text className="text-xs font-medium" style={{ color: colors.sage[600] }}>
                  Rejoint
                </Text>
              </View>
            )}
          </View>
        </View>

        {!room.isMember && (
          <View className="mt-3">
            {isFull ? (
              <Caption className="text-center" style={{ color: colors.rose[400] }}>
                Salon complet
              </Caption>
            ) : (
              <TouchableOpacity
                onPress={handlePress}
                disabled={joinRoom.isPending}
                className="items-center rounded-button border border-lavender-200 bg-surface py-2.5"
                activeOpacity={0.7}>
                {joinRoom.isPending ? (
                  <ActivityIndicator size="small" color={colors.lavender[500]} />
                ) : (
                  <Text className="text-body-sm font-semibold" style={{ color: colors.lavender[700] }}>
                    Rejoindre
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

export default function ChatScreen() {
  const { data, isLoading, isError } = useChatRooms();
  const isAnonymous = useChatStore((s) => s.isAnonymous);
  const toggleAnonymous = useChatStore((s) => s.toggleAnonymous);

  const rooms = data?.data ?? [];

  const listHeader = (
    <View className="mb-4 px-4">
      <Heading className="mb-4" style={{ color: colors.lavender[700] }}>Chat 💬</Heading>
      <View className="flex-row items-center justify-between rounded-card bg-surface-secondary px-4 py-3">
        <View className="flex-row items-center">
          <Feather name={isAnonymous ? 'eye-off' : 'eye'} size={16} color={colors.lavender[500]} />
          <Body className="ml-2 text-body-sm">Mode anonyme</Body>
        </View>
        <Switch
          value={isAnonymous}
          onValueChange={toggleAnonymous}
          trackColor={{ false: colors.lavender[100], true: colors.lavender[300] }}
          thumbColor={colors.surface}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <Container>
        <FlatList
          data={[]}
          renderItem={null}
          contentContainerStyle={{ paddingTop: 48, paddingBottom: 24 }}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={<LoadingSpinner />}
        />
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={rooms}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingTop: 48, paddingBottom: 24 }}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => <RoomCard room={item} />}
        ListEmptyComponent={
          isError ? (
            <View className="px-4">
              <Caption className="text-center" style={{ color: colors.lavender[400] }}>
                Impossible de charger les salons.
              </Caption>
            </View>
          ) : (
            <EmptyState
              icon="message-circle"
              title="Aucun salon"
              description="Échangez anonymement avec d'autres personnes qui traversent une rupture."
            />
          )
        }
      />
    </Container>
  );
}
