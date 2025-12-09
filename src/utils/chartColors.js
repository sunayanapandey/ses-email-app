// Chart Color Palette
// Organized by color families for better visual harmony

export const CHART_COLORS = {
    // Blues
    blues: ['#80BEE5', '#A0CEE9', '#C5E9F0', '#007DCC', '#429DD4', '#8AD3E1', '#27668D', '#487691', '#6C9097'],

    // Greens/Teals
    greens: ['#80C9CA', '#C6DCB8', '#9EDFC6', '#009295', '#8DB972', '#3EC08D', '#277072', '#6E8360', '#46876E'],

    // Purples/Pinks
    purples: ['#CDA5C9', '#E9BFE4', '#F7C7DB', '#9A4C93', '#D280C9', '#F08FB6', '#744D71', '#90678B', '#9F6F82'],

    // Oranges/Reds
    oranges: ['#FFC79D', '#F2B9B2', '#E1A8AB', '#FE8E3C', '#E57366', '#C45258', '#A66E45', '#99615A', '#895053'],

    // All colors in order
    all: [
        '#80BEE5', '#A0CEE9', '#C5E9F0', '#80C9CA', '#C6DCB8', '#9EDFC6',
        '#CDA5C9', '#E9BFE4', '#F7C7DB', '#FFC79D', '#F2B9B2', '#E1A8AB',
        '#007DCC', '#429DD4', '#8AD3E1', '#009295', '#8DB972', '#3EC08D',
        '#9A4C93', '#D280C9', '#F08FB6', '#FE8E3C', '#E57366', '#C45258',
        '#27668D', '#487691', '#6C9097', '#277072', '#6E8360', '#46876E',
        '#744D71', '#90678B', '#9F6F82', '#A66E45', '#99615A', '#895053'
    ]
};

// Predefined color schemes for different chart types
export const COLOR_SCHEMES = {
    // For bar charts - vibrant and distinct
    barChart: ['#007DCC', '#3EC08D', '#F08FB6', '#FE8E3C'],

    // For line charts - harmonious progression
    lineChart: ['#429DD4', '#9EDFC6', '#D280C9', '#FFC79D'],

    // For pie charts - balanced variety
    pieChart: ['#80BEE5', '#80C9CA', '#CDA5C9', '#FFC79D', '#E57366'],

    // Campaign performance - professional blues and greens
    campaignPerformance: ['#007DCC', '#429DD4', '#8AD3E1'],

    // Email status - status-like colors
    emailStatus: ['#80BEE5', '#9EDFC6', '#F08FB6', '#E1A8AB']
};

/**
 * Get a color from the palette by index
 * Automatically cycles through colors if index exceeds palette length
 */
export const getColor = (index, palette = 'all') => {
    const colors = CHART_COLORS[palette] || CHART_COLORS.all;
    return colors[index % colors.length];
};

/**
 * Get a specific color scheme
 */
export const getColorScheme = (schemeName) => {
    return COLOR_SCHEMES[schemeName] || COLOR_SCHEMES.barChart;
};

/**
 * Generate a random combination of colors
 */
export const getRandomColors = (count = 4) => {
    const shuffled = [...CHART_COLORS.all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};
