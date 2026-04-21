import { useMemo } from 'react';
import { TextInput, View, Text } from 'react-native';

interface DateInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

function clampNumber(input: string, max: number, length: number): string {
  const digits = input.replace(/\D/g, '').slice(0, length);
  if (!digits) return '';
  const n = parseInt(digits, 10);
  if (Number.isNaN(n)) return '';
  return String(Math.min(n, max));
}

export function DateInput({ value, onChange }: DateInputProps) {
  const [year, month, day] = useMemo(() => {
    if (!value) return ['', '', ''];
    const [y, m, d] = value.split('-');
    return [y ?? '', m ?? '', d ?? ''];
  }, [value]);

  const update = (d: string, m: string, y: string) => {
    if (d && m && y.length === 4) {
      const iso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      const date = new Date(iso);
      if (!Number.isNaN(date.getTime()) && date <= new Date()) {
        onChange(iso);
        return;
      }
    }
    onChange(null);
  };

  const cellClass =
    'rounded-button border border-lavender-200 bg-surface px-4 py-3 text-body-md text-text-primary text-center';

  return (
    <View>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Text className="mb-1 text-body-sm text-text-muted">Jour</Text>
          <TextInput
            className={cellClass}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="JJ"
            value={day}
            onChangeText={(t) => update(clampNumber(t, 31, 2), month, year)}
          />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-body-sm text-text-muted">Mois</Text>
          <TextInput
            className={cellClass}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="MM"
            value={month}
            onChangeText={(t) => update(day, clampNumber(t, 12, 2), year)}
          />
        </View>
        <View className="flex-[1.4]">
          <Text className="mb-1 text-body-sm text-text-muted">Année</Text>
          <TextInput
            className={cellClass}
            keyboardType="number-pad"
            maxLength={4}
            placeholder="AAAA"
            value={year}
            onChangeText={(t) => update(day, month, clampNumber(t, new Date().getFullYear(), 4))}
          />
        </View>
      </View>
    </View>
  );
}
