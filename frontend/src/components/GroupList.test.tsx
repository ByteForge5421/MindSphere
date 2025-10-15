import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupList from './GroupList';

describe('GroupList', () => {
  const mockGroups = [
    {
      _id: '1',
      name: 'Study Group',
      description: 'A group for studying',
      members: [],
      category: 'Academic',
    },
    {
      _id: '2',
      name: 'Sports Group',
      description: 'For sports enthusiasts',
      members: ['user-123'],
      category: 'Sports',
    },
  ];

  const mockJoinGroup = vi.fn();
  const mockSetSelectedGroup = vi.fn();

  test('renders group list', () => {
    render(
      <GroupList
        groups={mockGroups}
        currentUserId="user-1"
        joinGroup={mockJoinGroup}
        setSelectedGroup={mockSetSelectedGroup}
      />
    );

    expect(screen.getByText('Study Group')).toBeInTheDocument();
    expect(screen.getByText('Sports Group')).toBeInTheDocument();
  });

  test('renders empty state when no groups', () => {
    render(
      <GroupList
        groups={[]}
        currentUserId="user-1"
        joinGroup={mockJoinGroup}
        setSelectedGroup={mockSetSelectedGroup}
      />
    );

    expect(screen.getByText('No community groups yet')).toBeInTheDocument();
  });

  test('shows join button for non-members', async () => {
    const user = userEvent.setup();
    render(
      <GroupList
        groups={mockGroups}
        currentUserId="user-999"
        joinGroup={mockJoinGroup}
        setSelectedGroup={mockSetSelectedGroup}
      />
    );

    const joinButtons = screen.getAllByRole('button', { name: /join/i });
    expect(joinButtons.length).toBeGreaterThan(0);
  });
});
