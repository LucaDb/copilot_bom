import { Meta, StoryObj } from '@storybook/react';
import { IconWebhook } from '@websolutespa/bom-mixer-icons';
import { Button } from '@websolutespa/bom-mixer-ui';

const meta: Meta<typeof Button> = {
  title: 'Components / Button',
  component: Button,
  decorators: [(story) => (
    <div style={{ padding: '2rem', width: '100vw', maxWidth: '100%' }}>
      {story()}
    </div>
  )],
  //👇 Enables auto-generated documentation for the component story
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['default', 'primary', 'secondary', 'outline', 'ghost', 'link', 'underline', 'nav', 'circle'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Default',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    children: 'Link',
    variant: 'link',
  },
};

export const Underline: Story = {
  args: {
    children: 'Underline',
    variant: 'underline',
  },
};

export const Nav: Story = {
  args: {
    children: 'Nav',
    variant: 'nav',
  },
};

export const Circle: Story = {
  args: {
    children: <IconWebhook />,
    variant: 'circle',
  },
};
