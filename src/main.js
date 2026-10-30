window.Boutique = window.Boutique || {};

(function () {
    const { MAX_DPR } = window.Boutique.Constants;
    const initialDPR = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    const config = {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: Math.round(window.innerWidth * initialDPR),
        height: Math.round(window.innerHeight * initialDPR),
        scale: {
            mode: Phaser.Scale.NONE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            zoom: 1 / initialDPR
        },
        render: {
            pixelArt: false,
            antialias: true,
            antialiasGL: true,
            roundPixels: false
        },
        scene: window.Boutique.BoutiqueScene
    };

    window.game = new Phaser.Game(config);
})();
