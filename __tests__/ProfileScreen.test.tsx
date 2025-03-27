import React from 'react';
import { render, act } from '@testing-library/react-native';
import ProfileScreen from '../src/route/ProfileScreen/ProfileScreen';
import { supabase } from '../src/services/supabase';

// Mockin'am supabase duomenu baze
// Mockin'a su netikru vartotoju ir veikla
jest.mock('../src/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { email: 'test@example.com' } },
        error: null,
      }),
    },
    // Mockin'am duomenu gavima is USER ir ACTIVITY lenteles
    from: jest.fn((table) => {
      if (table === 'USER') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { username: 'testuser' },
                error: null,
              }),
            })),
          })),
        };
      } else if (table === 'ACTIVITY') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() =>
                Promise.resolve({
                  data: [
                    { duration: 60, distance: 3.5, step_count: 5000, calories_burned: 200 },
                    { duration: 90, distance: 6.5, step_count: 7000, calories_burned: 300 },
                  ],
                  error: null,
                })
            ),
          })),
        };
      }
    }),
  },
}));

// Testai, kurie tikrina, ar teisingai susumuojami duomenys
describe('ProfileScreen with mock', () => {
  it('should correctly sum the duration', async () => {
    // Renderinam ProfileScreen
    const { findByText } = render(<ProfileScreen navigation={{ navigate: jest.fn() }} />);
    // Ieskom teksto, kuriame yra 'Total Duration:'
    const durationText = await findByText(/Total Duration:/);
    // Spausdinam, apskaiciuota reiksme
    console.log('Actual Duration Text:', durationText.props.children);
    // Patikrinam, ar tekstas egzistuoja
    expect(durationText.props.children).toEqual(['Total Duration: ', 150, ' km']);
  });

  it('should correctly sum the distance', async () => {
    const { findByText } = render(<ProfileScreen navigation={{ navigate: jest.fn() }} />);
    const distanceText = await findByText(/Total Distance:/);
    console.log('Actual Distance Text:', distanceText.props.children);
    expect(distanceText.props.children).toEqual(['Total Distance: ', 10, ' km']);
  });

  it('should correctly sum the steps', async () => {
    const { findByText } = render(<ProfileScreen navigation={{ navigate: jest.fn() }} />);
    const stepsText = await findByText(/Total Steps:/);
    console.log('Actual Steps Text:', stepsText.props.children);
    expect(stepsText.props.children).toEqual(['Total Steps: ', 12000]);
  });

  it('should correctly sum the calories', async () => {
    const { findByText } = render(<ProfileScreen navigation={{ navigate: jest.fn() }} />);
    const caloriesText = await findByText(/Calories Burned:/);
    console.log('Actual Calories Text:', caloriesText.props.children);
    expect(caloriesText.props.children).toEqual(['Calories Burned: ', 500, ' kcal']);
  });
});
