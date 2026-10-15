import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DEMO_CREATED_KEYS } from '@/services/project-management/mock-project-management-service';
import { NewSecretKeyReveal } from './new-secret-key-reveal';

const meta = {
  title: 'Settings/New secret key reveal',
  component: NewSecretKeyReveal,
  tags: ['autodocs'],
  args: { secretKey: DEMO_CREATED_KEYS.secret, onDone: () => undefined },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NewSecretKeyReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InSpanish: Story = { globals: { locale: 'es' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
