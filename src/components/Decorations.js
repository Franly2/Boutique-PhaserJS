window.Boutique = window.Boutique || {};

/**
 * Renders foreground props (Knowledge Charm card, mascot butterfly, and Finish button).
 *
 * @fires Decorations#finish-clicked
 */
window.Boutique.Decorations = class Decorations extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

        const { CHARM, BUTTERFLY, FINISH_BTN } = window.Boutique.Constants.LAYOUT.DECORATIONS;

        this.knowledgeCharm = scene.add.image(CHARM.x, CHARM.y, 'knowledge_charm').setOrigin(0, 0);

        this.butterfly = scene.add.image(BUTTERFLY.x, BUTTERFLY.y, 'butterfly')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.finishBtn = scene.add.image(FINISH_BTN.x, FINISH_BTN.y, 'finish_button')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.finishBtn.on('pointerover', () => {
            scene.tweens.add({ targets: this.finishBtn, scale: 1.05, duration: 160, ease: 'Sine.easeOut' });
        });

        this.finishBtn.on('pointerout', () => {
            scene.tweens.add({ targets: this.finishBtn, scale: 1.0, duration: 160, ease: 'Sine.easeOut' });
        });

        this.finishBtn.on('pointerdown', () => {
            scene.tweens.add({
                targets: this.finishBtn,
                scale: 0.94,
                duration: 90,
                yoyo: true,
                ease: 'Quad.easeInOut',
                onComplete: () => this.emit('finish-clicked', FINISH_BTN.x, FINISH_BTN.y)
            });
        });

        this.add([this.knowledgeCharm, this.butterfly, this.finishBtn]);
    }
};
