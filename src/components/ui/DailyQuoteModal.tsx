import { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useAppStore } from '@/stores';
import { isSameDay } from '@/utils/date';

const QUOTES = [
  { text: "Les blessures du coeur s'ouvrent pour laisser entrer la lumiere.", author: 'Rumi' },
  { text: "Ce n'est pas la fin. C'est le commencement d'une autre histoire.", author: 'George Eliot' },
  { text: "On ne guerit pas d'un amour en fuyant, mais en l'aimant davantage.", author: "Jules Barbey d'Aurevilly" },
  { text: "Le courage, c'est d'aller de l'avant malgre la peur.", author: 'Ambrose Redmoon' },
  { text: "Parfois perdre un equilibre pour une raison plus grande, c'est de la sagesse.", author: 'Marianne Williamson' },
  { text: 'Chaque fin est un nouveau commencement.', author: 'Priya Ardis' },
  { text: 'Ce qui ne nous tue pas nous rend plus fort.', author: 'Friedrich Nietzsche' },
  { text: "Tu n'as pas a controler tes pensees. Tu dois juste arreter de les laisser te controler.", author: 'Dan Millman' },
  { text: 'La douleur est inevitable. La souffrance est optionnelle.', author: 'Haruki Murakami' },
  { text: "Aimer, ce n'est pas se regarder l'un l'autre, c'est regarder ensemble dans la meme direction.", author: 'Antoine de Saint-Exupery' },
  { text: "On ne peut pas empecher les oiseaux de la tristesse de voler au-dessus de nos tetes, mais on peut les empecher de faire leur nid dans nos cheveux.", author: 'Proverbe chinois' },
  { text: "Le coeur a ses raisons que la raison ne connait point.", author: 'Blaise Pascal' },
  { text: 'Tu merites un amour qui ne te fasse pas douter de ta valeur.', author: 'Frida Kahlo' },
  { text: "Le vrai voyage de decouverte ne consiste pas a chercher de nouveaux paysages, mais a avoir de nouveaux yeux.", author: 'Marcel Proust' },
  { text: "Accepter ce qui est, lacher prise sur ce qui etait, avoir confiance en ce qui sera.", author: 'Sonia Ricotti' },
  { text: "Tout ce qui nous arrive a un sens, meme si on ne le comprend pas tout de suite.", author: 'Paulo Coelho' },
  { text: "La vie ne s'arrete pas la ou le coeur se brise.", author: 'T.S. Eliot' },
  { text: "Se reconstruire, c'est aussi apprendre a s'aimer soi-meme d'abord.", author: 'Brene Brown' },
  { text: 'Le silence apres une tempete est le berceau de tout recommencement.', author: 'Victor Hugo' },
  { text: "On guerit de la souffrance par l'experience de la souffrance.", author: 'Marcel Proust' },
  { text: "Prendre soin de soi n'est pas un luxe. C'est une necessite.", author: 'Audre Lorde' },
  { text: "Etre seul ne signifie pas etre solitaire.", author: 'Paulo Coelho' },
  { text: "Ce que nous attendons avec impatience et ce dont nous avons besoin sont deux choses differentes.", author: 'Bessel van der Kolk' },
  { text: 'La tristesse est une frontiere entre deux pays heureux.', author: 'Christian Bobin' },
  { text: "On n'est jamais aussi fort que lorsqu'on a touche le fond et qu'on remonte.", author: 'Georges Bernanos' },
  { text: "Ne cherche pas quelqu'un pour completer ta vie. Cherche quelqu'un avec qui partager ta plenitude.", author: 'Rainer Maria Rilke' },
  { text: "L'amour que tu te portes est le fondement de tout l'amour que tu peux donner.", author: 'Louise Hay' },
  { text: "Un jour tu regarderas en arriere et tu comprendras pourquoi ca n'a pas marche.", author: 'Anonyme' },
  { text: "La douleur t'a change mais elle ne t'a pas brise.", author: 'Nikita Gill' },
  { text: 'Tu es plus courageux que tu ne le crois.', author: 'A.A. Milne' },
];

function getTodayQuote() {
  const today = new Date();
  const dayOfYear =
    Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    ) + today.getFullYear() * 365;
  return QUOTES[dayOfYear % QUOTES.length];
}

export function DailyQuoteModal() {
  const lastQuoteDate = useAppStore((s) => s.lastQuoteDate);
  const markQuoteSeenToday = useAppStore((s) => s.markQuoteSeenToday);

  const shouldShow =
    !lastQuoteDate || !isSameDay(lastQuoteDate, new Date());

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (shouldShow) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, [shouldShow]);

  const quote = getTodayQuote();

  const handleClose = () => {
    setVisible(false);
    markQuoteSeenToday();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/40 px-6"
        onPress={handleClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="w-full rounded-3xl bg-surface px-8 py-10 shadow-lg">
            <Text className="mb-6 text-center text-4xl">💜</Text>

            <Text className="mb-1 text-center text-caption uppercase tracking-widest text-lavender-400">
              Citation du jour
            </Text>

            <Text className="mb-6 text-center text-body-md font-medium italic leading-relaxed text-text-primary">
              &ldquo;{quote.text}&rdquo;
            </Text>

            <Text className="mb-8 text-center text-caption text-text-muted">
              — {quote.author}
            </Text>

            <TouchableOpacity
              onPress={handleClose}
              activeOpacity={0.8}
              className="items-center rounded-button bg-lavender-300 py-4"
            >
              <Text className="text-body-md font-semibold text-lavender-900">
                Commencer ma journée
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
