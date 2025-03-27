import { StyleSheet, Dimensions } from 'react-native';
import GlobalStyles from '../../styles/styles';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  loginContainer: {
    ...GlobalStyles.container,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    ...GlobalStyles.title,
    color: 'black',
    fontSize: 36,
    textAlign: 'center',
    marginTop: height * 0.3,
    fontWeight: 'bold',
  },
  input: {
    ...GlobalStyles.input,
    borderColor: GlobalStyles.colors.primary,
    backgroundColor: GlobalStyles.colors.secondary,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  button: {
    ...GlobalStyles.button,
  },
  buttonText: {
    ...GlobalStyles.buttonText,
  },
  linkText: {
    ...GlobalStyles.linkText,
    fontSize: 14,
    color: GlobalStyles.colors.accent,
    textAlign: 'center',
    marginTop: 10,
  },
  forgotPassword: {
    marginTop: 10,
    fontSize: 14,
    color: GlobalStyles.colors.accent,
  },
  placeholder: {
    color: GlobalStyles.colors.mutedGray,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  rememberUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    alignSelf: 'center',
    width: 18,
    height: 18,
    borderRadius: 3,
    marginRight: 8,
  },
  rememberUserText: {
    color: GlobalStyles.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%', // Ensure full height coverage
    justifyContent: 'center',
    alignItems: 'center', // Center content inside the background
  }
});


export default styles;
