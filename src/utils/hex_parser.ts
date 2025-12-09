export const isValidHex = (hex: string) => {
	// 1. ^#? : Optional hash at the start
	// 2. [0-9A-F] : Allow 0-9 and A-F
	// 3. {3} or {6} : strictly 3 or 6 characters
	return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);
};
