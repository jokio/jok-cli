import {
	IntrospectionEnumType,
	IntrospectionInputObjectType,
	IntrospectionInterfaceType,
	IntrospectionObjectType,
	IntrospectionScalarType,
	IntrospectionType,
	IntrospectionUnionType,
} from "graphql";
import getTypescriptField from "./getTypescriptField";

export default function (includeTypeName: boolean) {
	return (type: IntrospectionType) => {
		if (type.name.startsWith("__")) {
			return;
		}

		switch (type.kind) {
			case "OBJECT":
			case "INTERFACE":
				return objectType(type, includeTypeName);

			case "INPUT_OBJECT":
				return inputObjectType(type);

			case "ENUM":
				return enumType(type);

			case "SCALAR":
				return scalarType(type);

			case "UNION":
				return unionType(type);

			default:
				console.log("MISSED GENERATION FOR", type);
				return;
		}
	};
}

function objectType(
	type: IntrospectionObjectType | IntrospectionInterfaceType,
	includeTypeName: boolean
) {
	const fields = type.fields
		.map((x) => getTypescriptField(x.name, x.type))
		.map((x) => `\t${x}`)
		.join("\n");

	const typeName = type.name;

	return `
export interface ${typeName} {${
		includeTypeName
			? `
	__typename:"${typeName}"`
			: ""
	}
${fields}
}`;
}

function inputObjectType(type: IntrospectionInputObjectType) {
	const fields = type.inputFields
		.map((x) => getTypescriptField(x.name, x.type))
		.map((x) => `\t${x}`)
		.join("\n");

	const typeName = type.name;

	return `
export interface ${typeName} {
${fields}
}`;
}

function enumType(type: IntrospectionEnumType) {
	const typeName = type.name;
	const fields = type.enumValues
		.map((x) => `\t${x.name} = '${x.name}',`)
		.join("\n");

  return `
export enum ${typeName} {
${fields}
}`;
}

function scalarType(type: IntrospectionScalarType) {
	const typeName = type.name;
	let tsType = "";

	switch (typeName) {
		case "ID":
			tsType = "string";
			break;

		case "String":
			tsType = "string";
			break;

		case "Int":
			tsType = "number";
			break;

		case "Float":
			tsType = "number";
			break;

		case "Boolean":
			tsType = "boolean";
			break;

		case "DateTime":
		case "Time":
			tsType = "Date";
			break;

		// Date already exists in JS
		case "Date":
			return "";

		case "JSON":
			tsType = "any";
			break;

		default:
			tsType = "any";
			break;
	}

	// export ID for later use in the application
	if (typeName === "ID") {
		return `export type ${typeName} = ${tsType}`;
	}

	return `type ${typeName} = ${tsType}`;
}

function unionType(type: IntrospectionUnionType) {
	const typeName = type.name;
	const valueTypes = type.possibleTypes.map((x) => x.name).join(" | ");

	return `export type ${typeName} = ${valueTypes}`;
}
