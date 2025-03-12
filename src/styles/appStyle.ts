import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        fontFamily: 'Cochin',
    },
    statValue: {
        flexDirection: 'row',
        gap: 20,
        flexWrap: 'wrap',
    },
    label: {
        color: '#fff',
        fontSize: 20,
    },
    value: {
        fontSize: 35,
        color: '#fff',
        fontWeight: '500',
    },
    valueContainer: {
        marginVertical: 10,
        minWidth: '40%',
    }
});
