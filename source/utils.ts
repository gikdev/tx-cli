function to_snake_case(input: string): string {
	let final = input
	final =
		final[0]?.toLowerCase() +
		final
			.slice(1, final.length)
			.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
	final = final.replaceAll(" -", "-")
	final = final.replaceAll(" ", "-").replace(/(^-*|-*$)/g, "")
	return final
}

export { to_snake_case }
