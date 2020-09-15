class CombatCarousel extends Application {
    constructor(options={}) {
        super(options);

        this.turn = null;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "combat-carousel",
            template: "modules/combat-carousel/combat-carousel.hbs",
            popOut: false
        });
    }

    /** @override */
    async _render(...args) {
        await super._render(...args);
        
        const splide = this.splide = new Splide(".splide", {
            perPage: 10,
            perMove: 1,
            focus: 0,
            cover: true,
            pagination: false,
            arrows: "slider",
            fixedWidth: 100,
            //autoWidth: true,
            //width: 100,
            height: 150
        });
        
        splide.on("mounted", () => {
            const slides = document.querySelectorAll(".splide__slide");

            for (let i = 0; i < slides.length; i++) {
                slides[i].classList.add("fly");
                slides[i].style.animationDelay = `${0.1 * i}s`;
            }
        });

        splide.mount();
        splide.go(this.turn);
        splide.on("click", slide => {
            splide.go(slide.index);
        });

        splide.on("active", slide => {
            if (game.combat.turn !== slide.index) {
                game.combat.update({turn:slide.index});
            }
        });
        
        ui.nav.collapse();
        //this.setPosition();
    }

    getData() {
        const view = canvas.scene;
        const combats = view ? game.combats.entities.filter(c => c.data.scene === view._id) : [];
        const currentCombatIdx = combats.findIndex(c => c === game.combat);
        const hasCombat = currentCombatIdx > -1;
        const encounter = currentCombatIdx + 1;
        const round = game.combat.round;
        const turns = game.combat.turns.map(t => {
            const token = canvas.tokens.get(t.tokenId);
            const hp = token?.actor?.data?.data?.attributes?.hp || null;
            

            if (hp) {
                hp.low = hp.max * 0.34;
                hp.high = hp.max * 0.6;
                hp.optimum = hp.max * 0.9;
            }

            return {
                id: t._id,
                name: t.name,
                img: token.actor.img ?? t.img,
                initiative: t.initiative,
                carousel: {
                    hp,
                    attributes: [
                        {
                            img: "/icons/svg/shield.svg",
                            value: token.actor.data.data.attributes.ac.value
                        },
                        {
                            img: "/icons/svg/eye.svg",
                            value: token.actor.data.data.skills.prc.passive
                        }
                    ],
                    effects: token?.data?.effects || null
                }                
            }
        });
        
        this.turn = turns.length ? game.combat.turn : null;

        return {
            turns,
            encounter,
            round
        }
    }

    activateListeners(html) {
        super.activateListeners(html);

        const rollInit = html.find(".fa-dice-d20");
        const card = html.find(".splide__slide");

        rollInit.on("click", this._onRollInitiative);
        card.on("mouseover", (event) => this._onHoverCard(event, html));
        card.on("mouseleave", (event) => this._onMouseOutCard(event, html));
    }

    _onRollInitiative(event) {
        const parentLi = event.currentTarget.closest("li");
        const combatantId = parentLi.dataset.combatantId;
        
        if (!combatantId) return;

        game.combat.rollInitiative(combatantId);
    }

    /**
     * 
     * @param {*} event 
     */
    _onHoverCard(event, html) {
        event.preventDefault();
        const hoveredCard = event.currentTarget;
        const combatantId = hoveredCard.dataset.combatantId;
        const token = this.getTokenFromCombatantId(combatantId);
        const name = token ? token.name : null;
        const nameDiv = $(hoveredCard).find(".name");
        const infoBar = html.find(".info-bar");
        infoBar.empty().append(nameDiv.clone().addClass("hovered"));
    }

    _onMouseOutCard(event, html) {
        const infoBar = html.find(".info-bar");
        infoBar.find(".name.hovered").remove();
    }

    /**
     * 
     * @param {*} combatantId 
     */
    getTokenFromCombatantId(combatantId) {
        const combatant = game?.combat?.combatants.find(c => c._id === combatantId);
        if (!combatant) return;

        const token = combatant.tokenId ? canvas.tokens.get(combatant.tokenId) : null;

        return token;
    }
}

Hooks.on("ready", () => {
    ui.combatCarousel = new CombatCarousel();
    
    if (game.combat) {
        ui.combatCarousel.render(true);
    }
});

Hooks.on("createCombat", (combat, createData, options, user) => {
    ui.combatCarousel.render(true);
});

Hooks.on("createCombatant", (combat, createData, options, user) => {
    ui.combatCarousel.render(true);
});

Hooks.on("updateCombatant", (combat, update, options, user) => {
    console.log("combatant update", {combat, update, options, user});
    //ui.combatCarousel.splide.go()
    //ui.combatCarousel.splide.refresh();
    ui.combatCarousel.render();
});

Hooks.on("updateCombat", (combat, update, options, user) => {
    if (!hasProperty(update, "turn")) {
        return;
    }

    if (hasProperty(update, "round")) {
        const combatCarousel = document.querySelector("#combat-carousel");
        const overlay = combatCarousel.querySelector(".overlay");
        overlay.classList.add(".active");
        //setTimeout(overlay.classList.remove, 1000, ".active");
    }
    const token = ui.combatCarousel.getTokenFromCombatantId(combat.combatant._id);

    ui.combatCarousel.turn = update.turn;
    ui.combatCarousel.splide.go(update.turn);
    const infoBar = ui.combatCarousel.element.find(".info-bar");
    const turnAlertHtml = `<div class="turn name hovered"><h3>${token.name}'s Turn!</h3></div>`;
    infoBar.append(turnAlertHtml);
    setTimeout(() => {
        infoBar.find(".turn").remove();
    }, 1500);
    console.log("combat update", {combat, update, options, user});
});

Hooks.on("deleteCombat", (combat, options, user) => {
    ui.combatCarousel.close();
});