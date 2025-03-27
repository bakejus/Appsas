import { StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/styles';

const styles = StyleSheet.create({
  profileContainer: {
    ...GlobalStyles.container,
    backgroundColor: GlobalStyles.colors.background,
    padding: 10,
  },
  title: {
    ...GlobalStyles.title,
    color: GlobalStyles.colors.primary,
    top: 0,
    left: 0,
    right: 0,
    bottom: 10,
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
    fontSize: 25,
    color: 'black',
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: "bold",
  },
  buttonContainer: {
    ...GlobalStyles.buttonContainer,
  },
  button: {
    ...GlobalStyles.button,
    minWidth: '40%',
  },
  buttonText: {
    ...GlobalStyles.buttonText,
  },
  linkText: {
    ...GlobalStyles.linkText,
    marginTop: 10,
  },
  container:{
    flexDirection: "row",
    justifyContent: "space-between",
  },
  square1: {
    width: "50%", // Two squares per row
    aspectRatio: 1, // Makes it a square
    borderTopWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  square2: {
      width: "50%", // Two squares per row
      borderTopWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      padding: 20,
  },
});

export default styles;
