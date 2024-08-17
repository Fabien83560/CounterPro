const { EmbedBuilder } = require('discord.js');
const getEmbed = require("../Functions/getEmbed");
const getColorHexByName = require("../Functions/getColorHexByName");
const { updateHexOfUser } = require("../Functions/sql")

module.exports = {
    name: "color",
    description: "Set color of counting message",
    permission: "Aucune",
    dm: false,
    category: "Informations",
    options: [
        {
            type: "string",
            name: "name",
            description: "Name of the color (e.g., 'blue', 'red').",
            required: false,
            autocomplete: false,
        },
        {
            type: "string",
            name: "hex",
            description: "Hex code of the color (e.g., '#0000FF').",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, interaction) {
        const colorName = interaction.options.getString("name");
        const colorHex = interaction.options.getString("hex");

        if (!colorName && !colorHex) {
            await interaction.reply({
                embeds: [await getEmbed(
                    "ERROR",
                    "No Color Information Provided",
                    "You must provide at least one of the following: a color name or a hex code."
                )],
                ephemeral: true
            });
            return;
        }

        if (colorName && colorHex) {
            await interaction.reply({
                embeds: [await getEmbed(
                    "ERROR",
                    "Multiple Color Inputs",
                    "You cannot provide both a color name and a hex code. Please provide only one."
                )],
                ephemeral: true
            });
            return;
        }
        
        if (colorName) {
            const hex = await getColorHexByName(colorName.toLowerCase());

            if (!hex) {
                await interaction.reply({
                    embeds: [await getEmbed(
                        "ERROR",
                        "Invalid Color Name",
                        `The color name \`${colorName}\` is not recognized. Please use a valid color name.`
                    )],
                    ephemeral: true
                });
                return;
            }

            updateHexOfUser(interaction.user.id, hex)

            await interaction.reply({
                embeds: [await getEmbed(
                    "INFO",
                    "Color Selected",
                    `The color \`${colorName}\` has been set with hex value \`${hex}\`.`,
                    hex
                )],
                ephemeral: true
            });
        }

        if (colorHex) {
            const hexRegex = /^#[0-9A-Fa-f]{6}$/;
            if (!hexRegex.test(colorHex)) {
                await interaction.reply({
                    embeds: [await getEmbed(
                        "ERROR",
                        "Invalid Hex Code",
                        `The hex code \`${colorHex}\` is not valid. Please provide a valid hex code in the format #RRGGBB.`
                    )],
                    ephemeral: true
                });
                return;
            }

            updateHexOfUser(interaction.user.id, colorHex)

            await interaction.reply({
                embeds: [await getEmbed(
                    "INFO",
                    "Hex Code Provided",
                    `The hex code \`${colorHex}\` has been set.`,
                    colorHex
                )],
                ephemeral: true
            });
        }
    }
};
