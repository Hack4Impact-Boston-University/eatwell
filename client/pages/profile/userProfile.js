import Head from "next/head";
import * as ui from "@material-ui/core";

const useStyles = ui.makeStyles((theme) => ({
	heading: {
		color: "red",
	},
	avatar: {
		height: theme.spacing(13),
		width: theme.spacing(13),
	},
}));

export default function userAuth() {
	const classes = useStyles();

	return (
		<div>
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className={classes.heading}>User Profile Page</h1>
			<ui.Avatar
				src="https://pbs.twimg.com/profile_images/988263662761775104/Bu1EDlWo.jpg"
				alt="profile pic"
				className={classes.avatar}
			/>
		</div>
	);
}
