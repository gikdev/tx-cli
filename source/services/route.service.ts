import fs from "node:fs"
import path from "node:path"
import { to_snake_case } from "../utils.js"

interface RouteConfig {
  enableTypescript?: boolean
  enableSuffix?: boolean
}

const defaultRouteConfig: RouteConfig = {
  enableSuffix: true,
  enableTypescript: false,
}

const SUFFIX = ".route"
const CURRENT_DIR = process.cwd()

/** The business logic of everything ___route___
 * @todo `rename(oldName: string, newName, string): [string, boolean]`
 * @todo `delete(name: string): [string, boolean]`
 */
class RouteService {
  constructor(private _config: RouteConfig = defaultRouteConfig) {}

  /** Creates a route file and adds it into the index file
   * @param name name of the route to create
   * @returns [the message, if it's been successful or not]
   * @example routeService.create("HelloWorld")
   */
  public create(name: string): [string, boolean] {
    // Make the file name
    let fileName = ""
    fileName += to_snake_case(name)
    if (this._config.enableSuffix) fileName += SUFFIX
    fileName += this._config.enableTypescript ? ".tsx" : ".jsx"

    // make the file path
    const filePath = path.join(CURRENT_DIR, "src", "routes", fileName)

    // make the contents of the component file
    const fileContent = this.generateTemplate(name)

    // make the index file path
    const indexFilePath = path.join(
      CURRENT_DIR,
      "src",
      "routes",
      `index.${this._config.enableTypescript ? "ts" : "js"}`,
    )

    // make the export statement
    const suffix = this._config.enableSuffix ? SUFFIX : ""
    const exportStatement = `export { default as ${name} } from "./${to_snake_case(name)}${suffix}"
`

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

    return [`✅ Route <${name} /> created! 🎉`, true]
  }

  /** Generates a template for routes
   * @todo add multiple templates
   * @param routeName component name to use in template
   * @returns the ready to use component template
   */
  private generateTemplate(routeName: string): string {
    const rawTemplate = `function ROUTE_NAME() {
  return <>ROUTE_NAME</>
}

export default ROUTE_NAME\n`
    return rawTemplate.replaceAll("ROUTE_NAME", routeName)
  }
}

export default RouteService
