window.Boutique = window.Boutique || {};

/**
 * Manages High-DPI canvas scaling, background bleed cover, and coordinate conversion.
 * Automatically cleans up DOM listeners when the host Phaser Scene shuts down.
 */
window.Boutique.ViewportManager = class ViewportManager {
    /**
     * @param {Phaser.Scene} scene - The owning Phaser Scene instance.
     * @param {Phaser.GameObjects.Image} bgImage - Root fullscreen background image.
     * @param {Phaser.GameObjects.Container} mainContainer - Scaled virtual resolution container.
     */
    constructor(scene, bgImage, mainContainer) {
        this.scene = scene;
        this.bg = bgImage;
        this.mainContainer = mainContainer;
        this.orientationTimeoutId = null;

        this.onResizeBound = () => this.handleResize();
        this.onOrientationBound = () => {
            if (this.orientationTimeoutId) clearTimeout(this.orientationTimeoutId);
            this.orientationTimeoutId = setTimeout(this.onResizeBound, 150);
        };

        this.attachListeners();
        this.handleResize();

        // Automatically detach DOM listeners on scene restart/shutdown
        this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
        this.scene.events.once(Phaser.Scenes.Events.DESTROY, () => this.destroy());
    }

    attachListeners() {
        window.addEventListener('resize', this.onResizeBound);
        window.addEventListener('orientationchange', this.onOrientationBound);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', this.onResizeBound);
        }
    }

    handleResize() {
        if (!this.scene || !this.scene.scale) return;

        const { DESIGN_WIDTH, DESIGN_HEIGHT, MAX_DPR } = window.Boutique.Constants;
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

        const cssWidth = (window.visualViewport ? window.visualViewport.width : window.innerWidth) || window.innerWidth;
        const cssHeight = (window.visualViewport ? window.visualViewport.height : window.innerHeight) || window.innerHeight;

        const physicalWidth = Math.round(cssWidth * dpr);
        const physicalHeight = Math.round(cssHeight * dpr);

        if (Math.abs(this.scene.scale.zoom - (1 / dpr)) > 0.001) {
            this.scene.scale.setZoom(1 / dpr);
        }

        if (this.scene.scale.width !== physicalWidth || this.scene.scale.height !== physicalHeight) {
            this.scene.scale.resize(physicalWidth, physicalHeight);
        }

        if (this.bg) {
            this.bg.setPosition(physicalWidth / 2, physicalHeight / 2);
            const bgScale = Math.max(physicalWidth / this.bg.width, physicalHeight / this.bg.height);
            this.bg.setScale(bgScale);
        }

        if (this.mainContainer) {
            const paddingX = cssWidth < 1200 ? 24 * dpr : 0;
            const paddingY = cssHeight < 600 ? 20 * dpr : 0;

            const availableW = Math.max(100, physicalWidth - paddingX * 2);
            const availableH = Math.max(100, physicalHeight - paddingY * 2);

            const uiScale = Math.min(availableW / DESIGN_WIDTH, availableH / DESIGN_HEIGHT);

            this.mainContainer.setScale(uiScale);
            this.mainContainer.setPosition(
                (physicalWidth - DESIGN_WIDTH * uiScale) / 2,
                (physicalHeight - DESIGN_HEIGHT * uiScale) / 2
            );
        }
    }

    /**
     * Translates a screen pointer into the virtual 3408x1572 coordinate space.
     * @param {Phaser.Input.Pointer} pointer
     * @returns {{x: number, y: number}}
     */
    getLocalPoint(pointer) {
        const scale = (this.mainContainer && this.mainContainer.scaleX) ? this.mainContainer.scaleX : 1;
        const containerX = this.mainContainer ? this.mainContainer.x : 0;
        const containerY = this.mainContainer ? this.mainContainer.y : 0;

        return {
            x: (pointer.x - containerX) / scale,
            y: (pointer.y - containerY) / scale
        };
    }

    /**
     * Removes all window/viewport event listeners and pending timers.
     */
    destroy() {
        if (this.orientationTimeoutId) {
            clearTimeout(this.orientationTimeoutId);
            this.orientationTimeoutId = null;
        }
        window.removeEventListener('resize', this.onResizeBound);
        window.removeEventListener('orientationchange', this.onOrientationBound);
        if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', this.onResizeBound);
        }
    }
};
