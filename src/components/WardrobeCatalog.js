window.Boutique = window.Boutique || {};

/**
 * Interactive 6-category wardrobe panel with 3x3 item grid and drag-and-drop support.
 *
 * @fires WardrobeCatalog#item-selected
 */
window.Boutique.WardrobeCatalog = class WardrobeCatalog extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {window.Boutique.ViewportManager} viewport
     * @param {window.Boutique.Avatar} avatar
     * @param {Phaser.GameObjects.Container} [targetContainer] - Parent container for rendering drag ghosts.
     */
    constructor(scene, x, y, viewport, avatar, targetContainer = null) {
        super(scene, x, y);
        scene.add.existing(this);

        this.viewport = viewport;
        this.avatar = avatar;
        this.targetContainer = targetContainer;
        this.activeCategory = 'clothes';
        this.categoryTabs = {};
        this.gridSlots = [];

        const dz = window.Boutique.Constants.LAYOUT.AVATAR.DROP_ZONE;
        this.avatarDropZone = new Phaser.Geom.Rectangle(dz.x, dz.y, dz.width, dz.height);

        this.createBackgroundCard();
        this.createCategoryTabs();
        this.createTexts();
        this.createItemGrid();

        this.updateTabStyles();
        this.renderCatalog('clothes');
    }

    createBackgroundCard() {
        const { WIDTH, HEIGHT, CORNER_RADIUS } = window.Boutique.Constants.LAYOUT.CATALOG;
        const cardGfx = this.scene.add.graphics();
        cardGfx.fillStyle(0x000000, 0.08).fillRoundedRect(0, 10, WIDTH, HEIGHT, CORNER_RADIUS);
        cardGfx.fillStyle(0x000000, 0.04).fillRoundedRect(0, 18, WIDTH, HEIGHT - 8, CORNER_RADIUS);
        cardGfx.fillStyle(0xffffff, 1.0).fillRoundedRect(0, 0, WIDTH, HEIGHT, CORNER_RADIUS);
        this.add(cardGfx);
    }

    createCategoryTabs() {
        const { CATEGORIES } = window.Boutique.AssetManifest;
        const { TAB_Y, TAB_HIT_SIZE } = window.Boutique.Constants.LAYOUT.CATALOG;

        CATEGORIES.forEach((cat) => {
            const tabContainer = this.scene.add.container(cat.x, TAB_Y);
            const circleGfx = this.scene.add.graphics();
            const icon = this.scene.add.image(0, 0, cat.logo).setOrigin(0.5);

            tabContainer.add([circleGfx, icon]);
            tabContainer.setSize(TAB_HIT_SIZE, TAB_HIT_SIZE);
            tabContainer.setInteractive({ useHandCursor: true });

            tabContainer.on('pointerover', () => {
                this.scene.tweens.add({ targets: tabContainer, scale: 1.08, duration: 130, ease: 'Sine.easeOut' });
            });

            tabContainer.on('pointerout', () => {
                this.scene.tweens.add({ targets: tabContainer, scale: 1.0, duration: 130, ease: 'Sine.easeOut' });
            });

            tabContainer.on('pointerdown', () => {
                this.switchCategory(cat.id);
                this.scene.tweens.add({ targets: tabContainer, scale: 0.93, duration: 80, yoyo: true, ease: 'Quad.easeInOut' });
            });

            this.categoryTabs[cat.id] = { container: tabContainer, gfx: circleGfx, icon };
            this.add(tabContainer);
        });
    }

    createTexts() {
        const { HINT_POS, EMPTY_POS } = window.Boutique.Constants.LAYOUT.CATALOG;
        const { TEXT_STYLES } = window.Boutique.Constants;

        this.hintText = this.scene.add.text(HINT_POS.x, HINT_POS.y, 'Drag an item to the client!', TEXT_STYLES.HINT)
            .setOrigin(0.5);

        this.emptyStateText = this.scene.add.text(EMPTY_POS.x, EMPTY_POS.y, 'No items in this category', TEXT_STYLES.EMPTY)
            .setOrigin(0.5)
            .setVisible(false);

        this.add([this.hintText, this.emptyStateText]);

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                if (this.hintText && this.hintText.active) this.hintText.setFontFamily(TEXT_STYLES.FONT_FAMILY);
                if (this.emptyStateText && this.emptyStateText.active) this.emptyStateText.setFontFamily(TEXT_STYLES.FONT_FAMILY);
            });
        }
    }

    createItemGrid() {
        const { PALETTE, LAYOUT } = window.Boutique.Constants;
        const { GRID_COLS_X, GRID_ROWS_Y, SLOT_WIDTH, SLOT_HEIGHT, SLOT_RADIUS, BORDER_WIDTH } = LAYOUT.CATALOG;

        this.gridContainer = this.scene.add.container(0, 0);
        this.add(this.gridContainer);

        const halfW = SLOT_WIDTH / 2;
        const halfH = SLOT_HEIGHT / 2;

        for (let i = 0; i < 9; i++) {
            const cx = GRID_COLS_X[i % 3];
            const cy = GRID_ROWS_Y[Math.floor(i / 3)];
            const itemCard = this.scene.add.container(cx, cy);

            const bgGfx = this.scene.add.graphics();
            bgGfx.fillStyle(PALETTE.CARD_BG[i], 1.0);
            bgGfx.fillRoundedRect(-halfW, -halfH, SLOT_WIDTH, SLOT_HEIGHT, SLOT_RADIUS);
            itemCard.add(bgGfx);

            const borderGfx = this.scene.add.graphics();
            borderGfx.lineStyle(BORDER_WIDTH, PALETTE.SLOT_BORDER, 1.0);
            borderGfx.strokeRoundedRect(-halfW, -halfH, SLOT_WIDTH, SLOT_HEIGHT, SLOT_RADIUS);
            borderGfx.setVisible(false);
            itemCard.add(borderGfx);

            const itemSprite = this.scene.add.image(0, 0, 'clothes_1').setOrigin(0.5);
            itemCard.add(itemSprite);

            itemCard.setSize(SLOT_WIDTH, SLOT_HEIGHT);
            itemCard.setInteractive({ useHandCursor: true, draggable: true });

            const slotObj = { container: itemCard, border: borderGfx, sprite: itemSprite, itemData: null };
            this.setupCardInteractions(itemCard, slotObj);

            this.gridSlots.push(slotObj);
            this.gridContainer.add(itemCard);
        }
    }

    setupCardInteractions(itemCard, slotObj) {
        const { CALIBRATION } = window.Boutique.AssetManifest;
        const { MAX_DPR, INTERACTION } = window.Boutique.Constants;

        let startPointerX = 0;
        let startPointerY = 0;
        let dragGhost = null;

        itemCard.on('pointerover', () => {
            this.scene.tweens.add({ targets: itemCard, scale: 1.04, duration: 130, ease: 'Sine.easeOut' });
        });

        itemCard.on('pointerout', () => {
            this.scene.tweens.add({ targets: itemCard, scale: 1.0, duration: 130, ease: 'Sine.easeOut' });
        });

        itemCard.on('pointerdown', (pointer) => {
            startPointerX = pointer.x;
            startPointerY = pointer.y;
        });

        itemCard.on('dragstart', (pointer) => {
            const item = slotObj.itemData;
            if (!item) return;

            const ghostScale = CALIBRATION[item.type]?.[item.id]?.wearScale || INTERACTION.DEFAULT_GHOST_SCALE;
            const localPt = this.viewport.getLocalPoint(pointer);

            dragGhost = this.scene.add.image(localPt.x, localPt.y, item.key)
                .setScale(ghostScale)
                .setAlpha(INTERACTION.DRAG_GHOST_ALPHA);

            const targetParent = this.targetContainer || this.parentContainer || this.scene;
            targetParent.add(dragGhost);
        });

        itemCard.on('drag', (pointer) => {
            if (dragGhost) {
                const localPt = this.viewport.getLocalPoint(pointer);
                dragGhost.setPosition(localPt.x, localPt.y);
            }
        });

        itemCard.on('dragend', (pointer) => {
            if (dragGhost) {
                const localPt = this.viewport.getLocalPoint(pointer);

                // Strict geometric hit-test against the Avatar's rectangular drop zone
                if (Phaser.Geom.Rectangle.Contains(this.avatarDropZone, localPt.x, localPt.y)) {
                    this.emit('item-selected', slotObj.itemData);
                }

                dragGhost.destroy();
                dragGhost = null;
            }

            this.scene.tweens.add({ targets: itemCard, scale: 1.0, duration: 120, ease: 'Sine.easeOut' });
        });

        itemCard.on('pointerup', (pointer) => {
            const movedDist = Phaser.Math.Distance.Between(startPointerX, startPointerY, pointer.x, pointer.y);
            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
            const tapTolerance = INTERACTION.TAP_TOLERANCE_BASE * dpr;

            if (movedDist < tapTolerance && slotObj.itemData) {
                this.scene.tweens.add({
                    targets: itemCard,
                    scale: 0.94,
                    duration: 80,
                    yoyo: true,
                    ease: 'Quad.easeInOut',
                    onComplete: () => this.emit('item-selected', slotObj.itemData)
                });
            }
        });
    }

    /**
     * Switches active catalog tab and re-renders the 3x3 item grid.
     * @param {string} catId
     */
    switchCategory(catId) {
        if (this.activeCategory === catId) return;
        this.activeCategory = catId;
        this.updateTabStyles();
        this.renderCatalog(catId);
    }

    updateTabStyles() {
        const { PALETTE, LAYOUT } = window.Boutique.Constants;
        const radius = LAYOUT.CATALOG.TAB_RADIUS;

        Object.keys(this.categoryTabs).forEach((catId) => {
            const tab = this.categoryTabs[catId];
            const isActive = (catId === this.activeCategory);

            tab.gfx.clear();
            tab.gfx.fillStyle(isActive ? PALETTE.TAB_ACTIVE : PALETTE.TAB_INACTIVE, 1.0);
            tab.gfx.fillCircle(0, 0, radius);

            if (isActive) {
                tab.icon.setTint(0xffffff);
            } else {
                tab.icon.clearTint();
            }
        });
    }

    /**
     * Populates the 3x3 grid with items from the specified category.
     * @param {string} catId
     */
    renderCatalog(catId) {
        const { CATALOG_DATA } = window.Boutique.AssetManifest;
        const items = CATALOG_DATA[catId] || [];
        const hasItems = items.length > 0;

        this.hintText.setVisible(hasItems);
        this.gridContainer.setVisible(hasItems);
        this.emptyStateText.setVisible(!hasItems);

        if (!hasItems) return;

        for (let i = 0; i < 9; i++) {
            const slot = this.gridSlots[i];
            const item = items[i];

            if (item) {
                slot.container.setVisible(true);
                slot.itemData = item;
                slot.sprite.setTexture(item.key);
                slot.sprite.setScale(item.thumbScale || 1.0);
            } else {
                slot.container.setVisible(false);
                slot.itemData = null;
            }
        }

        this.updateGridBorders();

        this.gridContainer.setAlpha(0);
        this.scene.tweens.add({
            targets: this.gridContainer,
            alpha: 1,
            duration: 180,
            ease: 'Cubic.easeOut'
        });
    }

    /**
     * Synchronizes gold selection borders with the Avatar's equipped state.
     */
    updateGridBorders() {
        for (let i = 0; i < 9; i++) {
            const slot = this.gridSlots[i];
            if (slot && slot.container.visible && slot.itemData) {
                slot.border.setVisible(this.avatar.isItemEquipped(slot.itemData));
            }
        }
    }
};
