window.Boutique = window.Boutique || {};

/**
 * Data-driven character mannequin and equipment layer container.
 *
 * @fires Avatar#avatar-tapped
 * @fires Avatar#item-equipped
 * @fires Avatar#item-unequipped
 */
window.Boutique.Avatar = class Avatar extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);

        /** @type {Object.<string, string|number|null>} Currently equipped item ID per slot */
        this.equippedState = {};

        /** @type {Object.<string, Phaser.GameObjects.Image>} Dynamic sprite layer per slot */
        this.slotSprites = {};

        this.createCarpet();
        this.createCharacterLayers();
    }

    createCarpet() {
        const { AVATAR } = window.Boutique.Constants.LAYOUT;
        const { PALETTE } = window.Boutique.Constants;

        const carpet = this.scene.add.graphics();
        carpet.fillStyle(PALETTE.CARPET_SHADOW, 0.35);
        carpet.fillEllipse(0, AVATAR.CARPET_OFFSET_Y + AVATAR.CARPET_OUTER.offsetY, AVATAR.CARPET_OUTER.w, AVATAR.CARPET_OUTER.h);
        carpet.fillStyle(PALETTE.CARPET_FILL, 0.95);
        carpet.fillEllipse(0, AVATAR.CARPET_OFFSET_Y + AVATAR.CARPET_INNER.offsetY, AVATAR.CARPET_INNER.w, AVATAR.CARPET_INNER.h);
        this.add(carpet);
    }

    createCharacterLayers() {
        const { AVATAR } = window.Boutique.Constants.LAYOUT;
        const { AVATAR_SLOTS } = window.Boutique.AssetManifest;

        this.avatarWrapper = this.scene.add.container(0, 0).setScale(AVATAR.BASE_SCALE);
        this.add(this.avatarWrapper);

        this.baseSprite = this.scene.add.image(0, 0, 'avatar_base').setOrigin(0.5, 0.5);
        this.avatarWrapper.add(this.baseSprite);

        // Dynamically create and sort garment slots based on AVATAR_SLOTS layer order
        const sortedSlots = Object.entries(AVATAR_SLOTS).sort(([, a], [, b]) => a.layer - b.layer);

        sortedSlots.forEach(([slotType, config]) => {
            this.equippedState[slotType] = null;

            const slotImage = this.scene.add.image(0, 0, '__DEFAULT')
                .setOrigin(config.origin[0], config.origin[1])
                .setVisible(false);

            this.slotSprites[slotType] = slotImage;
            this.avatarWrapper.add(slotImage);
        });

        // Subtle breathing animation
        this.scene.tweens.add({
            targets: this.avatarWrapper,
            scaleY: AVATAR.BREATH_SCALE_Y,
            duration: AVATAR.BREATH_DURATION,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.baseSprite.setInteractive({ useHandCursor: true });
        this.baseSprite.on('pointerdown', () => {
            this.emit('avatar-tapped');
        });
    }

    /**
     * Toggles an inventory item on/off its corresponding slot.
     * Emits 'item-equipped' or 'item-unequipped' with the item payload.
     *
     * @param {{id: number|string, key: string, type: string}} item
     */
    toggleEquip(item) {
        if (!item || !(item.type in this.slotSprites)) return;

        const { type, id, key } = item;
        const targetSprite = this.slotSprites[type];

        // Unequip if already wearing the exact same item
        if (this.equippedState[type] === id) {
            this.equippedState[type] = null;
            targetSprite.setVisible(false);
            this.emit('item-unequipped', item);
            return;
        }

        // Equip new item and apply calibration data
        const { CALIBRATION } = window.Boutique.AssetManifest;
        const cal = CALIBRATION[type]?.[id] || { wearScale: 1.0, x: 0, y: 0 };

        this.equippedState[type] = id;
        targetSprite
            .setTexture(key)
            .setScale(cal.wearScale)
            .setPosition(cal.x || 0, cal.y || 0)
            .setVisible(true);

        this.emit('item-equipped', item);
    }

    /**
     * Checks if a catalog item is currently worn by the avatar.
     * @param {{id: number|string, type: string}} item
     * @returns {boolean}
     */
    isItemEquipped(item) {
        if (!item) return false;
        return this.equippedState[item.type] === item.id;
    }

    /**
     * Performs a squash-and-stretch bounce feedback animation.
     */
    bounce() {
        this.scene.tweens.add({
            targets: this.avatarWrapper,
            scaleX: 1.28,
            scaleY: 1.18,
            duration: 120,
            yoyo: true,
            ease: 'Back.easeOut'
        });
    }
};
