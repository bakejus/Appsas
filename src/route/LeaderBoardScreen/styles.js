import {Dimensions, StyleSheet} from 'react-native';
import GlobalStyles from '../../styles/styles';

const { height } = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.container,
        backgroundColor: GlobalStyles.colors.background,
        padding: 20,
    },
    title: {
        ...GlobalStyles.title,
        color: GlobalStyles.colors.primary,
        textAlign: 'center',
        marginBottom: 20,
        marginTop: height * 0.1,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: GlobalStyles.colors.secondary,
    },
    activeTab: {
        backgroundColor: GlobalStyles.colors.primary,
    },
    tabText: {
        color: GlobalStyles.colors.text,
        fontWeight: 'bold',
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: GlobalStyles.colors.border,
        width: '100%',
    },
    leaderboardRank: {
        width: 40,
        textAlign: 'center',
        fontWeight: 'bold',
        color: GlobalStyles.colors.primary,
    },
    leaderboardRankHeader: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 'bold',
        color: GlobalStyles.colors.primary,
    },
    leaderboardUsername: {
        fontSize: 16,
        color: GlobalStyles.colors.primary,
        textAlign: 'left',
        paddingHorizontal: 10,
        paddingRight: 45,
    },
    leaderboardUsernameHeader: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 'bold',
        color: GlobalStyles.colors.primary,
        paddingRight: 45,
    },
    leaderboardScore: {
        width: 90,
        textAlign: 'left',
        fontSize: 16,
        color: GlobalStyles.colors.primary,

    },
    leaderboardScoreHeader: {
        width: 90,
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 'bold',
        color: GlobalStyles.colors.primary,
    },
    buttonContainer: {
        ...GlobalStyles.buttonContainer,
    },
    button: {
        ...GlobalStyles.button,
    },
    buttonText: {
        ...GlobalStyles.buttonText,
    },
});

export default styles;
