import { StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/styles';

const styles = StyleSheet.create({
  registrationContainer: {
    ...GlobalStyles.container,
    backgroundColor: GlobalStyles.colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    ...GlobalStyles.title,
    color: GlobalStyles.colors.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    ...GlobalStyles.input,
    borderColor: GlobalStyles.colors.primary,
    backgroundColor: GlobalStyles.colors.secondary,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    ...GlobalStyles.button,
  },
  buttonText: {
    ...GlobalStyles.buttonText,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: GlobalStyles.colors.accent,
  },
  signupLink: {
    color: GlobalStyles.colors.accent,
    fontWeight: 'bold',
  },
  placeholder: {
    color: GlobalStyles.colors.primary,
  },
});

export default styles;
