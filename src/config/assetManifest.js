window.Boutique = window.Boutique || {};

window.Boutique.AssetManifest = {
    // Static environment, HUD, logo, and accessory textures
    STATIC_IMAGES: [
        { key: 'bg',              path: 'assets/UI/bg.png' },
        { key: 'avatar_base',     path: 'assets/avatar/avatar-base.png' },
        { key: 'knowledge_charm', path: 'assets/UI/HUD/knowledge-charm.png' },
        { key: 'butterfly',       path: 'assets/UI/butterfly.png' },
        { key: 'finish_button',   path: 'assets/UI/finish_button.png' },

        // HUD Badges (Aligned with physical filenames in assets/UI/HUD/)
        { key: 'gloq_up',         path: 'assets/UI/HUD/gloq-up-boutique-bade.png' },
        { key: 'coin_badge',      path: 'assets/UI/HUD/coin_badge.png' },
        { key: 'style_badge',     path: 'assets/UI/HUD/style-badge.png' },
        { key: 'care_badge',      path: 'assets/UI/HUD/care-badge.png' },
        { key: 'title_badge',     path: 'assets/UI/HUD/title-bade.png' },

        // Category Tab Logos
        { key: 'clothes_logo',    path: 'assets/catalog-logo/clothes-logo.png' },
        { key: 'pants_logo',      path: 'assets/catalog-logo/pants-logo.png' },
        { key: 'dress_logo',      path: 'assets/catalog-logo/dress-logo.png' },
        { key: 'shoes_logo',      path: 'assets/catalog-logo/shoes-logo.png' },
        { key: 'bag_logo',        path: 'assets/catalog-logo/bag-logo.png' },
        { key: 'glasses_logo',    path: 'assets/catalog-logo/glasses-logo.png' },

        // Accessories & Bottoms
        { key: 'sun_glasses',     path: 'assets/catalog-glasses/sun-glasses.png' },
        { key: 'navy_skirt',      path: 'assets/catalog-pants/navy-skirt.png' }
    ],

    // Data-driven slot definitions for Avatar rendering order & origin
    AVATAR_SLOTS: {
        shoes:   { origin: [0.5, 0.5], layer: 1 },
        pants:   { origin: [0.5, 0.0], layer: 2 },
        clothes: { origin: [0.5, 0.0], layer: 3 },
        dress:   { origin: [0.5, 0.0], layer: 4 },
        bag:     { origin: [0.5, 0.5], layer: 5 },
        glasses: { origin: [0.5, 0.5], layer: 6 }
    },

    CATEGORIES: [
        { id: 'clothes', logo: 'clothes_logo', x: 92 },
        { id: 'pants',   logo: 'pants_logo',   x: 203 },
        { id: 'dress',   logo: 'dress_logo',   x: 314 },
        { id: 'shoes',   logo: 'shoes_logo',   x: 426 },
        { id: 'bag',     logo: 'bag_logo',     x: 537 },
        { id: 'glasses', logo: 'glasses_logo', x: 648 }
    ],

    // Uses `thumbScale` exclusively for catalog grid thumbnails
    CATALOG_DATA: {
        clothes: Array.from({ length: 9 }, (_, i) => ({
            id: i + 1,
            key: `clothes_${i + 1}`,
            type: 'clothes',
            thumbScale: 1.0
        })),
        pants: [
            { id: 'navy_skirt', key: 'navy_skirt', type: 'pants', thumbScale: 0.65 }
        ],
        glasses: [
            { id: 'sun_glasses', key: 'sun_glasses', type: 'glasses', thumbScale: 0.82 }
        ],
        dress: [],
        shoes: [],
        bag: []
    },

    // Uses `wearScale` exclusively for equipped sprites on the Avatar
    CALIBRATION: {
        clothes: {
            1: { wearScale: 2.15, x: 0, y: -287 },
            2: { wearScale: 2.10, x: 0, y: -287 },
            3: { wearScale: 2.15, x: 0, y: -284 },
            4: { wearScale: 2.25, x: 0, y: -282 },
            5: { wearScale: 2.25, x: 0, y: -274 },
            6: { wearScale: 2.20, x: 0, y: -267 },
            7: { wearScale: 2.15, x: 0, y: -284 },
            8: { wearScale: 2.15, x: 0, y: -287 },
            9: { wearScale: 2.20, x: 0, y: -277 }
        },
        pants: {
            navy_skirt: { wearScale: 1.12, x: -5, y: -15 }
        },
        glasses: {
            sun_glasses: { wearScale: 0.7, x: -10, y: -358 }
        }
    }
};
