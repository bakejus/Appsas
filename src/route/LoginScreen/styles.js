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
    backgroundColor: GlobalStyles.colors.secondary,
    paddingVertical: 8,  // Smaller vertical padding
    paddingHorizontal: 20,  // Smaller horizontal padding
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',

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
});


export default styles;
