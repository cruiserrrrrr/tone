export default function isClient() {
    return typeof window !== "undefined" && typeof window !== null;
}
