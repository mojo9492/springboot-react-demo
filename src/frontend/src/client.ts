import fetch from "unfetch";
import {Student} from "./lib";

export const getAllStudents = async () => {
	return await fetch("api/v1/studs").then((res) => {
		if (res.ok) {
			return res;
		}

		const error = new Error(res.statusText);
		return Promise.reject(error)
	});
}


export const addNewStudent = async (student: Partial<Student>)=> {
	return await fetch("api/v1/studs", {
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		body: JSON.stringify(student)
	}).then((res) => {
		if (res.ok) {
			return res;
		}
		const error = new Error(res.statusText);
		return Promise.reject(error)
	})
}

export const deleteStudent = async (studentId: number) => {
	return await fetch(`api/v1/studs/${studentId}`, {
		method: "DELETE",
	}).then((res) => {
		if (res.ok) {
			return res;
		}
		const error = new Error(res.statusText);
		return Promise.reject(error)
	})
}