import { StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/styles';

const styles = StyleSheet.create({
  homeContainer: {
    ...GlobalStyles.container,
    backgroundColor: GlobalStyles.colors.background,
    width: "100%",
    padding: 0,
  },
  title: {
    ...GlobalStyles.title,
    color: GlobalStyles.colors.primary,
    top: 0,
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
  topBar: {
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      backgroundColor: '#fdfaf5',
      paddingTop: 5,
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
  appName:{
  color: GlobalStyles.colors.primary,
  fontSize: 25,
  fontWeight: 'bold',
  },
});

export default styles;
