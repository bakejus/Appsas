import { StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/styles';

const styles = StyleSheet.create({
  homeContainer: {
    ...GlobalStyles.container,
    backgroundColor: GlobalStyles.colors.background,
  },
  title: {
    ...GlobalStyles.title,
    color: GlobalStyles.colors.primary,
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  statsContainer: {
    width: '100%',
    padding: 20,
    //backgroundColor: GlobalStyles.colors.primary,
    borderColor: GlobalStyles.colors.primary,
    borderWidth: 5,
    borderRadius: 10,
    marginBottom: 20,
    // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,

        // Android shadow
        elevation: 5,  // Elevation adds shadow on Android
  },
  statText: {
    fontSize: 18,
    color: GlobalStyles.colors.primary,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  navBar: {
      ...GlobalStyles.navBar,
  },
  navBarButton: {
      ...GlobalStyles.navBarButton,

  },
  navBarButtonText: {
      ...GlobalStyles.navBarButtonText,
  },
  buttonContainer: {
    ...GlobalStyles.buttonContainer,
  },
  button: {

  },
  buttonText: {
    ...GlobalStyles.buttonText,
    fontSize: 7,
  },
});

export default styles;
