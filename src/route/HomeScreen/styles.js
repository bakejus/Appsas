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
    minWidth: 100,
  },
  buttonText: {
    ...GlobalStyles.buttonText,
  },
});

export default styles;
