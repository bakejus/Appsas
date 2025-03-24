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
    backgroundColor: GlobalStyles.colors.primary,
    borderRadius: 10,
    marginBottom: 20,
  },
  statText: {
    fontSize: 18,
    color: GlobalStyles.colors.black,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    ...GlobalStyles.buttonContainer,
  },
  button: {
    ...GlobalStyles.button,
    minWidth: 100,
  },
  buttonText: {
    ...GlobalStyles.buttonText,
  },
});

export default styles;
