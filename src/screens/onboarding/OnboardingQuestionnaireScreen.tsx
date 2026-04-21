import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Container, Heading, Body } from '@/components';
import { useOnboardingStore, useAppStore } from '@/stores';
import {
  SEPARATION_REASON_LABELS,
  TIME_SINCE_LABELS,
  DURATION_LABELS,
  EMOTION_CONFIG,
} from '@/types';
import type {
  SeparationReason,
  TimeSinceSeparation,
  RelationshipDuration,
  OnboardingEmotion,
} from '@/types';
import { useUpdateProfile } from '@/hooks/useAuth';
import { ProgressBar } from './components/ProgressBar';
import { ChoiceButton } from './components/ChoiceButton';
import { LoveSlider } from './components/LoveSlider';
import { DateInput } from './components/DateInput';

const TOTAL_STEPS = 6;

export default function OnboardingQuestionnaireScreen() {
  const [step, setStep] = useState(0);
  const {
    answers,
    toggleReason,
    setTimeSince,
    setDuration,
    setLoveLevel,
    setEmotion,
    setBreakupDate,
  } = useOnboardingStore();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const updateProfile = useUpdateProfile();

  const canGoNext = () => {
    switch (step) {
      case 0:
        return answers.reasons.length > 0;
      case 1:
        return answers.timeSince !== null;
      case 2:
        return answers.duration !== null;
      case 3:
        return true; // slider always has a value
      case 4:
        return answers.emotion !== null;
      case 5:
        return true; // breakup date optional, user can skip-through
      default:
        return false;
    }
  };

  const finalize = async () => {
    if (answers.breakupDate) {
      try {
        await updateProfile.mutateAsync({ breakupDate: answers.breakupDate });
      } catch {
        // Non-blocking: even if the API call fails, finish onboarding locally.
      }
    }
    completeOnboarding();
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      finalize();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <Container>
      <View className="flex-1">
        {/* Header */}
        <View className="mb-6 mt-2 flex-row items-center justify-between">
          <View className="mr-4 flex-1">
            <ProgressBar current={step} total={TOTAL_STEPS} />
          </View>
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
            <Text className="text-body-sm font-medium text-text-muted">Passer</Text>
          </TouchableOpacity>
        </View>

        {/* Step content */}
        <View className="flex-1">
          {step === 0 && <ReasonsStep reasons={answers.reasons} onToggle={toggleReason} />}
          {step === 1 && <TimeSinceStep value={answers.timeSince} onSelect={setTimeSince} />}
          {step === 2 && <DurationStep value={answers.duration} onSelect={setDuration} />}
          {step === 3 && <LoveLevelStep value={answers.loveLevel} onChange={setLoveLevel} />}
          {step === 4 && <EmotionStep value={answers.emotion} onSelect={setEmotion} />}
          {step === 5 && (
            <BreakupDateStep value={answers.breakupDate} onChange={setBreakupDate} />
          )}
        </View>

        {/* Navigation */}
        <View className="mb-4 flex-row gap-3">
          {step > 0 && (
            <TouchableOpacity
              onPress={() => setStep(step - 1)}
              activeOpacity={0.7}
              className="items-center rounded-button border border-lavender-200 bg-surface px-6 py-4"
            >
              <Text className="text-body-md font-semibold text-lavender-700">Retour</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.7}
            disabled={!canGoNext() || updateProfile.isPending}
            className={`flex-1 items-center rounded-button px-6 py-4 shadow-soft ${
              canGoNext() && !updateProfile.isPending ? 'bg-lavender-300' : 'bg-lavender-100'
            }`}
          >
            <Text
              className={`text-body-md font-semibold ${
                canGoNext() && !updateProfile.isPending ? 'text-lavender-900' : 'text-lavender-400'
              }`}
            >
              {step === TOTAL_STEPS - 1 ? 'Terminer' : 'Suivant'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
}

// --- Step components ---

function ReasonsStep({
  reasons,
  onToggle,
}: {
  reasons: SeparationReason[];
  onToggle: (r: SeparationReason) => void;
}) {
  return (
    <View>
      <Heading className="mb-2">Quelle est la raison de la séparation ?</Heading>
      <Body className="mb-6">Tu peux en sélectionner plusieurs.</Body>
      <View className="gap-3">
        {(Object.keys(SEPARATION_REASON_LABELS) as SeparationReason[]).map((key) => (
          <ChoiceButton
            key={key}
            label={SEPARATION_REASON_LABELS[key]}
            selected={reasons.includes(key)}
            onPress={() => onToggle(key)}
          />
        ))}
      </View>
    </View>
  );
}

function TimeSinceStep({
  value,
  onSelect,
}: {
  value: TimeSinceSeparation | null;
  onSelect: (v: TimeSinceSeparation) => void;
}) {
  return (
    <View>
      <Heading className="mb-2">Depuis combien de temps es-tu séparé(e) ?</Heading>
      <Body className="mb-6">Ça nous aide à adapter ton parcours.</Body>
      <View className="gap-3">
        {(Object.keys(TIME_SINCE_LABELS) as TimeSinceSeparation[]).map((key) => (
          <ChoiceButton
            key={key}
            label={TIME_SINCE_LABELS[key]}
            selected={value === key}
            onPress={() => onSelect(key)}
          />
        ))}
      </View>
    </View>
  );
}

function DurationStep({
  value,
  onSelect,
}: {
  value: RelationshipDuration | null;
  onSelect: (v: RelationshipDuration) => void;
}) {
  return (
    <View>
      <Heading className="mb-2">Combien de temps a duré la relation ?</Heading>
      <Body className="mb-6">Chaque histoire est unique.</Body>
      <View className="gap-3">
        {(Object.keys(DURATION_LABELS) as RelationshipDuration[]).map((key) => (
          <ChoiceButton
            key={key}
            label={DURATION_LABELS[key]}
            selected={value === key}
            onPress={() => onSelect(key)}
          />
        ))}
      </View>
    </View>
  );
}

function LoveLevelStep({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View>
      <Heading className="mb-2">À quel point tu l&apos;aimes encore ?</Heading>
      <Body className="mb-8">Sois honnête, il n&apos;y a pas de mauvaise réponse.</Body>
      <LoveSlider value={value} onValueChange={onChange} />
    </View>
  );
}

function EmotionStep({
  value,
  onSelect,
}: {
  value: OnboardingEmotion | null;
  onSelect: (v: OnboardingEmotion) => void;
}) {
  return (
    <View>
      <Heading className="mb-2">Comment tu te sens aujourd&apos;hui ?</Heading>
      <Body className="mb-6">Ton ressenti du moment, sans filtre.</Body>
      <View className="gap-3">
        {(Object.keys(EMOTION_CONFIG) as OnboardingEmotion[]).map((key) => (
          <ChoiceButton
            key={key}
            label={EMOTION_CONFIG[key].label}
            emoji={EMOTION_CONFIG[key].emoji}
            selected={value === key}
            onPress={() => onSelect(key)}
          />
        ))}
      </View>
    </View>
  );
}

function BreakupDateStep({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <View>
      <Heading className="mb-2">Quand la séparation a-t-elle eu lieu ?</Heading>
      <Body className="mb-6">
        Renseigner la date nous permet de t&apos;offrir des prompts adaptés à ton parcours.
        Tu peux passer cette étape et la renseigner plus tard.
      </Body>
      <DateInput value={value} onChange={onChange} />
    </View>
  );
}
