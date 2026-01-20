export const getFirstChar = (str: string) => {
    if (!str) return "U";

    return str[0].toUpperCase();
};