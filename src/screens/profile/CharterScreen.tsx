import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Container, Heading, Subheading, Body, Caption } from '@/components';
import { colors } from '@/theme';
import { Pressable } from 'react-native';

const RULES = [
  {
    emoji: '💜',
    title: 'Bienveillance avant tout',
    body: 'Chaque personne ici traverse un moment difficile. Accueillez les émotions des autres avec douceur et empathie, comme vous aimeriez qu\'on accueille les vôtres.',
  },
  {
    emoji: '🤝',
    title: 'Respect mutuel',
    body: 'Pas de moqueries, d\'insultes ou de jugements. Les histoires de chacun sont valides, quelle que soit la durée de la relation ou la raison de la rupture.',
  },
  {
    emoji: '🔒',
    title: 'Confidentialité',
    body: 'Ce qui se dit ici reste ici. Ne partagez jamais les propos ou les histoires des autres membres en dehors de l\'application.',
  },
  {
    emoji: '🙈',
    title: 'Anonymat respecté',
    body: 'Chacun est libre de rester anonyme ou de partager son prénom. Ne demandez jamais d\'informations personnelles aux autres membres.',
  },
  {
    emoji: '🚫',
    title: 'Zéro harcèlement',
    body: 'Aucune forme de harcèlement, drague insistante, messages non sollicités ou pression n\'est tolérée. Un non est un non.',
  },
  {
    emoji: '🌱',
    title: 'Encourager, pas conseiller',
    body: 'Préférez le soutien émotionnel aux conseils non sollicités. Dire « je te comprends » vaut souvent mieux que « tu devrais faire... ».',
  },
  {
    emoji: '⚠️',
    title: 'Pas de contenu nocif',
    body: 'Aucun contenu violent, sexuel, discriminatoire ou incitant à l\'automutilation. Si vous êtes en détresse, des ressources d\'aide sont disponibles.',
  },
  {
    emoji: '🛡️',
    title: 'Signaler, c\'est protéger',
    body: 'Si un comportement vous met mal à l\'aise, signalez-le. Vous protégez la communauté et vous-même. Aucun signalement n\'est anodin.',
  },
];

export default function CharterScreen() {
  const navigation = useNavigation();

  return (
    <Container className="px-0">
      <View className="flex-row items-center px-6 pb-2 pt-4">
        <Pressable onPress={() => navigation.goBack()} className="mr-3">
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Heading>Charte de bienveillance</Heading>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 mt-2 rounded-2xl bg-sky-50 px-5 py-4">
          <Body className="text-center leading-6 text-sky-700">
            BreakUp est un espace de soutien et de réconfort. Pour que chacun s'y
            sente en sécurité, nous vous demandons de respecter ces quelques
            règles simples.
          </Body>
        </View>

        {RULES.map((rule, index) => (
          <View
            key={index}
            className="mb-4 rounded-card border border-sky-100 bg-surface px-5 py-4"
          >
            <View className="mb-2 flex-row items-center">
              <Body className="mr-2 text-xl">{rule.emoji}</Body>
              <Subheading>{rule.title}</Subheading>
            </View>
            <Caption className="leading-5 text-text-secondary">{rule.body}</Caption>
          </View>
        ))}

        <View className="mt-4 rounded-2xl bg-sage-50 px-5 py-4">
          <Body className="text-center leading-6 text-sage-700">
            En utilisant BreakUp, vous vous engagez à respecter cette charte.
            Tout manquement pourra entraîner une suspension de votre compte.
          </Body>
        </View>
      </ScrollView>
    </Container>
  );
}
