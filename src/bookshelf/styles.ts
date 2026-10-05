import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20 
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  actionsRow: { 
    alignItems: "flex-end", 
    marginBottom: 10 
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  bookInfo: { 
    flex: 1 
  },
  bookTitle: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  bookAuthor: { 
    fontSize: 16, 
    color: "gray" 
  },
  emptyText: { 
    fontSize: 16, 
    color: "gray", 
    marginTop: 20 
  },
  sectionLabel: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 8 
  },
  hint: { 
    fontSize: 14, 
    color: "gray", 
    marginBottom: 8 
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  bookFormButton: { 
    marginTop: 10 
  },
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipSelected: { 
    backgroundColor: "#d9534f", 
    borderColor: "#d9534f" 
  },
  chipText: { 
    fontSize: 14, 
    color: "#333" 
  },
  chipTextSelected: { 
    color: "#fff", 
    fontWeight: "600" 
  },
});
