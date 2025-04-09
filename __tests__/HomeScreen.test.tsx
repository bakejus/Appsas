import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/route/HomeScreen/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-sensors', () => ({
  Pedometer: {
    isAvailableAsync: jest.fn(),
    watchStepCount: jest.fn(),
  },
}));

test('loads 3000 stored steps and sets correct state', async () => {
  jest.mock('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue('3000');
    Pedometer.isAvailableAsync.mockResolvedValue(true);
    Pedometer.watchStepCount.mockImplementation(() => ({ remove: jest.fn() }));
  
    const { getByText } = render(<HomeScreen navigation={{}} />);
  
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('stepsCount');
      expect(getByText(/Available/i)).toBeTruthy();
    });

    test('adds 500 steps from Pedometer watchStepCount and stores them', async () => {
      AsyncStorage.getItem.mockResolvedValue('1000');
      Pedometer.isAvailableAsync.mockResolvedValue(true);
    
      // Simulate pedometer returning 500 new steps
      Pedometer.watchStepCount.mockImplementation(callback => {
        callback({ steps: 500 });
        return { remove: jest.fn() };
      });
    
      render(<HomeScreen navigation={{}} />);
    
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('stepsCount', '1500');
      });
    });

    test('shows "Not available" when pedometer is unavailable', async () => {
      AsyncStorage.getItem.mockResolvedValue('1500');
      Pedometer.isAvailableAsync.mockResolvedValue(false);
    
      const { getByText } = render(<HomeScreen navigation={{}} />);
    
      await waitFor(() => {
        expect(getByText(/Not available/i)).toBeTruthy();
      });
    });

    test('handles null from AsyncStorage and initializes with 0 steps', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      Pedometer.isAvailableAsync.mockResolvedValue(true);
      Pedometer.watchStepCount.mockImplementation(() => ({ remove: jest.fn() }));
    
      render(<HomeScreen navigation={{}} />);
    
      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('stepsCount');
      });
    });

    test('handles AsyncStorage.getItem rejection gracefully', async () => {
      AsyncStorage.getItem.mockRejectedValue(new Error('Storage failed'));
      Pedometer.isAvailableAsync.mockResolvedValue(true);
    
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      render(<HomeScreen navigation={{}} />);
    
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error loading steps:'), expect.any(Error));
      });
    
      consoleSpy.mockRestore();
    });

  });