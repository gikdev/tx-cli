import fs from "node:fs"
import path from "node:path"
import { to_snake_case } from "../utils.js"

interface ComponentConfig {
	enableTypescript?: boolean
	enableSuffix?: boolean
}

const defaultComponentConfig: ComponentConfig = {
	enableSuffix: true,
	enableTypescript: false,
}

const CURRENT_DIR = process.cwd()

/** The business logic of everything ___component___
 * @todo `rename(oldName: string, newName, string): [string, boolean]`
 * @todo `delete(name: string): [string, boolean]`
 */
class ComponentService {
	constructor(private _config: ComponentConfig = defaultComponentConfig) {}

	/** Creates a create component file and adds it into the index file
	 * @param name name of the component to create
	 * @returns [the message, if it's been successful or not]
	 * @example compService.create("HelloWorld")
	 */
	public create(name: string): [string, boolean] {
		// Make the file name
		let fileName = ""
		fileName += to_snake_case(name)
		if (this._config.enableSuffix) fileName += ".component"
		fileName += this._config.enableTypescript ? ".tsx" : ".jsx"

		// make the file path
		const filePath = path.join(CURRENT_DIR, "src", "components", fileName)

		// make the contents of the component file
		const fileContent = this.generateTemplate(name)

		// make the index file path
		const indexFilePath = path.join(
			CURRENT_DIR,
			"src",
			"components",
			`index.${this._config.enableTypescript ? "ts" : "js"}`,
		)

		// make the export statement
		const exportStatementPath =
			to_snake_case(name) + this._config.enableSuffix ? ".component" : ""
		const exportStatement = `export { default as ${name} } from "./${exportStatementPath}"`

		// checking time! 🛡
		const doesFileExist = fs.existsSync(filePath)
		if (doesFileExist) return [`The file at ${filePath} already exists`, false]

		// make the component
		fs.writeFile(filePath, fileContent, err => {
			if (err) throw err
		})
		fs.appendFile(indexFilePath, exportStatement, err => {
			if (err) throw err
		})

		return [`✅ Component <${name} /> created! 🎉`, true]
	}

	/** Generates a template for components
	 * @todo add multiple templates
	 * @param componentName component name to use in template
	 * @returns the ready to use component template
	 */
	private generateTemplate(componentName: string): string {
		const rawTemplate = `function COMPONENT_NAME() {
  return <>COMPONENT_NAME</>
}

export default COMPONENT_NAME
`
		return rawTemplate.replaceAll("COMPONENT_NAME", componentName)
	}
}

export default ComponentService
