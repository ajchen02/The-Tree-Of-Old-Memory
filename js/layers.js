addLayer("c", {
    name: "coin",
    symbol: "C",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFF00",
    requires: new Decimal(1),
    resource: "Coins",
    baseResource: "Points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 1, 
    gainMult() {
        mult = new Decimal(1)
        if(hasUpgrade(this.layer,23)) mult=mult.times(upgradeEffect(this.layer,23))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    passiveGeneration(){return 1},
    row: 0,
    hotkeys: [
        {key: "c", description: "C: Reset for Coins", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    update(diff){
        //auto
            for(row=1;row<=1;row++){ //可重复购买项的行数
                for(col=1;col<=4;col++){ //可重复购买项的列数
                    if(layers[this.layer].buyables[row*10+col]){
                        layers[this.layer].buyables[row*10+col].abtick += diff
                        if(layers[this.layer].buyables[row*10+col].abtick >= layers[this.layer].buyables[row*10+col].abdelay() && layers[this.layer].buyables[row*10+col].unlocked() && layers[this.layer].buyables[row*10+col].canAfford()){
                            layers[this.layer].buyables[row*10+col].buy()
                            layers[this.layer].buyables[row*10+col].abtick = 0
                        }
                    }
                }
            }
        },
    buyables:{
        11:{
            cost(x){
                let base = new Decimal(5)
                if (hasUpgrade(this.layer,12)) base = base.minus(1)
                let costScale = new Decimal(1.1)
                let gain = base.times(costScale.pow(x)).div(upgradeEffect(this.layer,13))
                return gain
            },

            title:"Lv1",

            display(){words = `Add Point gain.<br>
                            You have `+format(getBuyableAmount(this.layer, this.id))+`
                            They are adding your point gain by  +`+format(buyableEffect(this.layer,this.id))+`<br>
                            Next: `
                    //if (getBuyableAmount(this.layer,this.id).gt(this.purchaseLimit))return words + "MAXED"
                    //else
                    return words + format(this.cost()) + " Coins."},
            
            canAfford(){return player[this.layer].points.gte(this.cost())},
            
            buy() {
                let buyTimes = new Decimal(0)
                while (this.canAfford() && buyTimes.lte(getBuyableAmount(this.layer, this.id).times(1.1).add(10))) { 
                    if(!(hasUpgrade(this.layer,14))) {player[this.layer].points = player[this.layer].points.sub(this.cost())}
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    buyTimes=buyTimes.add(1)
                }
            },

            effect(){
                let base =getBuyableAmount(this.layer,this.id).div(10)
                let gain =new Decimal(1)
                if(hasUpgrade(this.layer,22))gain=gain.times(upgradeEffect(this.layer,22))
                return base.times(gain)
            },
            
            unlocked(){
                return true},
            abtick:0,
            abdelay(){
                if (hasUpgrade(this.layer, 14)) return 1
                else return 1e300
            }
        },
        12:{
            cost(x){
                let base = new Decimal(1e4)
                let costScale = new Decimal(1.1)
                let gain = base.times(costScale.pow(x))
                return gain
            },

            title:"Lv2",

            display(){words = `Add Point gain.<br>
                            You have `+format(getBuyableAmount(this.layer, this.id))+`
                            They are adding your point gain by  +`+format(buyableEffect(this.layer,this.id))+`<br>
                            Next: `
                    //if (getBuyableAmount(this.layer,this.id).gt(this.purchaseLimit))return words + "MAXED"
                    //else
                    return words + format(this.cost()) + " Coins."},
            
            canAfford(){return player[this.layer].points.gte(this.cost())},
            
            buy() {
                let buyTimes = new Decimal(0)
                while (this.canAfford() && buyTimes.lte(getBuyableAmount(this.layer, this.id).times(1.1).add(10))) { 
                    if(!(hasUpgrade(this.layer,24))) {player[this.layer].points = player[this.layer].points.sub(this.cost())}
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    buyTimes=buyTimes.add(1)
                }
            },

            effect(){
                let base = getBuyableAmount(this.layer,this.id)
                let gain = new Decimal(1)
                if (hasUpgrade(this.layer,21)) base = base.times(upgradeEffect(this.layer,21))
                if (hasUpgrade(this.layer,25)) gain = gain.times(upgradeEffect(this.layer,25))
                return base.times(gain)
            },

            abtick:0,
            abdelay(){
                if (hasUpgrade(this.layer, 24)) return 1
                else return 1e300
            },

            unlocked(){ if(hasUpgrade(this.layer,15) || (getBuyableAmount(this.layer,this.id).gte(1))) return true
                       else return false},
        },
    },
    upgrades:{
        11: {
            title: "Why the Lv1 buyable soooo weak?",
            description: "Boost for a bit",
            cost: new Decimal(10),
            effect(){
                if (hasUpgrade(this.layer,this.id)) return new Decimal(0.1)
                return new Decimal(0)
            },
            effectDisplay() { return "Lv1 Base +"+format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                if (getBuyableAmount(this.layer, 11).gte(10) || (hasUpgrade(this.layer,this.id))) return true
                else return false},
        },
        12: {
            title: "This is so click-ful.",
            description: "Let me try to fix that..",
            cost: new Decimal(1000),
            effect(){
                if (hasUpgrade(this.layer,this.id)) return new Decimal(1)
                return new Decimal(0)
            },
            effectDisplay() {if (hasUpgrade(this.layer,this.id)) return "Lv1 Base Cost -"+format(upgradeEffect(this.layer, this.id)) 
                            else return 'Idk'},
            unlocked(){
                if (getBuyableAmount(this.layer, 11).gte(50) || (hasUpgrade(this.layer,this.id))) return true
                else return false},
            tooltip:"Buymax was always there, you don't need to unlock it or something.",
        },
        13: {
            title: "It's still click-ful!",
            description: "Okey, let me have another try",
            cost: new Decimal(10000),
            effect(){
                if (hasUpgrade(this.layer,this.id)) return player.points.root(2).add(1)
                return new Decimal(1)
            },
            effectDisplay() {return "Lv1 Cost /"+format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                if (getBuyableAmount(this.layer, 11).gte(70) || (hasUpgrade(this.layer,this.id))) return true
                else return false},
        },
        14: {
            title: "You just boosted point gain.",
            description: "I give up trying. This give you autobuy, and it cost nothing.",
            cost: new Decimal(100000),
            unlocked(){
                if (getBuyableAmount(this.layer, 11).gte(115) || (hasUpgrade(this.layer,this.id))) return true
                else return false},
        },
        15: {
            title: "I'm tired with Lv1.",
            description: "Me too. Why not Lv2?",
            cost: new Decimal(200000),
            unlocked(){
                if (getBuyableAmount(this.layer, 11).gte(150) || (hasUpgrade(this.layer,this.id))) return true
                else return false},
        },
        21: {
            title: "Why the Lv2 buyable soooo strong?",
            description: "No why.",
            cost: new Decimal(200000),
            effect(){
                if (hasUpgrade(this.layer,this.id)) return new Decimal(1.1)
                return new Decimal(1)
            },
            effectDisplay() { return "Lv2 Base x"+format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                if (getBuyableAmount(this.layer, 12).gte(10) || (hasUpgrade(this.layer,this.id))) return true
                else return false},
        },
        22: {
            title: "Now i get where this is going.",
            description: "No you didn't.",
            cost: new Decimal(800000),
            effect(){
                if (hasUpgrade(this.layer,this.id)) return getBuyableAmount(this.layer, 12).log(2)
                return new Decimal(1)
            },
            effectDisplay() {if (hasUpgrade(this.layer,this.id)) return "Lv1 Effect *"+format(upgradeEffect(this.layer, this.id)) 
                            else return 'Guess it.'},
            unlocked(){
                if (getBuyableAmount(this.layer, 12).gte(40) || (hasUpgrade(this.layer,this.id))) return true
                else return false},
        },
        23: {
            title: "The prices are too high!",
            description: "Yea, that should be boosted.",
            cost: new Decimal(1000000),
            effect(){
                if (hasUpgrade(this.layer,this.id)) return getBuyableAmount(this.layer, 12).log(2)
                return new Decimal(1)
            },
            effectDisplay() {return "Coins gain *"+format(upgradeEffect(this.layer, this.id))},
            unlocked(){
                if (getBuyableAmount(this.layer, 12).gte(45) || (hasUpgrade(this.layer,this.id))) return true
                else return false},
        },
        24: {
            title: "But Autobuy When?",
            description: "Now, but you need some grind.",
            cost: new Decimal(33333333),
            unlocked(){
                if (getBuyableAmount(this.layer, 12).gte(55) || (hasUpgrade(this.layer,this.id))) return true
                else return false},
        },
        25: {
            title: "And What's now?",
            description: "",
            cost: new Decimal(5e7),
            effect(){
                if (hasUpgrade(this.layer,this.id)) return getBuyableAmount(this.layer, 11).log(10)
                return new Decimal(1)
            },
            effectDisplay() {return "Lv2 Effect *"+format(upgradeEffect(this.layer, this.id))},
            unlocked(){
                if (getBuyableAmount(this.layer, 12).gte(80) || (hasUpgrade(this.layer,this.id))) return true
                else return false},
        },
    },
    tabFormat:[
        "main-display",
        'resource-display',
        "blank",
        "buyables",
        "blank",
        "upgrades",
        ],
})
