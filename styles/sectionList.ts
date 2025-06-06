import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const sectionListStyles = StyleSheet.create({
    listContainer: {
        flex: 1,
        backgroundColor: theme.colors.mainBg,
        padding: theme.spacing.md,
    },

    //Header
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    headerName: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: '600',
        color: theme.colors.text,
    },

    //Section
    sectionHeader: {
        backgroundColor: theme.colors.itemBg,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    sectionHeaderText: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: '600',
        color: theme.colors.text,
    },

    //Item
    itemContainer: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        justifyContent: 'space-between',
    },
    setNumber: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: '600',
        marginRight: theme.spacing.md,
        color: theme.colors.text,
    },
    itemText: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text,
    },
    itemNumbers: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },

    workoutImage: {
        width: 50,
        height: 50,
        borderRadius: theme.borderRadius.round,

    },
    workoutName: {

    }
}); 