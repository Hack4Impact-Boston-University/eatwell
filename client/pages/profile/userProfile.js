import Head from "next/head";
import * as ui from "@material-ui/core";

const useStyles = ui.makeStyles((theme) => ({
	heading: {
		color: "blue",
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
			<ui.Avat
		</div>
	);
}
