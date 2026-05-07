import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint({ name: "match", async: false })
export class Match implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [property] = args.constraints;
        const object = args.object as any;

        return value === object[property];
    }

    defaultMessage(args: ValidationArguments) {
        const [property] = args.constraints;
        return `${args.property} must match ${property}`;
    }
}