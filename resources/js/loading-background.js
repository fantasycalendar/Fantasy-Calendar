export default () => ({

    visible: false,
    show_cancel_button: false,
    info_text: "",
    random_text: "",
    timeout: null,
    random_text_interval: null,
    cancel_callback: null,

    show($event) {
        this.info_text = $event.detail.info_text;

        this.random_text = this.get_random_text();
        this.random_text_interval = this.random_text_interval || setInterval(() => {
            this.random_text = this.get_random_text();
        }, 6000);

        if(!this.timeout) {
            this.timeout = setTimeout(() => {
                this.visible = true;
                this.timeout = null;
            }, 100);
        }

        this.show_cancel_button = $event.detail.show_cancel_button;
        this.cancel_callback = $event.detail.cancel_callback;
    },

    hide() {
        this.cancel_callback = null;
        this.info_text = "";
        this.random_text = "";
        clearTimeout(this.timeout);
        clearInterval(this.random_text_interval);
        this.timeout = null;
        this.random_text_interval = null;
        this.visible = false;
        this.show_cancel_button = false;
    },

    cancel() {
        if(!this.cancel_callback) return;
        this.cancel_callback();
    },

    get_random_text() {
        return this.texts[Math.floor(Math.random() * this.texts.length)];
    },

    texts: [
        `Calculating start of the next war...`,
        `Preparing "Kill All Players" event...`,
        `Nerfing the moon...`,
        `Writing history...`,
        `Strapping lasers to Tarrasque...`,
        `Calculating airspeed velocity of an unladen swallow...`,
        `Calculating world-ending weather...`,
        `Preparing for the weekend...`,
        `Worshipping the master calendar...`,
        `Creating new and unusual seasons...`,
        `Comforting lunatics...`,
        `Buying new dice...`,
        `Hiding from the Ides of March...`,
        `Securing ropes to limit seasonal drift...`,
        `Making seasons kinder to wasps...`,
        `Adding leap months...`,
        `Rolling to seduce the sun...`,
        `Deciding between solar, lunar, or lunisolar calendars...`,
        `Teaching days to leap...`,
        `Shouting "NO!" at Aecius...`,
        `Selling soul for 1d10 cantrip...`,
        `Implementing niche event conditions...`,
        `Planting dates...`,
        `Converting epochs...`,
        `Defining an era...`,
        `Waking up after a nightmare about leap months with leap days...`,
        `Breaking moon phases...`,
        `Disciplining child calendars...`,
        `Calculating epoch of year 3 billion...`,
        `Making Mondays leap...`,
        `Locating phased moons...`,
        `Ignoring worldbuilding...`,
        `Stocking taverns with hooded strangers...`,
        `Breaking wasp...`,
        `Generating wibbly wobbly timey wimey calendar stuff...`,
        `Figuring out issues with Easter...`,
        `Grinding bones to make bread...`,
        `Computing the wood chucking capabilities of a woodchuck...`,
        `Optimizing the electromagnetic pathways to the nuclear bubble terminal...`,
        `Establishing warp vector...`,
        `Realigning the temporal buffer...`,
        `Coming up with new loading screen messages...`,
        `Screening now loading screen messages...`,
        `Loading newly screened loading screen messages...`,
        `I really should be getting back to work...`,
        `Playing TCGs with velociraptors...`,
        `Bothering Axel...`,
        `Bothering Wasp...`,
        `Deciding on optimal window for defenestration...`,
        `Zapping the hamster...`,
        `Animating progress to look busy...`,
        `Anti-re-un-de-scrambling the dates...`,
        `Lacing the sloth...`,
        `Thinking of unsolicited worldbuilding advice...`,
        `Looking for better fools...`,
        `Looking for the droids we are looking for...`,
        `Motivating the historians...`,
        `Applying alliteration after almanac attack...`,
        `Realigning megascope lenses...`,
        `Removing donkeys from swamp...`,
        `Cleaning up the adventurers' mess... again...`,
        `Disbarring rules lawyers...`,
        `Preparing obscure historical anecdotes...`,
        `Aligning moons...`,
        `Deterministically simulating galactic impracticalities...`,
        `Railroading adventure beats...`,
        `Adding and removing (we hope) subtle inconsistencies...`,
        `Trying to forget mondays...`,
        `Finishing 34-page backstory...`,
        `Deciding on this week's snack list...`,
        `Forgetting your password so you don't have to remember it...`,
        `Randomly adding leap seconds and leap frogs...`,
        `Stealing leaps from frogs...`,
        `Randomly deleting some other user's calendar...`,
        `Adding intercalary cheat day...`,
        `Moving moons from one calendar to another...`,
        `Providing sensation of deja vu... Didn't we do this before?`,
        `Calculating spare time...`,
        `Bringing calendar home from fancy date...`,
        `Stealing dates from fruit bowls...`,
        `Trying to remember what you named everything...`,
        `DROP TABLE calendar_data; --`,
        `Measuring voltage of current year...`,
        `Reclassifying Fantasy Calendar as a dating app...`,
        `Finding you some dates...`,
        `Sorting events by color...`,
        `Asking party members their birthdays...`,
        `Determining whether it's Thursday yet...`,
        `Telling days they're numbered...`,
        `Applying time skip...`,
        `Doing the time warp again...`,
        `Sorting intercalaries by carb content...`,
        `Killing time...`,
        `Accurately discounting Nostradamus...`,
        `Moving sundial to get more time...`,
        `Skipping our long rest...`,
        `Distinguishing time from thyme...`,
        `Doing things according to schedule...`,
        `Bundling octagonal diminutive quiescence...`,
        `Skipping a beat and breaking time...`,
        `404 Year not found`,
        `Debating the existance of year 0...`,
        `Stealing events from other people's calendars...`,
    ]

})