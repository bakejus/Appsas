// Mocks for @react-navigation

/*jest.mock('@react-navigation/native', () => {
    return {
      useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
      }),
      NavigationContainer: jest.fn().mockImplementation(({ children }) => children),
    };
  });
  
  jest.mock('@react-navigation/stack', () => {
    return {
      createStackNavigator: jest.fn().mockReturnValue({
        Navigator: jest.fn().mockImplementation(({ children }) => children),
        Screen: jest.fn(),
      }),
    };
  });*/

  import 'react-native-gesture-handler/jestSetup';

  jest.mock('react-native/Libraries/vendor/emitter/EventEmitter', () => ({
    EventEmitter: class {
      addListener() { return { remove: jest.fn() }; }
      removeAllListeners() {}
      emit() {}
    }
  }));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return Reanimated;
});

  