'use strict'
module.exports = function ServerIdentifier(mod) {
	let enabled = true;
	let serverId = { 
		38: 'Mystel',
		28: 'Yurian',
		29: 'Seren',
		40: 'Shakan',
		39: 'Shen'
	};
	
	mod.command.add(['si'], () => {
		enabled = !enabled;
		mod.command.message('Enabled: ' + enabled);
	});

	function guildName (name, id) {
		let str = ((!serverId[id]) ? ('Unk' + id) :  serverId[id]);
		return ((!name) ? str : (name + ' - ' + str));
	}
	
	//Refresh At Players Spawn
	mod.hook('S_SPAWN_USER', 17, (event) => {
		if(enabled && mod.game.me.inDungeon) {
			event.guildName = guildName(event.guildName, event.serverId);
			return true;
		}
	});

	//Block Guild Refresh For Other Player
	mod.hook('S_GUILD_NAME', 2, (event) => {
		if (enabled && event.gameId != mod.game.me.gameId) return false;
	});
}
