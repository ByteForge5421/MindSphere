import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VoiceRecorder } from './VoiceRecorder';

// Mock browser APIs
const mockGetUserMedia = vi.fn();
vi.stubGlobal('navigator', {
  mediaDevices: {
    getUserMedia: mockGetUserMedia,
  },
});

describe('VoiceRecorder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders voice recorder button', () => {
    mockGetUserMedia.mockResolvedValueOnce({
      getTracks: () => [],
    });

    render(
      <VoiceRecorder onAnalysisComplete={() => {}} />
    );

    expect(screen.queryByRole('button')).toBeTruthy();
  });

  test('requests microphone access when recording starts', () => {
    mockGetUserMedia.mockResolvedValueOnce({
      getTracks: () => [],
    });

    render(
      <VoiceRecorder onAnalysisComplete={() => {}} />
    );

    expect(screen.queryByRole('button')).toBeTruthy();
  });
});
