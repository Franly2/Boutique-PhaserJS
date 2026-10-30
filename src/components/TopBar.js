window.Boutique = window.Boutique || {};

/**
 * Renders the top HUD bar (Boutique logo, currency/status badges, and occasion pill).
 */
window.Boutique.TopBar = class TopBar extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

        const { TOP_BAR } = window.Boutique.Constants.LAYOUT;

        const badgeGlowUp = scene.add.image(TOP_BAR.GLOW_UP.x, TOP_BAR.GLOW_UP.y, 'gloq_up')
            .setOrigin(0, 0).setScale(TOP_BAR.GLOW_UP.scale);
        const badgeCoin = scene.add.image(TOP_BAR.COIN.x, TOP_BAR.COIN.y, 'coin_badge')
            .setOrigin(0, 0).setScale(TOP_BAR.COIN.scale);
        const badgeStyle = scene.add.image(TOP_BAR.STYLE.x, TOP_BAR.STYLE.y, 'style_badge')
            .setOrigin(0, 0).setScale(TOP_BAR.STYLE.scale);
        const badgeCare = scene.add.image(TOP_BAR.CARE.x, TOP_BAR.CARE.y, 'care_badge')
            .setOrigin(0, 0).setScale(TOP_BAR.CARE.scale);

        const pillGfx = scene.add.graphics();
        pillGfx.fillStyle(0x000000, 0.05);
        pillGfx.fillRoundedRect(TOP_BAR.PILL.x, TOP_BAR.PILL.shadowY, TOP_BAR.PILL.w, TOP_BAR.PILL.h, TOP_BAR.PILL.radius);
        pillGfx.fillStyle(0xffffff, 1.0);
        pillGfx.fillRoundedRect(TOP_BAR.PILL.x, TOP_BAR.PILL.y, TOP_BAR.PILL.w, TOP_BAR.PILL.h, TOP_BAR.PILL.radius);

        const badgeTitle = scene.add.image(TOP_BAR.TITLE.x, TOP_BAR.TITLE.y, 'title_badge')
            .setOrigin(0, 0)
            .setScale(TOP_BAR.TITLE.scale);

        this.add([pillGfx, badgeGlowUp, badgeCoin, badgeStyle, badgeCare, badgeTitle]);
    }
};
