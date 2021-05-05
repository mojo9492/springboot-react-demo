import React, {useEffect, useRef, useState} from "react";
import logo from './logo.svg';
import './App.css';
import {addNewStudent, deleteStudent, getAllStudents} from "./client";
import {Gender, Severity, Student} from "./lib";
import StudentTable from "./components/StudentTable";
import Button from "@material-ui/core/Button";
import Loading from "./components/Loading";
import {
	createStyles,
	FormControl,
	FormHelperText,
	InputLabel,
	makeStyles,
	MenuItem,
	Modal,
	Select,
	Theme
} from "@material-ui/core";
import Notification from "./components/Notification";

const useStyles = makeStyles((theme: Theme) =>
		createStyles({
			paper: {
				position: 'absolute',
				width: 400,
				backgroundColor: theme.palette.background.paper,
				border: '2px solid #000',
				boxShadow: theme.shadows[5],
				padding: theme.spacing(2, 4, 3),
			},
			formControl: {
				margin: theme.spacing(1),
				minWidth: 120,
			},
			selectEmpty: {
				marginTop: theme.spacing(2),
			},
		}),
);

interface NewStudentModalProps {
	open: boolean;
	close: (arg: boolean) => void;
}

const App: React.FC = () => {
	const [students, setStudents] = useState<Student[]>();
	const [severity, setSeverity] = useState(Severity.INFO)
	const [toastMessage, setToastMessage] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const showModal = () => setIsOpen(true);

	const fetchStudents = () => {
		getAllStudents()
				.then((res) => res.json())
				.then(data => {
					setStudents(data as Student[]);
				}).catch(error => {
			console.log(error.response);
			error.response.json().then((res: any) => {
				console.log(res);
				setSeverity(Severity.ERROR);
				setToastMessage(`There was an issue with your request
						 ${res.message}`);
			})
		}).finally(() => {
			setToastMessage("")
		});
	}

	useEffect(() => {
		fetchStudents();
	}, [setStudents]);

	if (!students) {
		return (
				<>
					<header className="App-header">
						<img src={logo} className="App-logo" alt="logo"/>
					</header>
					<h3>Loading...</h3>
					<Loading/>
				</>
		)
	}

	const deleteStudentHandler = async (studentId: number) => {
		setSeverity(Severity.WARNING);
		setToastMessage(`Deleting Student...`);

		await deleteStudent(studentId)
				.then(() => {
					setSeverity(Severity.SUCCESS);
					setToastMessage(`Deleted Student @${studentId}!`);
				});

		await fetchStudents();
	}

	const NewStudentModal: React.FC<NewStudentModalProps> = (props) => {
		const {open, close} = props;
		const studNameRef = useRef<HTMLInputElement>(null);
		const studEmailRef = useRef<HTMLInputElement>(null);
		const [selectedGender, setSelectedGender] = useState<Gender | string>("");
		const [nameValidation, setNameValidation] = useState("");
		const [emailValidation, setEmailValidation] = useState("");
		const [genderValidation, setGenderValidation] = useState("");

		const classes = useStyles();

		const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
			setSelectedGender(event.target.value as Gender);
		};

		const handleSubmit = async (event: React.FormEvent) => {
			event.preventDefault();
			const studName = studNameRef.current!!.value.toUpperCase();
			const studEmail = studEmailRef.current!!.value.toUpperCase();

			let validStudName;
			if (studName.trim() === "") {
				setNameValidation("Need to enter full name");
			} else {
				setNameValidation("");
				validStudName = studName;
			}

			let validStudEmail;
			if (studEmail === "" || !studEmail.includes("@")) {
				setEmailValidation("Enter a valid email");
			} else {
				setEmailValidation("!!!");
				validStudEmail = studEmail;
			}

			if (selectedGender === "") {
				setGenderValidation("Gender is required");
			} else {
				setGenderValidation("")
			}

			const newStudent: Partial<Student> = {
				name: JSON.stringify(validStudName),
				email: JSON.stringify(validStudEmail),
				gender: selectedGender as Gender
			}

			setSeverity(Severity.INFO);
			setToastMessage("Adding Student...");
			await addNewStudent(newStudent)
					.then(() => {
						setIsOpen(false);
						setSeverity(Severity.SUCCESS);
						setToastMessage(`Added Student: ${newStudent.name}`);
					})
					.catch(error => {
						setSeverity(Severity.ERROR);
						setToastMessage(`Attention: ${error.message}`);
					});
			await fetchStudents();
		}

		const addStudentForm = (
				<div style={{ top:"25%", left:"25%"}} className={classes.paper}>
					<h2>{"add new student"}</h2>
					<form>
						<input type={"text"} id={"name"} placeholder={"Student Full Name"} ref={studNameRef}/>
						<FormHelperText>{nameValidation}</FormHelperText>
						<input type={"text"} id={"email"} placeholder={"Student Email"} ref={studEmailRef}/>
						<FormHelperText>{emailValidation}</FormHelperText>
						<FormControl variant={"outlined"} className={classes.formControl}>
							<InputLabel id={"gender-select"}>Gender</InputLabel>
							<Select
									labelId="gender-select"
									id="gender-select"
									value={selectedGender}
									onChange={handleChange}
							>
								<MenuItem value={Gender.MALE}>Male</MenuItem>
								<MenuItem value={Gender.FEMALE}>Female</MenuItem>
								<MenuItem value={Gender.OTHER}>Other</MenuItem>
							</Select>
							<FormHelperText>{genderValidation}</FormHelperText>
							<Button variant={"contained"} onClick={handleSubmit}>Submit</Button>
						</FormControl>
					</form>
				</div>
		);

		return (
				<>
					<Modal
							open={open}
							onClose={close}
							aria-labelledby="add-new-student"
							aria-describedby="add-student-properties"
					>
						{addStudentForm}
					</Modal>
				</>
		)
	}

	return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
				</header>
				<br/>
				<Button variant="contained" onClick={showModal}>Add New Student</Button><br/><br/>
				<NewStudentModal open={isOpen} close={() => setIsOpen(false)}/>
				<StudentTable students={students} onDelete={deleteStudentHandler}/>
				<Notification onOpen={toastMessage !== "" && true} onClose={() => setToastMessage("")}
				              severityType={severity}>{toastMessage}</Notification>

			</div>
	);
}

export default App;
