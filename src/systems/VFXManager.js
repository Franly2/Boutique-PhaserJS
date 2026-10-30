window.Boutique = window.Boutique || {};

/**
 * Handles procedural particle bursts, sparkles, and floating score popups.
 */
window.Boutique.VFXManager = class VFXManager {
    /**
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Container} targetContainer
     */
    constructor(scene, targetContainer) {
        this.scene = scene;
        this.container = targetContainer;
        this.ensureSparkleTexture();
    }

    ensureSparkleTexture() {
        if (this.scene.textures.exists('star_sparkle')) return;

        const gfx = this.scene.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(0xffffff, 1);
        gfx.beginPath();
        gfx.moveTo(16, 0);
        gfx.lineTo(20, 12);
        gfx.lineTo(32, 16);
        gfx.lineTo(20, 20);
        gfx.lineTo(16, 32);
        gfx.lineTo(12, 20);
        gfx.lineTo(0, 16);
        gfx.lineTo(12, 12);
        gfx.closePath();
        gfx.fillPath();
        gfx.generateTexture('star_sparkle', 32, 32);
        gfx.destroy();
    }

    /**
     * @param {number} x - Virtual X coordinate.
     * @param {number} y - Virtual Y coordinate.
     * @param {string} text - Label to display (e.g. '+Style').
     */
    spawnFloatingScore(x, y, text) {
        const { TEXT_STYLES } = window.Boutique.Constants;
        const scoreText = this.scene.add.text(x, y, text, TEXT_STYLES.FLOATING_SCORE).setOrigin(0.5);

        this.container.add(scoreText);

        this.scene.tweens.add({
            targets: scoreText,
            y: y - 110,
            alpha: 0,
            scale: 1.25,
            duration: 900,
            ease: 'Cubic.easeOut',
            onComplete: () => scoreText.destroy()
        });
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} [tint=0xffffff]
     */
    spawnSparkles(x, y, tint = 0xffffff) {
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Phaser.Math.Between(60, 240);
            const star = this.scene.add.image(x, y, 'star_sparkle')
                .setTint(tint)
                .setScale(Phaser.Math.FloatBetween(0.8, 1.8));

            this.container.add(star);

            this.scene.tweens.add({
                targets: star,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0.2,
                angle: Phaser.Math.Between(-180, 180),
                duration: Phaser.Math.Between(600, 950),
                ease: 'Cubic.easeOut',
                onComplete: () => star.destroy()
            });
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    spawnCelebration(x, y) {
        const colors = window.Boutique.Constants.PALETTE.CELEBRATION;

        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Phaser.Math.Between(100, 480);
            const star = this.scene.add.image(x, y, 'star_sparkle')
                .setTint(colors[i % colors.length])
                .setScale(Phaser.Math.FloatBetween(1.0, 2.4));

            this.container.add(star);

            this.scene.tweens.add({
                targets: star,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist - 80,
                alpha: 0,
                scale: 0.1,
                angle: Phaser.Math.Between(-360, 360),
                duration: Phaser.Math.Between(800, 1400),
                ease: 'Quad.easeOut',
                onComplete: () => star.destroy()
            });
        }
    }
};
