window.Boutique = window.Boutique || {};

const FONT_STACK = '"Baloo Bhai 2", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';

window.Boutique.Constants = {
    DESIGN_WIDTH: 3408,
    DESIGN_HEIGHT: 1572,
    MAX_DPR: 2.5,

    INTERACTION: {
        TAP_TOLERANCE_BASE: 30,
        DRAG_GHOST_ALPHA: 0.85,
        DEFAULT_GHOST_SCALE: 2.0
    },

    LAYOUT: {
        AVATAR: {
            X: 1704,
            Y: 840,
            BASE_SCALE: 1.235,
            BREATH_SCALE_Y: 1.242,
            BREATH_DURATION: 2200,
            CARPET_OFFSET_Y: 480,
            CARPET_OUTER: { w: 804, h: 156, offsetY: 4 },
            CARPET_INNER: { w: 794, h: 148, offsetY: 0 },
            // Explicit rectangular drop area around the mannequin (x, y, width, height)
            DROP_ZONE: { x: 1320, y: 220, width: 768, height: 1120 }
        },
        CATALOG: {
            X: 155,
            Y: 256,
            WIDTH: 742,
            HEIGHT: 976,
            CORNER_RADIUS: 48,
            TAB_Y: 80,
            TAB_RADIUS: 40,
            TAB_HIT_SIZE: 80,
            HINT_POS: { x: 371, y: 198 },
            EMPTY_POS: { x: 371, y: 560 },
            GRID_COLS_X: [151, 371, 591],
            GRID_ROWS_Y: [379, 599, 819],
            SLOT_WIDTH: 200,
            SLOT_HEIGHT: 201,
            SLOT_RADIUS: 24,
            BORDER_WIDTH: 6
        },
        TOP_BAR: {
            GLOW_UP: { x: 160, y: 68, scale: 1.15 },
            COIN:    { x: 935, y: 66, scale: 1.6 },
            STYLE:   { x: 1325, y: 66, scale: 1.6 },
            CARE:    { x: 1820, y: 66, scale: 1.6 },
            PILL:    { x: 2321, y: 64, shadowY: 68, w: 930, h: 127, radius: 60 },
            TITLE:   { x: 2375, y: 64 + (127 - 64 * 1.45) / 2, scale: 1.45 }
        },
        DECORATIONS: {
            CHARM:      { x: 155, y: 1290 },
            BUTTERFLY:  { x: 2302, y: 1068 },
            FINISH_BTN: { x: 1704, y: 1440 }
        }
    },

    // Centralized popup & VFX coordinates (Decoupled from Avatar model)
    POPUP_ANCHORS: {
        AVATAR_SPARKLE: { x: 1704, y: 600 },
        clothes:        { x: 1704, y: 620, label: '+Style' },
        pants:          { x: 1704, y: 760, label: '+Style' },
        glasses:        { x: 1704, y: 480, label: '+Style' },
        dress:          { x: 1704, y: 660, label: '+Style' },
        shoes:          { x: 1704, y: 1220, label: '+Style' },
        bag:            { x: 1704, y: 780, label: '+Style' }
    },

    PALETTE: {
        CARPET_SHADOW: 0xd1869e,
        CARPET_FILL:   0xffc4dc,
        TAB_ACTIVE:    0xfd5da3,
        TAB_INACTIVE:  0xfbe3f1,
        SLOT_BORDER:   0xffd023,
        AVATAR_SPARKLE: 0xff9ec7,
        CELEBRATION:   [0xff007f, 0xffd700, 0xffffff, 0xb388ff, 0x00e5ff],
        CARD_BG: [
            0xd8efe9, 0xfde6f0, 0xe2efff,
            0xfef7da, 0xd8efe9, 0xf2eaff,
            0xffeee3, 0xfde6f0, 0xd8efe9
        ]
    },

    // Valid Phaser 3 TextStyle definitions using fontStyle instead of invalid fontWeight
    TEXT_STYLES: {
        FONT_FAMILY: FONT_STACK,
        HINT: {
            fontFamily: FONT_STACK,
            fontSize: '34px',
            fontStyle: '800',
            color: '#ec84ae'
        },
        EMPTY: {
            fontFamily: FONT_STACK,
            fontSize: '32px',
            fontStyle: '700',
            color: '#a0a0b0'
        },
        FLOATING_SCORE: {
            fontFamily: FONT_STACK,
            fontSize: '44px',
            fontStyle: '800',
            color: '#ff007f',
            stroke: '#ffffff',
            strokeThickness: 8
        }
    }
};
