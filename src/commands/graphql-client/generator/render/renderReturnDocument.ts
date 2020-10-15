import { RootType } from '../../utils/rootType'

export default function ({ rootType, hasVariables }: Props) {
  return `
		return {
			document: ${rootType},
			${hasVariables ? 'variables: props,' : ''}
		}
	`
}

interface Props {
  rootType: RootType
  hasVariables: boolean
}
