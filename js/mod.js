let modInfo = {
	name: "The Tree Of Gates",
	id: "Old-Memory",
	author: "ajchen",
	pointsName: "Points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.5",
	name: "In the memory of",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>I don't use this sorry</h3><br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let base = new Decimal(0.1)
	let coinAdds = buyableEffect('c',11).add(buyableEffect('c',12))
	let secretBuff = player.points.root(2).add(1)
	return base.times(secretBuff).add(coinAdds)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = ["Endgame: 100000 Points",
                     function(){return format(player.points.add(1).log(100000).mul(100))+"% to endgame"}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("100000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}