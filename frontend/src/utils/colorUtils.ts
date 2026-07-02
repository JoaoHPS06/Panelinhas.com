export function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
    const bigint = parseInt(full, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export function lighten(hex: string, amount: number): string {
    const [r, g, b] = hexToRgb(hex);
    const mix = (c: number) => Math.round(c + (255 - c) * amount);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export function lightenAlpha(hex: string, amount: number, alpha: number): string {
    const [r, g, b] = hexToRgb(hex);
    const mix = (c: number) => Math.round(c + (255 - c) * amount);
    return `rgba(${mix(r)}, ${mix(g)}, ${mix(b)}, ${alpha})`;
}

export function darkenAlpha(hex: string, amount: number, alpha: number): string {
    const [r, g, b] = hexToRgb(hex);
    const mix = (c: number) => Math.round(c * (1 - amount));
    return `rgba(${mix(r)}, ${mix(g)}, ${mix(b)}, ${alpha})`;
}

export function buildLojaColors(primary: string, secondary: string) {
    return {
        wallBg: lighten(secondary, 0.45),
        awningBg: primary,
        signColor: lighten(primary, 0.6),
        winBorder: darkenAlpha(primary, 0.3, 0.2),
        winLit: lightenAlpha(primary, 0.35, 0.65),
        doorBorder: darkenAlpha(primary, 0.3, 0.2),
        doorBg: darkenAlpha(primary, 0.5, 0.09),
    };
}
