module.exports = {
            AZZAN: {
                id: 'AZZAN', name: 'Azzan', title: 'The Wizard', avatar: '🧙‍♂️', colorClass: 'hero-azzan', description: 'Master of arcane power, fireballs, and sneaky HP swaps.',
                deck: [
                    { id: 'az_1', name: 'Magic Missile', icons: ['attack', 'attack'], shieldHp: 0, text: 'Deal 2 Attack damage.' },
                    { id: 'az_2', name: 'Magic Missile', icons: ['attack', 'attack'], shieldHp: 0, text: 'Deal 2 Attack damage.' },
                    { id: 'az_3', name: 'Fireball', icons: ['attack', 'attack', 'attack'], shieldHp: 0, text: 'Deal 3 Attack damage.' },
                    { id: 'az_4', name: 'Vampiric Touch', icons: ['attack', 'heal'], shieldHp: 0, text: 'Deal 1 Attack & Heal 1 HP.' },
                    { id: 'az_5', name: 'Mage Armor', icons: ['shield'], shieldHp: 3, text: 'Defense Shield (3 HP).' },
                    { id: 'az_6', name: 'Mage Armor', icons: ['shield'], shieldHp: 2, text: 'Defense Shield (2 HP).' },
                    { id: 'az_7', name: 'Speed of Thought', icons: ['draw', 'bolt', 'bolt'], shieldHp: 0, text: 'Draw 1 card and play 2 extra cards.' },
                    { id: 'az_8', name: 'Knowledge is Power', icons: ['draw', 'draw', 'bolt'], shieldHp: 0, text: 'Draw 2 cards and play 1 extra card.' },
                    { id: 'az_9', name: 'Charm Person', icons: ['draw', 'bolt'], shieldHp: 0, text: 'Draw a card & play extra turn.' },
                    { id: 'az_10', name: 'Vanish', icons: ['shield', 'draw'], shieldHp: 2, text: 'Shield (2 HP) + Draw 1 card.' },
                    { id: 'az_11', name: 'Vampiric Drain', icons: ['attack', 'attack', 'heal'], shieldHp: 0, text: 'Deal 2 Attack & Heal 1 HP.' },
                    { id: 'az_12', name: 'Vampiric Drain', icons: ['attack', 'heal', 'heal'], shieldHp: 0, text: 'Deal 1 Attack & Heal 2 HP.' },
                    { id: 'az_13', name: 'Swap Hit Points!', icons: ['special_swap'], shieldHp: 0, text: 'ULTIMATE: Swap your current HP with chosen opponent!' }
                ]
            },
            LIA: {
                id: 'LIA', name: 'Lia', title: 'The Paladin', avatar: '🛡️', colorClass: 'hero-lia', description: 'Holy champion focused on healing, holy smites, and divine armor.',
                deck: [
                    { id: 'lia_1', name: 'Smite', icons: ['attack', 'attack'], shieldHp: 0, text: 'Deal 2 Attack damage.' },
                    { id: 'lia_2', name: 'Smite', icons: ['attack', 'attack'], shieldHp: 0, text: 'Deal 2 Attack damage.' },
                    { id: 'lia_3', name: 'Holy Shield', icons: ['shield'], shieldHp: 3, text: 'Defense Shield (3 HP).' },
                    { id: 'lia_4', name: 'Holy Shield', icons: ['shield'], shieldHp: 3, text: 'Defense Shield (3 HP).' },
                    { id: 'lia_5', name: 'Lay on Hands', icons: ['heal', 'heal'], shieldHp: 0, text: 'Heal 2 HP.' },
                    { id: 'lia_6', name: 'Lay on Hands', icons: ['heal', 'heal', 'bolt'], shieldHp: 0, text: 'Heal 2 HP + Play 1 extra card.' },
                    { id: 'lia_7', name: 'Divine Protection', icons: ['shield', 'heal'], shieldHp: 2, text: 'Shield (2 HP) + Heal 1 HP.' },
                    { id: 'lia_8', name: 'Banishing Smite', icons: ['attack', 'attack', 'attack'], shieldHp: 0, text: 'Deal 3 Attack damage.' },
                    { id: 'lia_9', name: 'For the Cause!', icons: ['draw', 'bolt'], shieldHp: 0, text: 'Draw 1 card + Play 1 extra card.' },
                    { id: 'lia_10', name: 'Cure Wounds', icons: ['heal', 'draw'], shieldHp: 0, text: 'Heal 1 HP + Draw 1 card.' },
                    { id: 'lia_11', name: 'Finger of Death', icons: ['attack', 'bolt'], shieldHp: 0, text: 'Deal 1 Attack + Play 1 extra card.' },
                    { id: 'lia_12', name: 'High Shield', icons: ['shield'], shieldHp: 4, text: 'Heavy Shield (4 HP).' },
                    { id: 'lia_13', name: 'Divine Health', icons: ['special_full_heal'], shieldHp: 0, text: 'ULTIMATE: Heal back to maximum (10 HP)!' }
                ]
            },
            SUTHA: {
                id: 'SUTHA', name: 'Sutha', title: 'The Barbarian', avatar: '🪓', colorClass: 'hero-sutha', description: 'Fierce warrior delivering brutal melee strikes and high impact.',
                deck: [
                    { id: 'su_1', name: 'Slash', icons: ['attack', 'attack'], shieldHp: 0, text: 'Deal 2 Attack damage.' },
                    { id: 'su_2', name: 'Slash', icons: ['attack', 'attack'], shieldHp: 0, text: 'Deal 2 Attack damage.' },
                    { id: 'su_3', name: 'Heavy Axe Strike', icons: ['attack', 'attack', 'attack'], shieldHp: 0, text: 'Deal 3 Attack damage.' },
                    { id: 'su_4', name: 'Headbutt', icons: ['attack', 'bolt'], shieldHp: 0, text: 'Deal 1 Attack + Play 1 extra card.' },
                    { id: 'su_5', name: 'Spiked Shield', icons: ['shield', 'attack'], shieldHp: 2, text: 'Shield (2 HP) + Deal 1 Attack.' },
                    { id: 'su_6', name: 'Spiked Shield', icons: ['shield', 'attack'], shieldHp: 2, text: 'Shield (2 HP) + Deal 1 Attack.' },
                    { id: 'su_7', name: 'Battle Cry', icons: ['draw', 'bolt', 'bolt'], shieldHp: 0, text: 'Draw 1 card + Play 2 extra cards.' },
                    { id: 'su_8', name: 'Whirlwind', icons: ['attack', 'attack', 'bolt'], shieldHp: 0, text: 'Deal 2 Attack + Play 1 extra card.' },
                    { id: 'su_9', name: 'Snack Break', icons: ['heal', 'heal'], shieldHp: 0, text: 'Heal 2 HP.' },
                    { id: 'su_10', name: 'Thick Hide', icons: ['shield'], shieldHp: 3, text: 'Defense Shield (3 HP).' },
                    { id: 'su_11', name: 'Rage!', icons: ['attack', 'draw', 'bolt'], shieldHp: 0, text: 'Deal 1 Attack, Draw 1 & Play 1 card.' },
                    { id: 'su_12', name: 'Brutal Cleave', icons: ['attack', 'attack', 'attack'], shieldHp: 0, text: 'Deal 3 Attack damage.' },
                    { id: 'su_13', name: 'Devastating Smash!', icons: ['special_smash'], shieldHp: 0, text: 'ULTIMATE: Destroy ALL opponent shields instantly!' }
                ]
            },
            ORIAX: {
                id: 'ORIAX', name: 'Oriax', title: 'The Rogue', avatar: '🗡️', colorClass: 'hero-oriax', description: 'Tricky tiefling rogue specializing in multi-play combos and card theft.',
                deck: [
                    { id: 'or_1', name: 'Backstab', icons: ['attack', 'attack'], shieldHp: 0, text: 'Deal 2 Attack damage.' },
                    { id: 'or_2', name: 'Sneak Attack', icons: ['attack', 'bolt'], shieldHp: 0, text: 'Deal 1 Attack + Play 1 extra card.' },
                    { id: 'or_3', name: 'Cunning Action', icons: ['draw', 'bolt', 'bolt'], shieldHp: 0, text: 'Draw 1 card + Play 2 extra cards.' },
                    { id: 'or_4', name: 'Cunning Action', icons: ['draw', 'bolt', 'bolt'], shieldHp: 0, text: 'Draw 1 card + Play 2 extra cards.' },
                    { id: 'or_5', name: 'Parry', icons: ['shield'], shieldHp: 2, text: 'Defense Shield (2 HP).' },
                    { id: 'or_6', name: 'Smoke Bomb', icons: ['shield', 'draw'], shieldHp: 2, text: 'Shield (2 HP) + Draw 1 card.' },
                    { id: 'or_7', name: 'Poison Dagger', icons: ['attack', 'heal'], shieldHp: 0, text: 'Deal 1 Attack & Heal 1 HP.' },
                    { id: 'or_8', name: 'Crossbow Shot', icons: ['attack', 'attack'], shieldHp: 0, text: 'Deal 2 Attack damage.' },
                    { id: 'or_9', name: 'Health Potion', icons: ['heal', 'draw'], shieldHp: 0, text: 'Heal 1 HP + Draw 1 card.' },
                    { id: 'or_10', name: 'My Shield Now!', icons: ['shield'], shieldHp: 3, text: 'Defense Shield (3 HP).' },
                    { id: 'or_11', name: 'Rapid Daggers', icons: ['attack', 'attack', 'bolt'], shieldHp: 0, text: 'Deal 2 Attack + Play 1 extra card.' },
                    { id: 'or_12', name: 'Flurry of Blades', icons: ['attack', 'attack', 'draw'], shieldHp: 0, text: 'Deal 2 Attack & Draw 1 card.' },
                    { id: 'or_13', name: 'Thieves\' Cant / Steal', icons: ['special_steal', 'bolt'], shieldHp: 0, text: 'ULTIMATE: Draw 2 extra cards & gain extra play turn!' }
                ]
            }
        };
