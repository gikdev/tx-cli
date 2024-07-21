const TEMPLATES = {
	COMPONENT: `function COMPONENT_NAME() {
  return <>COMPONENT_NAME</>
}

export default COMPONENT_NAME
`,
}

function getComponentTemplate({ componentName }: { componentName: string }) {
	return TEMPLATES.COMPONENT.replaceAll("COMPONENT_NAME", componentName)
}

export { getComponentTemplate }
