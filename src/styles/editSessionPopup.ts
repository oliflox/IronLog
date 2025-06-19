import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const editSessionPopupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 20,
  },
  popup: {
    backgroundColor: theme.colors.itemBg,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.accent,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.mainBg,
  },
  footer: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.accent,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    marginRight: 10,
    alignItems: "center" as const,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600" as const,
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: "center" as const,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600" as const,
  },
}); 