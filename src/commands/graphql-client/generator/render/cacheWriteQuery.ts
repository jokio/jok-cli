export default function ({
	hasProps,
	queryName,
}: Props) {

	return `
	return this.client.writeQuery({
		query,
		data: { ${queryName}: data },
		${hasProps ? 'variables: props,' : ''}
	  })
	`
}

interface Props {
	hasProps: boolean
	queryName: string
}
