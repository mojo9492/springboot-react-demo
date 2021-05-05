//Gender for Student
export enum Gender {
	MALE,
	FEMALE,
	OTHER
}
//Focus object
export type Student = {
	id: number;
	name: string;
	email: string;
	gender: Gender;
}
//Use for Notification severityType
export enum Severity {
	INFO = "info",
	SUCCESS = "success",
	WARNING = "warning",
	ERROR = "error"
}
