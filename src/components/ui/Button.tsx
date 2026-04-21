import { forwardRef } from 'react';
import { Text, TouchableOpacity, type TouchableOpacityProps, type View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'rose' | 'sky' | 'sage';

type ButtonProps = {
  title: string;
  variant?: ButtonVariant;
  className?: string;
} & TouchableOpacityProps;

const variantStyles: Record<ButtonVariant, { button: string; text: string }> = {
  primary: {
    button: 'bg-lavender-300 rounded-button shadow-soft px-6 py-4 items-center',
    text: 'text-lavender-900 text-body-md font-semibold',
  },
  secondary: {
    button: 'bg-surface border border-lavender-200 rounded-button px-6 py-4 items-center',
    text: 'text-lavender-700 text-body-md font-semibold',
  },
  ghost: {
    button: 'px-6 py-4 items-center',
    text: 'text-lavender-500 text-body-md font-medium',
  },
  rose: {
    button: 'bg-rose-100 rounded-button shadow-soft px-6 py-4 items-center border border-rose-200',
    text: 'text-rose-400 text-body-md font-semibold',
  },
  sky: {
    button: 'bg-sky-100 rounded-button shadow-soft px-6 py-4 items-center border border-sky-100',
    text: 'text-sky-500 text-body-md font-semibold',
  },
  sage: {
    button: 'bg-sage-100 rounded-button shadow-soft px-6 py-4 items-center border border-sage-200',
    text: 'text-sage-600 text-body-md font-semibold',
  },
};

export const Button = forwardRef<View, ButtonProps>(
  ({ title, variant = 'primary', className = '', ...touchableProps }, ref) => {
    const styles = variantStyles[variant];
    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        className={`${styles.button} ${className}`}
        activeOpacity={0.7}>
        <Text className={styles.text}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
