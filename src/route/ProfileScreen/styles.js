import { StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/styles';

const styles = StyleSheet.create({
  profileContainer: {
    ...GlobalStyles.container,
    backgroundColor: GlobalStyles.colors.background,
    padding: 0,
  },
  title: {
    ...GlobalStyles.title,
    color: GlobalStyles.colors.primary,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: GlobalStyles.colors.white,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    //color: GlobalStyles.colors.primary,
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
    ...GlobalStyles.button,
  },
  buttonText: {
    ...GlobalStyles.buttonText,
  },
  linkText: {
    ...GlobalStyles.linkText,
    marginTop: 10,
  },
  statsContainer: {
      width: '100%',
      padding: 20,
      //backgroundColor: GlobalStyles.colors.primary,
      borderColor: GlobalStyles.colors.primary,
      borderWidth: 5,
      borderRadius: 20,
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
      //color: GlobalStyles.colors.primary,
      fontWeight: '500',
      marginBottom: 10,
      textAlign: 'center',
    },
});

export default styles;
