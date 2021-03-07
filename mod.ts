import { Command } from "./deps.ts";
import {
	// Checkbox,
	// Confirm,
	Input,
	// Number,
	prompt,
	Select,
	Toggle
} from "./deps.ts";

await new Command()
	.name("discordeno")
	.version("1.0.0")
	.description("The unofficial and powerful Discordeno CLI.")
	.parse(Deno.args);

await prompt([
	{
		name: "name",
		message: "What would you like to call your project?",
		type: Input,
		// TODO: Get directory name and use it as the default name.
		// default: Deno.cwd().split('\\').reverse()[0],
		default: "my-discordeno-bot",
		// suggestions: [
		// 	Deno.cwd().split('\\').reverse()[0],
		// ],
		minLength: 1
	},
	{
		/**
		 * Forgot that the reason people are using this plugin is
		 * for generating templates...
		 *
		 * Going to leave this question in for now though.
		 */
		name: "use_template",
		message: "Would you like to use a template?",
		type: Toggle,
		default: false,
		validate: ((value) => value == "Yes"),
		after: async ({ use_template }, next): Promise<void> => {
			use_template
				? await next()
				: await next("confirm");
		}
	},
	{
		name: "custom_template",
		message: "Would you like to use a custom template from Git?",
		type: Toggle,
		default: false,
		after: async ({ custom_template }, next): Promise<void> => {
			custom_template
				? await next("template_url")
				: await next("template_name");
		}
	},
	{
		name: "template_url",
		message: "Please enter the Git URL for the template",
		type: Input,
		suggestions: [
			"https://",
			"https://github.com",
			"https://gitlab.com",
			"https://bitbuckit.org"
		],
		validate: ((value) => /^(ftp|http|https):\/\/[^ "]+$/.test(value)),
		after: async ({}, next): Promise<void> => await next("confirm")
	},
	{
		name: "template_name",
		message: "Please choose a template",
		type: Select,
		options: [
			{
				name: "basic",
				value: "https://github.com/discordeno/slash-commands-boilerplate"
			},
			{
				name: "serverless-slash-commands",
				value: "https://github.com/discordeno/slash-commands-boilerplate"
			}
		]
	},
	{
		name: "confirm",
		message: "Confirm settings?",
		type: Toggle,
		default: true,
		after: async (
			{ confirm, custom_template, template_name, template_url, name },
			next
		): Promise<void> => {
			if (confirm) {
				if (custom_template) {
					// @ts-ignore IntelliJ cannot find Deno.
					await Deno.run({
						cmd: [
							"git",
							"clone",
							"--single-branch",
							template_url as string,
							name as string
						]
					}).status();
				} else {
					// @ts-ignore IntelliJ cannot find Deno.
					await Deno.run({
						cmd: [
							"git",
							"clone",
							"--single-branch",
							template_name as string,
							name as string
						]
					}).status();
				}
			} else {
				await next("name");
			}
		}
	}
]);
