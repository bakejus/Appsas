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
  button: {
      ...GlobalStyles.button,
      width: '50%',
      margin: 'auto',
    },
    buttonText: {
      ...GlobalStyles.buttonText,
    },
  postButton: {
    ...GlobalStyles.button,
    width: '30%',
    margin: 'auto',
    marginBottom: -5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postButtonText: {
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
    activityItem: {
      backgroundColor: '#e6e6e6',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
    },
    activityText: {
      fontSize: 14,
      color: '#333',
    },
    scroller: {
    padding: 10,
    margin: 0,
    width: "100%",
    },
});

export default styles;
