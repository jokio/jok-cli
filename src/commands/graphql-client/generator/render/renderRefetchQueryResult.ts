export default function ({ hasProps }: Props) {
  if (hasProps) {
    return `
		return {
			query,
			variables: props,
		}`
  } else {
    return `
		return {
			query,
		}`
  }
}

interface Props {
  hasProps: boolean
}
