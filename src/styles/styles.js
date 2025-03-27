import {StyleSheet} from 'react-native';

const GlobalStyles = StyleSheet.create({
  colors: {
    primary: '#feb83d', // Primary
    secondary: '#fefcf0', // Secondary
    background: '#fdfaf5', //  background
    accent: '#61707D', // Accent
    white: '#ffffff',
    mutedGray: '#888888',
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
  },
  button: {
    backgroundColor: "#feb83d",
    paddingVertical: 8,  // Smaller vertical padding
    paddingHorizontal: 20,  // Smaller horizontal padding
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    //paddingHorizontal: 20,
    backgroundColor: '#ffdc9f', // Dark background to match the overall theme
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,  // Smaller font size for smaller button
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#fdfaf5', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    //paddingHorizontal: 20,
    backgroundColor: '#feb83d',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ffdc9f', // Light border to separate navbar from the content
  },
  navBarButton: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    maxWidth: '25%',
  },
  navBarButtonText: {
    color: '#ffffff',
    fontSize: 14,  // Smaller font size for smaller button
    fontWeight: 'bold',
    fontSize: 7,
  },

  icon: {
  color: "#ffffff",
  },
});

export default GlobalStyles;
