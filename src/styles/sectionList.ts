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
        marginBottom: theme.spacing.md,
    },
    sectionHeaderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionHeaderText: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: '600',
        color: theme.colors.text,
    },
    sectionTotals: {
        alignItems: 'flex-end',
    },
    sectionTotalText: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    sectionTotalSubText: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: '400',
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
        width: '100%',
        height: 100,
        borderRadius: theme.borderRadius.md,
    }
}); 