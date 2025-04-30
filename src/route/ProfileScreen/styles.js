import { StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/styles';

const styles = StyleSheet.create({
  profileContainer: {
    ...GlobalStyles.container,
    backgroundColor: GlobalStyles.colors.background,
    padding: 0,
  },
  title: {
    ...GlobalStyles.title,
    color: GlobalStyles.colors.primary,
    left: 0,
    right: 0,
    top: 25,
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
    ...GlobalStyles.button,
    width: '30%',
    margin: 'auto',
  },
  buttonText: {
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
      flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginVertical: 20,
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#fff',
      marginHorizontal: 6,
      paddingVertical: 16,
      borderRadius: 12,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

    statLabel: {
      marginTop: 8,
      fontSize: 14,
      color: '#666',
    },

    statValue: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 4,
      color: '#333',
    },
  statText: {
      fontSize: 18,
      //color: GlobalStyles.colors.primary,
      fontWeight: '500',
      marginBottom: 10,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 16,
      fontSize: 16,
      backgroundColor: '#fff',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      margin: 'auto',
      marginTop: 20,
    },

    settingLabel: {
      fontSize: 16,
      marginBottom: 4,
      color: '#444',
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
          marginBottom: 20,
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
          marginLeft: 10,
        },
        postDescription: {
          fontSize: 16,
          color: '#555',
          marginBottom: 12,
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
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },

  friendName: {
    fontSize: 16,
    fontWeight: '500',
  },

});

export default styles;
