import { StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/styles';

const styles = StyleSheet.create({
  homeContainer: {
    ...GlobalStyles.container,
        backgroundColor: GlobalStyles.colors.background,
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
    width: '90%',
    //backgroundColor: GlobalStyles.colors.primary,
    borderColor: GlobalStyles.colors.primary,
    borderWidth: 5,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
      paddingBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
    appName: {
      color: GlobalStyles.colors.primary,
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    postContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      },
      postTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
      },
      postUser: {
        fontSize: 14,
        color: '#777',
        marginBottom: 8,
      },
      postDescription: {
        fontSize: 16,
        color: '#555',
        marginBottom: 12,
      },
      activityContainer: {
        backgroundColor: '#f2f2f2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
      },
      activityText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
      },
      likesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
      },
      icon: {
        color: '#e91e63',
        marginRight: 6,
      },
      likesText: {
        fontSize: 14,
        color: '#333',
      },

});
export const alertNotificationColors = [
  { //light mode
    success: {
      border: 'red',
      background: '#fff5f5',
      icon: 'red',
      title: 'red',
      message: 'black',
      primary: 'red',
    },
  },
  {//dark mode
    success: {
      border: '#660000',
      background: '#2c2c2c',
      icon: '#ff6666',
      title: '#ff6666',
      message: 'white',
      primary: '#ff4444',
    },
  },
];

export default styles;
