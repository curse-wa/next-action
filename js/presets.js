const preset_actions = {
    'Potions': {
        'Limited Invulnerability Potion':3387,
        'Greater Arcane Protection Potion':13461,
        'Greater Frost Protection Potion':13456,
        'Greater Nature Protection Potion':13458,
        'Greater Shadow Protection Potion':13459,
        'Swiftness Potion':2459,
        'Major Mana Potion':13444,
        'Major Healing Potion':13446,
        'Major Rejuvenation Potion':18253,
        'Swiftness of Zanza':20081,
        'Spirit of Zanza':20079,
        'Sheen of Zanza':20080,
        'Noggenfogger Elixir':8529,
        'Free Action Potion':5634,
        'Mighty Rage Potion':13442,
        'Flask of Petrification':13506,
        'Flask of Distilled Wisdom':13511,
        'Flask of the Titans':13510,
        'Flask of Supreme Power':13512
    },
    'Engineering': {
        'Goblin Sapper Charge':10646,
        'Dense Dynamite':18641,
        'Goblin Rocket Boots':7189,
        'Masterwork Target Dummy':16023,
        'Gnomish Cloaking Device':4397,
        'Gnomish Battle Chicken':10725,
        'Arcanite Dragonling':16022,
        'Major Recombobulator':18637
    },
    'Trinkets': {
        'Ramstein\'s Lightning Bolts':13515,
        'Nifty Stopwatch':2820,
        'Gnomish Cloaking Device':4397,
        'Gnomish Battle Chicken':10725,
        'Arcanite Dragonling':16022,
        'Mark of the Champion (SP)':23207,
        'Mark of the Champion (AP)':23206,
        'Rune of the Dawn (SP)':19812,
        'Seal of the Dawn (AP)':13209,
        'Major Recombobulator':18637,
        'Ankh of Life':1713,
        'Lifegiving Gem':19341,
        'Kiss of the Spider':22954,
        'Slayer\'s Crest':23041,
        'Drake Fang Talisman':19406,
        'Earthstrike':21180,
        'Diamond Flask':20130,
        'Neltharion\'s Tear':19379,
        'Arena Grand Master':19024,
        'Edge of Madness Class Trinket':19953,
        'Mind Quickening Gem':19339,
        'The Restrained Essence of Sapphiron':23046,
        'Zandalarian Charm':19950,
        'Talisman of Ephemeral Power':18820,
        'Rejuvenating Gem':19395,
        'Scrolls of Blinding Light':19343,
        'Warmth of Forgiveness':23027,
        'Eye of the Dead':23047,
        'Hand of Justice':11815,
        'Fetish of the Sand Reaver':21647,
        'Badge of the Swarmguard':21670,
        'Blackhand\'s Breadth':13965,
        'Hibernation Crystal':20636,
        'Styleen\'s Impeding Scarab':19431,
        'Scarab Brooch':21625,
        'Darkmoon Card: Blue Dragon':19288,
        'Eye of Diminution':23001,
        'Glyph of Deflection':23040
    },
    'Non-Trinket': {
        'Torch of Holy Flame':7344,
        'Skull of Impending Doom':4984,
        'Gauntlets of the Sea':8346,
        'Everglow Lantern':5323,
        'Furbolg Medicine Pouch':16768,
        'Ancient Cornerstone Grimoire':17067
    },
    'Misc': {
        'Filled Festive Mug':21171,
        'Heavy Runecloth Bandage':14530,
        'Thistle Tea':7676,
        'R.O.I.D.S.':8410,
        'Whipper Root Tuber':11951,
        'Major Healthstone':19013,
        'Bag of Marbles':1191,
        'Wail of the Banshee':13514,
        'Dark Rune':20520,
        'Demonic Rune':12662,
        'Oil of Immolation':8956,
        'Chronoboon Displacer':212160,
        'Stratholme Holy Water':13180,
        'Festival Dumplings':21537,
        'Mana Ruby':8008,
        'Mana Citrine':8007,
        'Ice Deflector':4386
    }
};

Object.entries(preset_actions).forEach(([category,items]) => {
    let list = ''
    Object.entries(items).forEach(([name,id]) => {
        list+=`<li><a class="dropdown-item" onclick="actionAdd(this,['item',${id}])">${name}</a></li>`
    })

    document.querySelector('#template .preset-categories').insertAdjacentHTML('beforeend', `
        <li>
            <a class="dropdown-item sub-header">${category}</a>
            <ul class="dropdown-menu dropdown-submenu">${list}</ul>
        </li>
    `);
});