import React from "react";

interface FooterProps {

}

const Footer: React.FC<FooterProps> = (props) => {
	return (
			<footer className={"App-footer"}>
        boberJober Labs {new Date().getFullYear()}
			</footer>
	)
}
export default Footer;