import { Text } from "ink"
import React, { useEffect, useState } from "react"
import zod from "zod"
import { RouteService } from "../../services/index.js"

export const alias = "r"
export const args = zod.array(zod.string())
export const options = zod.object({
  ts: zod.boolean().default(false).describe("Whether or not to use TS"),
  suffix: zod
    .boolean()
    .default(true)
    .describe("Whether or not to use suffixes (e.g. sth.route.jsx)"),
})

interface Props {
  options: zod.infer<typeof options>
  args: zod.infer<typeof args>
}

function Route({ args, options }: Props) {
  const [msg, setMsg] = useState("Working on it...")
  const [succeeded, setSucceeded] = useState<boolean | null>(null)
  const colorToSet = succeeded ? "green" : succeeded === false ? "red" : "gray"
  const compService = new RouteService({
    enableSuffix: options.suffix,
    enableTypescript: options.ts,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const finalRouteName = args[0] ?? "NewRoute"
    const [newMsg, newSucceeded] = compService.create(finalRouteName)

    setMsg(newMsg)
    setSucceeded(newSucceeded)
  }, [])

  return <Text color={colorToSet}>{msg}</Text>
}

export default Route