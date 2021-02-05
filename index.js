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
		return ((!name) ? str : (name + ' | ' + str));
	}

	//Refresh au spawn
	mod.hook('S_SPAWN_USER', 17, (event) => {
		if(enabled) {
			event.guildName = guildName(event.guildName, event.serverId);
			return true;
		}
	});

	//Données du groupe
	let group = {};
	mod.hook('S_PARTY_MEMBER_LIST', 8, (event) => {
		if (!enabled) return;

		group = {};

		event.members.forEach(element => {
			group[element.gameId] = event.serverId
		});
	});

	//Refresh en groupe
	mod.hook('S_GUILD_NAME', 2, (event) => {
		if (enabled && event.gameId != mod.game.me.gameId && group.length > 0 && group[event.gameId]) {
			event.guildName = guildName(event.guildName,  group[event.gameId]);
			return true;
		}
	});
}
