const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addhwid")
        .setDescription("Add HWID")
        .setDescriptionLocalizations({
            "en-US": "Add HWID",
            "fi": "Lisää HWID",
            "fr": "Ajouter HWID",
            "de": "HWID hinzufügen",
            "it": "Aggiungi HWID",
            "nl": "Voeg HWID toe",
            "ru": "Добавить HWID",
            "pl": "Dodaj HWID",
            "tr": "HWID ekle",
            "cs": "Přidat HWID",
            "ja": "HWIDを追加",
            "ko": "HWID 추가",
        })
        .addStringOption((option) => 
        option
            .setName("username")
            .setDescription("Enter Username")
            .setDescriptionLocalizations({
                "en-US": "Enter Username",
                "fi": "Anna käyttäjätunnus",
                "fr": "Entrez le nom d'utilisateur",
                "de": "Geben Sie den Benutzernamen ein",
                "it": "Inserisci il nome utente",
                "nl": "Voer gebruikersnaam in",
                "ru": "Введите имя пользователя",
                "pl": "Wprowadź nazwę użytkownika",
                "tr": "Kullanıcı adını girin",
                "cs": "Zadejte uživatelské jméno",
                "ja": "ユーザー名を入力してください",
                "ko": "사용자 이름을 입력하십시오",
            })
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("hwid")
            .setDescription("Enter Additional HWID")
            .setDescriptionLocalizations({
                "en-US": "Enter Additional HWID",
                "fi": "Anna lisä HWID",
                "fr": "Entrez un HWID supplémentaire",
                "de": "Geben Sie zusätzliche HWID ein",
                "it": "Inserisci HWID aggiuntivo",
                "nl": "Voer extra HWID in",
                "ru": "Введите дополнительный HWID",
                "pl": "Wprowadź dodatkowy HWID",
                "tr": "Ek HWID girin",
                "cs": "Zadejte další HWID",
                "ja": "追加のHWIDを入力してください",
                "ko": "추가 HWID 입력",
            })
            .setRequired(true)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        let un = interaction.options.getString("username")
        let auxhwid = interaction.options.getString("hwid")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addhwiduser&user=${un}&hwid=${auxhwid}`)
        .then(res => res.json())
        .then(json => {
			if (json.success) {
				interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: true})
			} else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            }
        })
    },
};