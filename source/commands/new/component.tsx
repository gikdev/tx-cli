import { Text } from "ink"
import React, { useEffect, useState } from "react"
import zod from "zod"
import { newComponentFile } from "../../helpers/index.js"

export const alias = "c"
export const args = zod.array(zod.string())
export const options = zod.object({
	ts: zod.boolean().default(false).describe("Whether or not to use TS"),
	suffix: zod
		.boolean()
		.default(true)
		.describe("Whether or not to use suffixes (e.g. sth.component.jsx)"),
})

interface Props {
	options: zod.infer<typeof options>
	args: zod.infer<typeof args>
}

function Component({ args, options }: Props) {
	const [msg, setMsg] = useState("Working on it...")
	const [succeeded, setSucceeded] = useState<boolean | null>(null)
	const colorToSet = succeeded ? "green" : succeeded === false ? "red" : "gray"

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const [newMsg, newSucceeded] = newComponentFile({
			name: args[0] ?? "NewComponent",
			useSuffix: options.suffix,
			useTypescript: options.ts,
		})

		setMsg(newMsg)
		setSucceeded(newSucceeded)
	}, [])

	return <Text color={colorToSet}>{msg}</Text>
}

export default Component
