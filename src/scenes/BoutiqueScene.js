window.Boutique = window.Boutique || {};

/**
 * Main Dress-Up Scene orchestrator.
 * Loads manifest assets, instantiates UI/gameplay components, and wires cross-component events.
 */
window.Boutique.BoutiqueScene = class BoutiqueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BoutiqueScene' });
    }

    preload() {
        const { STATIC_IMAGES } = window.Boutique.AssetManifest;
        const hasBundle = typeof GAME_ASSETS !== 'undefined';
        const getAsset = (key, fallbackFile) => {
            return hasBundle && GAME_ASSETS[key] ? GAME_ASSETS[key] : fallbackFile;
        };

        STATIC_IMAGES.forEach((asset) => {
            this.load.image(asset.key, getAsset(asset.key, asset.path));
        });

        // Preload only the 9 active catalog clothes textures
        for (let i = 1; i <= 9; i++) {
            const key = `clothes_${i}`;
            this.load.image(key, getAsset(key, `assets/catalog-clothes/clothes-${i}.png`));
        }
    }

    create() {
        const { LAYOUT } = window.Boutique.Constants;
        const { ViewportManager, VFXManager, Avatar, WardrobeCatalog, Decorations, TopBar } = window.Boutique;

        this.bg = this.add.image(0, 0, 'bg').setOrigin(0.5).setDepth(0);
        this.mainContainer = this.add.container(0, 0).setDepth(1);

        this.vfx = new VFXManager(this, this.mainContainer);
        this.viewport = new ViewportManager(this, this.bg, this.mainContainer);

        this.avatar = new Avatar(this, LAYOUT.AVATAR.X, LAYOUT.AVATAR.Y);
        this.catalog = new WardrobeCatalog(this, LAYOUT.CATALOG.X, LAYOUT.CATALOG.Y, this.viewport, this.avatar, this.mainContainer);
        this.decorations = new Decorations(this);
        this.topBar = new TopBar(this);

        this.mainContainer.add([
            this.avatar,
            this.catalog,
            this.decorations,
            this.topBar
        ]);

        this.viewport.handleResize();
        this.bindEvents();
    }

    bindEvents() {
        const { POPUP_ANCHORS, PALETTE } = window.Boutique.Constants;

        // Catalog requests equipping/unequipping an item
        this.catalog.on('item-selected', (itemData) => {
            this.avatar.toggleEquip(itemData);
        });

        // Avatar state changed -> update UI borders & trigger VFX at configured anchor
        this.avatar.on('item-equipped', (itemData) => {
            this.catalog.updateGridBorders();

            const anchor = POPUP_ANCHORS[itemData.type];
            if (anchor) {
                this.vfx.spawnFloatingScore(anchor.x, anchor.y, anchor.label);
            }
        });

        this.avatar.on('item-unequipped', () => {
            this.catalog.updateGridBorders();
        });

        this.avatar.on('avatar-tapped', () => {
            const pt = POPUP_ANCHORS.AVATAR_SPARKLE;
            this.vfx.spawnSparkles(pt.x, pt.y, PALETTE.AVATAR_SPARKLE);
        });

        this.decorations.on('finish-clicked', (btnX, btnY) => {
            this.vfx.spawnCelebration(btnX, btnY);
        });
    }
};
