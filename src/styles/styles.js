import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
  colors: {
    primary: '#4CAF50', // Hulk Green
    secondary: '#6A0DAD', // Deep Purple
    background: '#1C1C1E', // Dark Gray/Black background
    accent: '#32FF7E', // Neon Green (Accent)
    white: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#0077b6',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'HelveticaNeue',
    backgroundColor: '#fff',
    color: '#4CAF50',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,  // Smaller vertical padding
    paddingHorizontal: 20,  // Smaller horizontal padding
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 14,  // Smaller font size for smaller button
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

export default GlobalStyles;
