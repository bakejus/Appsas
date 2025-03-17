import { StyleSheet, Dimensions } from 'react-native';
import GlobalStyles from '../../styles/styles';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  loginContainer: {
    ...GlobalStyles.container,
    backgroundColor: GlobalStyles.colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    ...GlobalStyles.title,
    color: GlobalStyles.colors.primary,
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
    alignSelf: 'flex-end',
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
});


export default styles;
