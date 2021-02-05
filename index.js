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
		mod.command.message('Enable: ' + enabled);
	});

	function guildName (name, id) {
		if (!name) return serverId[id];
		else return name + ' | ' + serverId[id];
	}

	//Refresh au spawn
	mod.hook('S_SPAWN_USER', 17, (event) => {
		if(enabled && serverId[event.serverId]) {
			event.guildName = guildName(event.guildName, event.serverId);
			return true;
		}
		
		console.error('Unknow Server Id: ' + event.serverId);
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
		if (event.gameId != mod.game.me.gameId && enabled && group.length > 0) {
			if (group[event.gameId]) {
				if (serverId[group[event.gameId].serverId]) {
					event.guildName = guildName(event.guildName,  group[event.gameId]);
					return true;
				}
			}
		}
	});
}
