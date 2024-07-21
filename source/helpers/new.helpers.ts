import fs from "node:fs"
import path from "node:path"
import { to_snake_case } from "../utils.js"
import { getComponentTemplate } from "./template.helpers.js"

const CURRENT_DIR = process.cwd()

interface Config {
	name: string
	useSuffix: boolean
	useTypescript: boolean
}

function newComponentFile(config: Config): [string, boolean] {
	const fileName = `${to_snake_case(config.name)}${config.useSuffix ? ".component" : ""}.${config.useTypescript ? "tsx" : "jsx"}`
	const filePath = path.join(CURRENT_DIR, "src", "components", fileName)
	const contents = getComponentTemplate({ componentName: config.name })
	const fileExists = fs.existsSync(filePath)

	if (fileExists) return [`The file ${filePath} already exists`, false]

	fs.writeFile(filePath, contents, err => {
		if (err) throw err
	})

	return [`Component <${config.name} /> got created!`, true]
}

export { newComponentFile }
