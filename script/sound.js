class Sound {
    constructor() {
        this.sfxOn = true;
        let soundContainer = getObj("soundcont"),
        bgm = new Audio("./sound/snake.ogg"),
        sfxEat = new Audio("./sound/eat.ogg"),
        sfxBoom = new Audio("./sound/boom.ogg");
        soundContainer.appendChild(bgm);
        soundContainer.appendChild(sfxEat);
        soundContainer.appendChild(sfxBoom);
        bgm.id = "bgm";
        bgm.loop = true;
        bgm.pause();
        sfxEat.id = "sfxEat";
        sfxBoom.id = "sfxBoom";
    }

    playMusic() {
        let bgm = getObj("bgm");
        bgm.play();
    }

    toggleMusic() {
        let bgm = getObj("bgm");
        if (bgm.paused) {
            bgm.play();
        } else {
            bgm.pause();
        }
    }

    toggleSfx = () => {if(this.sfxOn) {this.sfxOn = false;} else{this.sfxOn = true;}}

    playEatSfx = () => {if(this.sfxOn) {getObj("sfxEat").play();} else{return;}}

    playBoomSfx = () => {if(this.sfxOn) {getObj("sfxBoom").play();} else{return;}}
}