import { StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/styles';

const styles = StyleSheet.create({
  profileContainer: {
    ...GlobalStyles.container,
    backgroundColor: GlobalStyles.colors.background,
  },
  title: {
    ...GlobalStyles.title,
    color: GlobalStyles.colors.primary,
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
    color: GlobalStyles.colors.primary,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
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
});

export default styles;
