import { Text, type TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading = ({ children, className = '', ...props }: TypographyProps) => (
  <Text className={`text-heading-lg font-bold text-text-primary ${className}`} {...props}>
    {children}
  </Text>
);

export const Subheading = ({ children, className = '', ...props }: TypographyProps) => (
  <Text className={`text-heading-md font-semibold text-text-primary ${className}`} {...props}>
    {children}
  </Text>
);

export const Body = ({ children, className = '', ...props }: TypographyProps) => (
  <Text className={`text-body-md text-text-secondary ${className}`} {...props}>
    {children}
  </Text>
);

export const Caption = ({ children, className = '', ...props }: TypographyProps) => (
  <Text className={`text-caption text-text-muted ${className}`} {...props}>
    {children}
  </Text>
);
